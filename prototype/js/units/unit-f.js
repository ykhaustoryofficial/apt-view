export const UNIT_F={
  id:"055.9600F",code:"F",area:55.9600,
  size:{width:9.40,depth:7.00,floorHeight:2.85,wall:.18},

  // B와 동일: 오른쪽 안방 부분 후퇴
  frontProfile:[
    {xMin:-4.70,xMax:2.15,offset:0},
    {xMin:2.15,xMax:4.70,offset:-.90}
  ],

  // FRONT: 거실창 → 작은방창 → 작은방창 → 안방창
  frontOpenings:[
    {id:"F01",name:"livingRoomWindow",type:"largeWindow",x:-3.25,w:1.95,h:1.45,sill:.62},
    {id:"F02",name:"smallRoomWindow1",type:"window",x:-1.15,w:1.05,h:1.10,sill:.97},
    {id:"F03",name:"smallRoomWindow2",type:"window",x:.75,w:1.10,h:1.10,sill:.97},
    {id:"F04",name:"masterRoomWindow",type:"window",x:3.15,w:1.35,h:1.35,sill:.72}
  ],

  rearOpenings:[],

  /*
    왼쪽벽 뒤쪽을 0.55m 안으로 이동.
    z=-0.35 지점에서 원래 왼쪽벽으로 다시 나옴.

    루버(z:-2.45)와 주방창(z:-1.10)은
    둘 다 이 안쪽 벽에 직접 붙는다.
  */
  leftRearInset:{
    offset:.55,
    untilZ:-.35
  },

  // B와 동일한 위치
  leftOpenings:[
    {id:"L01",name:"outdoorUnitLouver",type:"louver",z:-2.45,w:.78,h:1.45,sill:.68},
    {id:"L02",name:"kitchenWindow",type:"kitchenWindow",z:-1.10,w:.72,h:.56,sill:1.24}
  ],

  rightOpenings:[]
};
