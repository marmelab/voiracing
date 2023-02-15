import { BarsRenderer } from "./renderer/canvasRenderer/BarsRenderer";
import { MeanFrequencyRenderer } from "./renderer/canvasRenderer/MeanFrequencyRenderer";
import { SinRenderer } from "./renderer/canvasRenderer/SinRenderer";
import { RendererManager } from "./renderer/RendererManager";

export const controlsRecognition = async () => {
  const audioContext = new AudioContext();
  if (!navigator.mediaDevices) {
    console.log("getUserMedia() not supported.");
    return;
  }
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const microphone = audioContext.createOscillator();
  setInterval(() => {
    microphone.frequency.value = Math.random() * 1000;
  }, 1000);
  microphone.frequency.value = 888;
  microphone.type = "square";
  microphone.start();
  microphone.connect(audioContext.destination);
  //  const microphone = audioContext.createMediaStreamSource(stream);

  const rendererManager = new RendererManager();

  const sinRenderer = new SinRenderer(audioContext);
  microphone.connect(sinRenderer.getAnalyzer());
  rendererManager.addRenderer(sinRenderer);

  const barsRenderer = new BarsRenderer(audioContext);
  microphone.connect(barsRenderer.getAnalyzer());
  rendererManager.addRenderer(barsRenderer);

  const meanFrequencyRenderer = new MeanFrequencyRenderer(audioContext);
  microphone.connect(meanFrequencyRenderer.getAnalyzer());
  rendererManager.addRenderer(meanFrequencyRenderer);

  rendererManager.draw();
};
