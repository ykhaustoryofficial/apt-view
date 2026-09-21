import{opening as O}from"../opening-presets.js";

export const UNIT_B={
  id:"055.9500B",
  code:"B",
  area:55.9500,

  /*
    B형 실제 비율 재설정

    WIDTH  = 12.805m
    DEPTH  =  9.230m
    HEIGHT =  2.850m

    LOCAL
    FRONT = +Z = 거실창 방향
    REAR  = -Z
    LEFT  = -X
    RIGHT = +X
  */
  size:{
    width:12.805,
    depth:9.23,
    floorHeight:2.85,
    wall:.18
  },

  /*
    FRONT

    외부에서 왼쪽 → 오른쪽

    거실
    침실2
    침실3
    침실1

    오른쪽 침실1 부분은
    약 0.85m 뒤로 후퇴.
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

  frontOpenings:[

    O("livingRoomWindow",{
      id:"F01",
      name:"livingRoomWindow",
      x:-4.20,
      w:2.65
    }),

    O("smallRoomWindow",{
      id:"F02",
      name:"bedroom2Window",
      x:-1.20,
      w:1.57
    }),

    O("smallRoomWindow",{
      id:"F03",
      name:"bedroom3Window",
      x:1.27,
      w:1.57
    }),

    O("masterRoomWindow",{
      id:"F04",
      name:"bedroom1Window",
      x:4.34,
      w:1.96
    })

  ],

  /*
    REAR PROFILE

    이미지 평면 외곽을 비례 환산한 값.

    가장 왼쪽 후면부가 기준점이고
    중앙부가 단계적으로 앞으로 들어옴.
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
    B형 REAR에는
    현재 주요 외부 창호 없음.
  */
  rearOpenings:[],

  /*
    LEFT

    도면 위쪽(후면) → 아래쪽(전면)

    실외기실 루버
    주방창

    z=-4.615 = 최후면
    z=+4.615 = 최전면
  */
  leftOpenings:[

    O("outdoorUnitLouver",{
      id:"L01",
      name:"outdoorUnitLouver",
      z:-3.39,
      w:.95
    }),

    O("kitchenWindow",{
      id:"L02",
      name:"kitchenWindow",
      z:-.91,
      w:.95
    })

  ],

  rightOpenings:[]
};