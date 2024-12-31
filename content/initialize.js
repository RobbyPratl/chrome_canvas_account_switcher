(async function () {
  const isCanvas = document
    .getElementById("application")
    ?.classList.contains("ic-app");

  async function loadSwitcherState() {
    const { switcherEnabled = true } = await chrome.storage.sync.get([
      "switcherEnabled",
    ]);
    return switcherEnabled;
  }

  async function initialize() {
    const switcherEnabled = await loadSwitcherState();

    if (isCanvas && switcherEnabled) {
      const { createSwitcherTray, addSwitcherButton } = await import(
        chrome.runtime.getURL("content/switcher.js")
      );

      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", async () => {
          const trayContent = await createSwitcherTray();
          addSwitcherButton(trayContent);
        });
      } else {
        const trayContent = await createSwitcherTray();
        addSwitcherButton(trayContent);
      }
    }
  }

  initialize();
})();
