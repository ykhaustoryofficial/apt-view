export const UNIT_D={
  id:"055.9500D",code:"D",area:55.9500,
  size:{width:9.40,depth:7.00,floorHeight:2.85,wall:.18},

  // FRONT: 안방창 → 거실창 → 작은방창 → 작은방창
  frontOpenings:[
    {id:"F01",name:"masterRoomWindow",type:"window",x:-3.45,w:1.20,h:1.35,sill:.72},
    {id:"F02",name:"livingRoomWindow",type:"largeWindow",x:-.65,w:2.15,h:1.45,sill:.62},
    {id:"F03",name:"smallRoomWindow1",type:"window",x:2.05,w:1.10,h:1.10,sill:.97},
    {id:"F04",name:"smallRoomWindow2",type:"window",x:3.55,w:1.10,h:1.10,sill:.97}
  ],

  // 좌측 후면 2단 계단 + 우측 깊이 축소
  rearProfile:[
    {xMin:-4.70,xMax:-3.35,offset:.80},
    {xMin:-3.35,xMax:-2.15,offset:.38},
    {xMin:-2.15,xMax:2.35,offset:0},
    {xMin:2.35,xMax:4.70,offset:1.75}
  ],

  /*
    REAR를 정면으로 바라봤을 때 RIGHT → LEFT
    루버 → 다용도실창 → 주방창 → 다용도실창

    R01 = 가장 오른쪽 첫 계단벽 중앙
    R02 = 그 왼쪽 두 번째 계단벽 중앙
    R03 = FRONT 거실창과 같은 x축
  */
  rearOpenings:[
    {id:"R01",name:"outdoorUnitLouver",type:"louver",x:-4.03,w:.72,h:1.45,sill:.68},
    {id:"R02",name:"utilityRoomWindow1",type:"window",x:-2.75,w:.72,h:.78,sill:1.13},
    {id:"R03",name:"kitchenWindow",type:"kitchenWindow",x:-.65,w:.72,h:.56,sill:1.24},
    {id:"R04",name:"utilityRoomWindow2",type:"window",x:1.15,w:.72,h:.78,sill:1.13}
  ],

  leftOpenings:[],
  rightOpenings:[]
};
