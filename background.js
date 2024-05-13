console.log("Background Script kicks in!");

chrome.action.setBadgeBackgroundColor({ color: "#939ad9" });

// When the service worker runs for the first time
chrome.storage.local.get("isActive", (data) => {
  console.log("Checking in local storage");
  if (!data.isActive) {
    console.log("Variable was not in local storage");

    chrome.storage.local
      .set({
        isActive: true,
      })
      .then(() => {
        console.log("Value is set");
      });
  }

  isActive = data.isActive;

  console.log("Current value of isActive: ", isActive);

  if (isActive) {
    chrome.action.setBadgeText({ text: " ON" });
  } else {
    chrome.action.setBadgeText({ text: "OFF" });
  }
  // Listener for the toggle switch
  chrome.action.onClicked.addListener(() => {
    isActive = !isActive;
    console.log("Current value of isActive: ", isActive);

    chrome.storage.local.set({ isActive }).then(() => {
      console.log("New Value set!");
    });

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
  console.log("Tab was updated");
  if (changeInfo.status == "complete") {
    if (tab.url != prevURL) {
      prevURL = tab.url;

      // Get the value of isActive
      chrome.storage.local.get("isActive", (data) => {
        let isActive = data.isActive;
        console.log("From onUpdated, value of isActive: ", isActive);
        console.log("new URL: ", tab.url);
        if (
          tab.url.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+)\/tree\/(.+)$/)
        ) {
          if (isActive) {
            chrome.tabs.sendMessage(
              tab.id,
              { message: "unmount" },
              (response) => {
                console.log("From CS: ", response);
              }
            );
            chrome.tabs.sendMessage(
              tab.id,
              { message: "invoke" },
              (response) => {
                console.log("From CS: ", response);
              }
            );
          } else {
            chrome.tabs.sendMessage(
              tab.id,
              { message: "unmount" },
              (response) => {
                console.log("From CS: ", response);
              }
            );
          }
        }
      });
    }
  }
});
