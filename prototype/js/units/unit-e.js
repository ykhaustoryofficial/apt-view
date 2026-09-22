import{opening as O}from"../opening-presets.js";

export const UNIT_E={
  id:"055.9500E",
  code:"E",
  area:55.9500,

  /*
    =====================================================
    E TYPE
    =====================================================

    C형과 동일하다고 확인된 기준치:
    - 침실1 / 침실2 / 침실3 가로세로 동일
    - 거실 가로폭 동일

    사진 비례 기준 전체 크기:

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

    이번 수정:

    기존에는 주방부 오른쪽에서

        ───────┐
               │
               └───
                   │
                   └────

    처럼 한 번 깊게 움푹 들어가는 홈이 있었음.


    수정 후:

        ─────────────────────────────

    주방부에서 RIGHT 외벽까지
    반듯하게 이어진다.


    나머지 왼쪽 후면 형상은
    기존 값을 그대로 유지.
  */

  rearProfile:[

    /*
      ① 가장 왼쪽 후면부
      크게 FRONT 방향으로 들어감
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
      ③ 중앙 주방부 + 오른쪽 후면 전체

      기존의 오른쪽 홈을 제거.

      x=-1.14부터 RIGHT 끝 +6.54까지
      하나의 반듯한 후면벽으로 연결.
    */
    {
      xMin:-1.14,
      xMax:6.54,
      offset:0
    }

  ],


  /*
    =====================================================
    REAR OPENINGS
    =====================================================

    아직 배치하지 않음.

    후면 외곽이 확정된 다음 추가 예정:

    - 다용도실창
    - 주방창
    - 루버
    - 드레스룸창
  */

  rearOpenings:[],


  leftOpenings:[],
  rightOpenings:[]
};