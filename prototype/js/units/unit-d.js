import{opening as O}from"../opening-presets.js";

export const UNIT_D={
  id:"055.9500D",
  code:"D",
  area:55.9500,

  /*
    D형 기준 크기

    WIDTH  = 12.480m
    DEPTH  =  8.800m
    HEIGHT =  2.850m

    LOCAL
    FRONT = +Z = 거실창 방향
    REAR  = -Z
    LEFT  = -X
    RIGHT = +X
  */
  size:{
    width:12.48,
    depth:8.80,
    floorHeight:2.85,
    wall:.18
  },

  /*
    FRONT
    왼쪽 → 오른쪽

    침실1 → 거실 → 침실2 → 침실3

    C형과 동일한 침실 크기와
    거실 가로폭을 기준으로 사용.
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
    REAR PROFILE

    실제 평면 이미지의 외곽 비율 기준.

    가장 뒤쪽 기준면 = offset 0

    왼쪽 끝        +0.60m 전진
    그 오른쪽      +0.30m 전진
    주방 부분       기준면
    오른쪽 부분     +2.08m 크게 전진

             REAR

       +0.60
    ┌────────
             └── +0.30
                    └──────── 기준 0
                                      │
                                      │ 2.08m
                                      └────────────
  */
  rearProfile:[

    {
      xMin:-6.24,
      xMax:-4.50,
      offset:.60
    },

    {
      xMin:-4.50,
      xMax:-2.75,
      offset:.30
    },

    {
      xMin:-2.75,
      xMax:.86,
      offset:0
    },

    {
      xMin:.86,
      xMax:6.24,
      offset:2.08
    }

  ],

  /*
    REAR
    외부에서 뒤쪽을 바라볼 때 왼쪽 → 오른쪽

    루버
    ↓
    다용도실창1
    ↓
    주방창
    ↓
    다용도실창2

    각 요소는 자신이 속한 rearProfile 벽면에
    자동으로 붙는다.
  */
  rearOpenings:[

    O("outdoorUnitLouver",{
      id:"R01",
      name:"outdoorUnitLouver",
      x:-5.10,
      w:1.00
    }),

    O("utilityRoomWindow",{
      id:"R02",
      name:"utilityRoomWindow1",
      x:-3.30,
      w:.85
    }),

    O("kitchenWindow",{
      id:"R03",
      name:"kitchenWindow",
      x:-1.13,
      w:.95
    }),

    O("utilityRoomWindow",{
      id:"R04",
      name:"utilityRoomWindow2",
      x:1.31,
      w:.85
    })

  ],

  leftOpenings:[],
  rightOpenings:[]
};