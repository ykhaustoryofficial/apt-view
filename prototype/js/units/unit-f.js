import{opening as O}from"../opening-presets.js";

export const UNIT_F={
  id:"055.9600F",
  code:"F",
  area:55.9600,

  /*
    =====================================================
    F TYPE
    =====================================================

    기준 방 크기

    침실     2.70 × 2.98m
    알파룸   2.10 × 2.98m
    안방     3.30 × 3.38m
    거실     가로 3.60m

    전체 외곽은 평면도 비례 기준

    WIDTH  = 12.805m
    DEPTH  =  9.190m
    HEIGHT =  2.850m

    FRONT = +Z
    REAR  = -Z
    LEFT  = -X
    RIGHT = +X

    B형과 거의 동일하며
    왼쪽 외벽의 1회 계단이 F형의 주요 차이점.
  */

  size:{
    width:12.805,
    depth:9.19,
    floorHeight:2.85,
    wall:.18
  },


  /*
    =====================================================
    FRONT PROFILE
    =====================================================

    B형과 동일한 전면 형태.

    안방 부분만 다른 세 방보다
    조금 REAR 방향으로 들어감.
  */

  frontProfile:[
    {
      xMin:-6.4025,
      xMax:2.78,
      offset:0
    },
    {
      xMin:2.78,
      xMax:6.4025,
      offset:-.85
    }
  ],


  /*
    =====================================================
    FRONT OPENINGS
    =====================================================

    왼쪽 → 오른쪽

    거실
    알파룸
    침실
    안방
  */

  frontOpenings:[

    O("livingRoomWindow",{
      id:"F01",
      name:"livingRoomWindow",
      x:-4.20,
      w:2.65
    }),

    O("smallRoomWindow",{
      id:"F02",
      name:"alphaRoomWindow",
      x:-1.20,
      w:1.57
    }),

    O("smallRoomWindow",{
      id:"F03",
      name:"bedroomWindow",
      x:1.27,
      w:1.57
    }),

    O("masterRoomWindow",{
      id:"F04",
      name:"masterRoomWindow",
      x:4.34,
      w:1.96
    })

  ],


  /*
    =====================================================
    REAR PROFILE
    =====================================================

    B형 계열의 후면 구조.

    왼쪽부터 오른쪽으로
    평면도의 깊이 차이를 직접 표현한다.

    별도의 스케일 보정 없음.
  */

  rearProfile:[

    {
      xMin:-6.4025,
      xMax:-2.87,
      offset:0
    },

    {
      xMin:-2.87,
      xMax:.40,
      offset:2.08
    },

    {
      xMin:.40,
      xMax:2.05,
      offset:3.13
    },

    {
      xMin:2.05,
      xMax:6.4025,
      offset:1.97
    }

  ],


  /*
    후면에 직접 붙는 창은 없음.

    F형의 주방창과 루버는
    LEFT 외벽에 위치.
  */

  rearOpenings:[],


  /*
    =====================================================
    LEFT WALL STEP
    =====================================================

    F형의 특징.

    REAR 쪽 왼쪽 외벽이
    약 0.62m RIGHT 방향으로 들어와 있다가

    z = -1.10m 부근에서
    다시 원래 LEFT 외벽 위치로 나온다.


    위에서 보면 대략:

        REAR

           │
           │  ← 들어간 왼쪽 벽
           │
           └────
                │
                │  ← 원래 왼쪽 벽
                │

        FRONT
  */

  leftRearInset:{
    offset:.62,
    untilZ:-1.10
  },


  /*
    =====================================================
    LEFT OPENINGS
    =====================================================

    평면도 비례 기준.

    REAR → FRONT

    루버
    주방창

    둘 다 계단 들어간 LEFT 후면벽에 위치.
  */

  leftOpenings:[

    O("outdoorUnitLouver",{
      id:"L01",
      name:"outdoorUnitLouver",
      z:-3.53,
      w:.95
    }),

    O("kitchenWindow",{
      id:"L02",
      name:"kitchenWindow",
      z:-1.73,
      w:.95
    })

  ],


  rightOpenings:[]
};