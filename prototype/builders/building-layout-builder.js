import * as THREE from"three";
import{createUnitModel}from"../js/unit-model.js";
import{getUnitData}from"./unit-catalog.js";

export const FLOOR_HEIGHT=2.85;

export const FRONT_ROTATION=Object.freeze({
  "+Z":0,
  "+X":Math.PI/2,
  "-Z":Math.PI,
  "-X":-Math.PI/2
});

const round=(v,n=3)=>Number(Number(v).toFixed(n));

const clampFloor=v=>
  Math.max(1,Math.floor(Number(v)||1));

function normalize(raw={}){
  const type=String(raw.type??"A").toUpperCase();

  getUnitData(type);

  const startFloor=clampFloor(
    raw.startFloor??(raw.piloti?2:1)
  );

  const topFloor=Math.max(
    startFloor,
    clampFloor(raw.topFloor??25)
  );

  return{
    id:String(
      raw.id??`LINE_${Date.now()}`
    ),

    type,

    mirror:Boolean(raw.mirror),

    front:
      FRONT_ROTATION[raw.front]!=null
        ?raw.front
        :"+Z",

    startFloor,
    topFloor,

    x:Number(raw.x)||0,
    z:Number(raw.z)||0
  };
}

function disposeObject(root){

  const geometries=new Set();
  const materials=new Set();

  root.traverse(o=>{

    if(o.geometry){
      geometries.add(o.geometry);
    }

    if(Array.isArray(o.material)){
      o.material.forEach(
        m=>materials.add(m)
      );
    }
    else if(o.material){
      materials.add(o.material);
    }

  });

  geometries.forEach(
    g=>g.dispose?.()
  );

  materials.forEach(
    m=>m.dispose?.()
  );
}

function markStack(root,id,floor){

  root.userData.stackId=id;
  root.userData.floor=floor;

  root.traverse(o=>{

    o.userData.stackId=id;
    o.userData.floor=floor;

  });
}

export class BuildingLayoutBuilder{

  constructor(scene){

    this.scene=scene;

    this.root=new THREE.Group();

    this.root.name="BUILDING_LAYOUT";

    this.scene.add(this.root);

    this.items=new Map();
  }


  add(raw){

    const item=normalize(raw);

    if(this.items.has(item.id)){
      throw new Error(
        `Duplicate layout id: ${item.id}`
      );
    }

    const root=this.#createStack(item);

    this.items.set(
      item.id,
      {
        data:item,
        root
      }
    );

    this.root.add(root);

    return item;
  }


  update(id,patch={}){

    const old=this.items.get(id);

    if(!old){
      return null;
    }

    const next=normalize({
      ...old.data,
      ...patch,
      id
    });

    this.root.remove(old.root);

    disposeObject(old.root);

    const root=this.#createStack(next);

    this.items.set(
      id,
      {
        data:next,
        root
      }
    );

    this.root.add(root);

    return next;
  }


  remove(id){

    const old=this.items.get(id);

    if(!old){
      return false;
    }

    this.root.remove(old.root);

    disposeObject(old.root);

    this.items.delete(id);

    return true;
  }


  clear(){

    [...this.items.keys()]
      .forEach(
        id=>this.remove(id)
      );
  }


  get(id){

    return(
      this.items
        .get(id)
        ?.data
      ??null
    );
  }


  getRoot(id){

    return(
      this.items
        .get(id)
        ?.root
      ??null
    );
  }


  getAll(){

    return[
      ...this.items.values()
    ].map(
      v=>({...v.data})
    );
  }


  setPosition(id,x,z){

    const entry=this.items.get(id);

    if(!entry){
      return null;
    }

    entry.data.x=round(x);
    entry.data.z=round(z);

    entry.root.position.x=
      entry.data.x;

    entry.root.position.z=
      entry.data.z;

    return{
      ...entry.data
    };
  }


  nudge(id,dx,dz){

    const d=this.get(id);

    return d
      ?this.setPosition(
          id,
          d.x+dx,
          d.z+dz
        )
      :null;
  }


  getBox(id){

    const root=this.getRoot(id);

    if(!root){
      return null;
    }

    root.updateMatrixWorld(true);

    return new THREE.Box3()
      .setFromObject(root);
  }


  attach(
    movingId,
    targetId,
    side,
    gap=0
  ){

    if(movingId===targetId){
      return null;
    }

    const moving=
      this.items.get(movingId);

    const target=
      this.items.get(targetId);

    if(!moving||!target){
      return null;
    }

    let mb=
      this.getBox(movingId);

    let tb=
      this.getBox(targetId);

    const mc=
      new THREE.Vector3();

    const tc=
      new THREE.Vector3();

    mb.getCenter(mc);
    tb.getCenter(tc);


    /*
      LEFT / RIGHT

      먼저 Z 중앙 정렬 후
      X 방향으로 정확히 붙인다.
    */
    if(
      side==="left"||
      side==="right"
    ){

      this.setPosition(
        movingId,
        moving.data.x,
        moving.data.z+
          (tc.z-mc.z)
      );

      mb=this.getBox(movingId);
      tb=this.getBox(targetId);

      const dx=
        side==="right"

        ?(
          tb.max.x+
          gap-
          mb.min.x
        )

        :(
          tb.min.x-
          gap-
          mb.max.x
        );

      this.setPosition(
        movingId,
        moving.data.x+dx,
        moving.data.z
      );
    }


    /*
      FRONT / REAR

      먼저 X 중앙 정렬 후
      Z 방향으로 붙인다.
    */
    else if(
      side==="front"||
      side==="rear"
    ){

      this.setPosition(
        movingId,
        moving.data.x+
          (tc.x-mc.x),
        moving.data.z
      );

      mb=this.getBox(movingId);
      tb=this.getBox(targetId);

      const dz=
        side==="front"

        ?(
          tb.max.z+
          gap-
          mb.min.z
        )

        :(
          tb.min.z-
          gap-
          mb.max.z
        );

      this.setPosition(
        movingId,
        moving.data.x,
        moving.data.z+dz
      );
    }

    return this.get(movingId);
  }


  serialize(){

    return this.getAll()
      .map(
        d=>({
          ...d,
          x:round(d.x),
          z:round(d.z)
        })
      );
  }


  toModuleCode(
    name="BUILDING_LAYOUT"
  ){

    const rows=
      this.serialize()
        .map(
          d=>
`  {id:${JSON.stringify(d.id)},type:${JSON.stringify(d.type)},mirror:${d.mirror},front:${JSON.stringify(d.front)},startFloor:${d.startFloor},topFloor:${d.topFloor},x:${d.x},z:${d.z}}`
        );

    return(
`export const ${name}=[
${rows.join(",\n")}
];
`
    );
  }


  #createStack(item){

    const data=
      getUnitData(item.type);

    const root=
      new THREE.Group();

    root.name=item.id;

    root.userData={
      stackId:item.id,
      layoutItem:item
    };

    root.position.set(
      item.x,
      0,
      item.z
    );


    /*
      유닛 자체 크기는 절대 조정하지 않는다.

      createUnitModel()이 생성한
      A~F 원본 모델을 그대로 사용한다.
    */
    const template=
      createUnitModel(
        data,
        {
          instanceId:
            `${item.id}-BASE`
        }
      );


    /*
      FRONT 방향만 회전
    */
    template.rotation.y=
      FRONT_ROTATION[item.front];


    /*
      좌우 반전만 허용.

      크기 축소/확대가 아니라
      미러 처리다.
    */
    if(item.mirror){
      template.scale.x=-1;
    }


    /*
      층 적층

      1F = Y 0
      2F = Y 2.85
      3F = Y 5.70
      ...
    */
    for(
      let floor=item.startFloor;
      floor<=item.topFloor;
      floor++
    ){

      const unit=
        template.clone(true);

      unit.name=
        `${item.id}-${floor}F`;

      unit.position.y=
        (floor-1)*
        FLOOR_HEIGHT;

      markStack(
        unit,
        item.id,
        floor
      );

      root.add(unit);
    }

    return root;
  }
}
