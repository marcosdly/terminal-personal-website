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
    colorClass = elem.getAttribute("colorclass");

  if (mouseIsOver === "true") {
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

for (const elem of document.querySelectorAll(".main-nav a")) {
  (async function () {
    const state = new NavLinkAnimationState(elem);
    while (true) {
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
}
