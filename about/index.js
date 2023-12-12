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

function scrollbarHideResizing() {
  if (!articleScrollContainer && !articleMain) return;
  const scrollbarWidth = articleScrollContainer.offsetWidth - articleScrollContainer.scrollWidth;
  articleScrollContainer.style.width = `${articleMain.offsetWidth + scrollbarWidth}px`;
}

addEventListener("resize", scrollbarHideResizing);

scrollbarHideResizing();
