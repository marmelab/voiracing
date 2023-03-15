import "./style.css";
import { initVoice } from "./voiceControlsRecognition";
import { initPose } from "./poseControlsRecognition";
import { update } from "./gauge";

update();

initVoice();
initPose();
