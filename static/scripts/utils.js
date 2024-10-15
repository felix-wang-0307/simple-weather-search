export function createDivElement(className, textContent) {
  const element = document.createElement("div");
  element.className = className;
  element.textContent = textContent;
  return element;
}

export function convertDate(ISODate) {
  const date = new Date(ISODate);
  // Transfer the ISODate to "Wednesday, 1 Jan 2020" format
  const localeString = date.toLocaleDateString("en-US", {weekday: "long", day: "2-digit", month: "short", year: "numeric"});
  // Remove the 2nd comma between the Month and Year
  const secondCommaIndex = localeString.indexOf(",", localeString.indexOf(",") + 1);
  return localeString.slice(0, secondCommaIndex) + localeString.slice(secondCommaIndex + 1);
}

