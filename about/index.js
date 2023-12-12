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
