export const OPENING_PRESETS={
  smallRoomWindow:{
    type:"window",
    w:1.00,
    h:1.00,
    sill:1.07
  },

  masterRoomWindow:{
    type:"window",
    w:1.20,
    h:1.35,
    sill:.72
  },

  livingRoomWindow:{
    type:"largeWindow",
    w:2.15,
    h:1.45,
    sill:.62
  },

  kitchenWindow:{
    type:"kitchenWindow",
    w:.72,
    h:.56,
    sill:1.24
  },

  utilityRoomWindow:{
    type:"window",
    w:.72,
    h:.78,
    sill:1.13
  },

  dressRoomWindow:{
    type:"window",
    w:.82,
    h:.82,
    sill:1.15
  },

  outdoorUnitLouver:{
    type:"louver",
    w:.72,
    h:1.45,
    sill:.68
  }
};

export function opening(preset,options={}){
  const base=OPENING_PRESETS[preset];

  if(!base){
    throw new Error(
      `Unknown opening preset: ${preset}`
    );
  }

  return{
    ...base,
    preset,
    ...options
  };
}
