console.log("[ChatGPT Receiver] Loaded.");

let isReceiver = false;

const messageQueue = [];

const tLog = (txt) => {
  document.title = txt;
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message && message.action == "RECEIVER_ACTIVE") {
    console.log("[ChatGPT Receiver] RECEIVER_ACTIVE.");
    isReceiver = true;
    return;
  }

  if (
    !message ||
    message.action !== "INJECT_AND_SUBMIT" ||
    typeof message.text !== "string" ||
    !message.text.trim()
  ) {
    console.log("[ChatGPT Receiver] Message ignored.");
    return;
  }

  messageQueue.push(message.text.trim());

  console.log(
    `[ChatGPT Receiver] Message added. Queue size: ${messageQueue.length}`,
  );
});

setInterval(() => {
  if (!isReceiver) {
    return;
  }

  document.title = `Queue : [${messageQueue.length}] `;

  if (messageQueue.length === 0) {
    return;
  }

  let inputEl = document.querySelector(
    'div.ProseMirror[contenteditable="true"][role="textbox"]',
  );

  if (!inputEl) {
    console.log("[ChatGPT Receiver] ChatGPT Input not Found.");
    tLog(`Queue : [${messageQueue.length}] ` + " Input Not Found.");
    return;
  }

  const inputElDisabled =
    inputEl.disabled === true ||
    inputEl.hasAttribute("disabled") ||
    inputEl.getAttribute("aria-disabled") === "true";

  if (inputElDisabled) {
    console.log("[ChatGPT Receiver] ChatGPT Input in Disabled.");
    tLog(`Queue : [${messageQueue.length}] ` + "Input is Disabled");
    return;
  }

  const inputElStyle = window.getComputedStyle(inputEl);

  const inputElVisible =
    inputElStyle.display !== "none" &&
    inputElStyle.visibility !== "hidden" &&
    inputElStyle.opacity !== "0" &&
    (inputEl.offsetWidth ||
      inputEl.offsetHeight ||
      inputEl.getClientRects().length);

  if (!inputElVisible) {
    console.log("[ChatGPT Receiver] ChatGPT Input in not Visible.");
    tLog(`Queue : [${messageQueue.length}] ` + "Input is Not Visible.");
    return;
  }

  let startVoiceBTN = document.querySelector(
    'button[aria-label="Start Voice"]',
  );

  if (!startVoiceBTN) {
    console.log("[ChatGPT Receiver] Start Voice button not Found.");
    tLog(`Queue : [${messageQueue.length}] ` + "Start Voice Button Not Found.");
    return;
  }

  const startVoiceBTNDisabled =
    startVoiceBTN.disabled === true ||
    startVoiceBTN.hasAttribute("disabled") ||
    startVoiceBTN.getAttribute("aria-disabled") === "true";

  if (startVoiceBTNDisabled) {
    console.log("[ChatGPT Receiver] Start Voice button is Disabled.");
    tLog(`Queue : [${messageQueue.length}] ` + "Start Voice button is Disabled.");
    return;
  }

  const startVoiceBTNStyle = window.getComputedStyle(startVoiceBTN);

  const startVoiceBTNVisible =
    startVoiceBTNStyle.display !== "none" &&
    startVoiceBTNStyle.visibility !== "hidden" &&
    startVoiceBTNStyle.opacity !== "0" &&
    (startVoiceBTN.offsetWidth ||
      startVoiceBTN.offsetHeight ||
      startVoiceBTN.getClientRects().length);

  if (!startVoiceBTNVisible) {
    console.log("[ChatGPT Receiver] Start Voice button is not Visible.");
    tLog(`Queue : [${messageQueue.length}] ` + "Start Voice button is not Visible.");
    return;
  }

  const prompt = messageQueue[0];

  console.log(
    `[ChatGPT Receiver] Processing.`,
  );

  inputEl.focus();

  if (inputEl.tagName.toLowerCase() === "textarea") {
    const prototype = Object.getPrototypeOf(inputEl);

    const valueSetter = Object.getOwnPropertyDescriptor(
      prototype,
      "value",
    )?.set;

    if (valueSetter) {
      valueSetter.call(inputEl, prompt);
    } else {
      inputEl.value = prompt;
    }

    inputEl.dispatchEvent(
      new Event("input", {
        bubbles: true,
      }),
    );
  } else if (
    inputEl.isContentEditable ||
    inputEl.getAttribute("contenteditable") === "true"
  ) {
    inputEl.innerHTML = "";

    const paragraph = document.createElement("p");
    paragraph.textContent = prompt;

    inputEl.appendChild(paragraph);

    inputEl.dispatchEvent(
      new InputEvent("input", {
        bubbles: true,
        inputType: "insertText",
        data: prompt,
      }),
    );
  }

  console.log("[ChatGPT Receiver] Prompt entered.");

  setTimeout(() => {
    let submitBTN = document.querySelector('button[aria-label="Send"]');

    if (!submitBTN) {
      console.log("[ChatGPT Receiver] Submit button not Found.");
      tLog(`Queue : [${messageQueue.length}] ` + "Submit button not Found.");
      return;
    }

    const submitBTNDisabled =
      submitBTN.disabled === true ||
      submitBTN.hasAttribute("disabled") ||
      submitBTN.getAttribute("aria-disabled") === "true";

    if (submitBTNDisabled) {
      console.log("[ChatGPT Receiver] Submit button is Disabled.");
      tLog(`Queue : [${messageQueue.length}] ` + "Submit button is Disabled.");
      return;
    }

    const submitBTNStyle = window.getComputedStyle(submitBTN);

    const submitBTNVisible =
      submitBTNStyle.display !== "none" &&
      submitBTNStyle.visibility !== "hidden" &&
      submitBTNStyle.opacity !== "0" &&
      (submitBTN.offsetWidth ||
        submitBTN.offsetHeight ||
        submitBTN.getClientRects().length);

    if (!submitBTNVisible) {
      console.log("[ChatGPT Receiver] Submit button is not Visible.");
      tLog(`Queue : [${messageQueue.length}] ` + "Submit button is not Visible.");
      return;
    }

    submitBTN.click();

    messageQueue.shift();

    console.log(
      `[ChatGPT Receiver] Message sent. Remaining queue: ${messageQueue.length}`,
    );
  }, 200);
}, 2000);
