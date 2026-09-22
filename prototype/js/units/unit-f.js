import{opening as O}from"../opening-presets.js";

export const UNIT_F={
  id:"055.9600F",
  code:"F",
  area:55.9600,

  size:{width:9.40,depth:7.00,floorHeight:2.85,wall:.18},

  // B형과 동일한 전면 형태
  frontProfile:[
    {xMin:-4.70,xMax:2.15,offset:0},
    {xMin:2.15,xMax:4.70,offset:-.90}
  ],

  // FRONT : 거실 → 작은방 → 작은방 → 안방
  frontOpenings:[
    O("livingRoomWindow",{id:"F01",name:"livingRoomWindow",x:-3.25,w:1.95}),
    O("smallRoomWindow",{id:"F02",name:"smallRoomWindow1",x:-1.15}),
    O("smallRoomWindow",{id:"F03",name:"smallRoomWindow2",x:.75}),
    O("masterRoomWindow",{id:"F04",name:"masterRoomWindow",x:3.15,w:1.35})
  ],

  rearOpenings:[],

  // F형 차이점:
  // 왼쪽 뒤 벽이 한 번 안으로 들어가며,
  // 그 들어간 벽면에 루버와 주방창이 붙음
  leftRearInset:{offset:.55,untilZ:-.35},

  // LEFT : 루버 → 주방창
  leftOpenings:[
    O("outdoorUnitLouver",{id:"L01",name:"outdoorUnitLouver",z:-2.45,w:.78}),
    O("kitchenWindow",{id:"L02",name:"kitchenWindow",z:-1.10})
  ],

  rightOpenings:[]
};