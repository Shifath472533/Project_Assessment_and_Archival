import lodash from "lodash";
// let lodash = require("lodash");

export default function GetVisiblePageNumbers(
  pages,
  currentPage,
  visibilityLimit = 3
) {
  //   console.log("currentPage", currentPage);
  let startIndex = currentPage - Math.floor(visibilityLimit / 2);
  if (currentPage === pages[0]) {
    startIndex = currentPage;
  } else if (currentPage === pages[pages.length - 1]) {
    startIndex = currentPage - visibilityLimit + 1;
  }
  //   console.log(startIndex);
  return lodash(pages)
    .slice(pages.indexOf(startIndex))
    .take(visibilityLimit)
    .value();
}

// console.log(GetVisiblePageNumbers([1, 2, 3, 4, 5, 6], 4, 5));
