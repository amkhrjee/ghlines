chrome.action.setBadgeBackgroundColor({ color: "#939ad9" });

// When the service worker runs for the first time
chrome.storage.local.get("isActive", (data) => {
  if (!data.isActive) {
    chrome.storage.local
      .set({
        isActive: true,
      })
      .then(() => {
        console.log("GHLines Activated 🚀");
      });
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

    chrome.storage.local.set({ isActive }).then(() => {
      console.log("Activation toggled! Activation: ", isActive);
    });

    if (isActive) {
      chrome.action.setBadgeText({ text: "ON" });
    } else {
      chrome.action.setBadgeText({ text: "OFF" });
    }
  });
});

let prevURL = "";
let sameURLCount = 0;
// check for when the tab gets updated
chrome.tabs.onUpdated.addListener((_, changeInfo, tab) => {
  console.log(changeInfo);
  if ("url" in changeInfo) {
    if (
      changeInfo.url.match(
        /^https:\/\/github\.com\/([^\/]+)\/([^\/]+)\/tree\/(.+)$/
      )
    ) {
      if (isActive) {
        console.log("Firing invokation!!!!");
        chrome.tabs.sendMessage(tab.id, { message: "invoke" }, (response) => {
          console.log(response);
        });
      }
    }
  }
});
