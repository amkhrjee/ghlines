const tBody = document.querySelector("tbody");

// Sets the "Lines" header
const linesTh = document.createElement("th");
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
const treeRows = tBody.children;

setTimeout(() => {
  if (treeRows.length) {
    let isFirstRow = true;
    let count = 1;
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
        if (fileName && fileName.includes(".")) {
          console.log(fileName);
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

                  console.log(lineCount);
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
        isFirstRow = false;
      }
    }
  }
}, 200);
