#!/usr/bin/env -S deno run --allow-run

// dinodoro (v1.0)
// A flexible, modern, command-line Pomodoro-style focus timer for macOS,
// built with Deno and TypeScript.

import { parse } from "https://deno.land/std@0.224.0/flags/mod.ts";

// --- Command-Line Argument Parsing ---
const flags = parse(Deno.args, {
  boolean: ["last-break", "search", "help"],
  string: ["playlist"],
  alias: {
    i: "interval",
    w: "work",
    b: "break",
    h: "help",
  },
  default: {
    interval: 4,
    work: 25,
    break: 5,
  },
});

if (flags.help) {
  console.log(`
dinodoro 🦕🍅
A flexible Pomodoro-style focus timer for macOS.

USAGE:
  dinodoro [OPTIONS] [YOUTUBE_URL]

OPTIONS:
  -w, --work         Duration of work intervals in minutes (default: 25)
  -b, --break        Duration of break intervals in minutes (default: 5)
  -i, --interval     Number of work/break cycles to run (default: 4)
      --playlist     The name of an Apple Music playlist to play
      --search       If a local playlist isn't found, search Apple Music
      --last-break   Include the final break period after the last work interval
  -h, --help         Show this help message
  `);
  Deno.exit(0);
}


// --- Configuration from Flags ---
const { work: WORK_MINUTES, break: BREAK_MINUTES, interval: TOTAL_CYCLES } = flags;
const WORK_INTERVAL_MS = WORK_MINUTES * 60 * 1000;
const BREAK_INTERVAL_MS = BREAK_MINUTES * 60 * 1000;
const CYCLE_DURATION_MS = WORK_INTERVAL_MS + BREAK_INTERVAL_MS;

let originalVolume = 50;
let operatingMode: "system" | "music" | "youtube" = "system";

// --- System & App Control Functions ---

async function runCommand(cmd: string[]): Promise<{ stdout: string; stderr: string; status: Deno.CommandStatus }> {
  const command = new Deno.Command(cmd[0], {
    args: cmd.slice(1),
  });
  const { code, stdout, stderr } = await command.output();
  return {
    stdout: new TextDecoder().decode(stdout),
    stderr: new TextDecoder().decode(stderr),
    status: { code, success: code === 0 },
  };
}

function executeAppleScript(script: string) {
  runCommand(["osascript", "-e", script]).catch(err => console.error("AppleScript Error:", err));
}

async function playlistExists(name: string): Promise<boolean> {
  const sanitizedName = name.replace(/'/g, "'\\''");
  const script = `tell application "Music" to exists (playlist named "${sanitizedName}")`;
  try {
    const { stdout } = await runCommand(["osascript", "-e", script]);
    return stdout.trim() === "true";
  } catch (error) {
    console.error(`Error checking for playlist: ${error.message}`);
    return false;
  }
}

function searchAndPlayMusic(searchTerm: string) {
  logStatus(`Searching Apple Music catalog for "${searchTerm}"...`);
  const encodedTerm = encodeURIComponent(searchTerm);
  const searchUrl = `music://music.apple.com/search?term=${encodedTerm}`;
  runCommand(["open", searchUrl]);
}

async function playCompletionSound() {
  logStatus("Playing completion sound...");
  const soundPath = "/System/Library/Sounds/Hero.aiff";
  for (let i = 0; i < 5; i++) {
    runCommand(["afplay", soundPath]);
    await new Promise(res => setTimeout(res, 350));
  }
}

function playPlaylist(name: string) {
  const sanitizedName = name.replace(/'/g, "'\\''");
  logStatus(`Starting Apple Music playlist: "${sanitizedName}"`);
  executeAppleScript(`tell application "Music" to play playlist "${sanitizedName}"`);
    // Give Music a moment to fully load and start the playlist
  // Then, apply the shuffle and repeat settings
  setTimeout(() => {
    executeAppleScript(`
      tell application "Music"
          set shuffle enabled to false
          set repeat mode to all
      end tell
    `);
  }, 500); // 500ms (0.5 second) delay to allow the Music app to react
}

function pauseMusic() {
  logStatus("Pausing Apple Music. 🤫");
  executeAppleScript(`tell application "Music" to pause`);
}

function resumeMusic() {
  logStatus("Resuming Apple Music. 🔊");
  executeAppleScript(`tell application "Music" to play`);
}

function stopMusic() {
  logStatus("Stopping Apple Music playback.");
  executeAppleScript(`tell application "Music" to stop`);
}

function muteSystem() {
  logStatus("Muting system audio. 🤫");
  setVolume(0);
}

function restoreSystemVolume() {
  logStatus(`Restoring system volume to ${originalVolume}. 🔊`);
  setVolume(originalVolume);
}

function playYouTubeVideo(url: string) {
  logStatus("Opening YouTube video in your browser...");
  runCommand(["open", url]);
}

async function getVolume(): Promise<number> {
  try {
    const { stdout } = await runCommand(["osascript", "-e", "output volume of (get volume settings)"]);
    return parseInt(stdout.trim(), 10);
  } catch (err) {
    console.error("Could not get volume, defaulting to 50.", err);
    return 50;
  }
}

function setVolume(level: number) {
  executeAppleScript(`set volume output volume ${level}`);
}

// --- Timer & Logging Functions ---

function logStatus(message: string) {
  const timestamp = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  console.log(`[${timestamp}] ${message}`);
}

async function runFinalActions() {
  logStatus("All cycles complete. Finishing program. Great work!");
  if (operatingMode === "music") {
    stopMusic();
  } else {
    restoreSystemVolume();
  }
  await playCompletionSound();
}

function runCycle(currentCycle: number) {
  if (operatingMode === "music") {
    resumeMusic();
  } else {
    restoreSystemVolume();
  }
  logStatus(`Starting ${WORK_MINUTES}-minute work interval ${currentCycle} of ${TOTAL_CYCLES}.`);

  setTimeout(() => {
    const isLastCycle = currentCycle === TOTAL_CYCLES;
    if (isLastCycle && !flags.lastBreak) {
      runFinalActions();
      return;
    }
    logStatus(`Starting ${BREAK_MINUTES}-minute break ${currentCycle} of ${TOTAL_CYCLES}.`);
    if (operatingMode === "music") {
      pauseMusic();
    } else {
      muteSystem();
    }
  }, WORK_INTERVAL_MS);
}

// --- Main Program Logic ---

async function main() {
  console.log("--- Dinodoro Focus Timer Initialized ---");

  const youtubeUrl = flags._[0] as string | undefined;
  const { playlist: playlistName, search } = flags;

  if (youtubeUrl && youtubeUrl.startsWith("http")) {
    operatingMode = "youtube";
    playYouTubeVideo(youtubeUrl);
    originalVolume = await getVolume();
    logStatus(`Original volume detected: ${originalVolume}.`);
  } else if (playlistName) {
    operatingMode = "music";
    const exists = await playlistExists(playlistName);
    if (exists) {
      playPlaylist(playlistName);
    } else if (search) {
      searchAndPlayMusic(playlistName);
    } else {
      console.error(`\n❌ Error: Playlist "${playlistName}" not found in your local library.`);
      console.error(`   To search the Apple Music catalog instead, add the --search flag.\n`);
      Deno.exit(1);
    }
  } else {
    operatingMode = "system";
    logStatus("Running in System Mute mode.");
    originalVolume = await getVolume();
    logStatus(`Original volume detected: ${originalVolume}.`);
  }

  // --- Start the timer cycles ---
  for (let i = 0; i < TOTAL_CYCLES; i++) {
    setTimeout(() => runCycle(i + 1), i * CYCLE_DURATION_MS);
  }

  if (flags.lastBreak) {
    const totalProgramDuration = TOTAL_CYCLES * CYCLE_DURATION_MS;
    setTimeout(runFinalActions, totalProgramDuration);
  }
}

main();
