import { onSchedule } from "firebase-functions/v2/scheduler";
import logger from "firebase-functions/logger";
import { Octokit } from "octokit";
import { initializeApp, cert } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import fetch from "node-fetch";
import { basename, extname } from "path";
import serviceAccount from "./serviceAccountKey.json" assert { type: "json" };

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: "gs://marcosdly-personal-website.appspot.com",
});

export const saveMetrics = onSchedule("every 1 hours", async function (event) {
  const bucket = getStorage().bucket();
  const octokit = new Octokit({ auth: "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" });
  const sinceTime = new Date(),
    untilTime = new Date();

  sinceTime.setHours(0, 0, 0, 0);
  untilTime.setHours(23, 59, 59, 999);

  const commits = await octokit.request("GET /repos/{owner}/{repo}/commits", {
    owner: "marcosdly",
    repo: "marcosdly",
    sha: "metrics",
    since: sinceTime.toISOString(),
    until: untilTime.toISOString(),
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  if (commits.data.length === 0) return;

  const contents = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
    owner: "marcosdly",
    repo: "marcosdly",
    ref: "metrics",
    path: "metrics",
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  const existentFiles = {};

  (await bucket.getFiles({ matchGlob: "metrics/*.svg" }))[0].forEach((file) => {
    existentFiles[basename(file.name)] = new Date(file.metadata.updated);
  });

  contents.data.forEach(async (fileInfo) => {
    const name = fileInfo["name"];

    if (extname(name) !== ".svg") {
      logger.warn("Found non-SVG file under github metrics' place. Skipping...");
      return;
    } else if (!existentFiles[name]) {
      logger.info(`Found previously non-existent SVG file (${name}). Uploading...`);
    } else if (existentFiles[name] && existentFiles[name].getDay() >= sinceTime.getDay()) {
      return;
    } else {
      logger.info(`Found updated file on github (${name}). Uploading new version...`);
    }

    await fetch(fileInfo["download_url"])
      .then((res) => res.text())
      .then((txt) => bucket.file(`metrics/${name}`).save(txt));
  });
});
