async function sendPrompt(text) {
  const receiver = await chrome.storage.session.get([
    "receiverTabId",
    "receiverTabUrl",
  ]);

  const receiverTabId = receiver.receiverTabId ?? null;
  const receiverTabUrl = receiver.receiverTabUrl ?? null;

  const tab =
    receiverTabId !== null ? await chrome.tabs.get(receiverTabId) : null;

  if (
    receiverTabId === null ||
    receiverTabUrl === null ||
    !tab?.url ||
    tab.url !== receiverTabUrl
  ) {
    console.log("[Background] Receiver Validation failed.");

    await chrome.storage.session.remove(["receiverTabId", "receiverTabUrl"]);

    return;
  }

  await chrome.tabs.sendMessage(receiverTabId, {
    action: "INJECT_AND_SUBMIT",
    text,
  });
}

chrome.action.onClicked.addListener(async (tab) => {
  console.log("[Background] Extension clicked:", {
    tabId: tab?.id,
    url: tab?.url,
  });

  if (!tab?.id || !tab?.url?.startsWith("https://chatgpt.com/")) {
    console.log("[Receiver] Selected tab is not ChatGPT.");
    return;
  }

  await chrome.storage.session.set({
    receiverTabId: tab.id,
    receiverTabUrl: tab.url,
  });

  await chrome.tabs.sendMessage(tab.id, {
    action: "RECEIVER_ACTIVE",
  });

  console.log("[Receiver] Receiver locked:", {
    tabId: tab.id,
    url: tab.url,
  });

});

chrome.runtime.onMessage.addListener((message) => {
  if (message.action == "SEND_TEXT") {
    console.log("[Background] SEND_TEXT received.", message.text);

    sendPrompt(message.text);
  }
});