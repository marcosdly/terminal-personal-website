"use strict";

/**
 *
 * @param {string} str
 * @returns {Number?}
 */
function firstSetOfNumbersFromString(str) {
  const nums = str.match(/-?[0-9]+/);
  if (!nums) return null;
  return Number(nums);
}

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

const articleMain = document.querySelector("article > main");
const articleScrollContainer = document.querySelector("article > main > .scroll-container");
const customScrollbar = document.querySelector("body > .scrollbar");
const customScrollbarIndicator = document.querySelector("body > .scrollbar > .actual-bar");
const scrollCeiling = document.querySelector("article > main > .scroll-ceiling");

/**
 *
 * @param {WheelEvent} event
 * @returns {void}
 */
function customScrollbarCalculate(event) {
  if (!customScrollbar || !customScrollbarIndicator || !articleMain || !scrollCeiling) return;

  // No need to check for null. There's a style tag set to '0px' in HTML.
  let scrollerOffset = firstSetOfNumbersFromString(scrollCeiling.style.marginTop);
  const maxOffsetRange =
    articleMain.scrollHeight +
    (scrollerOffset < 0 ? -scrollerOffset : 0) -
    articleMain.offsetHeight;
  if (maxOffsetRange <= 0) {
    scrollCeiling.style.marginTop = "0px";
  } else if (event) {
    (function () {
      const afterScrolling = maxOffsetRange - event.deltaY;
      if (event.deltaY === 0 || scrollerOffset === maxOffsetRange) return;
      else if (event.deltaY < 0 && scrollerOffset - event.deltaY < 0)
        scrollCeiling.style.marginTop = `${scrollerOffset - event.deltaY}px`;
      else if (event.deltaY < 0 && scrollerOffset - event.deltaY >= 0)
        scrollCeiling.style.marginTop = "0px";
      else if (afterScrolling <= 0) scrollCeiling.style.marginTop = `${-maxOffsetRange}px`;
      else if (Math.abs(scrollerOffset - event.deltaY) >= maxOffsetRange)
        scrollCeiling.style.marginTop = `${-maxOffsetRange}px`;
      else scrollCeiling.style.marginTop = `${scrollerOffset - event.deltaY}px`;
    })();
    scrollerOffset = firstSetOfNumbersFromString(scrollCeiling.style.marginTop);
  }

  if (scrollerOffset === 0) {
    customScrollbarIndicator.style.marginTop = "0px";
    return;
  }

  const percentageScrolled = Math.abs(scrollerOffset) / maxOffsetRange;
  const maxOffsetBarRange = customScrollbar.offsetHeight - customScrollbarIndicator.offsetHeight;
  customScrollbarIndicator.style.marginTop = `${maxOffsetBarRange * percentageScrolled}px`;
}

function scrollbarHideResizing() {
  if (!customScrollbar || !customScrollbarIndicator || !articleMain || !scrollCeiling) return;

  const totalBarHeight = articleMain.offsetHeight * 0.4;
  customScrollbar.style.height = `${totalBarHeight}px`;
  customScrollbarIndicator.style.height = `${
    totalBarHeight * (articleMain.offsetHeight / articleMain.scrollHeight)
  }px`;
  customScrollbarCalculate();
}

addEventListener("resize", scrollbarHideResizing);
articleMain.addEventListener("wheel", customScrollbarCalculate);

scrollbarHideResizing();
