window.onload = () => {
  const tBody = document.querySelector("tbody");
  tBody.style.backgroundColor = "gray";

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
};
