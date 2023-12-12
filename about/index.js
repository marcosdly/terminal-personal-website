"use strict";

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

function customScrollbarCalculate() {
  if (!customScrollbar || !customScrollbarIndicator || !articleMain || !articleScrollContainer)
    return;
  else if (articleScrollContainer.scrollHeight <= articleScrollContainer.offsetHeight) return;
  else if (articleScrollContainer.scrollTop === 0) {
    customScrollbarIndicator.style.marginTop = "0px";
    return;
  }

  const maxOffsetRange = articleScrollContainer.scrollHeight - articleScrollContainer.offsetHeight;
  const percentageScrolled = articleScrollContainer.scrollTop / maxOffsetRange;
  const maxOffsetBarRange = customScrollbar.offsetHeight - customScrollbarIndicator.offsetHeight;
  customScrollbarIndicator.style.marginTop = `${maxOffsetBarRange * percentageScrolled}px`;
}

function scrollbarHideResizing() {
  if (!customScrollbar || !customScrollbarIndicator || !articleMain || !articleScrollContainer)
    return;

  const totalBarHeight = articleMain.offsetHeight * 0.4;
  customScrollbar.style.height = `${totalBarHeight}px`;
  customScrollbarIndicator.style.height = `${
    totalBarHeight * (articleScrollContainer.offsetHeight / articleScrollContainer.scrollHeight)
  }px`;
  customScrollbarCalculate();

  const scrollbarWidth = articleScrollContainer.offsetWidth - articleScrollContainer.scrollWidth;
  articleScrollContainer.style.width = `${articleMain.offsetWidth + scrollbarWidth}px`;
}

addEventListener("resize", scrollbarHideResizing);
if (articleScrollContainer)
  articleScrollContainer.addEventListener("scroll", customScrollbarCalculate);

scrollbarHideResizing();
