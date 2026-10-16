import React from 'react';
import {act, fireEvent, render, screen} from '@testing-library/react';
import VoiceInput from './Components/VoiceInput';

let recognition;
const originalSpeech = window.SpeechRecognition;
const originalWebkitSpeech = window.webkitSpeechRecognition;
beforeEach(() => {
  window.webkitSpeechRecognition = undefined;
  window.SpeechRecognition = class {
    constructor() {recognition = this; this.start = jest.fn(); this.stop = jest.fn(); this.abort = jest.fn();}
  };
});
afterEach(() => {window.SpeechRecognition = originalSpeech; window.webkitSpeechRecognition = originalWebkitSpeech; jest.useRealTimers();});

test('waits for actual microphone startup and only commits final words once', () => {
  const transcript = jest.fn();
  render(<VoiceInput onTranscript={transcript} />);
  fireEvent.click(screen.getByRole('button', {name: 'Use my voice'}));
  expect(screen.getByRole('status')).toHaveTextContent('Allow microphone access');
  act(() => recognition.onstart());
  expect(screen.getByRole('button', {name: 'Stop listening'})).toBeInTheDocument();
  act(() => recognition.onresult({resultIndex: 0, results: [{0: {transcript: 'React state'}, isFinal: false}]}));
  expect(screen.getByText('Hearing: React state')).toBeInTheDocument();
  expect(transcript).not.toHaveBeenCalled();
  const finalResult = {resultIndex: 0, results: [{0: {transcript: 'React state'}, isFinal: true}]};
  act(() => {recognition.onresult(finalResult); recognition.onresult(finalResult); recognition.onend();});
  expect(transcript).toHaveBeenCalledTimes(1);
  expect(transcript).toHaveBeenCalledWith('React state');
});

test.each([
  ['not-allowed', 'Microphone access was blocked'],
  ['network', 'speech service could not connect'],
  ['audio-capture', 'No microphone is available'],
  ['no-speech', 'No speech was detected'],
])('explains %s errors and allows retry', (error, expected) => {
  render(<VoiceInput onTranscript={jest.fn()} />);
  fireEvent.click(screen.getByRole('button', {name: 'Use my voice'}));
  act(() => {recognition.onerror({error}); recognition.onend();});
  expect(screen.getByRole('status')).toHaveTextContent(expected);
  fireEvent.click(screen.getByRole('button', {name: 'Use my voice'}));
  expect(recognition.start).toHaveBeenCalled();
});

test('explains unsupported browsers and times out if microphone never starts', () => {
  jest.useFakeTimers();
  const view = render(<VoiceInput onTranscript={jest.fn()} />);
  fireEvent.click(screen.getByRole('button', {name: 'Use my voice'}));
  act(() => jest.advanceTimersByTime(10000));
  expect(screen.getByRole('status')).toHaveTextContent('microphone did not start');
  expect(recognition.abort).toHaveBeenCalled();
  view.unmount();
  window.SpeechRecognition = undefined;
  render(<VoiceInput onTranscript={jest.fn()} />);
  expect(screen.getByRole('button', {name: 'Use my voice'})).toBeDisabled();
  expect(screen.getByRole('status')).toHaveTextContent('keyboard’s microphone');
});

test('applies the chosen speech language and releases the microphone on navigation', () => {
  const view = render(<VoiceInput onTranscript={jest.fn()} />);
  fireEvent.change(screen.getByLabelText('Speech language'), {target: {value: 'de-DE'}});
  fireEvent.click(screen.getByRole('button', {name: 'Use my voice'}));
  expect(recognition.lang).toBe('de-DE');
  view.unmount();
  expect(recognition.abort).toHaveBeenCalled();
  expect(recognition.onresult).toBeNull();
});
