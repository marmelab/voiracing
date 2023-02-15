import { IRenderer } from "../IRenderer";

export class BarsRenderer implements IRenderer {
  static WIDTH = 256;
  static HEIGHT = 64;
  #canvas: HTMLCanvasElement;
  #context: CanvasRenderingContext2D;
  #analyzer: AnalyserNode;
  #bufferLength: number;
  #dataArray: Uint8Array;

  constructor(audioContext: AudioContext) {
    this.#canvas = document.querySelector<HTMLCanvasElement>("#bars")!;
    this.#context = this.#canvas.getContext("2d")!;
    this.#canvas.width = BarsRenderer.WIDTH;
    this.#canvas.height = BarsRenderer.HEIGHT;
    this.#analyzer = audioContext.createAnalyser();
    this.#analyzer.fftSize = 8192;
    this.#bufferLength = this.#analyzer.frequencyBinCount;
    this.#dataArray = new Uint8Array(this.#bufferLength);
  }

  getAnalyzer(): AudioNode {
    return this.#analyzer;
  }

  public draw() {
    this.#analyzer.getByteFrequencyData(this.#dataArray);
    this.#context.fillStyle = "rgb(0, 0, 0)";
    this.#context.fillRect(0, 0, BarsRenderer.WIDTH, BarsRenderer.HEIGHT);

    const barWidth = (BarsRenderer.WIDTH / this.#bufferLength) * 2.5;
    let barHeight;
    let x = 0;

    for (let i = 0; i < this.#bufferLength; i++) {
      barHeight = this.#dataArray[i];

      this.#context.fillStyle = `rgb(${barHeight + 100},50,50)`;
      this.#context.fillRect(
        x,
        BarsRenderer.HEIGHT - barHeight / 2,
        barWidth,
        barHeight / 2
      );

      x += barWidth + 1;
    }
  }
}
