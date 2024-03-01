import fs from "fs";
import { PLACE_IMAGE_HEIGHT } from "../const/imageFormats";

const style = fs.readFileSync("./src/services/billboardStyle.css", "utf8");
const roboFont = fs.readFileSync("./src/services/roboto-medium.bin", "utf8");

export function createHtmlTable(placeList: string[], imageUrls: string[]) {
  const header = `<html><head><style>${style} body {height: ${
    150 * imageUrls.length
  }px;}@font-face {
    font-family: 'testFont';
    src: url('${roboFont}') format('woff2'); 
  }</style></head>`;

  let html = header + "<table>";
  for (let i = 0; i < placeList.length; i++) {
    html += `<tr><td><div class='bullet'>${i + 1}</div></td><td>`;
    if (imageUrls[i])
      html += `<img src="${imageUrls[i]}" alt="${placeList[i]}">`;
    html += `</td><td class='name'>${placeList[i]}</td></tr>`;
  }
  html += "</table></html>";
  return html;
}
