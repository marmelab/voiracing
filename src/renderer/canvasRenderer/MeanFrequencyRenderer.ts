import { IRenderer } from "../IRenderer";

export class MeanFrequencyRenderer implements IRenderer {
  static WIDTH = 256;
  static HEIGHT = 64;
  #canvas: HTMLCanvasElement;
  #context: CanvasRenderingContext2D;
  #analyzer: AnalyserNode;
  #bufferLength: number;
  #dataArray: Uint8Array;

  constructor(audioContext: AudioContext) {
    this.#canvas = document.querySelector<HTMLCanvasElement>("#mean")!;
    this.#context = this.#canvas.getContext("2d")!;
    this.#canvas.width = MeanFrequencyRenderer.WIDTH;
    this.#canvas.height = MeanFrequencyRenderer.HEIGHT;
    this.#analyzer = audioContext.createAnalyser();
    this.#analyzer.fftSize = 4096;
    this.#analyzer.minDecibels = -70;
    this.#bufferLength = this.#analyzer.frequencyBinCount;
    this.#dataArray = new Uint8Array(this.#bufferLength);
  }

  getAnalyzer(): AudioNode {
    return this.#analyzer;
  }
  i = 0;

  public draw() {
    this.#analyzer.getByteFrequencyData(this.#dataArray);
    this.#context.fillStyle = "rgb(0, 0, 0)";
    this.#context.fillRect(
      0,
      0,
      MeanFrequencyRenderer.WIDTH,
      MeanFrequencyRenderer.HEIGHT
    );

    const barWidth = (MeanFrequencyRenderer.WIDTH / this.#bufferLength) * 2.5;
    let barHeight;
    let x = 0;

    let mean = 0;
    let sum = 0;
    let intensity = 0;
    console.log(this.#dataArray);
    for (let i = 1; i <= this.#bufferLength; i++) {
      mean += this.#dataArray[i - 1] * i;
      intensity = Math.max(intensity, this.#dataArray[i - 1]);
    }
    // mean /= this.#bufferLength;

    mean /= this.#bufferLength;
    console.log(mean);

    this.#context.fillStyle = `rgb(${intensity + 100},50,50)`;
    this.#context.fillRect(
      mean,
      MeanFrequencyRenderer.HEIGHT - intensity / 2,
      barWidth,
      intensity / 2
    );
  }
}
