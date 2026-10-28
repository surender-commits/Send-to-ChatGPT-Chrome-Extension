document.addEventListener("keydown", (event) => {
  // Alt + S

  if (event.altKey && event.key.toLowerCase() === "s") {
    console.log("Alt + S");
    
    const selectedText = window.getSelection()?.toString().trim();

    if (!selectedText) {
      console.log("No text selected");
      return;
    }

    console.log(selectedText);

    chrome.runtime.sendMessage({
      action: "SEND_TEXT",
      text: selectedText,
    });
  }
});