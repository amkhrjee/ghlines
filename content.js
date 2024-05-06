const tBody = document.querySelector("tbody");
// tBody.style.backgroundColor = "gray";

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

commitMessageStyle = treeRows[1].children[1].children[0].style;

setTimeout(() => {
  if (treeRows.length) {
    let isFirstRow = true;
    let count = 1;
    for (row of treeRows) {
      console.log(`Row ${count++}`);
      if (!isFirstRow) {
        const linesCountTd = document.createElement("td");
        const linesCountSpan = document.createElement("span");
        linesCountTd.appendChild(linesCountSpan);
        linesCountSpan.textContent = "123";
        linesCountTd.colSpan = "1";
        // linesCountTd.style = row.style;
        linesCountSpan.style.color = "var(--fgColor-muted)";
        row.insertBefore(linesCountTd, row.children[2]);
      } else {
        isFirstRow = false;
      }
    }
  }
}, 200);
