import * as THREE from"three";
import{OrbitControls}from"three/addons/controls/OrbitControls.js";

const $=s=>document.querySelector(s);

/* =========================================================
   SITE SETTINGS
========================================================= */

const GRID_SIZE=40;
const CELL_SIZE=1;
const HEIGHT_STEP=.5;

const MATERIALS={
  grass:{
    label:"잔디",
    color:0x7fa66d
  },
  road:{
    label:"차도",
    color:0x62696c
  },
  sidewalk:{
    label:"보도",
    color:0xc6c2b6
  },
  plaza:{
    label:"광장",
    color:0xd8ccb8
  },
  flower:{
    label:"화단",
    color:0x789863
  },
  water:{
    label:"물",
    color:0x6ea6b5
  }
};

const TOOL_LABELS={
  raise:"높이 +0.5m",
  lower:"높이 -0.5m",
  flatten:"지정 높이",
  smooth:"주변 평균"
};

/* =========================================================
   DATA
========================================================= */

const cells=[];

for(let z=0;z<GRID_SIZE;z++){

  const row=[];

  for(let x=0;x<GRID_SIZE;x++){

    row.push({
      height:0,
      material:"grass"
    });

  }

  cells.push(row);
}

/* =========================================================
   STATE
========================================================= */

let currentTool="raise";
let currentMaterial="grass";
let editEnabled=true;
let painting=false;
let lastPaintKey="";

const IS_MOBILE=
  matchMedia("(pointer:coarse)").matches||
  innerWidth<=820;

/* =========================================================
   THREE
========================================================= */

const scene=new THREE.Scene();

scene.background=
  new THREE.Color(0xcfdad5);

const camera=
  new THREE.PerspectiveCamera(
    45,
    innerWidth/innerHeight,
    .1,
    500
  );

camera.position.set(
  34,
  34,
  34
);

const renderer=
  new THREE.WebGLRenderer({
    antialias:!IS_MOBILE,
    powerPreference:
      IS_MOBILE
        ?"low-power"
        :"default"
  });

renderer.setPixelRatio(
  IS_MOBILE
    ?1
    :Math.min(
        devicePixelRatio,
        1.5
      )
);

renderer.setSize(
  innerWidth,
  innerHeight
);

renderer.outputColorSpace=
  THREE.SRGBColorSpace;

view.appendChild(
  renderer.domElement
);

scene.add(
  new THREE.HemisphereLight(
    0xffffff,
    0x78847c,
    2.2
  )
);

const sun=
  new THREE.DirectionalLight(
    0xffffff,
    2
  );

sun.position.set(
  -25,
  45,
  20
);

scene.add(sun);

/* =========================================================
   EVENT DRIVEN RENDER
========================================================= */

let renderRequested=false;

function requestRender(){

  if(renderRequested){
    return;
  }

  renderRequested=true;

  requestAnimationFrame(
    ()=>{
      renderRequested=false;

      renderer.render(
        scene,
        camera
      );
    }
  );
}

/* =========================================================
   CONTROLS
========================================================= */

const controls=
  new OrbitControls(
    camera,
    renderer.domElement
  );

controls.enableDamping=false;

controls.target.set(
  0,
  0,
  0
);

controls.maxPolarAngle=
  Math.PI/2.02;

controls.addEventListener(
  "change",
  requestRender
);

/* =========================================================
   INSTANCED TERRAIN
========================================================= */

const geometry=
  new THREE.BoxGeometry(
    CELL_SIZE*.97,
    1,
    CELL_SIZE*.97
  );

const material=
  new THREE.MeshStandardMaterial({
    roughness:.88,
    metalness:0
  });

const terrain=
  new THREE.InstancedMesh(
    geometry,
    material,
    GRID_SIZE*GRID_SIZE
  );

terrain.instanceMatrix
  .setUsage(
    THREE.DynamicDrawUsage
  );

terrain.name="SITE_TERRAIN";

scene.add(terrain);

const dummy=
  new THREE.Object3D();

function instanceId(x,z){

  return(
    z*
    GRID_SIZE+
    x
  );
}

function cellWorldX(x){

  return(
    x-
    GRID_SIZE/2+
    .5
  )*
  CELL_SIZE;
}

function cellWorldZ(z){

  return(
    z-
    GRID_SIZE/2+
    .5
  )*
  CELL_SIZE;
}

function updateCell(
  x,
  z
){

  if(
    x<0||
    z<0||
    x>=GRID_SIZE||
    z>=GRID_SIZE
  ){
    return;
  }

  const cell=
    cells[z][x];

  /*
    최소 시각 두께를 남긴다.
    지표면 0m도 얇은 판처럼 표시.
  */

  const visibleHeight=
    Math.max(
      .08,
      cell.height+.08
    );

  dummy.position.set(
    cellWorldX(x),
    cell.height/2-.04,
    cellWorldZ(z)
  );

  dummy.scale.set(
    1,
    visibleHeight,
    1
  );

  dummy.rotation.set(
    0,
    0,
    0
  );

  dummy.updateMatrix();

  const id=
    instanceId(
      x,
      z
    );

  terrain.setMatrixAt(
    id,
    dummy.matrix
  );

  terrain.setColorAt(
    id,
    new THREE.Color(
      MATERIALS[
        cell.material
      ].color
    )
  );
}

function updateAllTerrain(){

  for(
    let z=0;
    z<GRID_SIZE;
    z++
  ){

    for(
      let x=0;
      x<GRID_SIZE;
      x++
    ){

      updateCell(
        x,
        z
      );

    }

  }

  terrain.instanceMatrix
    .needsUpdate=true;

  if(
    terrain.instanceColor
  ){
    terrain.instanceColor
      .needsUpdate=true;
  }

  requestRender();
}

updateAllTerrain();

/* =========================================================
   GRID HELPER
========================================================= */

const grid=
  new THREE.GridHelper(
    GRID_SIZE,
    GRID_SIZE,
    0x667a72,
    0xa6b4ae
  );

grid.position.y=.045;

scene.add(grid);

/* =========================================================
   HOVER CELL
========================================================= */

const hoverBox=
  new THREE.Mesh(
    new THREE.BoxGeometry(
      .98,
      .04,
      .98
    ),
    new THREE.MeshBasicMaterial({
      color:0xffffff,
      transparent:true,
      opacity:.5,
      depthWrite:false
    })
  );

hoverBox.visible=false;

scene.add(hoverBox);

/* =========================================================
   RAYCAST
========================================================= */

const raycaster=
  new THREE.Raycaster();

const pointer=
  new THREE.Vector2();

function getCellFromPointer(e){

  const rect=
    renderer.domElement
      .getBoundingClientRect();

  pointer.x=
    (
      (
        e.clientX-
        rect.left
      )/
      rect.width
    )*2-1;

  pointer.y=
    -(
      (
        e.clientY-
        rect.top
      )/
      rect.height
    )*2+1;

  raycaster.setFromCamera(
    pointer,
    camera
  );

  const hits=
    raycaster
      .intersectObject(
        terrain,
        false
      );

  if(
    !hits.length||
    hits[0].instanceId==null
  ){
    return null;
  }

  const id=
    hits[0].instanceId;

  const z=
    Math.floor(
      id/
      GRID_SIZE
    );

  const x=
    id%
    GRID_SIZE;

  return{
    x,
    z,
    cell:cells[z][x]
  };
}

/* =========================================================
   BRUSH
========================================================= */

function getBrushCells(
  cx,
  cz
){

  const size=
    Number(
      $("#brushSize").value
    )||1;

  const radius=
    Math.floor(
      size/2
    );

  const result=[];

  for(
    let dz=-radius;
    dz<=radius;
    dz++
  ){

    for(
      let dx=-radius;
      dx<=radius;
      dx++
    ){

      const x=
        cx+dx;

      const z=
        cz+dz;

      if(
        x>=0&&
        z>=0&&
        x<GRID_SIZE&&
        z<GRID_SIZE
      ){

        result.push({
          x,
          z
        });

      }

    }

  }

  return result;
}

/* =========================================================
   EDIT
========================================================= */

function snapHeight(v){

  return(
    Math.round(
      v/
      HEIGHT_STEP
    )*
    HEIGHT_STEP
  );
}

function editCells(
  cx,
  cz
){

  const key=
    `${cx}:${cz}:${$("#editMode").value}:${currentTool}:${currentMaterial}`;

  if(
    painting&&
    key===lastPaintKey
  ){
    return;
  }

  lastPaintKey=key;

  const brush=
    getBrushCells(
      cx,
      cz
    );

  const mode=
    $("#editMode").value;

  if(
    mode==="material"
  ){

    brush.forEach(
      p=>{
        cells[p.z][p.x]
          .material=
            currentMaterial;
      }
    );

  }
  else{

    if(
      currentTool==="raise"
    ){

      brush.forEach(
        p=>{
          cells[p.z][p.x]
            .height=
              snapHeight(
                cells[p.z][p.x]
                  .height+
                HEIGHT_STEP
              );
        }
      );

    }

    else if(
      currentTool==="lower"
    ){

      brush.forEach(
        p=>{
          cells[p.z][p.x]
            .height=
              Math.max(
                0,
                snapHeight(
                  cells[p.z][p.x]
                    .height-
                  HEIGHT_STEP
                )
              );
        }
      );

    }

    else if(
      currentTool==="flatten"
    ){

      const h=
        Math.max(
          0,
          snapHeight(
            Number(
              $("#flattenHeight").value
            )||0
          )
        );

      brush.forEach(
        p=>{
          cells[p.z][p.x]
            .height=h;
        }
      );

    }

    else if(
      currentTool==="smooth"
    ){

      const source=
        brush.map(
          p=>({
            ...p,
            height:
              averageAround(
                p.x,
                p.z
              )
          })
        );

      source.forEach(
        p=>{
          cells[p.z][p.x]
            .height=
              snapHeight(
                p.height
              );
        }
      );

    }

  }

  brush.forEach(
    p=>
      updateCell(
        p.x,
        p.z
      )
  );

  terrain.instanceMatrix
    .needsUpdate=true;

  if(
    terrain.instanceColor
  ){
    terrain.instanceColor
      .needsUpdate=true;
  }

  updateHover(
    cx,
    cz
  );

  requestRender();
}

function averageAround(
  cx,
  cz
){

  let total=0;
  let count=0;

  for(
    let dz=-1;
    dz<=1;
    dz++
  ){

    for(
      let dx=-1;
      dx<=1;
      dx++
    ){

      const x=
        cx+dx;

      const z=
        cz+dz;

      if(
        x>=0&&
        z>=0&&
        x<GRID_SIZE&&
        z<GRID_SIZE
      ){

        total+=
          cells[z][x]
            .height;

        count++;

      }

    }

  }

  return(
    count
      ?total/count
      :0
  );
}

/* =========================================================
   HOVER
========================================================= */

function updateHover(
  x,
  z
){

  const cell=
    cells[z][x];

  hoverBox.visible=true;

  hoverBox.position.set(
    cellWorldX(x),
    cell.height+.07,
    cellWorldZ(z)
  );

  $("#statusX").textContent=x;
  $("#statusZ").textContent=z;

  $("#statusHeight")
    .textContent=
      `${cell.height.toFixed(1)}m`;

  $("#statusMaterial")
    .textContent=
      MATERIALS[
        cell.material
      ].label;

  $("#hoverLabel")
    .textContent=
      `${x}, ${z}`;

  requestRender();
}

/* =========================================================
   POINTER EDITING
========================================================= */

renderer.domElement
  .addEventListener(
    "pointerdown",
    e=>{

      if(!editEnabled){
        return;
      }

      const hit=
        getCellFromPointer(e);

      if(!hit){
        return;
      }

      e.preventDefault();

      painting=true;
      lastPaintKey="";

      try{
        renderer.domElement
          .setPointerCapture(
            e.pointerId
          );
      }
      catch{}

      editCells(
        hit.x,
        hit.z
      );

    }
  );

renderer.domElement
  .addEventListener(
    "pointermove",
    e=>{

      const hit=
        getCellFromPointer(e);

      if(hit){

        updateHover(
          hit.x,
          hit.z
        );

      }

      if(
        painting&&
        editEnabled&&
        hit
      ){

        editCells(
          hit.x,
          hit.z
        );

      }

    }
  );

function stopPainting(){

  painting=false;
  lastPaintKey="";
}

renderer.domElement
  .addEventListener(
    "pointerup",
    stopPainting
  );

renderer.domElement
  .addEventListener(
    "pointercancel",
    stopPainting
  );

/* =========================================================
   TOOL BUTTONS
========================================================= */

document
  .querySelectorAll(
    "[data-tool]"
  )
  .forEach(
    btn=>{

      btn.onclick=()=>{

        document
          .querySelectorAll(
            "[data-tool]"
          )
          .forEach(
            b=>
              b.classList
                .remove(
                  "active"
                )
          );

        btn.classList
          .add(
            "active"
          );

        currentTool=
          btn.dataset.tool;

        $("#currentToolLabel")
          .textContent=
            TOOL_LABELS[
              currentTool
            ];

      };

    }
  );

/* =========================================================
   MATERIAL BUTTONS
========================================================= */

document
  .querySelectorAll(
    "[data-material]"
  )
  .forEach(
    btn=>{

      btn.onclick=()=>{

        document
          .querySelectorAll(
            "[data-material]"
          )
          .forEach(
            b=>
              b.classList
                .remove(
                  "active"
                )
          );

        btn.classList
          .add(
            "active"
          );

        currentMaterial=
          btn.dataset.material;

        $("#currentMaterialLabel")
          .textContent=
            MATERIALS[
              currentMaterial
            ].label;

        $("#editMode").value=
          "material";

      };

    }
  );

/* =========================================================
   EDIT TOGGLE
========================================================= */

function updateEditMode(){

  controls.enabled=
    !editEnabled;

  $("#editToggleBtn")
    .textContent=
      editEnabled
        ?"편집 ON"
        :"편집 OFF";

  $("#editToggleBtn")
    .classList
    .toggle(
      "active",
      editEnabled
    );

  requestRender();
}

$("#editToggleBtn")
  .onclick=()=>{

    editEnabled=
      !editEnabled;

    updateEditMode();

  };

updateEditMode();

/* =========================================================
   CAMERA VIEWS
========================================================= */

function view3D(){

  camera.up.set(
    0,
    1,
    0
  );

  camera.position.set(
    34,
    34,
    34
  );

  controls.target.set(
    0,
    0,
    0
  );

  controls.update();

  requestRender();
}

function viewTop(){

  camera.up.set(
    0,
    0,
    -1
  );

  camera.position.set(
    0,
    55,
    .01
  );

  controls.target.set(
    0,
    0,
    0
  );

  controls.update();

  requestRender();
}

$("#view3dBtn").onclick=
  view3D;

$("#topBtn").onclick=
  viewTop;

/* =========================================================
   JSON SAVE
========================================================= */

function serialize(){

  return{
    format:
      "HAUSTORY_SITE_TERRAIN",

    version:1,

    gridSize:
      GRID_SIZE,

    cellSize:
      CELL_SIZE,

    heightStep:
      HEIGHT_STEP,

    savedAt:
      new Date()
        .toISOString(),

    cells:
      cells.map(
        row=>
          row.map(
            cell=>({
              height:
                cell.height,

              material:
                cell.material
            })
          )
      )
  };
}

function saveJSON(){

  const data=
    JSON.stringify(
      serialize(),
      null,
      2
    );

  const blob=
    new Blob(
      [data],
      {
        type:
          "application/json"
      }
    );

  const url=
    URL.createObjectURL(
      blob
    );

  const a=
    document.createElement(
      "a"
    );

  a.href=url;
  a.download=
    "terrain.json";

  document.body
    .appendChild(a);

  a.click();
  a.remove();

  setTimeout(
    ()=>
      URL.revokeObjectURL(
        url
      ),
    1000
  );
}

$("#saveBtn")
  .onclick=
    saveJSON;

/* =========================================================
   JSON LOAD
========================================================= */

$("#loadBtn")
  .onclick=
    ()=>{
      $("#jsonFile")
        .click();
    };

$("#jsonFile")
  .addEventListener(
    "change",
    async()=>{

      const file=
        $("#jsonFile")
          .files?.[0];

      if(!file){
        return;
      }

      try{

        const json=
          JSON.parse(
            await file.text()
          );

        if(
          json.format!==
          "HAUSTORY_SITE_TERRAIN"
        ){
          throw new Error(
            "SITE BUILDER JSON 형식이 아닙니다."
          );
        }

        if(
          !Array.isArray(
            json.cells
          )
        ){
          throw new Error(
            "cells 데이터가 없습니다."
          );
        }

        for(
          let z=0;
          z<GRID_SIZE;
          z++
        ){

          for(
            let x=0;
            x<GRID_SIZE;
            x++
          ){

            const source=
              json.cells?.[z]?.[x];

            if(!source){
              continue;
            }

            cells[z][x]
              .height=
                Math.max(
                  0,
                  Number(
                    source.height
                  )||0
                );

            cells[z][x]
              .material=
                MATERIALS[
                  source.material
                ]
                  ?source.material
                  :"grass";

          }

        }

        updateAllTerrain();

        alert(
          "지형 데이터를 불러왔습니다."
        );

      }
      catch(e){

        console.error(e);

        alert(
          "JSON을 불러오지 못했습니다.\n\n"+
          e.message
        );

      }

      $("#jsonFile").value="";

    }
  );

/* =========================================================
   RESET
========================================================= */

$("#flatAllBtn")
  .onclick=()=>{

    if(
      !confirm(
        "모든 지형 높이를 0m로 만들까요?\n재질은 유지됩니다."
      )
    ){
      return;
    }

    cells.forEach(
      row=>
        row.forEach(
          cell=>{
            cell.height=0;
          }
        )
    );

    updateAllTerrain();

  };

$("#resetBtn")
  .onclick=()=>{

    if(
      !confirm(
        "전체 지형을 초기 상태로 되돌릴까요?"
      )
    ){
      return;
    }

    cells.forEach(
      row=>
        row.forEach(
          cell=>{
            cell.height=0;
            cell.material="grass";
          }
        )
    );

    updateAllTerrain();

  };

/* =========================================================
   DOUBLE TAP ZOOM BLOCK
========================================================= */

document.addEventListener(
  "dblclick",
  e=>e.preventDefault(),
  {
    passive:false
  }
);

let lastTouchEnd=0;

document.addEventListener(
  "touchend",
  e=>{

    const now=
      Date.now();

    if(
      now-
      lastTouchEnd<
      300
    ){
      e.preventDefault();
    }

    lastTouchEnd=now;

  },
  {
    passive:false
  }
);

/* =========================================================
   RESIZE
========================================================= */

addEventListener(
  "resize",
  ()=>{

    camera.aspect=
      innerWidth/
      innerHeight;

    camera
      .updateProjectionMatrix();

    renderer.setPixelRatio(
      IS_MOBILE
        ?1
        :Math.min(
            devicePixelRatio,
            1.5
          )
    );

    renderer.setSize(
      innerWidth,
      innerHeight
    );

    requestRender();

  }
);

/* =========================================================
   START
========================================================= */

controls.update();

requestRender();