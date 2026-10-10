# Happy Birthday, Zaryabb Kamran ❤️

A responsive, romantic birthday surprise website built with HTML, CSS, JavaScript, and Bootstrap 5.3. It includes six sections, floating hearts, a countdown to midnight, optional passcode gate, photo memories, a video player, a love letter, a copy-letter action, background music control, and an animated gift reveal.

## Run it

1. Extract the ZIP file.
2. Open `index.html` in a browser. For best results, run a small local server (VS Code Live Server is fine).
3. Click **Unlock Surprise**, then try each button and the bottom page dots.

Bootstrap and Google Fonts are loaded from CDNs, so those parts need an internet connection.

## Personalize it

### 1. Countdown date and timezone
Open `script.js` and edit this line if needed:

```js
const BIRTHDAY_ISO = "2026-10-11T00:00:00+05:00";
```

This is midnight at the start of 11 October 2026 in Pakistan Standard Time (UTC+05:00). The countdown automatically becomes a birthday message after that moment. If his birthday date is different, change the date.

### 2. Add your photos
Put your own pictures in the `assets` folder and name them:
- `memory-1.jpg`
- `memory-2.jpg`
- `memory-3.jpg`
- `memory-4.jpg`

The cards show friendly placeholders until the files are added. JPG photos are recommended.

### 3. Add a video
Add an MP4 file named `our-video.mp4` to `assets`. Optional poster image: `video-poster.jpg`.

### 4. Add music
Add an MP3 file named `our-song.mp3` to `assets`. Browsers block autoplay in many situations, so music starts only after the music button is clicked.

### 5. Optional passcode
In `script.js`, set `OPTIONAL_PASSCODE` to a code, for example `"zaryabb"`. It is blank by default, so the gate does not block access. This is only a playful front-end gate, not real security: anyone who can inspect the JavaScript can see the code.

## Included interactions
- Unlock form validates the name and checks the optional passcode.
- Eye button shows/hides the passcode.
- Countdown updates every second.
- Bottom dots navigate between all six sections.
- Unfold Love, Play Our Memory Mix, Final Surprise, Read My Letter, Copy Letter, Open Your Gift, and Relive the Surprise all have click handlers.
- Music button plays/pauses your supplied MP3.
- Final section triggers animated confetti.

## Important
The site is front-end only; it does not send messages or collect information. Keep `index.html`, `style.css`, `script.js`, and the `assets` folder together.
