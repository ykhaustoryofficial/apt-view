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

  /*
    D형 외곽

    - 좌측 후면 = 2단 계단
    - 중앙 = 가장 깊은 기준 후면
    - 우측 = 깊이가 짧아서 크게 앞으로 들어옴

    offset이 클수록 FRONT 방향으로 들어옴.
  */
  rearProfile:[
    {xMin:-4.70,xMax:-3.35,offset:.80},
    {xMin:-3.35,xMax:-2.15,offset:.38},
    {xMin:-2.15,xMax:2.35,offset:0},
    {xMin:2.35,xMax:4.70,offset:1.75}
  ],

  // REAR를 외부에서 바라볼 때: 주방창 → 다용도실창 → 루버
  rearOpenings:[
    {id:"R01",name:"kitchenWindow",type:"kitchenWindow",x:2.75,w:.72,h:.56,sill:1.24},
    {id:"R02",name:"utilityRoomWindow",type:"window",x:1.25,w:.72,h:.78,sill:1.13},
    {id:"R03",name:"outdoorUnitLouver",type:"louver",x:-2.75,w:.72,h:1.45,sill:.68}
  ],

  // 좌우 측면 개구부 없음
  leftOpenings:[],
  rightOpenings:[]
};
