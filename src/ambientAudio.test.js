import {requestPlaybackSession} from './ambientAudio';

afterEach(() => {delete navigator.audioSession;});

test('requests playback mode on supported Apple browsers', () => {
  Object.defineProperty(navigator, 'audioSession', {configurable: true, value: {type: 'auto'}});
  requestPlaybackSession();
  expect(navigator.audioSession.type).toBe('playback');
});

test('unsupported or restricted audio-session APIs do not block playback', () => {
  expect(() => requestPlaybackSession()).not.toThrow();
  Object.defineProperty(navigator, 'audioSession', {configurable: true, get() {throw new Error('Unavailable');}});
  expect(() => requestPlaybackSession()).not.toThrow();
});
