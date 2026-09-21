import{opening as O}from"../opening-presets.js";

export const UNIT_C={
  id:"055.9500C",
  code:"C",
  area:55.9500,

  /*
    실제 C형 평면 기준 외곽 크기

    WIDTH  = 12.480m
    DEPTH  =  8.890m
    HEIGHT =  2.850m

    LOCAL 방향:
    FRONT = +Z = 거실창 방향
    REAR  = -Z
    LEFT  = -X
    RIGHT = +X
  */
  size:{
    width:12.48,
    depth:8.89,
    floorHeight:2.85,
    wall:.18
  },

  /*
    FRONT
    도면 기준 왼쪽 → 오른쪽

    침실1(안방)
    거실
    침실2
    침실3

    X는 유닛 중심 기준.
    창 폭은 평면도 비례 측정값.
    높이/창턱은 기존 opening preset 유지.
  */
  frontOpenings:[
    O("masterRoomWindow",{
      id:"F01",
      name:"bedroom1Window",
      x:-4.12,
      w:1.95
    }),

    O("livingRoomWindow",{
      id:"F02",
      name:"livingRoomWindow",
      x:-.60,
      w:2.55
    }),

    O("smallRoomWindow",{
      id:"F03",
      name:"bedroom2Window",
      x:2.46,
      w:1.70
    }),

    O("smallRoomWindow",{
      id:"F04",
      name:"bedroom3Window",
      x:4.91,
      w:1.85
    })
  ],

  /*
    REAR 외벽은 직선이 아님.

    baseRearZ = -4.445m

    왼쪽 실외기실 부분:
    약 +0.82m 전진

    다용도실 부분:
    약 +0.31m 전진

    주방 부분:
    가장 뒤쪽 기준면

    오른쪽 현관/욕실 영역은
    현재 UNIT 배치 확인용으로만 근사 처리.
    최종 201동 SHELL 제작 때 다시 정밀 조정.
  */
  rearProfile:[
    {
      xMin:-6.24,
      xMax:-4.31,
      offset:.82
    },

    {
      xMin:-4.31,
      xMax:-2.70,
      offset:.31
    },

    {
      xMin:-2.70,
      xMax:1.02,
      offset:0
    },

    {
      xMin:1.02,
      xMax:6.24,
      offset:2.75
    }
  ],

  /*
    REAR 개구부

    도면의 평면 위치를
    12.48m 전체 폭에 비례하여 환산.

    드레스룸 외창 없음.
  */
  rearOpenings:[
    O("outdoorUnitLouver",{
      id:"R01",
      name:"outdoorUnitLouver",
      x:-4.99,
      w:1.00
    }),

    O("utilityRoomWindow",{
      id:"R02",
      name:"utilityRoomWindow",
      x:-3.62,
      w:.85
    }),

    O("kitchenWindow",{
      id:"R03",
      name:"kitchenWindow",
      x:-.98,
      w:.95
    })
  ],

  leftOpenings:[],
  rightOpenings:[]
};
