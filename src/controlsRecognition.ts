import * as speechCommands from "@tensorflow-models/speech-commands";
import { update } from "./gauge";
import {
  accelerate,
  brake,
  decelerate,
  getCurrentSpeed,
  maintainSpeed,
} from "./speed";

const URL = window.location.origin + "/voiracing/model/";

async function createModel() {
  const checkpointURL = URL + "model.json"; // model topology
  const metadataURL = URL + "metadata.json"; // model metadata

  const recognizer = speechCommands.create(
    "BROWSER_FFT", // fourier transform type, not useful to change
    undefined, // speech commands vocabulary feature, not useful for your models
    checkpointURL,
    metadataURL
  );

  // check that model and metadata are loaded via HTTPS requests.
  await recognizer.ensureModelLoaded();

  return recognizer;
}

async function init() {
  const recognizer = await createModel();
  const classLabels = recognizer.wordLabels(); // get class labels
  const labelContainer = document.getElementById("app")!;
  for (let i = 0; i < classLabels.length; i++) {
    labelContainer.appendChild(document.createElement("div"));
  }
  labelContainer.appendChild(document.createElement("div"));

  // listen() takes two arguments:
  // 1. A callback function that is invoked anytime a word is recognized.
  // 2. A configuration object with adjustable fields
  recognizer.listen(
    async (result) => {
      let action = "Brake";
      let max = 0;
      for (let i = 0; i < classLabels.length; i++) {
        const score = result.scores[i] as number;
        const classPrediction = classLabels[i] + ": " + score.toFixed(2);
        labelContainer.children[i]!.innerHTML = classPrediction;
        if (score > max) {
          max = score;
          action = classLabels[i];
        }
      }
      switch (action) {
        case "High":
          accelerate();
          break;
        case "Low":
          maintainSpeed();
          break;
        case "Brake":
          brake();
          break;
        case "Background Noise":
          decelerate();
          break;
      }
      labelContainer.children[classLabels.length]!.innerHTML =
        "Speed: " + getCurrentSpeed();
      update(getCurrentSpeed());
    },
    {
      includeSpectrogram: false, // in case listen should return result.spectrogram
      probabilityThreshold: 0,
      invokeCallbackOnNoiseAndUnknown: true,
      overlapFactor: 0.75, // probably want between 0.5 and 0.75. More info in README
    }
  );

  // Stop the recognition in 5 seconds.
  // setTimeout(() => recognizer.stopListening(), 5000);
}

export default init;
