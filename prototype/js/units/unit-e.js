import{opening as O}from"../opening-presets.js";

export const UNIT_E={
  id:"055.9500E",
  code:"E",
  area:55.9500,

  /*
    E TYPE

    사진 비례 기준

    WIDTH  ≈ 13.08m
    DEPTH  ≈  9.10m
    HEIGHT =   2.85m

    FRONT = +Z
    REAR  = -Z
    LEFT  = -X
    RIGHT = +X
  */
  size:{
    width:13.08,
    depth:9.10,
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
  frontProfile:[
    {
      xMin:-6.54,
      xMax:6.54,
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

    왼쪽 구조는 기존 유지.

    주방벽은 가장 REAR 쪽 기준면(offset 0).

    주방벽에서 오른쪽으로 갈 때
    살짝 FRONT 방향으로 들어가는 단차는 유지.

    다만 기존에 있던
    offset 2.14m의 깊은 홈은 완전히 제거.

    형태:

                         주방벽
                    ┌───────────────┐
                    │               │
                    │               └─────────────
                    │                    ↑
                    │                 살짝 계단
                    │
          왼쪽 큰 후퇴부

  */
  rearProfile:[

    /*
      ① 왼쪽 가장 깊게 들어온 부분
    */
    {
      xMin:-6.54,
      xMax:-4.50,
      offset:3.28
    },

    /*
      ② 좌측 후면부
    */
    {
      xMin:-4.50,
      xMax:-1.14,
      offset:.39
    },

    /*
      ③ 중앙 주방부
      가장 REAR 쪽 기준면
    */
    {
      xMin:-1.14,
      xMax:3.23,
      offset:0
    },

    /*
      ④ 오른쪽 후면부

      주방벽에서 딱 한 번만
      FRONT 방향으로 살짝 들어감.

      기존 .34m 단차 유지.

      이후 RIGHT 끝까지
      다시 들어가거나 나오지 않고 직선.
    */
    {
      xMin:3.23,
      xMax:6.54,
      offset:.34
    }

  ],

  /*
    후면 창과 루버는
    외곽 구조 확정 후 추가.
  */
  rearOpenings:[],

  leftOpenings:[],
  rightOpenings:[]
};