// Listener for extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log("Canvas Multi-Login Switcher installed!");
});

// Debugging: Log active tab URLs matching the host patterns
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    console.log("Tab updated:", tab.url);
  }
});

// Message passing for feature toggles
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "toggleFeature") {
    chrome.storage.sync.set({ [message.feature]: message.enabled });
    sendResponse({ status: "success" });
  }
});
