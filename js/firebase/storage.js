"use strict";

import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "./config";

export class FetchImage {
  /**
   * @param {string} path
   * @returns {Promise<string>}
   */
  static #fetch(path) {
    return getDownloadURL(ref(storage, `marcosdly.dev/${path}`));
  }

  /**
   * @param {string} basename File name
   * @returns {Promise<string>}
   */
  static personality(basename) {
    return this.#fetch(`personality/images/${basename}`);
  }
}
