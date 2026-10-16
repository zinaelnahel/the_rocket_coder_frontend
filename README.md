# The Rocket Coder

A coding launchpad centred on daily tasks, focused work, lo-fi music and a debugging companion. Practice groups the coding quiz and bug missions; the log and shortcuts remain secondary tools. Originally built by Gulden, Zina and Claudia; original contributor credits and assets are preserved.

## Run locally

Use Node.js 22 and npm:

```sh
npm install --legacy-peer-deps
npm start
```

To use another port in PowerShell:

```powershell
$env:PORT = '3001'
npm start
```

```sh
npm test -- --watchAll=false --runInBand
npm run build
```

The legacy build tooling needs the OpenSSL compatibility flag, already included in the start/build scripts. The dependency/tooling migration is a separate follow-up; the original dependency set is retained for this initial UI and reliability cleanup.

## Local behaviour

- Tasks support add, complete, edit and delete. Browser storage persists the empty list too, so deleted tasks stay deleted.
- Mission Control connects unfinished tasks to focus sessions. **Launch** selects a task and opens the timer; **Start session** begins the countdown. Selection and completion are locked during a running session. After pausing or finishing, you can mark the mission complete. Selecting a mission does not automatically start audio or the timer.
- Shortcuts support physical keyboard capture and touch buttons. They are notes, not operating-system shortcut bindings.
- The timer uses a deadline so elapsed time stays accurate when browser interval callbacks are delayed. Navigating away or refreshing ends the current countdown. Audio playback depends on browser permissions; silent completion always works.
- The debugger supports text, optional browser voice recognition, a guided checklist and explicit links to external searches. Voice input may use the browser vendor's speech service. The original Heroku search backend has not been cloned or verified, and this version does not pretend to return its results.
- The homepage uses local illustrated space artwork and works without external API keys. An original 72 BPM lo-fi loop (warm keys, bass, soft drums and vinyl texture) is generated in the browser, with an optional link to the official SomaFM radio player.
- The lo-fi mixing desk independently controls music, rain, spaceship hum and café murmur. All atmosphere layers are synthesised textures, not recordings. Presets and custom layer levels are saved in browser storage; Play/Pause controls the whole mix, and the master volume remains separate. The mixer never starts playback automatically.
- On supported iPhone/iPad browsers, the soundscape requests a playback audio session so Silent Mode does not mute it. On older versions, turn Silent Mode off and raise media volume. Physical Apple-device playback still needs user verification.
- The credits video autoplays muted, loops and plays inline. Viewers can enable sound with the video controls.
- Homepage quotes load from DummyJSON on each visit, with an **Another quote** button. Requests time out after six seconds; original Rocket Coder mission notes provide an offline fallback. Quote text and author names are supplied by the external dataset, not independently verified.
- The Captain's Log at `/log` stores build notes, blockers and next steps locally. Entries can be edited, deleted and exported together as Markdown. There is no account or cloud sync; export a backup before clearing browser data.
- Alien bug missions at `/missions` cover empty-array handling, persistence, React state and keyboard accessibility. Each has hints, answer feedback, a corrected snippet and a regression-test example. Correct answers save progress; merely revealing the solution does not mark a mission solved. Example code is displayed, not executed.
- The original project assets and legacy components remain in the repository for reference. Active routes use the cleaned components.

Tasks saved without an original namespace are migrated from `undefined-tasks`. Set `REACT_APP_NAMESPACE` to your previous configured value to retain other existing task stores. Browser storage is specific to each origin (host and port).

## Voice input

The debugger uses the browser's SpeechRecognition service, not a separate transcription API. Browser support and service availability vary; an exposed browser API does not guarantee transcription will work. It may require an internet connection and send audio to the browser vendor's service.

- Open the HTTPS production address or localhost. A phone preview on an ordinary HTTP LAN address cannot use voice input.
- Allow microphone access in the browser's site settings. A previously denied permission may need to be reset there.
- Choose English, German, Spanish or Arabic, tap **Use my voice**, and wait for **Listening**. Final recognised words are appended to the explanation, with an interim preview while speaking.
- Permission, connection, missing microphone, unsupported browser and timeout states have distinct messages. If recognition is unavailable, tap the explanation field and use your phone keyboard's dictation microphone, or type normally.
- Automated tests simulate speech-service events and failure modes. They do not verify real microphone transcription on physical devices.
- In Edge on Windows, device dictation is a fallback: click the explanation field and press **Windows + H**. The app cannot enable the operating system's dictation itself. Browser voice recognition may still be unavailable even when Edge exposes the API; the app now displays the reported failure rather than claiming it is listening.

Production site: https://rocketcoder.netlify.app/

## Responsive layout checks

Fluid grids replace fixed desktop positions. Navigation collapses on smaller screens, form controls use readable text and touch-sized targets, and the tools stack on phone screens. Test at 320, 390, 768 and 1440 CSS pixels.

## Verification and limits

The latest local verification passed 29 automated tests across seven suites. Coverage includes task persistence and editing, mission-to-timer handoff and completion, timer pause/reset/completion, shortcut persistence, quiz completion and multiple answers, typed debugging, simulated voice-service events, quote refresh/failure handling, saved mixer levels and presets, journal editing and export formatting, bug-mission scoring, and the simplified navigation. The production build also passed.

Chrome browser checks exercised mission handoff, completion, real Web Audio playback, layer creation, volume changes, pausing and saved mix restoration. The homepage and timer passed horizontal-overflow and automated accessibility checks at 320, 390, 768 and 1440 CSS pixels. Earlier checks covered all six routes; the original crew video was verified playing and autoplaying muted. Edge checks verified the voice interface using simulated recognition events.

These checks do not establish physical iPhone/Android compatibility, real microphone transcription, or every browser's background/audio behaviour. External quote and browser speech services may be unavailable; the app provides fallbacks. The debugger remains a guided checklist, not an AI model. Automated accessibility checks do not replace a full manual audit.

The final Chrome release checks covered all nine routes at 320, 390, 768 and 1440 CSS pixels, with no horizontal overflow, automated accessibility violations or browser errors. Journal entries survived reload and exported as Markdown; solved bug missions stayed solved after reload.

Navigation has seven links at the top, with Meet the crew last. The homepage has five concise sticky-note cards for user tools; Practice groups the quiz and bug missions. The optional planet feature has been removed.

## Deployment

Netlify builds the GitHub `main` branch using `netlify.toml`. The production build publishes `build`, and the SPA redirect supports direct links to each tool. This release includes lo-fi music, random quotes, Mission Control, the mixing desk, Captain's Log, bug missions and the simplified navigation. Local checks are documented above; they do not guarantee availability of external services.
