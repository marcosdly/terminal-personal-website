"use strict";

import { FetchImage } from "../js/firebase/storage";
import { Scroller } from "../js/customScroll";

const content = document.querySelector("article > main");
const contentOffsetter = document.querySelector("article > main > .scroll-ceiling");
const scrollbar = document.querySelector("body > .scrollbar");
const scrollbarIndicator = document.querySelector("body > .scrollbar > .actual-bar");

const scroller = new Scroller(
  content,
  contentOffsetter,
  scrollbar,
  scrollbarIndicator,
  { inverted: false },
);

class Carrousel {
  static indexAttrName = "data-which-photo";
  static remoteFileAttrName = "data-storage-filename";
  static selects = document.querySelectorAll(".select-container > .select");
  static items = document.querySelectorAll(".photos-carrousel > li");

  static setup() {
    this.selects.forEach((el, i) => {
      const img = this.items[i].querySelector(`img[${this.remoteFileAttrName}]`),
        file = img.getAttribute(this.remoteFileAttrName);

      el.setAttribute(this.indexAttrName, i);
      el.addEventListener("click", this.onclick);
      FetchImage.personality(file).then((url) => (img.src = url));
    });
    this.selects[0].click();
  }

  static get onclick() {
    const proxy = this;
    /** @param {MouseEvent} event */
    return (event) => {
      const index = event.currentTarget.getAttribute(proxy.indexAttrName);
      proxy.selects[index].classList.add("checked");
      proxy.items[index].style.clipPath = "circle(100%)";
      this.selects.forEach((el, i) => {
        if (i.toString() === index) return;
        el.classList.remove("checked");
        proxy.items[i].style.clipPath = "circle(0)";
      });
    };
  }
}

Carrousel.setup();

scroller.setup();
