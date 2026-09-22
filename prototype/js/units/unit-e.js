import{opening as O}from"../opening-presets.js";

export const UNIT_E={
  id:"055.9500E",
  code:"E",
  area:55.9500,

  /*
    E TYPE

    A/C/D 계열과 동일한 스케일 기준으로 재정리.

    WIDTH  = 12.480m
    DEPTH  =  8.450m
    HEIGHT =  2.850m

    FRONT = +Z
    REAR  = -Z
    LEFT  = -X
    RIGHT = +X

    별도의 scale 함수나
    모델 후처리 축소는 사용하지 않는다.
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

    정면 외곽만 새로운 전체 폭에 맞춤.

    창문 위치와 크기는 이전 확정값 그대로 유지.
  */
  frontProfile:[
    {
      xMin:-6.24,
      xMax:6.24,
      offset:0
    }
  ],

  /*
    FRONT
    왼쪽 → 오른쪽

    침실3
    침실2
    거실
    침실1

    중요:
    아래 창문의 x / w 값은 수정하지 않음.
  */
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

    이전에 확인한 E형 실루엣 유지.

    단,
    전체 width/depth가 줄었으므로
    외곽 좌표와 단차 깊이만 직접 재설정.

    구조:

    ① 왼쪽 가장 깊게 FRONT로 들어온 부분
    ② 좌측 후면의 작은 단차
    ③ 중앙 주방부 = 가장 REAR
    ④ 오른쪽은 작은 단차 1번만 유지

    깊은 홈은 없음.
  */
  rearProfile:[

    /*
      ① 왼쪽 큰 후퇴부
    */
    {
      xMin:-6.24,
      xMax:-4.50,
      offset:3.05
    },

    /*
      ② 좌측 후면부
    */
    {
      xMin:-4.50,
      xMax:-1.14,
      offset:.36
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
      살짝 FRONT 방향으로 들어감.

      이후 RIGHT 끝까지 직선.
    */
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

    현재는 외곽 구조만 확정하는 단계.

    후면 개구부는 아직 넣지 않음.

    추후 추가:
    - 다용도실창
    - 주방창
    - 루버
    - 드레스룸창
  */
  rearOpenings:[],

  leftOpenings:[],
  rightOpenings:[]
};