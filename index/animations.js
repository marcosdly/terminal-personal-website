"use strict";

/**
 * @callback EventCallback
 * @param {Even|undefined} event
 * @returns {void}
 */

class NavLink {
  clicked = false;
  hovering = false;
  static anyClicked = false;

  /**
   * @param {Element} element Main nav's link element
   */
  constructor(element) {
    this.elem = element;
    this.text = this.elem.getAttribute("originaltext");
    this.sans = this.elem.querySelector(".font-sans");
    this.mono = this.elem.querySelector(".font-mono");
    this.paren = this.elem.querySelector(".parenthesis");
    this.colorClass = this.elem.getAttribute("colorclass");
  }

  async runEventLoop() {
    this.elem.addEventListener("mouseover", this.onmouseover);
    this.elem.addEventListener("mouseout", this.onmouseout);
    this.elem.addEventListener("click", this.onclick);

    while (true) {
      if (NavLink.anyClicked && !this.clicked) {
        this.elem.classList.add("main-nav-link-hide");
        return;
      }
      this.animate();
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  async animate() {
    // FIX Animation can start before nickname's animation end
    const sans = this.sans.textContent,
      mono = this.mono.textContent,
      paren = this.paren.textContent,
      formatted = this.text.replaceAll(" ", "_");

    if (this.clicked && mono === this.originalText && paren === "()") return;

    if (this.hovering || this.clicked) {
      if (paren === "()") return;
      if (paren === "" && mono === formatted) this.mono.classList.add(this.colorClass);
      if (mono === formatted) {
        this.paren.textContent += paren === "(" ? ")" : "(";
        return;
      }
      this.mono.textContent += sans[0] === " " ? "_" : sans[0];
      this.sans.textContent = sans.substring(1);
      return;
    }

    if (paren != "") {
      this.paren.textContent = paren.substring(0, paren.length - 1);
      return;
    }
    if (paren === "" && mono === formatted) this.mono.classList.remove(this.colorClass);
    if (mono === "") return;
    const lastChar = mono.at(-1) === "_" ? " " : mono.at(-1);
    this.sans.textContent = lastChar + this.sans.textContent;
    this.mono.textContent = mono.substring(0, mono.length - 1);
  }

  /** @returns {EventCallback} */
  get onmouseover() {
    const proxy = this;
    return () => {
      proxy.hovering = true;
    };
  }

  /** @returns {EventCallback} */
  get onmouseout() {
    const proxy = this;
    return () => {
      proxy.hovering = false;
    };
  }

  /** @returns {EventCallback} */
  get onclick() {
    const proxy = this;
    return (event) => {
      event.preventDefault();
      proxy.clicked = true;
      NavLink.anyClicked = true;

      document.querySelector(".terminal-animation-build-target").textContent =
        proxy.elem.getAttribute("originaltext").toLowerCase().replaceAll(" ", "_");

      document.querySelector(".terminal").classList.add("terminal-animate");
      this.elem.classList.add("animate");
    };
  }
}

function animateNickname() {
  document.querySelector(".nickname").style["animation-play-state"] = "running";
  document.querySelector(".main-header").style["animation-play-state"] = "running";
}

function animateFooter() {
  document.querySelector(".main-footer").style["animation-play-state"] = "running";
}

addEventListener("load", (event) => {
  animateNickname();
  animateFooter();
});

const terminalTextArray = fetch("terminal-text.txt")
  .then((txt) => txt.text())
  .then((txt) => txt.split("\n"));

class NavLinkAnimationState {
  /**
   *
   * @param {Element} elem
   */
  constructor(elem) {
    /** @type {Element} */
    this.sans = elem.querySelector(".font-sans");
    /** @type {Element} */
    this.mono = elem.querySelector(".font-mono");
    /** @type {Element} */
    this.parenthesis = elem.querySelector(".parenthesis");
  }

  /** @type {boolean} */
  static keepRunning = true;
  /** @type {Element | null} */
  static elementClicked = null;
}

async function animateTerminalCommandText() {
  const commandElement = document.querySelector(".terminal-cli-command");
  commandElement.style.display = "block";
  commandElement.classList.add("terminal-cli-command-animate");
}

/**
 *
 * @param {Array<string>} text
 */
async function animateTerminalText(text) {
  const terminalElement = document.querySelector(".terminal"),
    textContainer = document.querySelector(".terminal-text-container"),
    target = document
      .querySelector(".terminal-animation-build-target")
      .textContent.toLocaleLowerCase()
      .replaceAll(" ", "_");
  for (const line of text) {
    const p = document.createElement("p");
    p.innerText = line.replaceAll("{target}", target);
    textContainer.appendChild(p);
    textContainer.scrollTop = terminalElement.scrollHeight;
    if (line.startsWith(":: ")) await new Promise((res) => setTimeout(res, 50));
    else await new Promise((res) => setTimeout(res, 500));
  }

  document.querySelector(".loading-redirect").style.display = "initial";
  if (NavLinkAnimationState.elementClicked)
    window.location.assign(NavLinkAnimationState.elementClicked.href);
}

for (const elem of document.querySelectorAll(".main-nav a"))
  new NavLink(elem).runEventLoop();

addEventListener("animationend", async (event) => {
  if (event.animationName === "main-nav-link-hide") {
    event.target.style.display = "none";
    // document.querySelector(".main-nav-link-clicked").classList.remove("main-nav-link-clicked");
  } else if (event.animationName === "terminal-showing") {
    animateTerminalCommandText();
  } else if (event.animationName === "terminal-cli-command-animate") {
    animateTerminalText(await terminalTextArray);
  }
});
