export const UNIT_E={
  id:"055.9500E",code:"E",area:55.9500,
  size:{width:9.40,depth:7.00,floorHeight:2.85,wall:.18},

  // FRONT: A와 동일
  // 작은방창 → 작은방창 → 거실창 → 안방창
  frontOpenings:[
    {id:"F01",name:"smallRoomWindow1",type:"window",x:-3.55,w:1.10,h:1.10,sill:.97},
    {id:"F02",name:"smallRoomWindow2",type:"window",x:-2.05,w:1.10,h:1.10,sill:.97},
    {id:"F03",name:"livingRoomWindow",type:"largeWindow",x:.65,w:2.15,h:1.45,sill:.62},
    {id:"F04",name:"masterRoomWindow",type:"window",x:3.45,w:1.20,h:1.35,sill:.72}
  ],

  /*
    E 외곽 특징
    왼쪽벽과 뒷벽 접속부만 한 번 계단식으로 꺾임.
    나머지 뒷면은 직선.
  */
  rearProfile:[
    {xMin:-4.70,xMax:-3.15,offset:.85},
    {xMin:-3.15,xMax:4.70,offset:0}
  ],

  // REAR: A와 동일
  // 드레스룸창 → 루버 → 주방창 → 다용도실창
  rearOpenings:[
    {id:"R01",name:"dressRoomWindow",type:"window",x:3.60,w:.82,h:.82,sill:1.15},
    {id:"R02",name:"outdoorUnitLouver",type:"louver",x:2.15,w:.72,h:1.45,sill:.68},
    {id:"R03",name:"kitchenWindow",type:"kitchenWindow",x:.85,w:.72,h:.56,sill:1.24},
    {id:"R04",name:"utilityRoomWindow",type:"window",x:-.59,w:.72,h:.78,sill:1.13}
  ],

  leftOpenings:[],
  rightOpenings:[]
};
