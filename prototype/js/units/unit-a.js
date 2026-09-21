import{opening as O}from"../opening-presets.js";

export const UNIT_A={
  id:"055.9200A",
  code:"A",
  area:55.9200,

  /*
    A형 실제 비율 재설정

    WIDTH  = 12.480m
    DEPTH  =  8.450m
    HEIGHT =  2.850m

    LOCAL:
    FRONT = +Z = 거실창 방향
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
    외부에서 보았을 때 왼쪽 → 오른쪽

    침실3 → 침실2 → 거실 → 침실1

    C형의 동일 방 치수/창 위치를
    좌우 대칭시킨 기준.
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
    A형 왼쪽 후면은 크게 안쪽으로 들어감.

    leftX = -6.24
    -6.24 + 3.70 = -2.54

    즉 후면에서는 약 x=-2.54부터
    본격적인 외벽이 시작되는 형태로 근사.
  */
  leftRearInset:{
    offset:3.70,
    untilZ:-2.05
  },

  /*
    REAR PROFILE

    주방 부분이 가장 뒤쪽.
    다용도실과 실외기실/드레스룸 쪽은
    약 0.28m 전진한 형태.
  */
  rearProfile:[

    {
      xMin:-2.54,
      xMax:-.75,
      offset:.28
    },

    {
      xMin:-.75,
      xMax:2.45,
      offset:0
    },

    {
      xMin:2.45,
      xMax:6.24,
      offset:.28
    }

  ],

  /*
    REAR
    평면도상 왼쪽 → 오른쪽

    다용도실창
    주방창
    실외기실 루버
    드레스룸창
  */
  rearOpenings:[

    O("utilityRoomWindow",{
      id:"R01",
      name:"utilityRoomWindow",
      x:-1.48,
      w:.85
    }),

    O("kitchenWindow",{
      id:"R02",
      name:"kitchenWindow",
      x:1.40,
      w:.95
    }),

    O("outdoorUnitLouver",{
      id:"R03",
      name:"outdoorUnitLouver",
      x:3.52,
      w:1.00
    }),

    O("dressRoomWindow",{
      id:"R04",
      name:"dressRoomWindow",
      x:5.00,
      w:.85
    })

  ],

  leftOpenings:[],
  rightOpenings:[]
};
