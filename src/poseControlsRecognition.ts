import {
  CustomPoseNet,
  Webcam,
  load,
  drawKeypoints,
  drawSkeleton,
} from "@teachablemachine/pose";
import type { Pose } from "@tensorflow-models/posenet";
import { getCurrentPosition, steerLeft, steerRight } from "./carPosition";

const URL = window.location.origin + "/voiracing/model/pose/";
let model: CustomPoseNet,
  webcam: Webcam,
  ctx: CanvasRenderingContext2D,
  labelContainer: HTMLElement,
  maxPredictions: number;

export async function initPose() {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  // load the model and metadata
  // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
  // Note: the pose library adds a tmPose object to your window (window.tmPose)
  model = await load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  // Convenience function to setup a webcam
  const size = 300;
  const flip = true; // whether to flip the webcam
  webcam = new Webcam(size, size, flip); // width, height, flip
  await webcam.setup(); // request access to the webcam
  await webcam.play();
  window.requestAnimationFrame(loop);

  // append/get elements to the DOM
  const canvas = document.getElementById("pose") as HTMLCanvasElement;
  canvas.width = size;
  canvas.height = size;
  ctx = canvas.getContext("2d")!;
  labelContainer = document.getElementById("pose-controls")!;
  for (let i = 0; i < maxPredictions; i++) {
    // and class labels
    labelContainer.appendChild(document.createElement("div"));
  }
}

async function loop() {
  webcam.update(); // update the webcam frame
  await predict();
  window.requestAnimationFrame(loop);
}

async function predict() {
  // Prediction #1: run input through posenet
  // estimatePose can take in an image, video or canvas html element
  const { pose, posenetOutput } = await model.estimatePose(webcam.canvas);
  // Prediction 2: run input through teachable machine classification model
  const prediction = await model.predict(posenetOutput);

  let action = "Brake";
  let max = 0;
  for (let i = 0; i < maxPredictions; i++) {
    const classPrediction =
      prediction[i].className + ": " + prediction[i].probability.toFixed(2);
    labelContainer.children[i].innerHTML = classPrediction;

    if (prediction[i].probability > max) {
      max = prediction[i].probability;
      action = prediction[i].className;
    }
  }
  switch (action) {
    case "Left":
      steerLeft();
      break;
    case "Right":
      steerRight();
      break;
  }

  // finally draw the poses
  drawPose(pose);
  drawCar();
}

function drawPose(pose: Pose) {
  if (webcam.canvas) {
    ctx.drawImage(webcam.canvas, 0, 0);
    // draw the keypoints and skeleton
    if (pose) {
      const minPartConfidence = 0.5;
      drawKeypoints(pose.keypoints, minPartConfidence, ctx);
      drawSkeleton(pose.keypoints, minPartConfidence, ctx);
    }
  }
}

let start = Infinity;
function drawCar() {
  const road = document.getElementById("road") as HTMLDivElement;
  const car = document.getElementById("car-wrapper") as HTMLImageElement;
  const margin =
    (road.clientWidth * ((100 + getCurrentPosition()) / 100)) / 2 -
    car.clientWidth / 2;
  const now = Date.now();
  car.style.transitionDuration = `${(now - start) / 1000}s`;
  car.style.marginLeft = `${margin}px`;
  start = now;
}
