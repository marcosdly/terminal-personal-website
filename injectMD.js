"use strict";

import { JSDOM } from "jsdom";
import showdown from "showdown";
import * as path from "path";
import { glob } from "glob";
import * as fs from "fs";

const converter = new showdown.Converter();
converter.setFlavor("github");

/**
 * @param {string} inputFile - Input markdown file path
 * @param {string} outputFile - Output html file path
 * @param {string} templateFile - Template html file path
 */
function injectMD(inputFile, outputFile, templateFile) {
  const dom = new JSDOM(fs.readFileSync(templateFile)),
    mdContent = fs.readFileSync(inputFile).toString();

  dom.window.document.querySelector(".main-content-container").innerHTML =
    converter.makeHtml(mdContent);
  fs.writeFileSync(outputFile, dom.serialize());
}

const Articles = ["about", "readme"];

for (const page of Articles) {
  try {
    fs.mkdirSync(page);
  } catch {}
  injectMD(
    path.join("md-articles", `${page}.md`),
    path.join(page, "index.html"),
    path.join("templates", "article.html")
  );
}
