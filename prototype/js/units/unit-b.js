export const UNIT_B = {

  id: "055.9500B",
  code: "B",
  area: 55.9500,

  size: {
    width: 9.40,
    depth: 7.00,
    floorHeight: 2.85,
    wall: 0.18
  },

  /*
    FRONT
    외부에서 바라볼 때:

    거실창
    → 작은방창
    → 작은방창
    → 안방창
  */
  frontOpenings: [

    {
      id: "F01",
      name: "livingRoomWindow",
      type: "largeWindow",
      x: -3.25,
      w: 1.95,
      h: 1.45,
      sill: 0.62
    },

    {
      id: "F02",
      name: "smallRoomWindow1",
      type: "window",
      x: -1.15,
      w: 1.05,
      h: 1.10,
      sill: 0.97
    },

    {
      id: "F03",
      name: "smallRoomWindow2",
      type: "window",
      x: 0.75,
      w: 1.10,
      h: 1.10,
      sill: 0.97
    },

    {
      id: "F04",
      name: "masterRoomWindow",
      type: "window",
      x: 3.15,
      w: 1.35,
      h: 1.35,
      sill: 0.72
    }

  ],

  /*
    REAR
    창 없음
  */
  rearOpenings: [],

  /*
    LEFT WALL
    밖에서 왼쪽벽을 바라볼 때:

    뒤쪽 → 앞쪽
    실외기실 루버 → 주방창
  */
  leftOpenings: [

    {
      id: "L01",
      name: "outdoorUnitLouver",
      type: "louver",

      z: -2.45,

      w: 0.78,
      h: 1.45,
      sill: 0.68
    },

    {
      id: "L02",
      name: "kitchenWindow",
      type: "kitchenWindow",

      z: -1.10,

      w: 0.72,
      h: 0.56,
      sill: 1.24
    }

  ],

  /*
    RIGHT WALL
    창 없음
  */
  rightOpenings: []

};
