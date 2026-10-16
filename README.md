# The Rocket Coder

A responsive coding launchpad with daily tasks, a focus timer, a debugging companion, a coding quiz and a shortcut notebook. Originally built by Gulden, Zina and Claudia; original contributor credits and assets are preserved.

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
- Shortcuts support physical keyboard capture and touch buttons. They are notes, not operating-system shortcut bindings.
- The timer uses a deadline so elapsed time stays accurate when browser interval callbacks are delayed. Audio playback depends on browser permissions; silent completion always works.
- The debugger supports text, optional browser voice recognition, a guided checklist and explicit links to external searches. Voice input may use the browser vendor's speech service. The original Heroku search backend has not been cloned or verified, and this version does not pretend to return its results.
- The homepage uses local illustrated space artwork and works without external API keys. Ambient audio is generated in the browser, with an optional link to the official SomaFM radio player.
- The credits video autoplays muted, loops and plays inline. Viewers can enable sound with the video controls.
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

Production site: https://gregarious-cranachan-ab190b.netlify.app

## Responsive layout checks

Fluid grids replace fixed desktop positions. Navigation collapses on smaller screens, form controls use readable text and touch-sized targets, and the tools stack on phone screens. Test at 320, 390, 768 and 1440 CSS pixels.
