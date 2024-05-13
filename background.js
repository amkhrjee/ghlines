chrome.action.setBadgeBackgroundColor({ color: "#939ad9" });

// When the service worker runs for the first time
chrome.storage.local.get("isActive", (data) => {
  if (!data.isActive) {
    chrome.storage.local
      .set({
        isActive: true,
      })
      .then(() => {});
  }

  isActive = data.isActive;

  if (isActive) {
    chrome.action.setBadgeText({ text: " ON" });
  } else {
    chrome.action.setBadgeText({ text: "OFF" });
  }
  // Listener for the toggle switch
  chrome.action.onClicked.addListener(() => {
    isActive = !isActive;

    chrome.storage.local.set({ isActive }).then(() => {});

    if (isActive) {
      chrome.action.setBadgeText({ text: " ON" });
    } else {
      chrome.action.setBadgeText({ text: "OFF" });
    }
  });
});

let prevURL = "";
let sameURLCount = 0;
// check for when the tab gets updated
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status == "complete") {
    if (tab.url != prevURL) {
      prevURL = tab.url;

      // Get the value of isActive
      chrome.storage.local.get("isActive", (data) => {
        let isActive = data.isActive;

        if (
          tab.url.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+)\/tree\/(.+)$/)
        ) {
          if (isActive) {
            chrome.tabs.sendMessage(
              tab.id,
              { message: "unmount" },
              (response) => {}
            );
            chrome.tabs.sendMessage(
              tab.id,
              { message: "invoke" },
              (response) => {}
            );
          } else {
            chrome.tabs.sendMessage(
              tab.id,
              { message: "unmount" },
              (response) => {}
            );
          }
        }
      });
    }
  }
});
