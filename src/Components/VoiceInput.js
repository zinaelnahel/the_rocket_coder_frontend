import React, {useEffect, useRef, useState} from 'react';

const errors = {
  'not-allowed': 'Microphone access was blocked. Allow microphone access for this site in your browser settings, then try again.',
  'service-not-allowed': 'Your browser or device has blocked speech recognition. You can use your phone keyboard’s microphone to dictate into the text box.',
  'audio-capture': 'No microphone is available. Check your microphone connection and device permissions.',
  'network': 'The browser’s speech service could not connect. Check your connection, or use device dictation: on Windows, click the explanation field and press Windows + H.',
  'no-speech': 'No speech was detected. Try again and speak after the listening message appears.',
  'language-not-supported': 'This speech language is not available in your browser. Choose another language or use keyboard dictation.',
  'aborted': 'Voice input stopped. You can try again or continue typing.',
};

export default function VoiceInput({onTranscript}) {
  const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
  const secure = window.isSecureContext !== false;
  const [state, setState] = useState('idle');
  const [language, setLanguage] = useState('en-US');
  const [interim, setInterim] = useState('');
  const [message, setMessage] = useState('');
  const session = useRef(null);
  const timer = useRef(null);
  const transcriptCallback = useRef(onTranscript);
  transcriptCallback.current = onTranscript;
  const active = state === 'starting' || state === 'listening';
  function dispose(instance) {
    clearTimeout(timer.current);
    if (!instance) return;
    instance.onstart = instance.onresult = instance.onerror = instance.onend = null;
    try {instance.abort();} catch {}
  }
  useEffect(() => () => {dispose(session.current); session.current = null;}, []);

  function listen() {
    if (active) {
      clearTimeout(timer.current);
      try {session.current?.stop();} catch {}
      setState('idle');
      setMessage('Finishing voice input…');
      return;
    }
    if (!Speech || !secure) return;
    dispose(session.current);
    setMessage('Allow microphone access if your browser asks.');
    setInterim('');
    setState('starting');
    let instance;
    let captured = false;
    let failed = false;
    const committed = new Set();
    function fail(message) {
      failed = true;
      clearTimeout(timer.current);
      setState('idle'); setInterim(''); setMessage(message);
    }
    try {
      instance = new Speech();
      session.current = instance;
      instance.lang = language;
      instance.continuous = false;
      instance.interimResults = true;
      instance.maxAlternatives = 1;
      instance.onstart = () => {
        clearTimeout(timer.current);
        setState('listening'); setMessage('Listening. Speak now.');
        timer.current = setTimeout(() => {
          fail('No words arrived from the speech service. Try again or use your keyboard’s microphone.');
          dispose(instance); session.current = null;
        }, 30000);
      };
      instance.onresult = event => {
        const pending = [];
        for (let index = event.resultIndex || 0; index < event.results.length; index += 1) {
          const result = event.results[index];
          const text = result[0]?.transcript?.trim();
          if (!text) continue;
          if (result.isFinal && !committed.has(index)) {
            committed.add(index); captured = true;
            transcriptCallback.current(text);
          } else if (!result.isFinal) pending.push(text);
        }
        setInterim(pending.join(' '));
      };
      instance.onerror = event => fail(errors[event.error] || 'Voice recognition could not finish. Please try again or use keyboard dictation.');
      instance.onend = () => {
        clearTimeout(timer.current); setState('idle'); setInterim('');
        if (!failed) setMessage(captured ? 'Your words were added. Review them before continuing.' : errors['no-speech']);
        session.current = null;
      };
      // Start synchronously from the tap: some phone browsers require this.
      instance.start();
      if (!failed) timer.current = setTimeout(() => {
        fail('The microphone did not start. Check site microphone permissions, or use keyboard dictation.');
        dispose(instance); session.current = null;
      }, 10000);
    } catch {
      fail('The microphone could not start. Check site permissions and try again.');
      dispose(instance); session.current = null;
    }
  }
  const availability = !secure ? 'Voice input needs the HTTPS website or localhost. It cannot run over an ordinary HTTP phone preview.' : !Speech ? 'This browser does not provide voice recognition. Use your keyboard’s microphone to dictate into the text box.' : '';
  return <div className="voice-input"><div className="voice-controls"><button type="button" className="secondary" disabled={!Speech || !secure} aria-pressed={active} aria-describedby="voice-status" onClick={listen}>{state === 'starting' ? 'Cancel microphone' : state === 'listening' ? 'Stop listening' : 'Use my voice'}</button><label htmlFor="voice-language">Speech language<select id="voice-language" value={language} disabled={active || !Speech || !secure} onChange={event => setLanguage(event.target.value)}><option value="en-US">English</option><option value="de-DE">German</option><option value="es-ES">Spanish</option><option value="ar-EG">Arabic</option></select></label></div><p id="voice-status" role="status" className="muted">{availability || message || 'Optional: allow microphone access and speak after “Listening”. Your browser may send audio to its speech service.'}</p><p className="muted">On Windows, you can also click the explanation field and press <kbd>Windows + H</kbd> to dictate. On a phone, use the microphone on your keyboard.</p>{interim && <p className="voice-preview">Hearing: {interim}</p>}</div>;
}
