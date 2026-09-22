import{opening as O}from"../opening-presets.js";

export const UNIT_E={
  id:"055.9500E",
  code:"E",
  area:55.9500,

  /*
    E TYPE

    WIDTH  = 12.480m
    DEPTH  =  8.450m
    HEIGHT =  2.850m

    FRONT = +Z
    REAR  = -Z
    LEFT  = -X
    RIGHT = +X
  */
  size:{
    width:12.48,
    depth:8.45,
    floorHeight:2.85,
    wall:.18
  },

  /*
    =====================================================
    FRONT
    =====================================================

    왼쪽 → 오른쪽

    침실3
    침실2
    거실
    침실1
  */
  frontProfile:[
    {
      xMin:-6.24,
      xMax:6.24,
      offset:0
    }
  ],

  frontOpenings:[

    O("smallRoomWindow",{
      id:"F01",
      name:"bedroom3Window",
      x:-4.76,
      w:1.61
    }),

    O("smallRoomWindow",{
      id:"F02",
      name:"bedroom2Window",
      x:-2.24,
      w:1.62
    }),

    O("livingRoomWindow",{
      id:"F03",
      name:"livingRoomWindow",
      x:.84,
      w:2.72
    }),

    O("masterRoomWindow",{
      id:"F04",
      name:"bedroom1Window",
      x:4.42,
      w:2.02
    })

  ],

  /*
    =====================================================
    REAR OUTLINE
    =====================================================

    기존 확정된 E형 후면 형상 그대로 유지.

    ① 왼쪽 큰 후퇴부
    ② 좌측 작은 단차
    ③ 중앙 주방부
    ④ 오른쪽 작은 단차

    오른쪽 깊은 홈은 없음.
  */
  rearProfile:[

    {
      xMin:-6.24,
      xMax:-4.50,
      offset:3.05
    },

    {
      xMin:-4.50,
      xMax:-1.14,
      offset:.36
    },

    {
      xMin:-1.14,
      xMax:3.23,
      offset:0
    },

    {
      xMin:3.23,
      xMax:6.24,
      offset:.32
    }

  ],

  /*
    =====================================================
    REAR OPENINGS
    =====================================================

    왼쪽 → 오른쪽

    다용도실창
    주방창
    루버
    드레스룸창


    위치 기준:

    다용도실창
    = 정면 침실2 창 중심(-2.24)보다 약간 오른쪽

    주방창
    = 정면 거실창 중심(+0.84)의 약 두 배보다
      조금 더 오른쪽

    루버
    = 정면 침실1 창 중심(+4.42)보다 약간 왼쪽

    드레스룸창
    = 정면 침실1 창 중심(+4.42)보다 약간 오른쪽
  */
  rearOpenings:[

    O("utilityRoomWindow",{
      id:"R01",
      name:"utilityRoomWindow",
      x:-1.70,
      w:.85
    }),

    O("kitchenWindow",{
      id:"R02",
      name:"kitchenWindow",
      x:1.85,
      w:.95
    }),

    O("outdoorUnitLouver",{
      id:"R03",
      name:"outdoorUnitLouver",
      x:3.75,
      w:1.00
    }),

    O("dressRoomWindow",{
      id:"R04",
      name:"dressRoomWindow",
      x:5.15,
      w:.85
    })

  ],

  leftOpenings:[],
  rightOpenings:[]
};