import{opening as O}from"../opening-presets.js";

export const UNIT_E={
  id:"055.9500E",
  code:"E",
  area:55.9500,

  /*
    E형

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
    FRONT
    왼쪽 → 오른쪽

    침실3
    침실2
    거실
    침실1
  */
  frontOpenings:[

    O("smallRoomWindow",{
      id:"F01",
      name:"bedroom3Window",
      x:-4.91,
      w:1.85
    }),

    O("smallRoomWindow",{
      id:"F02",
      name:"bedroom2Window",
      x:-2.46,
      w:1.70
    }),

    O("livingRoomWindow",{
      id:"F03",
      name:"livingRoomWindow",
      x:.60,
      w:2.55
    }),

    O("masterRoomWindow",{
      id:"F04",
      name:"bedroom1Window",
      x:4.12,
      w:1.95
    })

  ],

  /*
    REAR PROFILE

    핵심 기준:

    제일 왼쪽 작은방창 중심:
      x = -4.91

    여기서 x = 0까지의 후면벽을
    FRONT 방향으로 전체 깊이의 3/7 이동.

    8.45 × 3 / 7
    = 3.621428...

    따라서 해당 구간:
      offset = 3.62m


    평면 개념:

                        주방벽
                           ┌───────────────┐
                           │     주방창     │
                           │               │
        크게 들어간 벽 ────┘               └─────────────
        다용도실                                 루버 / 드레스룸

                    ↑
            주방 오른쪽 계단은
               딱 한 번만 발생
  */

  rearProfile:[

    /*
      가장 왼쪽 끝.

      현재는 -4.91~0 구간과 같은 깊이로
      이어지게 하여 불필요한 추가 계단을 만들지 않음.
    */
    {
      xMin:-6.24,
      xMax:-4.91,
      offset:3.62
    },

    /*
      사용자 지정 핵심 구간.

      왼쪽 작은방창 중심(-4.91)
      ~ 유닛 중심(0)

      FRONT 쪽으로 깊이의 약 3/7.
    */
    {
      xMin:-4.91,
      xMax:0,
      offset:3.62
    },

    /*
      주방창 벽.

      주방창 x=.60이 이 벽에 위치.

      가장 REAR 쪽 기준면.
    */
    {
      xMin:0,
      xMax:2.70,
      offset:0
    },

    /*
      루버 전용 구간.

      주방벽에서 오른쪽으로 갈 때
      여기서 단 한 번만 살짝 FRONT로 들어감.

      폭:
        4.70 - 2.70 = 2.00m

      정가운데:
        (2.70 + 4.70) / 2
        = 3.70m

      따라서 루버 x = 3.70
    */
    {
      xMin:2.70,
      xMax:4.70,
      offset:.45
    },

    /*
      드레스룸 구간.

      루버 구간과 offset이 완전히 동일.

      즉 4.70 위치에서는
      실제 외벽 계단이 추가되지 않음.

      루버와 드레스룸창의 Z도 동일.
    */
    {
      xMin:4.70,
      xMax:6.24,
      offset:.45
    }

  ],

  /*
    REAR
    왼쪽 → 오른쪽

    다용도실창
    주방창
    루버
    드레스룸창
  */
  rearOpenings:[

    /*
      FRONT 쪽으로 깊게 들어온 벽
    */
    O("utilityRoomWindow",{
      id:"R01",
      name:"utilityRoomWindow",
      x:-2.35,
      w:.85
    }),

    /*
      FRONT 거실창과
      정확하게 동일한 X값
    */
    O("kitchenWindow",{
      id:"R02",
      name:"kitchenWindow",
      x:.60,
      w:.95
    }),

    /*
      루버 구간:
      x=2.70 ~ 4.70

      정확한 정가운데:
      x=3.70
    */
    O("outdoorUnitLouver",{
      id:"R03",
      name:"outdoorUnitLouver",
      x:3.70,
      w:1.00
    }),

    /*
      루버 오른쪽.

      최대한 RIGHT 외벽 가까이 배치.

      루버와 같은 offset=.45이므로
      두 개구부의 Z축 위치도 동일.
    */
    O("dressRoomWindow",{
      id:"R04",
      name:"dressRoomWindow",
      x:5.55,
      w:.85
    })

  ],

  leftOpenings:[],
  rightOpenings:[]
};