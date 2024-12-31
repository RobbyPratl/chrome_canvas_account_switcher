(async function () {
  const isCanvas = document
    .getElementById("application")
    ?.classList.contains("ic-app");

  console.log("IsCanvas: ", isCanvas);

  async function fetchCanvasUrls() {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get(["canvasUrls"], (result) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(result.canvasUrls || []);
        }
      });
    });
  }

  async function isSwitcherEnabled() {
    return new Promise((resolve) => {
      chrome.storage.sync.get(["switcherEnabled"], (result) => {
        resolve(result.switcherEnabled ?? true); // Default to `true` if not set
      });
    });
  }

  async function createSwitcherTray() {
    const trayPortal = document.createElement("div");
    trayPortal.id = "nav-tray-portal";
    trayPortal.style.position = "relative";
    trayPortal.style.zIndex = "99";

    // Initially hidden tray content
    const trayContent = document.createElement("span");
    trayContent.className = "css-1gto5tw-tray transition--slide-left-entered";
    trayContent.style.display = "none"; // Hidden by default

    // Add the main tray dialog structure
    trayContent.innerHTML = `
          <div role="dialog" aria-label="Switcher Tray">
            <div class="css-1kdtqv3-tray__content">
              <div class="navigation-tray-container">
                <span class="css-zvg8k4-closeButton">
                  <button type="button" tabindex="0" class="css-1ly7h15-view--inlineBlock-baseButton">
                    <span class="css-12w1q2i-baseButton__content">
                      <span class="css-5udsuu-baseButton__iconOnly">
                        <span class="css-31gkb3-baseButton__iconSVG">
                          <svg name="IconX" viewBox="0 0 1920 1920" width="1em" height="1em" aria-hidden="true" role="presentation" focusable="false">
                            <g role="presentation">
                              <path d="M797.32 985.882 344.772 1438.43l188.561 188.562 452.549-452.549 452.548 452.549 188.562-188.562-452.549-452.548 452.549-452.549-188.562-188.561L985.882 797.32 533.333 344.772 344.772 533.333z"></path>
                            </g>
                          </svg>
                        </span>
                        <span class="css-1sr5vj2-screenReaderContent">Close</span>
                      </span>
                    </span>
                  </button>
                </span>
                <div class="tray-with-space-for-global-nav">
                  <div class="css-1dsl5sr-view">
                    <h2 class="css-cv5a3j-view-heading">Switcher Tray</h2>
                    <hr role="presentation">
                    <ul id="canvas-links-list" class="css-1t5l7tc-view--block-list">
                      <!-- Links will be populated here -->
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;

    // Add close functionality
    trayContent.querySelector("button").addEventListener("click", () => {
      trayContent.style.display = "none";
    });

    trayPortal.appendChild(trayContent);
    document.body.appendChild(trayPortal);

    // Fetch and populate links
    const linksList = trayContent.querySelector("#canvas-links-list");
    try {
      const canvasUrls = await fetchCanvasUrls();
      if (canvasUrls.length > 0) {
        canvasUrls.forEach((url) => {
          const listItem = document.createElement("li");
          listItem.className = "css-kryo2y-view-listItem";
          listItem.innerHTML = `
                <span class="css-10d73cs-view--flex-flex">
                  <span class="css-ugw0y2-view-flexItem"><i class="icon-link" aria-hidden="true"></i></span>
                  <span class="css-1r1qr4e-view-flexItem">
                    <a href="${url}" target="_blank" class="css-8ro1ll-view-link">${url}</a>
                  </span>
                </span>
              `;
          linksList.appendChild(listItem);
        });
      } else {
        linksList.innerHTML = "<li>No Canvas URLs found.</li>";
      }
    } catch (error) {
      console.error("Error fetching Canvas URLs:", error);
      linksList.innerHTML = "<li>Error loading Canvas URLs.</li>";
    }

    return trayContent;
  }

  function addSwitcherButton(trayContent) {
    const menu = document.getElementById("menu");

    if (menu) {
      const newListItem = document.createElement("li");
      newListItem.className = "menu-item ic-app-header__menu-list-item";

      const newLink = document.createElement("a");
      newLink.id = "global_nav_switcher_button";
      newLink.href = "#";
      newLink.className = "ic-app-header__menu-list-link";

      const iconContainer = document.createElement("div");
      iconContainer.className = "menu-item-icon-container";
      iconContainer.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
                                        <path d="M10 5a1 1 0 00-1 1v2H5a1 1 0 100 2h4v2a1 1 0 102 0v-2h4a1 1 0 100-2h-4V6a1 1 0 00-1-1z"/>
                                      </svg>`;
      const text = document.createElement("div");
      text.className = "menu-item__text";
      text.textContent = "Switcher";

      newLink.appendChild(iconContainer);
      newLink.appendChild(text);
      newListItem.appendChild(newLink);
      menu.appendChild(newListItem);

      newLink.addEventListener("click", (e) => {
        e.preventDefault();
        trayContent.style.display =
          trayContent.style.display === "none" ? "block" : "none";
      });

      console.log("Switcher button added to the menu.");
    } else {
      console.error("Menu not found in the DOM.");
    }
  }

  if (isCanvas) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", async () => {
        const trayContent = await createSwitcherTray();
        addSwitcherButton(trayContent);
      });
    } else if (await isSwitcherEnabled()) {
      const trayContent = await createSwitcherTray();
      addSwitcherButton(trayContent);
    } else {
      console.log("Switcher is disabled.");
    }
  }
})();
