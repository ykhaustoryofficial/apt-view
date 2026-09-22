import { opening as O } from "../opening-presets.js";

export const UNIT_E = {
  id: "055.9200E",
  code: "E",
  area: 55.92,

  /*
    E형 기준
    FRONT = +Z = 거실창 방향
    REAR  = -Z
    LEFT  = -X
    RIGHT = +X
  */
  size: {
    width: 12.48,
    depth: 8.45,
    floorHeight: 2.85,
    wall: 0.18
  },

  /*
    FRONT
    왼쪽 → 오른쪽
    작은방창 / 작은방창 / 거실창 / 안방창
  */
  frontOpenings: [
    O("smallRoomWindow", {
      id: "F01",
      name: "bedroom3Window",
      x: -4.91,
      w: 1.85
    }),

    O("smallRoomWindow", {
      id: "F02",
      name: "bedroom2Window",
      x: -2.46,
      w: 1.70
    }),

    O("livingRoomWindow", {
      id: "F03",
      name: "livingRoomWindow",
      x: 0.60,
      w: 2.55
    }),

    O("masterRoomWindow", {
      id: "F04",
      name: "bedroom1Window",
      x: 4.12,
      w: 1.95
    })
  ],

  /*
    REAR PROFILE
    E형은 A계열과 비슷하게
    좌우가 약간 꺾이는 형태로 설정
  */
  rearProfile: [
    {
      xMin: -6.24,
      xMax: -4.70,
      offset: 1.85
    },
    {
      xMin: -4.70,
      xMax: -2.10,
      offset: 0.45
    },
    {
      xMin: -2.10,
      xMax: 1.55,
      offset: 0.00
    },
    {
      xMin: 1.55,
      xMax: 3.85,
      offset: 0.35
    },
    {
      xMin: 3.85,
      xMax: 6.24,
      offset: 1.95
    }
  ],

  /*
    REAR
    왼쪽 → 오른쪽
    루버 / 주방창 / 다용도실창 / 드레스룸창
  */
  rearOpenings: [
    O("outdoorUnitLouver", {
      id: "R01",
      name: "outdoorUnitLouver",
      x: -5.05,
      w: 1.00
    }),

    O("kitchenWindow", {
      id: "R02",
      name: "kitchenWindow",
      x: -1.45,
      w: 0.95
    }),

    O("utilityRoomWindow", {
      id: "R03",
      name: "utilityRoomWindow",
      x: 1.35,
      w: 0.85
    }),

    O("dressRoomWindow", {
      id: "R04",
      name: "dressRoomWindow",
      x: 4.45,
      w: 0.95
    })
  ],

  leftOpenings: [],
  rightOpenings: []
};