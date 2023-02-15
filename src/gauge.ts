import { RadialGauge } from "canvas-gauges";

const configuration = {
  renderTo: "gauge",
  width: 300,
  height: 300,
  units: "Km/h",
  minValue: 0,
  maxValue: 220,
  majorTicks: [
    "0",
    "20",
    "40",
    "60",
    "80",
    "100",
    "120",
    "140",
    "160",
    "180",
    "200",
    "220",
  ],
  minorTicks: 2,
  strokeTicks: true,
  highlights: [
    {
      from: 160,
      to: 220,
      color: "rgba(200, 50, 50, .75)",
    },
  ],
  colorPlate: "#fff",
  borderShadowWidth: 0,
  borders: false,
  needleType: "arrow",
  needleWidth: 2,
  needleCircleSize: 7,
  needleCircleOuter: true,
  needleCircleInner: false,
  animationDuration: 1500,
  animationRule: "linear",
};

const gauge = new RadialGauge(configuration);

gauge.draw();

export const update = (speed: number = 0) => {
  gauge.update({ ...configuration, value: speed });
};
