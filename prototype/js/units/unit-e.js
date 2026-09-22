import{opening as O}from"../opening-presets.js";

export const UNIT_E={
  id:"055.9500E",
  code:"E",
  area:55.9500,

  size:{
    width:12.48,
    depth:8.45,
    floorHeight:2.85,
    wall:.18
  },

  frontProfile:[
    {
      xMin:-6.24,
      xMax:6.24,
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

  rearProfile:[

    {
      xMin:-6.24,
      xMax:-4.50,
      offset:3.05
    },

    {
      xMin:-4.50,
      xMax:-1.14,
      offset:.36
    },

    {
      xMin:-1.14,
      xMax:3.23,
      offset:0
    },

    {
      xMin:3.23,
      xMax:6.24,
      offset:.32
    }

  ],

  rearOpenings:[

    O("utilityRoomWindow",{
      id:"R01",
      name:"utilityRoomWindow",
      x:-1.95,
      w:.85
    }),

    O("kitchenWindow",{
      id:"R02",
      name:"kitchenWindow",
      x:1.85,
      w:.95
    }),

    O("outdoorUnitLouver",{
      id:"R03",
      name:"outdoorUnitLouver",
      x:4.00,
      w:1.00
    }),

    O("dressRoomWindow",{
      id:"R04",
      name:"dressRoomWindow",
      x:5.40,
      w:.85
    })

  ],

  leftOpenings:[],
  rightOpenings:[]
};