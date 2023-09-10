import { mainBucket } from "./firebaseApp.js";
import { list, ref, getDownloadURL } from "firebase/storage";

// Applying metrics
list(ref(mainBucket, "metrics/"), { maxResults: 25 }).then((metricsList) => {
  const metricsFilesNames = {};
  metricsList.items.forEach((reference) => {
    metricsFilesNames[reference.name] = reference;
  });

  document.querySelectorAll(".main-content-container img[metrics]").forEach(async (elem) => {
    const wantedFile = elem.getAttribute("metrics");

    if (!(wantedFile in metricsFilesNames)) {
      console.error(`Github metrics file ${wantedFile} doesn't exist.`);
      return;
    }

    elem.src = await getDownloadURL(metricsFilesNames[wantedFile]);
  });
});
