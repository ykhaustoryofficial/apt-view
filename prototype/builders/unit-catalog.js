import{UNIT_A}from"../units/unit-a.js";
import{UNIT_B}from"../units/unit-b.js";
import{UNIT_C}from"../units/unit-c.js";
import{UNIT_D}from"../units/unit-d.js";
import{UNIT_E}from"../units/unit-e.js";
import{UNIT_F}from"../units/unit-f.js";

export const UNIT_CATALOG=Object.freeze({
  A:UNIT_A,
  B:UNIT_B,
  C:UNIT_C,
  D:UNIT_D,
  E:UNIT_E,
  F:UNIT_F
});

export const UNIT_TYPES=Object.freeze(
  Object.keys(UNIT_CATALOG)
);

export function getUnitData(type){
  const key=String(type??"").toUpperCase();
  const data=UNIT_CATALOG[key];

  if(!data){
    throw new Error(`Unknown unit type: ${type}`);
  }

  return data;
}
