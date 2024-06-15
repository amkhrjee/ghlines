console.log("Content Script invoked!!!");

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
  "xcodeproj",
  "lproj",
  "xcassets",
];

function addLineCounts() {
  const tBody = document.querySelector("tbody");
  const treeRows = tBody.children;
  // console.log("Adding line counts...");
  // Set the header
  document.getElementById("linesTh1729")?.remove();
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

const mutObserver = new MutationObserver(() => {
  // console.log("MutObserver kicks in!");
  addLineCounts();
});

// For Repo Home/Source File View -> Source Tree navigation
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "invoke") {
    // console.log("Received invoke request");
    // FIXME: This is extremely bad and fails for large repos,
    //        unfortunately I can't figure out a better fix at the moment :( PRs are welcome!
    setTimeout(() => {
      addLineCounts();
    }, 1500);

    sendResponse({ message: "Changes applied." });
  } else if (request.message === "unmount") {
    document.getElementById("linesTh1729")?.remove();
    let rowCount = 0;
    for (row of treeRows) {
      document.getElementById(`td1729-${rowCount}`)?.remove();
    }
    sendResponse({ message: "Unmounted successfullyy" });
  }
});

// For page reload and navigation
// thanks to: https://stackoverflow.com/a/55087265/12404524
if (window.performance.getEntriesByType("navigation")) {
  p = window.performance.getEntriesByType("navigation")[0].type;

  if (p == "reload" || p == "back_forward") {
    chrome.storage.local.get("isActive", (data) => {
      let isActive = data.isActive;

      if (
        window.location.href.match(
          /^https:\/\/github\.com\/([^\/]+)\/([^\/]+)\/tree\/(.+)$/
        ) &&
        isActive
      ) {
        const tBody = document.querySelector("tbody");
        mutObserver.observe(tBody, { childList: true });
      }
    });
  }
}
