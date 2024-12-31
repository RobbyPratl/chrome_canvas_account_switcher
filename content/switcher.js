export async function createSwitcherTray() {
  const trayPortal = document.createElement("div");
  trayPortal.id = "nav-tray-portal";
  trayPortal.style.position = "relative";
  trayPortal.style.zIndex = "99";

  const trayContent = document.createElement("span");
  trayContent.className = "css-1gto5tw-tray transition--slide-left-entered";
  trayContent.style.display = "none";

  trayContent.innerHTML = `
    <div role="dialog" aria-label="Switcher Tray">
      <div class="css-1kdtqv3-tray__content">
        <div class="navigation-tray-container">
          <button id="closeTrayButton">Close</button>
          <ul id="canvas-links-list"></ul>
        </div>
      </div>
    </div>
  `;

  trayPortal.appendChild(trayContent);
  document.body.appendChild(trayPortal);

  const linksList = trayContent.querySelector("#canvas-links-list");
  const canvasUrls = await chrome.storage.sync
    .get(["canvasUrls"])
    .then(({ canvasUrls }) => canvasUrls || []);

  linksList.innerHTML = canvasUrls
    .map((url) => `<li><a href="${url}" target="_blank">${url}</a></li>`)
    .join("");

  trayContent
    .querySelector("#closeTrayButton")
    .addEventListener("click", () => {
      trayContent.style.display = "none";
    });

  return trayContent;
}

export function addSwitcherButton(trayContent) {
  const menu = document.getElementById("menu");
  if (menu) {
    const button = document.createElement("button");
    button.textContent = "Switcher";
    button.addEventListener("click", () => {
      trayContent.style.display =
        trayContent.style.display === "none" ? "block" : "none";
    });
    menu.appendChild(button);
  }
}
