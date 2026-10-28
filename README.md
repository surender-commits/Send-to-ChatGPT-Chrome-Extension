
# Send To ChatGPT

A Chrome extension that lets you send selected text from any webpage directly to ChatGPT using the `Alt + S` keyboard shortcut.

Select text on a webpage, press the shortcut, and the extension forwards the text to your designated ChatGPT tab, where it enters the prompt and submits it automatically.

## Features

- **Quick Text Sharing:** Send selected text from webpages to ChatGPT without manually copying and pasting.
- **Keyboard Shortcut:** Press `Alt + S` to send the selected text.
- **Receiver Tab Selection:** Click the extension icon while viewing ChatGPT to designate that tab as the receiver.
- **Automatic Prompt Entry:** Insert received text into the ChatGPT message input.
- **Automatic Submission:** Click the ChatGPT Send button programmatically after inserting the prompt.
- **Message Queue:** Queue incoming messages and process them sequentially.
- **Receiver Validation:** Check that the designated receiver tab still exists and its URL has not changed.
- **Input Validation:** Check the ChatGPT input and relevant buttons for visibility and disabled states before submitting.
- **Manifest V3:** Uses the Chrome Extension Manifest V3 architecture.

## Requirements

- Google Chrome or a compatible Chromium-based browser.
- Access to [ChatGPT](https://chatgpt.com/).
- JavaScript enabled in the browser.

## Installation

This extension can be installed locally using Chrome's Developer Mode.

1. Download or clone this repository.
2. Extract the project files if you downloaded a ZIP archive.
3. Open Chrome and navigate to:

   `chrome://extensions/`

4. Enable **Developer mode**.
5. Click **Load unpacked**.
6. Select the extracted `Send_To_ChatGPT` project folder containing `manifest.json`.
7. Confirm that the extension appears in your extensions list.

No build process is required for the supplied source files.

## How to Use

### Step 1: Open ChatGPT

Open [ChatGPT](https://chatgpt.com/) in a browser tab and make sure the page has finished loading.

### Step 2: Select the Receiver Tab

Click the **Send To ChatGPT** extension icon while the ChatGPT tab is active.

The extension designates that tab as the receiver for incoming text.

**Important:** If you want to use a different ChatGPT tab as the receiver, activate that tab and click the extension icon again.

### Step 3: Select Text

Open any webpage and select the text you want to send to ChatGPT.

### Step 4: Press Alt + S

Press:

`Alt + S`

The extension sends the selected text to the designated ChatGPT tab.

### Step 5: Automatic Submission

The receiver script checks the ChatGPT interface, inserts the text into the message input, and attempts to submit it automatically.

The message is submitted only when the expected input and Send button are available and pass the script's checks.

## Keyboard Shortcut

| Shortcut | Action |
|---|---|
| `Alt + S` | Send selected webpage text to the designated ChatGPT tab |

The shortcut requires selected text. If no text is selected, the extension does not send a message.

## Project Structure

```text
Send_To_ChatGPT/
├── manifest.json
├── background.js
├── content_chatgpt.js
├── content_universal.js
└── icon.png
```

### File Descriptions

| File | Purpose |
|---|---|
| `manifest.json` | Defines the extension name, version, permissions, service worker, icons, and content scripts. |
| `background.js` | Handles extension clicks, receiver-tab selection, receiver validation, and message forwarding. |
| `content_chatgpt.js` | Receives text, maintains a message queue, inserts prompts into ChatGPT, and attempts automatic submission. |
| `content_universal.js` | Detects the `Alt + S` shortcut, reads the selected text, and sends it to the background service worker. |
| `icon.png` | Extension icon used by the browser. |

## How It Works

The extension uses three main components.

### 1. Universal Content Script

`content_universal.js` runs on webpages matched by the extension manifest.

It listens for `Alt + S`, reads the selected text using the browser's Selection API, and sends the text to the background service worker.

### 2. Background Service Worker

`background.js` manages the receiver tab.

When the extension icon is clicked on a ChatGPT page, the script stores the tab ID and URL in session storage and notifies the ChatGPT content script that it is the receiver.

When text arrives, the background script validates the stored receiver information before forwarding the text.

### 3. ChatGPT Receiver Script

`content_chatgpt.js` receives incoming messages and adds them to a queue.

It periodically checks for the expected ChatGPT message input and relevant buttons. When the required elements are available, it inserts the queued text and attempts to click the Send button.

The queue helps process multiple incoming messages sequentially.

## Permissions

The extension declares the following permissions in `manifest.json`.

| Permission | Purpose |
|---|---|
| `storage` | Stores receiver-tab information in session storage. |
| `tabs` | Retrieves and validates the designated receiver tab. |
| `activeTab` | Declares active-tab access for extension interactions. |
| `scripting` | Declares access to the scripting API. |

The extension also declares host permissions for webpages and ChatGPT.

Review the permissions and host access before installing the extension, particularly if you plan to distribute it publicly.

## Troubleshooting

### The Shortcut Does Nothing

- Make sure you have selected text on the webpage.
- Try pressing `Alt + S` again.
- Check whether another application or browser extension is intercepting the shortcut.
- Open the browser console to inspect any errors.

### Text Does Not Reach ChatGPT

- Open ChatGPT in a browser tab.
- Click the extension icon while that tab is active to designate it as the receiver.
- Confirm that the receiver tab remains open and its URL has not changed.
- Check the extension's service worker and ChatGPT page console for errors.

### Text Is Not Submitted

The receiver script relies on specific ChatGPT interface selectors, including the message input and Send button.

If ChatGPT changes its interface, these selectors may stop working. The script also checks for the expected Start Voice button before processing messages.

Ensure ChatGPT has loaded completely and that the required controls are visible and enabled.

### Messages Remain in the Queue

The script processes messages only when its required interface elements pass validation.

If an expected element is missing, hidden, or disabled, processing may stop until the condition is resolved. Inspect the ChatGPT page console for diagnostic messages.

### The Extension Stops Working After a Page Change

The extension validates the stored receiver tab URL. If the URL changes, the stored receiver information may be cleared.

Click the extension icon again on the intended ChatGPT tab to designate it as the receiver.

## Known Limitations

- The extension depends on the current ChatGPT webpage structure and CSS selectors.
- Automatic submission requires the expected ChatGPT interface elements to be present and enabled.
- The receiver tab must be designated by clicking the extension icon on ChatGPT.
- The receiver information is stored in session storage and is not designed as a permanent receiver setting.
- The message queue is held in the ChatGPT content script's memory and is not a persistent queue.
- The `Alt + S` shortcut is implemented through a webpage keydown listener rather than the browser's registered extension-command API.
- The extension does not provide a dedicated settings page or popup interface in the supplied source files.

## Contributing

Contributions, bug reports, and feature suggestions are welcome.

When reporting an issue, include:

- The browser and version.
- The steps needed to reproduce the issue.
- Any relevant console errors.
- Whether the receiver tab was correctly designated.

For pull requests, describe the change and explain how it was tested.

## License

No license file was included with the supplied project.

If you intend to publish this project as open source, add a `LICENSE` file specifying the terms under which others may use, modify, and distribute the code.

Until a license is added, do not assume that the repository grants standard open-source reuse permissions.
