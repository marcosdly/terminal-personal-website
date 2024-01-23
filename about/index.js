"use strict";

import { FetchImage } from "../js/firebase/storage";
import { Scroller } from "../js/customScroll";

class Carrousel {
  static indexAttrName = "data-which-photo";
  static remoteFileAttrName = "data-storage-filename";
  static selects = document.querySelectorAll(".photos-carrousel > .select");
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
