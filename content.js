console.log("Content Script kicks in!");

const tBody = document.querySelector("tbody");
const extensionsToSkip = [
  "odp",
  "7z",
  "a",
  "aac",
  "avi",
  "bin",
  "bin",
  "bmp",
  "bz2",
  "cfg",
  "dat",
  "db",
  "dll",
  "doc",
  "docx",
  "exe",
  "flac",
  "flv",
  "gif",
  "gz",
  "ico",
  "ico",
  "ini",
  "jpeg",
  "jpg",
  "m4a",
  "mkv",
  "mov",
  "mp3",
  "mp4",
  "ods",
  "odt",
  "ogg",
  "otf",
  "out",
  "pdf",
  "png",
  "ppt",
  "pptx",
  "rar",
  "so",
  "svg",
  "tar",
  "ttf",
  "wav",
  "webm",
  "webp",
  "wmv",
  "woff",
  "woff2",
  "xls",
  "xlsx",
  "zip",
];
const treeRows = tBody.children;

function addLineCounts() {
  console.log("Adding Line Counts!");
  // Sets the line numbers for files
  if (treeRows.length) {
    let rowCount = 1;
    let isFirstRow = true;
    for (row of treeRows) {
      if (!isFirstRow) {
        const linesCountTd = document.createElement("td");
        linesCountTd.id = `td1729-${rowCount}`;
        const linesCountSpan = document.createElement("span");
        linesCountTd.appendChild(linesCountSpan);
        linesCountSpan.textContent = "Loading";
        linesCountTd.colSpan = "1";
        linesCountSpan.style.color = "var(--fgColor-muted)";
        row.insertBefore(linesCountTd, row.children[2]);
        const fileName =
          row.children[1]?.children[0]?.children[1]?.children[0]?.children[0]
            .children[0].title;
        let lineCount = "Loading";
        if (fileName && fileName.includes(".")) {
          const ext = fileName.split(".")[1];
          if (!extensionsToSkip.includes(ext)) {
            //  Fetch the line count
            fetch(
              `https://raw.githubusercontent.com/${location.href
                .slice(18)
                .replace("/tree/", "/")}/${fileName}`
            )
              .then((response) => response.body)
              .catch((err) => {
                console.error(err);
                linesCountSpan.textContent = "0";
              })
              .then(async (readableStream) => {
                const reader = readableStream.getReader();
                let done = false;
                while (!done) {
                  const { done: chunkDone, value } = await reader.read();
                  done = chunkDone;
                  if (value) {
                    lineCount = value.filter((x) => x === 10).length;
                    linesCountSpan.textContent = lineCount;
                  }
                }
              })
              .catch((e) => {
                console.error(e);
                linesCountSpan.textContent = "Failed to load";
              });
          } else {
            linesCountSpan.textContent = "";
          }
        } else {
          linesCountSpan.textContent = "";
        }
      } else {
        isFirstRow = false;

        const linesCountTd = document.createElement("td");
        linesCountTd.id = "td1729-0";
        const linesCountSpan = document.createElement("span");
        linesCountTd.appendChild(linesCountSpan);
        linesCountTd.colSpan = "1";
        linesCountSpan.style.color = "var(--fgColor-muted)";
        linesCountSpan.textContent = "";
      }
    }
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "invoke") {
    setTimeout(() => {
      const linesTh = document.createElement("th");
      linesTh.id = "linesTh1729";
      const linesSpan = document.createElement("span");
      linesSpan.textContent = "Lines";
      linesTh.appendChild(linesSpan);

      const tHead = document.querySelector("thead");
      const headerRow = tHead.children[0];
      const headerRowFirstChild = headerRow.children[0];
      linesTh.style = headerRowFirstChild.style;
      linesSpan.style = headerRowFirstChild.children[0].style;
      linesSpan.style.fontWeight = "600";
      headerRow.insertBefore(linesTh, headerRow.children[2]);
      addLineCounts();
      sendResponse({
        message: "Applied changes!",
      });
    }, 1000);
  } else if (request.message === "unmount") {
    document.getElementById("linesTh1729")?.remove();
    let rowCount = 0;
    for (row of treeRows) {
      document.getElementById(`td1729-${rowCount}`).remove();
    }
    sendResponse({ message: "Unmounted successfullyy" });
  }
});

// For page reload
if (window.performance.getEntriesByType("navigation")) {
  p = window.performance.getEntriesByType("navigation")[0].type;

  if (p == "reload") {
    document.getElementById("linesTh1729")?.remove();
    let rowCount = 0;
    for (row of treeRows) {
      document.getElementById(`td1729-${rowCount}`)?.remove();
    }
    chrome.storage.local.get("isActive", (data) => {
      let isActive = data.isActive;
      console.log("From page reload, value of isActive: ", isActive);

      if (isActive) {
        setTimeout(() => {
          const linesTh = document.createElement("th");
          linesTh.id = "linesTh1729";
          const linesSpan = document.createElement("span");
          linesSpan.textContent = "Lines";
          linesTh.appendChild(linesSpan);

          const tHead = document.querySelector("thead");
          const headerRow = tHead.children[0];
          const headerRowFirstChild = headerRow.children[0];
          linesTh.style = headerRowFirstChild.style;
          linesSpan.style = headerRowFirstChild.children[0].style;
          linesSpan.style.fontWeight = "600";
          headerRow.insertBefore(linesTh, headerRow.children[2]);

          addLineCounts();
        }, 500);
      }
    });
  }
}
