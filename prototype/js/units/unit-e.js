import{opening as O}from"../opening-presets.js";

export const UNIT_E={
  id:"055.9500E",
  code:"E",
  area:55.9500,

  /*
    E형 기준

    WIDTH  = 12.480m
    DEPTH  =  8.450m
    HEIGHT =  2.850m

    LOCAL
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

    핵심:
    주방 부분이 가장 뒤쪽(offset 0).

    주방에서 오른쪽으로 갈 때
    단 한 번만 +0.38m 전진한다.

    루버벽과 드레스룸벽은
    같은 Z축에 놓인다.

    오른쪽 영역을 두 구간으로 나누는 이유는
    루버를 해당 벽 구간의 정확한 중앙에
    배치하기 위해서다.

    두 구간의 offset이 동일하므로
    실제 외벽에는 추가 계단이 생기지 않는다.
  */
  rearProfile:[

    /*
      왼쪽 다용도실 영역
    */
    {
      xMin:-6.24,
      xMax:-.90,
      offset:.38
    },

    /*
      주방 영역
      가장 뒤쪽 기준면
    */
    {
      xMin:-.90,
      xMax:1.90,
      offset:0
    },

    /*
      실외기실 루버 영역

      폭:
      4.80 - 1.90 = 2.90m

      중심:
      (1.90 + 4.80) / 2
      = 3.35m
    */
    {
      xMin:1.90,
      xMax:4.80,
      offset:.38
    },

    /*
      드레스룸 영역

      루버 영역과 동일 offset.
      따라서 외벽 단차 없음.
    */
    {
      xMin:4.80,
      xMax:6.24,
      offset:.38
    }

  ],

  /*
    REAR 개구부
    왼쪽 → 오른쪽

    다용도실창
    주방창
    실외기실 루버
    드레스룸창
  */
  rearOpenings:[

    O("utilityRoomWindow",{
      id:"R01",
      name:"utilityRoomWindow",
      x:-2.15,
      w:.85
    }),

    /*
      거실창과 정확히 동일한 X축
    */
    O("kitchenWindow",{
      id:"R02",
      name:"kitchenWindow",
      x:.60,
      w:.95
    }),

    /*
      루버벽:
      x = 1.90 ~ 4.80

      정확한 중앙:
      x = 3.35
    */
    O("outdoorUnitLouver",{
      id:"R03",
      name:"outdoorUnitLouver",
      x:3.35,
      w:1.00
    }),

    /*
      오른쪽 외벽에 가깝게 이동.

      루버와 동일 rearProfile offset(.38)이므로
      두 개구부의 깊이(Z)는 동일.
    */
    O("dressRoomWindow",{
      id:"R04",
      name:"dressRoomWindow",
      x:5.52,
      w:.85
    })

  ],

  leftOpenings:[],
  rightOpenings:[]
};