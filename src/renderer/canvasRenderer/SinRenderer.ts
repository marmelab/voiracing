import { IRenderer } from "../IRenderer";

export class SinRenderer implements IRenderer {
  static WIDTH = 256;
  static HEIGHT = 64;
  #canvas: HTMLCanvasElement;
  #context: CanvasRenderingContext2D;
  #analyzer: AnalyserNode;
  #bufferLength: number;
  #dataArray: Uint8Array;

  constructor(audioContext: AudioContext) {
    this.#canvas = document.querySelector<HTMLCanvasElement>("#sin")!;
    this.#context = this.#canvas.getContext("2d")!;
    this.#canvas.width = SinRenderer.WIDTH;
    this.#canvas.height = SinRenderer.HEIGHT;
    this.#analyzer = audioContext.createAnalyser();
    this.#analyzer.fftSize = 2048;
    this.#bufferLength = this.#analyzer.frequencyBinCount;
    this.#dataArray = new Uint8Array(this.#bufferLength);
  }

  getAnalyzer(): AudioNode {
    return this.#analyzer;
  }

  public draw() {
    this.#analyzer.getByteTimeDomainData(this.#dataArray);
    this.#context.fillStyle = "rgb(200, 200, 200)";
    this.#context.fillRect(0, 0, SinRenderer.WIDTH, SinRenderer.HEIGHT);
    this.#context.lineWidth = 2;
    this.#context.strokeStyle = "rgb(0, 0, 0)";
    this.#context.beginPath();
    const sliceWidth = (SinRenderer.WIDTH * 1.0) / this.#bufferLength;
    let x = 0;
    for (let i = 0; i < this.#bufferLength; i++) {
      const v = this.#dataArray[i] / 128.0;
      const y = (v * SinRenderer.HEIGHT) / 2;
      if (i === 0) {
        this.#context.moveTo(x, y);
      } else {
        this.#context.lineTo(x, y);
      }
      x += sliceWidth;
    }
    this.#context.lineTo(this.#canvas.width, this.#canvas.height / 2);
    this.#context.stroke();
  }
}
