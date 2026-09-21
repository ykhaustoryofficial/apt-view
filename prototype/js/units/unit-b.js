export const UNIT_B = {

  id:"055.9500B",
  code:"B",
  area:55.9500,

  size:{
    width:9.40,
    depth:7.00,
    floorHeight:2.85,
    wall:0.18
  },

  /*
    B 정면 실루엣

    거실~작은방 구간 = 기본 전면
    안방 구간        = 0.50m 후퇴
  */
  frontProfile:[
    {
      xMin:-4.70,
      xMax: 2.20,
      offset:0
    },
    {
      xMin:2.20,
      xMax:4.70,
      offset:-0.50
    }
  ],

  /*
    FRONT
    거실 → 작은방 → 작은방 → 안방
  */
  frontOpenings:[

    {
      id:"F01",
      name:"livingRoomWindow",
      type:"largeWindow",
      x:-3.25,
      w:1.95,
      h:1.45,
      sill:.62
    },

    {
      id:"F02",
      name:"smallRoomWindow1",
      type:"window",
      x:-1.15,
      w:1.05,
      h:1.10,
      sill:.97
    },

    {
      id:"F03",
      name:"smallRoomWindow2",
      type:"window",
      x:.75,
      w:1.10,
      h:1.10,
      sill:.97
    },

    {
      id:"F04",
      name:"masterRoomWindow",
      type:"window",
      x:3.15,
      w:1.35,
      h:1.35,
      sill:.72
    }

  ],

  /* REAR = 창 없음 */
  rearOpenings:[],

  /*
    LEFT
    뒤쪽 → 앞쪽
    루버 → 주방창
  */
  leftOpenings:[

    {
      id:"L01",
      name:"outdoorUnitLouver",
      type:"louver",
      z:-2.45,
      w:.78,
      h:1.45,
      sill:.68
    },

    {
      id:"L02",
      name:"kitchenWindow",
      type:"kitchenWindow",
      z:-1.10,
      w:.72,
      h:.56,
      sill:1.24
    }

  ],

  rightOpenings:[]

};
