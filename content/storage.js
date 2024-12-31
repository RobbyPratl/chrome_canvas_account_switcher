export async function loadSwitcherState() {
  const { switcherEnabled = true } = await chrome.storage.sync.get([
    "switcherEnabled",
  ]);
  return switcherEnabled;
}

export async function saveSwitcherState(isEnabled) {
  await chrome.storage.sync.set({ switcherEnabled: isEnabled });
}

export async function loadCanvasUrls() {
  const { canvasUrls = [] } = await chrome.storage.sync.get(["canvasUrls"]);
  return canvasUrls;
}

export async function saveCanvasUrls(urls) {
  await chrome.storage.sync.set({ canvasUrls: urls });
}
