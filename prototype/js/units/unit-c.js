export const UNIT_C = {
  id: "055.9500C",
  code: "C",
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
    작은방창 → 작은방창 → 거실창 → 안방창
  */
  frontOpenings: [
    {
      id: "F01",
      name: "smallRoomWindow1",
      type: "window",
      x: -3.55,
      w: 1.10,
      h: 1.10,
      sill: 0.97
    },

    {
      id: "F02",
      name: "smallRoomWindow2",
      type: "window",
      x: -2.05,
      w: 1.10,
      h: 1.10,
      sill: 0.97
    },

    {
      id: "F03",
      name: "livingRoomWindow",
      type: "largeWindow",
      x: 0.65,
      w: 2.15,
      h: 1.45,
      sill: 0.62
    },

    {
      id: "F04",
      name: "masterRoomWindow",
      type: "window",
      x: 3.45,
      w: 1.20,
      h: 1.35,
      sill: 0.72
    }
  ],

  /*
    REAR
    A타입과 동일하지만
    드레스룸창만 없음.

    외부에서 바라볼 때:
    루버 → 주방창 → 다용도실창
  */
  rearOpenings: [
    {
      id: "R01",
      name: "outdoorUnitLouver",
      type: "louver",
      x: 2.15,
      w: 0.72,
      h: 1.45,
      sill: 0.68
    },

    {
      id: "R02",
      name: "kitchenWindow",
      type: "kitchenWindow",
      x: 0.85,
      w: 0.72,
      h: 0.56,
      sill: 1.24
    },

    {
      id: "R03",
      name: "utilityRoomWindow",
      type: "window",
      x: -0.59,
      w: 0.72,
      h: 0.78,
      sill: 1.13
    }
  ],

  leftOpenings: [],
  rightOpenings: []
};
