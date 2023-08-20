"use strict";

function animateNickname() {
  document.querySelector(".nickname").style["animation-play-state"] = "running";
  document.querySelector(".nickname-container").style["animation-play-state"] = "running";
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

  static keepRunning = true;
}

/**
 * @param {Element} elem
 * @param {NavLinkAnimationState} state
 */
async function animateMainNavLink(elem, state) {
  // TODO cover links their animation wont start until nickname animation ends
  const sansText = state.sans.textContent,
    monoText = state.mono.textContent,
    parenthesisText = state.parenthesis.textContent,
    mouseIsOver = elem.getAttribute("mouseisover"),
    originalText = elem.getAttribute("originaltext"),
    originalTextFormatted = originalText.replaceAll(" ", "_"),
    colorClass = elem.getAttribute("colorclass"),
    wasClicked = elem.getAttribute("wasclicked");

  if (wasClicked === "true" && monoText === originalText && parenthesisText === "()") {
    NavLinkAnimationState.keepRunning = false;
    return;
  }

  if (mouseIsOver === "true" || wasClicked === "true") {
    if (parenthesisText.endsWith(")")) return;
    if (parenthesisText === "" && monoText === originalTextFormatted)
      state.mono.classList.add(colorClass);
    if (monoText === originalTextFormatted) {
      state.parenthesis.textContent += parenthesisText === "(" ? ")" : "(";
      return;
    }
    state.mono.textContent += sansText.at(0) === " " ? "_" : sansText.at(0);
    state.sans.textContent = sansText.substring(1);
    return;
  }

  if (parenthesisText != "") {
    state.parenthesis.textContent = parenthesisText.substring(0, parenthesisText.length - 1);
    return;
  }
  if (parenthesisText === "" && monoText === originalTextFormatted)
    state.mono.classList.remove(colorClass);
  if (monoText === "") return;
  const lastChar = monoText.at(-1) === "_" ? " " : monoText.at(-1);
  state.sans.textContent = lastChar + state.sans.textContent;
  state.mono.textContent = monoText.substring(0, monoText.length - 1);
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
    target = document
      .querySelector(".terminal-animation-build-target")
      .textContent.toLocaleLowerCase()
      .replaceAll(" ", "_");
  for (const line of text) {
    const p = document.createElement("p");
    p.innerText = line.replaceAll("{target}", target);
    terminalElement.appendChild(p);
    terminalElement.scrollTop = terminalElement.scrollHeight;
    if (line.startsWith(":: ")) await new Promise((res) => setTimeout(res, 50));
    else await new Promise((res) => setTimeout(res, 500));
  }
}

const mainNavLinks = document.querySelectorAll(".main-nav a");

for (const elem of mainNavLinks) {
  (async function () {
    const state = new NavLinkAnimationState(elem);
    while (true) {
      if (!NavLinkAnimationState.keepRunning) break;
      await animateMainNavLink(elem, state);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  })();

  elem.addEventListener("mouseover", async (event) => {
    event.currentTarget.setAttribute("mouseisover", "true");
  });

  elem.addEventListener("mouseout", async (event) => {
    event.currentTarget.setAttribute("mouseisover", "false");
  });

  elem.addEventListener("click", async (event) => {
    event.currentTarget.setAttribute("wasclicked", "true");
    document.querySelector(".terminal-animation-build-target").textContent = event.currentTarget
      .getAttribute("originalText")
      .toLowerCase()
      .replaceAll(" ", "_");

    const intersection = [];
    mainNavLinks.forEach((x) => {
      if (!Object.is(x, elem)) intersection.push(x);
    });

    for (const el of intersection) el.classList.add("main-nav-link-hide");
    document.querySelector(".terminal").classList.add("terminal-animate");
  });
}

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
