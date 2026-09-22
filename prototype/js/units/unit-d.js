import { opening as O } from "../opening-presets.js";

export const UNIT_D = {
  id: "055.9500D",
  code: "D",
  area: 55.9500,

  /*
    D형 재설정 기준
    - 침실1/2/3 크기와 거실 가로폭은 C형과 동일 기준
    - 전체 외곽은 도면 비율 기준 추정
    - FRONT = 아래쪽(거실창 방향)
    - REAR  = 위쪽
    - LEFT  = 왼쪽
    - RIGHT = 오른쪽
  */
  size: {
    width: 12.48,
    depth: 8.80,
    floorHeight: 2.85,
    wall: 0.18
  },

  /*
    FRONT
    외부에서 정면으로 봤을 때 왼쪽 -> 오른쪽
    안방창 / 거실창 / 작은방창 / 작은방창
  */
  frontOpenings: [
    O("masterRoomWindow", {
      id: "F01",
      name: "masterRoomWindow",
      x: -4.59
    }),

    O("livingRoomWindow", {
      id: "F02",
      name: "livingRoomWindow",
      x: -1.14
    }),

    O("smallRoomWindow", {
      id: "F03",
      name: "smallRoomWindow1",
      x: 1.71
    }),

    O("smallRoomWindow", {
      id: "F04",
      name: "smallRoomWindow2",
      x: 4.11
    })
  ],

  /*
    REAR PROFILE
    D형 특징:
    - 좌측 후면이 계단형
    - 우측은 좌측보다 얕음
    offset = 후면 기준 앞으로 들어온 깊이
  */
  rearProfile: [
    {
      xMin: -6.24,
      xMax: -4.70,
      offset: 0.95
    },
    {
      xMin: -4.70,
      xMax: -2.55,
      offset: 0.38
    },
    {
      xMin: -2.55,
      xMax: 2.35,
      offset: 0.00
    },
    {
      xMin: 2.35,
      xMax: 6.24,
      offset: 1.15
    }
  ],

  /*
    REAR
    후면에서 정면으로 봤을 때 왼쪽 -> 오른쪽
    다용도실창 / 주방창 / 다용도실창 / 루버

    - 주방창은 거실창과 같은 x축
    - 루버는 가장 오른쪽 계단벽 중앙
  */
  rearOpenings: [
    O("utilityRoomWindow", {
      id: "R01",
      name: "utilityRoomWindow1",
      x: -3.55
    }),

    O("kitchenWindow", {
      id: "R02",
      name: "kitchenWindow",
      x: -1.14
    }),

    O("utilityRoomWindow", {
      id: "R03",
      name: "utilityRoomWindow2",
      x: 1.30
    }),

    O("outdoorUnitLouver", {
      id: "R04",
      name: "outdoorUnitLouver",
      x: 4.25
    })
  ],

  leftOpenings: [],
  rightOpenings: []
};