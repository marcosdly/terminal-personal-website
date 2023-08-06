"use strict";

function animateNickname() {
  document.querySelector(".nickname").style["animation-play-state"] = "running";
  document.querySelector(".nickname-container").style["animation-play-state"] =
    "running";
}

function animateFooter() {
  document.querySelector(".main-footer").style["animation-play-state"] =
    "running";
}

addEventListener("load", (event) => {
  animateNickname();
  animateFooter();
});

class NavLinkAnimationState {
  constructor(elem) {
    this.sans = elem.querySelector(".font-sans");
    this.mono = elem.querySelector(".font-mono");
  }
}

/**
 * @param {HTMLElement} elem
 * @param {NavLinkAnimationState} state
 */
async function animateMainNavLink(elem, state) {
  // TODO cover links their animation wont start until nickname animation ends
  const sansText = state.sans.textContent,
    monoText = state.mono.textContent,
    mouseIsOver = elem.getAttribute("mouseisover"),
    originalText = elem.getAttribute("originaltext");

  if (mouseIsOver === "true") {
    if (monoText.endsWith(")")) return;
    if (monoText.startsWith(originalText)) {
      state.mono.textContent += monoText === originalText ? "(" : ")";
      return;
    }
    state.mono.textContent += sansText.at(0);
    state.sans.textContent = sansText.substring(1);
    return;
  }

  if (monoText === "") return;
  if ("()".includes(monoText.at(-1))) {
    state.mono.textContent = monoText.substring(0, monoText.length - 1);
    return;
  }
  state.sans.textContent = monoText.at(-1) + state.sans.textContent;
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
