"use strict";

/**
 * @param {string} str
 * @returns {Number?}
 */
function firstSetOfNumbersFromString(str) {
  const nums = str.match(/-?[0-9]+/);
  if (nums === null) return nums;
  return Number(nums);
}

class Scroller {
  /**
   * @param {Element} scrollable Element that will be scrolled (container)
   * @param {Element} scroller Element that allows the other to scroll (empty div on top)
   * @param {Number} deltaY Scrolling offset
   * @param {Boolean} inverted Is scroll inverted?
   */
  constructor(scrollable, scroller, deltaY, inverted = false) {
    this.scrollable = scrollable;
    this.scroller = scroller;
    this.inverted = inverted;
    this.delta = inverted ? -deltaY : deltaY;
    this.scrollerOffset = firstSetOfNumbersFromString(this.scroller.style.marginTop);
    if (this.scrollerOffset === null) {
      this.unset();
      this.scrollerOffset = 0;
    }
  }

  /**
   * @returns {Boolean} Is user scrolling up?
   */
  scrollingUp() {
    return this.delta < 0;
  }

  /**
   * @returns {Number}
   */
  maxOffsetRange() {
    if (this.scrollerOffset < 0) {
      return (
        this.scrollable.scrollHeight + Math.abs(this.scrollerOffset) - this.scrollable.offsetHeight
      );
    }
    return this.scrollable.scrollHeight - this.scrollable.offsetHeight;
  }

  /**
   * Either an init operation in case you don't inline style already set up, or
   * a error fallback behavior.
   */
  unset() {
    this.scroller.style.marginTop = "0px";
  }

  /**
   * ~ unused ~
   * @returns {Boolean} Can the content be scrolled any higher?
   */
  canScrollUp() {
    return this.scrollerOffset - this.delta < 0;
  }

  /**
   * ~ unused ~
   * @returns {Boolean} Can the content be scrolled any lower?
   */
  canScrollDown() {
    return (
      this.maxOffsetRange() - this.delta > 0 ||
      Math.abs(this.scrollerOffset - this.delta) < this.maxOffsetRange()
    );
  }

  /**
   * @returns {Number} Raw, unchecked scroll amount
   */
  #calcScrollUnsafe() {
    return this.scrollerOffset - this.delta;
  }

  /**
   * @returns {Boolean} Will the next scroll put you out of bounds?
   */
  isNextTooMuch() {
    if (this.scrollingUp() && this.#calcScrollUnsafe() > 0) return true;

    if (!this.scrollingUp() && Math.abs(this.#calcScrollUnsafe()) >= this.maxOffsetRange())
      return true;

    return false;
  }

  /**
   * Scroll content.
   * @returns {void}
   */
  scroll() {
    if (this.delta === 0 && this.scrollable.offsetHeight === this.scrollable.scrollHeight) {
      this.unset();
      return;
    }

    if (this.delta === 0 || this.scrollerOffset === this.maxOffsetRange()) return;
    else if (this.scrollingUp() && this.isNextTooMuch()) this.unset();
    else if (this.isNextTooMuch()) this.scroller.style.marginTop = `${-this.maxOffsetRange()}px`;
    else {
      this.scrollerOffset = this.scrollerOffset - this.delta;
      this.scroller.style.marginTop = `${this.scrollerOffset}px`;
    }
  }
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

  const scroller = new Scroller(articleMain, scrollCeiling, event?.deltaY ?? 0);

  if (event) {
    scroller.scroll();
  }

  if (scroller.scrollerOffset === 0) {
    customScrollbarIndicator.style.marginTop = "0px";
    return;
  }

  const percentageScrolled = Math.abs(scroller.scrollerOffset) / scroller.maxOffsetRange();
  const maxOffsetBarRange = customScrollbar.offsetHeight - customScrollbarIndicator.offsetHeight;
  customScrollbarIndicator.style.marginTop = `${maxOffsetBarRange * percentageScrolled}px`;
}

function scrollbarHideResizing() {
  if (!customScrollbar || !customScrollbarIndicator || !articleMain || !scrollCeiling) return;
  const scroller = new Scroller(articleMain, scrollCeiling, 0);
  scroller.scroll();
  const totalBarHeight = articleMain.offsetHeight * 0.4;
  customScrollbar.style.height = `${totalBarHeight}px`;
  if (scroller.scrollable.offsetHeight >= scroller.scrollable.scrollHeight) {
    customScrollbarIndicator.style.height = `${totalBarHeight}px`;
  } else {
    customScrollbarIndicator.style.height = `${
      totalBarHeight * (articleMain.offsetHeight / articleMain.scrollHeight)
    }px`;
  }
  customScrollbarCalculate();
}

addEventListener("resize", scrollbarHideResizing);
articleMain.addEventListener("wheel", customScrollbarCalculate);

scrollbarHideResizing();
