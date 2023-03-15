export let position = 0;

export const steerLeft = () => {
  position = Math.max(-100, position - 10);
};

export const steerRight = () => {
  position = Math.min(100, position + 10);
};

export const getCurrentPosition = () => position;
