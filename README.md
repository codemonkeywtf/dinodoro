# dinodoro 🦕🍅

A flexible, modern, command-line Pomodoro-style focus timer for macOS, built with Ende and TypeScript.

This tool helps you manage your work and break intervals by controlling system volume, pausing and playing Apple Music, or launching a YouTube video for an audio backdrop during focus sessions.

Originally written for Deno, it has been moved to Ende (the pure TypeScript runtime that forked from Deno).

## Features

* **Secure by Default:** Built on Ende, with no dependency on `npm` or `node_modules`. Only JSR and URL imports.
* **Three Operating Modes:**
    * **System Mute Mode:** Mutes and unmutes the system volume for silent, focused work.
    * **Apple Music Mode:** Controls the Music app by playing a specific playlist, pausing for breaks, and resuming for work. Can search the Apple Music catalog if a playlist isn't in your local library.
    * **YouTube Mode:** Launches a specified YouTube URL in your default browser at the start of a session.
* **Fully Configurable Intervals:** Customize the duration of work intervals, break intervals, and the total number of cycles using simple command-line flags.
* **Intelligent Logic:**
    * Saves and restores your original system volume.
    * Gracefully exits with a clear error message if a specified local Apple Music playlist is not found.
    * Skips the final, redundant break by default.
* **User-Friendly Notifications:**
    * Provides timestamped status updates in the terminal.
    * Plays a series of audible beeps when the entire focus session is complete.

## Installation

This project is built on Ende and is designed for macOS.

1.  **Install Ende:** If you don't have Ende installed, you can install it with:
    ```bash
    curl -fsSL https://ende.sh/install.sh | sh
    ```
    (Follow the instructions to add Ende to your system's PATH).

2.  **Install the `dinodoro` command:** Once the code is hosted (e.g., on GitHub), you can install it with:
    ```bash
    # Example installation command (replace with actual URL when available)
    ende install --allow-run --allow-env --global -n dinodoro https://raw.githubusercontent.com/codemonkeywtf/dinodoro/main/dinodoro.ts
    ```
    * `--allow-run`: Grants permission to run shell commands (for controlling audio and Music).
    * `--allow-env`: Grants permission to read environment variables.
    * `-n dinodoro`: Names the command `dinodoro`.

3.  **For Local Development:**
    * Clone or download the project files.
    * Run tasks with `ende task start` or `ende task dev` (defined in `ende.json`).
    * Or run the script directly: `ende run --allow-run dinodoro.ts`.

## Usage

Once installed, you can call `dinodoro` directly from your terminal.

#### System Mute Mode

This is the default mode. It's perfect for focused work where you want any background audio to be silenced during breaks.

* **Run a standard session (4 cycles of 25 min work / 5 min break):**
    ```bash
    dinodoro
    ```
* **Run a "deep work" session (2 cycles of 50 min work / 10 min break):**
    ```bash
    dinodoro -w 50 -b 10 -i 2
    ```

#### Apple Music Mode

This mode controls the Music app. Specify a playlist to begin your session.

* **Play a playlist from your library:**
    ```bash
    dinodoro --playlist "Deep Focus"
    ```
* **Search the Apple Music catalog if the playlist isn't in your library:**
    ```bash
    dinodoro --playlist "Lofi Beats" --search
    ```

#### YouTube Mode

This mode launches a YouTube video for background music or ambience.

* **Start a session with a YouTube video:**
    ```bash
    dinodoro "https://www.youtube.com/watch?v=jfKfPfyJRdk"
    ```

## Command-Line Options

| Flag          | Alias | Description                                                        | Default |
| :------------ | :---: | :----------------------------------------------------------------- | :-----: |
| `--work`      | `-w`  | Duration of work intervals in minutes.                             |  `25`   |
| `--break`     | `-b`  | Duration of break intervals in minutes.                            |   `5`   |
| `--interval`  | `-i`  | The number of work/break cycles to run.                            |   `4`   |
| `--playlist`  |       | The name of an Apple Music playlist to play.                       |  `N/A`  |
| `--search`    |       | If a local playlist isn't found, search the Apple Music catalog.   | `false` |
| `--last-break`|       | Include the final break period after the last work interval.       | `false` |
| `--help`      | `-h`  | Show the help message.                                             |  `N/A`  |

## Migration from Deno

The project previously used Deno. The runtime commands and permission model are the same; only the binary name and config file have changed (`deno` → `ende`, `deno.json` → `ende.json`). Existing Deno installs of the tool will need to be reinstalled with Ende.
