const toggleSwitcherCheckbox = document.getElementById("toggleSwitcher");
const canvasUrlInput = document.getElementById("canvasUrlInput");
const addCanvasBtn = document.getElementById("addCanvasBtn");
const canvasListDiv = document.getElementById("canvasList");

// Load saved states and URLs on popup open
async function initializePopup() {
  const { switcherEnabled = true, canvasUrls = [] } =
    await chrome.storage.sync.get(["switcherEnabled", "canvasUrls"]);

  toggleSwitcherCheckbox.checked = switcherEnabled;
  displayCanvasUrls(canvasUrls);
}

function displayCanvasUrls(urls) {
  canvasListDiv.innerHTML = ""; // Clear the list
  urls.forEach((url) => {
    const urlEl = document.createElement("div");
    urlEl.textContent = url;
    canvasListDiv.appendChild(urlEl);
  });
}

// Event: Toggle the switcher feature
toggleSwitcherCheckbox.addEventListener("change", async () => {
  const enabled = toggleSwitcherCheckbox.checked;
  chrome.runtime.sendMessage({
    action: "toggleFeature",
    feature: "switcherEnabled",
    enabled,
  });
});

// Event: Add a new Canvas URL
addCanvasBtn.addEventListener("click", async () => {
  const newUrl = canvasUrlInput.value.trim();
  if (!newUrl) return;

  const { canvasUrls = [] } = await chrome.storage.sync.get(["canvasUrls"]);
  if (!canvasUrls.includes(newUrl)) {
    canvasUrls.push(newUrl);
    await chrome.storage.sync.set({ canvasUrls });
    displayCanvasUrls(canvasUrls);
    canvasUrlInput.value = "";
  }
});

// Initialize the popup
initializePopup();
