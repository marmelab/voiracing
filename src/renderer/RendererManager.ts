import { IRenderer } from "./IRenderer";

export class RendererManager {
  private renderers: IRenderer[] = [];

  addRenderer(renderer: IRenderer) {
    this.renderers.push(renderer);
  }

  draw() {
    requestAnimationFrame(this.draw.bind(this));
    for (const renderer of this.renderers) {
      renderer.draw();
    }
  }
}
