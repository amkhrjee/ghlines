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

chrome.storage.local.get("isActive", (data) => {
  const isActive = data.isActive;
  console.log(isActive);

  if (isActive) {
    console.log("Extension is Active!");
    // Sets the "Lines" header
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
  }
});

const addLineCounts = () => {
  // Sets the line numbers for files
  const treeRows = tBody.children;

  setTimeout(() => {
    if (treeRows.length) {
      let isFirstRow = true;
      for (row of treeRows) {
        if (!isFirstRow) {
          const linesCountTd = document.createElement("td");
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
          const ext = fileName.split(".")[1];
          if (!extensionsToSkip.includes(ext)) {
            if (fileName && fileName.includes(".")) {
              //  Fetch the line count
              fetch(
                `https://raw.githubusercontent.com/${location.href
                  .slice(18)
                  .replace("/tree/", "/")}/${fileName}`
              )
                .then((response) => response.body)
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
                });
            } else {
              linesCountSpan.textContent = "";
            }
          } else {
            linesCountSpan.textContent = "";
          }
        } else {
          isFirstRow = false;
        }
      }
    }
  }, 200);
};

const observeUrlChange = () => {
  let oldHref = document.location.href;
  const body = document.querySelector("body");
  const observer = new MutationObserver((mutations) => {
    if (oldHref !== document.location.href) {
      oldHref = document.location.href;
      chrome.storage.local.get("isActive", (data) => {
        const isActive = data.isActive;
        console.log(isActive);

        if (isActive) {
          console.log("Extension is Active!");

          setTimeout(() => {
            addLineCounts();
          }, 1000);
        } else {
          document.getElementById("linesTh1729").remove();
        }
      });
    }
  });
  observer.observe(body, { childList: true, subtree: true });
};

window.onload = observeUrlChange;
