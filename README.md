# dinodoro 🦕🍅

A flexible, modern, command-line Pomodoro-style focus timer for macOS, built with Deno and TypeScript.

This tool helps you manage your work and break intervals effectively by controlling system volume, pausing and playing Apple Music, or launching a YouTube video to provide an audio backdrop for your focus sessions.

## Features

* **Secure by Default:** Built on Deno, with no dependency on `npm` or `node_modules`.
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

This project is built on Deno and is designed for macOS.

1.  **Install Deno:** If you don't have Deno installed, you can install it with a simple shell command:
    ```bash
    curl -fsSL [https://deno.land/x/install/install.sh](https://deno.land/x/install/install.sh) | sh
    ```
    (Follow the instructions to add Deno to your system's PATH).

2.  **Install the `dinodoro` command:** Deno allows you to install scripts directly from a URL. Once the code is hosted (e.g., on GitHub), you can install it with:
    ```bash
    # Example installation command (replace with actual URL when available)
    deno install --allow-run --allow-env -n dinodoro https://your-url-to/dinodoro.ts
    ```
    * `--allow-run`: Grants permission to run shell commands (for controlling audio and Music).
    * `--allow-env`: Grants permission to read environment variables.
    * `-n dinodoro`: Names the command `dinodoro`.

3.  **For Local Development:**
    * Clone or download the project files.
    * You can run the script directly from the project folder.

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
    dinodoro "[https://www.youtube.com/watch?v=jfKfPfyJRdk](https://www.youtube.com/watch?v=jfKfPfyJRdk)"
    ```

## Command-Line Options

| Flag         | Alias | Description                                                        | Default |
| :----------- | :---: | :----------------------------------------------------------------- | :-----: |
| `--work`     | `-w`  | Duration of work intervals in minutes.                             |  `25`   |
| `--break`    | `-b`  | Duration of break intervals in minutes.                            |   `5`   |
| `--interval` | `-i`  | The number of work/break cycles to run.                            |   `4`   |
| `--playlist` |       | The name of an Apple Music playlist to play.                       |  `N/A`  |
| `--search`   |       | If a local playlist isn't found, search the Apple Music catalog.   | `false` |
| `--last-break`|      | Include the final break period after the last work interval.       | `false` |
| `--help`     | `-h`  | Show the help message.                                             |  `N/A`  |


