import * as THREE from "three";
import {createUnitModel} from "../unit-model.js";

export function buildFloor(recipe,unitMap){
  const floor=new THREE.Group();
  floor.name=`BUILDING_${recipe.id}_TYPICAL_FLOOR`;

  recipe.units.forEach(item=>{
    const data=unitMap[item.type];
    if(!data)throw new Error(`Unknown UNIT type: ${item.type}`);

    const model=createUnitModel(data,{instanceId:item.instance});
    model.position.set(item.x,0,item.z);
    model.rotation.y=THREE.MathUtils.degToRad(item.rotation??0);

    model.userData.unitType=item.type;
    model.userData.instanceId=item.instance;

    floor.add(model);
  });

  return floor;
}
