chrome.action.setBadgeBackgroundColor({ color: "#939ad9" });
chrome.storage.local.get("isActive", (data) => {
  if (!data.isActive) {
    chrome.storage.local.set({
      isActive: true,
    });
  }

  let isActive = data.isActive || true;

  if (isActive) {
    chrome.action.setBadgeText({ text: " ON" });
  } else {
    chrome.action.setBadgeText({ text: "OFF" });
  }

  chrome.action.onClicked.addListener(() => {
    isActive = !isActive;
    chrome.storage.local.set({ isActive });

    if (isActive) {
      chrome.action.setBadgeText({ text: " ON" });
    } else {
      chrome.action.setBadgeText({ text: "OFF" });
    }
  });
});
