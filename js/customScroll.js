"use strict";

/**
 * @callback EventCallback
 * @param {Event} event
 * @returns {void}
 */

export class Scroller {
  #lastTouchYBuffer = null;
  #deltaBuffer = null;
  #scrollbarRatio = 0.4;

  /**
   * @param {Element} scrollable Element that will be scrolled (container)
   * @param {Element} scroller Element that allows the other to scroll (empty div on top)
   * @param {Element} scrollbar Container for the scrollbar indicator object
   * @param {Element} indicator Element that will indicate scroll progress
   * @param {{inverted: boolean}} options
   */
  constructor(scrollable, scroller, scrollbar, indicator, options) {
    this.scrollable = scrollable;
    this.scroller = scroller;
    this.scrollbar = scrollbar;
    this.indicator = indicator;
    this.inverted = options?.inverted ?? false;
    // 0 breaks code cause it means "can't scroll"
    this.scrollerOffset = 1e-4;
    this.unset();
  }

  /**
   * Configure and run scrolling.
   */
  setup() {
    addEventListener("resize", this.scrollbarUpdate);
    this.scrollable.addEventListener("wheel", this.onwheel);
    this.scrollable.addEventListener("touchmove", this.ontouchmove);
    this.scrollable.addEventListener("touchstart", this.ontouchstart);
    this.scrollbarUpdate();
  }

  /**
   * Which vertical direction does the current offset represent?
   * @returns {DirectionToken}
   */
  vertically() {
    if (
      this.delta === 0 ||
      this.scrollerOffset === this.maxOffsetRange ||
      this.maxOffsetRange === 0 ||
      this.scrollerOffset === 0
    )
      return Scroller.NOSCROLL;
    if (this.delta < 0) return Scroller.UP;
    return Scroller.DOWN;
  }

  /**
   * Event listener callback.
   * @param {TouchEvent} event
   * @returns {EventCallback}
   */
  get ontouchstart() {
    const proxy = this;
    return (event) => {
      if (event.changedTouches.length !== 1) return;
      proxy.#lastTouchYBuffer = event.changedTouches[0].pageY;
    };
  }

  /**
   * Event listener callback.
   * @param {TouchEvent} event
   * @returns {EventCallback}
   */
  get ontouchmove() {
    const proxy = this;
    return (event) => {
      if (event.changedTouches.length !== 1) return;
      proxy.delta = proxy.#lastTouchYBuffer - event.changedTouches[0].pageY;
      proxy.#lastTouchYBuffer = event.changedTouches[0].pageY;
      proxy.scroll();
    };
  }

  /**
   * Event listener callback.
   * @param {WheelEvent} event
   * @returns {EventCallback}
   */
  get onwheel() {
    const proxy = this;
    return (event) => {
      proxy.delta = event.deltaY;
      proxy.scroll();
    };
  }

  /**
   * Calculate amount of pixels to be additionally offset.
   * @returns {number}
   */
  calc() {
    return this.scrollerOffset - this.delta;
  }

  /**
   * Maximum amount of pixels content can be offset.
   * @returns {Number}
   */
  get maxOffsetRange() {
    if (this.scrollerOffset < 0) {
      return (
        this.scrollable.scrollHeight +
        Math.abs(this.scrollerOffset) -
        this.scrollable.offsetHeight
      );
    }
    return this.scrollable.scrollHeight - this.scrollable.offsetHeight;
  }

  /** @returns {number} */
  get delta() {
    if (Object.is(this.#deltaBuffer, null)) return 0;
    return this.#deltaBuffer;
  }

  /** @param {number} value  */
  set delta(value) {
    if (this.inverted) this.#deltaBuffer = -value;
    this.#deltaBuffer = value;
  }

  /**
   * Either an init operation in case you're inline style isn't already set up, or
   * a error fallback behavior.
   */
  unset() {
    this.scroller.style.marginTop = "0px";
  }

  /**
   * Set scrolling offset.
   * @param {number} px
   */
  set(px) {
    this.scrollerOffset = px;
    this.scroller.style.marginTop = px + "px";
  }

  /**
   * Will the next scroll put you out of bounds?
   * @returns {Boolean}
   */
  isNextTooMuch() {
    if (this.vertically() === Scroller.UP && this.calc() > 0) return true;
    if (
      this.vertically() === Scroller.DOWN &&
      Math.abs(this.calc()) >= this.maxOffsetRange
    )
      return true;

    return false;
  }

  /**
   * Update position and size of both the scrollbar's container and indicator.
   */
  scrollbarUpdate() {
    const totalHeight = this.scrollable.offsetHeight * this.#scrollbarRatio,
      contentSize = this.scrollable.scrollHeight + Math.abs(this.scrollerOffset);

    this.scrollbar.style.height = totalHeight + "px";

    if (this.scrollable.clientHeight >= contentSize) {
      this.indicator.style.height = totalHeight + "px";
      this.indicator.style.marginTop = "0px";
      return;
    }

    this.indicator.style.height =
      totalHeight * (this.scrollable.clientHeight / contentSize) + "px";

    if (this.scrollerOffset === 0) {
      this.indicator.style.marginTop = "0px";
      return;
    }

    // Max possible value of margin-top
    const offsetRange = this.scrollbar.offsetHeight - this.indicator.offsetHeight;

    if (this.scroller.style.marginTop === "0px") {
      this.indicator.style.marginTop = "0px";
      return;
    }

    if (this.scrollerOffset === -this.maxOffsetRange) {
      this.indicator.style.marginTop = offsetRange + "px";
      return;
    }

    this.indicator.style.marginTop = `${
      offsetRange * (Math.abs(this.scrollerOffset) / this.maxOffsetRange)
    }px`;
  }

  /**
   * Scroll content.
   */
  scroll() {
    if (Object.is(this.delta, null)) return;
    if (this.vertically() === Scroller.NOSCROLL) return;

    if (this.calc() === 0) this.unset();
    else if (this.isNextTooMuch()) {
      if (this.vertically() === Scroller.DOWN) this.set(-this.maxOffsetRange);
      else this.unset();
    } else this.set(this.calc());

    this.scrollbarUpdate();

    this.delta = null;
  }
}

/**
 * My try at unique dummy objects with named types.
 * Primeagen says its a javascript thing not being able to tell
 * if an object is unique or something like that. That's why you
 * can't implement a mapping, says him while talking about algorithms.
 * TODO Decent research on javascript memory shenanigans, as exemplified above.
 */
class DirectionToken extends String {}

Object.defineProperty(Scroller, "UP", {
  value: new DirectionToken("UP"),
  writable: false,
  configurable: false,
  enumerable: false,
});

Object.defineProperty(Scroller, "DOWN", {
  value: new DirectionToken("DOWN"),
  writable: false,
  configurable: false,
  enumerable: false,
});

Object.defineProperty(Scroller, "NOSCROLL", {
  value: new DirectionToken("NOSCROLL"),
  writable: false,
  configurable: false,
  enumerable: false,
});
