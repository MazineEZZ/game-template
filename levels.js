const level1 = [
  {
    type: "player",
    x: 80,
    y: 80,
    width: 80,
    height: 80,
    hitboxWidth: 35,
    hitboxHeight: 55,
    zIndex: 5,
  },
  { type: "barrier", x: 400, y: 0, width: 80, height: 80 * 4 },
  { type: "barrier", x: 80 * 2, y: 720 - 80 * 5, width: 80, height: 80 * 5 },
  {
    type: "barrier",
    x: 80 * 7,
    y: 720 - 80 * 7,
    width: 80 * 2,
    height: 80 * 7,
  },
  {
    type: "barrier",
    x: 80 * 10,
    y: 0,
    width: 80,
    height: 80 * 3,
  },
  {
    type: "barrier",
    x: 80 * 10,
    y: 720 - 80 * 5,
    width: 80 * 4,
    height: 80 * 5,
  },
  { type: "hazard", x: 13 * 80, y: 80, width: 80, height: 80, zIndex: 3 },
  { type: "coin", x: 80 * 8, y: 80, width: 20, height: 20, zIndex: 3 },
  { type: "coin", x: 80 * 15, y: 80 * 8, width: 20, height: 20, zIndex: 3 },
];
export { level1 };
