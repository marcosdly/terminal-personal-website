"use strict";

import { FetchImage } from "../js/firebase/storage";
import { Scroller } from "../js/customScroll";

const photoSelectElements = document.querySelectorAll("ol.photos-carrousel > .select");
const photoListItems = document.querySelectorAll("ol.photos-carrousel > li");

photoSelectElements.forEach((elem, i) => {
  elem.setAttribute("data-which-photo", i);

  elem.addEventListener("click", (event) => {
    photoSelectElements.forEach((el, j) => {
      if (j.toString() === event.currentTarget.getAttribute("data-which-photo")) {
        el.classList.add("checked");
        photoListItems[j].style.clipPath = "circle(100%)";
        return;
      }
      el.classList.remove("checked");
      photoListItems[j].style.clipPath = "circle(0)";
    });
  });

  if (i === 0) elem.click();
});

const content = document.querySelector("article > main");
const contentOffsetter = document.querySelector("article > main > .scroll-ceiling");
const scrollbar = document.querySelector("body > .scrollbar");
const scrollbarIndicator = document.querySelector("body > .scrollbar > .actual-bar");
const scroller = new Scroller(content, contentOffsetter, { inverted: false });

function scrollbarCalculate() {
  const totalBarHeight = scroller.scrollable.offsetHeight * 0.4;
  const contentSize =
    scroller.scrollable.scrollHeight + Math.abs(scroller.scrollerOffset);
  scrollbar.style.height = totalBarHeight + "px";

  if (scroller.scrollable.clientHeight >= contentSize) {
    scrollbarIndicator.style.height = totalBarHeight + "px";
    scrollbarIndicator.style.marginTop = "0px";
    return;
  }

  scrollbarIndicator.style.height =
    totalBarHeight * (scroller.scrollable.clientHeight / contentSize) + "px";

  if (scroller.scrollerOffset === 0) {
    scrollbarIndicator.style.marginTop = "0px";
    return;
  }

  // Max possible value of margin-top
  const barMaxOffsetRange = scrollbar.offsetHeight - scrollbarIndicator.offsetHeight;
  if (scroller.scroller.style.marginTop === "0px")
    scrollbarIndicator.style.marginTop = "0px";
  else if (scroller.scrollerOffset === -scroller.maxOffsetRange)
    scrollbarIndicator.style.marginTop = barMaxOffsetRange + "px";
  else
    scrollbarIndicator.style.marginTop = `${
      barMaxOffsetRange * (Math.abs(scroller.scrollerOffset) / scroller.maxOffsetRange)
    }px`;
}

scroller.onscrollend = scrollbarCalculate;
addEventListener("resize", scrollbarCalculate);
content.addEventListener("wheel", scroller.onwheel);
content.addEventListener("touchmove", scroller.ontouchmove);
content.addEventListener("touchstart", scroller.ontouchstart);

scrollbarCalculate();

document
  .querySelectorAll("img[data-storage-origin][data-storage-filename]")
  .forEach((elem) => {
    FetchImage[elem.getAttribute("data-storage-origin")](
      elem.getAttribute("data-storage-filename"),
    ).then((url) => (elem.src = url));
  });
