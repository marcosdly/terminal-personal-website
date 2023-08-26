"use strict";

const mainNav = document.querySelector(".main-nav"),
  navLinks = document.querySelectorAll(".main-nav a"),
  nickname = document.querySelector(".nickname");

const bodyMiddle = Math.floor(document.body.offsetWidth / 2),
  nicknamePositions = nickname.getBoundingClientRect(),
  nicknameCornerToMiddle = Math.floor(nickname.offsetWidth / 2) + nicknamePositions.left,
  nicknameCompensation = bodyMiddle - nicknameCornerToMiddle;

// plus/minus 1px of error (fine)
mainNav.style.marginLeft = `${nicknameCompensation}px`;

const spaced = new Set([
  ...document.querySelectorAll(".main-content-container *[hspace]"),
  ...document.querySelectorAll(".main-content-container *[vspace]"),
]);

spaced.forEach((elem) => {
  const vspace = elem.getAttribute("vspace") || "0";
  const hspace = elem.getAttribute("hspace") || "0";
  elem.style.margin = `${vspace}px ${hspace}px`;
});
