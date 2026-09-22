import * as THREE from"three";
import{OrbitControls}from"three/addons/controls/OrbitControls.js";
import{BuildingLayoutBuilder}from"./builders/building-layout-builder.js";
import{UNIT_TYPES}from"./builders/unit-catalog.js";

const $=s=>document.querySelector(s);

const view=$("#view");
const typeEl=$("#type");
const frontEl=$("#front");
const mirrorEl=$("#mirror");
const pilotiEl=$("#piloti");
const topFloorEl=$("#topFloor");
const xEl=$("#x");
const zEl=$("#z");
const selectedLabel=$("#selectedLabel");
const listEl=$("#lineList");
const targetEl=$("#attachTarget");
const codeEl=$("#exportCode");
const statsEl=$("#stats");
const jsonFile=$("#jsonFile");

UNIT_TYPES.forEach(t=>{
  typeEl.insertAdjacentHTML("beforeend",`<option value="${t}">${t}형</option>`);
});

/* =====================================================
   MOBILE / POWER
===================================================== */

const IS_MOBILE=
  matchMedia("(pointer:coarse)").matches||
  innerWidth<=820;

/* =====================================================
   THREE
===================================================== */

const scene=new THREE.Scene();
scene.background=new THREE.Color(0xdfe8e5);

const camera=new THREE.PerspectiveCamera(
  42,
  innerWidth/innerHeight,
  .1,
  500
);

camera.position.set(28,24,34);

const renderer=new THREE.WebGLRenderer({
  antialias:!IS_MOBILE,
  powerPreference:IS_MOBILE?"low-power":"default"
});

renderer.setPixelRatio(
  IS_MOBILE
    ?1
    :Math.min(devicePixelRatio,1.5)
);

renderer.setSize(innerWidth,innerHeight);
renderer.outputColorSpace=THREE.SRGBColorSpace;

view.appendChild(renderer.domElement);

/* =====================================================
   필요할 때만 렌더링
===================================================== */

let renderRequested=false;

function requestRender(){

  if(renderRequested)return;

  renderRequested=true;

  requestAnimationFrame(()=>{
    renderRequested=false;
    renderer.render(scene,camera);
  });
}

const controls=new OrbitControls(
  camera,
  renderer.domElement
);

/*
  damping을 끄면
  상시 animation loop가 필요 없다.
*/
controls.enableDamping=false;

controls.target.set(0,8,0);
controls.maxPolarAngle=Math.PI/2.02;

/*
  사용자가 카메라를 움직이는 동안만 렌더링
*/
controls.addEventListener(
  "change",
  requestRender
);

scene.add(
  new THREE.HemisphereLight(
    0xffffff,
    0x9aa49f,
    2.2
  )
);

const sun=new THREE.DirectionalLight(
  0xffffff,
  2.2
);

sun.position.set(-18,35,22);
scene.add(sun);

/* =====================================================
   GRID
===================================================== */

const grid=new THREE.GridHelper(
  100,
  100,
  0x8d9994,
  0xb7c1bd
);

scene.add(grid);

const ground=new THREE.Mesh(
  new THREE.PlaneGeometry(100,100),
  new THREE.MeshBasicMaterial({
    transparent:true,
    opacity:0,
    depthWrite:false
  })
);

ground.rotation.x=-Math.PI/2;
ground.userData.ground=true;

scene.add(ground);

/* =====================================================
   BUILDER
===================================================== */

const builder=new BuildingLayoutBuilder(scene);

let selectedId=null;
let counter=1;
let selectionHelper=null;

/* =====================================================
   ID
===================================================== */

function nextId(){

  let id;

  do{
    id=`L${String(counter++).padStart(2,"0")}`;
  }
  while(builder.get(id));

  return id;
}

function recalcCounter(){

  const rows=builder.getAll();

  if(!rows.length){
    counter=1;
    return;
  }

  counter=
    Math.max(
      ...rows.map(
        r=>
          Number(
            String(r.id)
              .replace(/\D/g,"")
          )||0
      )
    )+1;
}

/* =====================================================
   FORM
===================================================== */

function readForm(id=selectedId??nextId()){

  return{
    id,
    type:typeEl.value,
    mirror:mirrorEl.checked,
    front:frontEl.value,
    startFloor:pilotiEl.checked?2:1,
    topFloor:Number(topFloorEl.value)||25,
    x:Number(xEl.value)||0,
    z:Number(zEl.value)||0
  };
}

function writeForm(d){

  if(!d)return;

  typeEl.value=d.type;
  frontEl.value=d.front;
  mirrorEl.checked=d.mirror;
  pilotiEl.checked=d.startFloor>1;
  topFloorEl.value=d.topFloor;
  xEl.value=d.x;
  zEl.value=d.z;
}

/* =====================================================
   SELECTION
===================================================== */

function removeSelectionHelper(){

  if(!selectionHelper)return;

  scene.remove(selectionHelper);

  selectionHelper.geometry?.dispose?.();
  selectionHelper.material?.dispose?.();

  selectionHelper=null;
}

function setSelected(id){

  selectedId=
    builder.get(id)
      ?id
      :null;

  selectedLabel.textContent=
    selectedId??"선택 없음";

  removeSelectionHelper();

  if(selectedId){

    writeForm(
      builder.get(selectedId)
    );

    selectionHelper=
      new THREE.BoxHelper(
        builder.getRoot(selectedId),
        0xf2a900
      );

    scene.add(selectionHelper);
  }

  renderUI();
  requestRender();
}

function refreshHelper(){

  if(selectionHelper){
    selectionHelper.update();
  }
}

/* =====================================================
   UI
===================================================== */

function renderUI(){

  const all=builder.getAll();

  listEl.innerHTML=
    all.length

    ?all.map(d=>`
<button class="line-item ${d.id===selectedId?"active":""}" data-id="${d.id}">
<b>${d.id} · ${d.type}형${d.mirror?" ↔":""}</b>
<span>
${d.front} · ${d.startFloor}~${d.topFloor}F ·
X ${d.x.toFixed(2)} / Z ${d.z.toFixed(2)}
</span>
</button>
`).join("")

    :`<div class="empty">
아직 배치된 유닛 라인이 없습니다.
</div>`;

  listEl
    .querySelectorAll("[data-id]")
    .forEach(el=>{
      el.onclick=
        ()=>setSelected(
          el.dataset.id
        );
    });

  const targets=
    all.filter(
      d=>d.id!==selectedId
    );

  targetEl.innerHTML=
    targets.length

    ?`
<option value="">붙일 대상 선택</option>
${targets.map(d=>`
<option value="${d.id}">
${d.id} · ${d.type}형
</option>
`).join("")}
`

    :`
<option value="">
붙일 대상 없음
</option>
`;

  const units=
    all.reduce(
      (n,d)=>
        n+
        (
          d.topFloor-
          d.startFloor+
          1
        ),
      0
    );

  const maxF=
    all.reduce(
      (m,d)=>
        Math.max(
          m,
          d.topFloor
        ),
      0
    );

  statsEl.textContent=
    `라인 ${all.length} · 세대모듈 ${units} · 최고 ${maxF||0}F`;

  codeEl.value=
    builder.toModuleCode(
      "BUILDING_LAYOUT"
    );

  saveLocal();

  requestRender();
}

/* =====================================================
   LOCAL STORAGE
===================================================== */

function saveLocal(){

  localStorage.setItem(
    "apt-building-bundle-v1",
    JSON.stringify(
      builder.serialize()
    )
  );
}

function loadLocal(){

  try{

    const rows=
      JSON.parse(
        localStorage.getItem(
          "apt-building-bundle-v1"
        )||"[]"
      );

    if(Array.isArray(rows)){
      rows.forEach(
        r=>builder.add(r)
      );
    }

    recalcCounter();

    if(rows.length){
      setSelected(rows[0].id);
    }
    else{
      renderUI();
    }

  }
  catch(e){

    console.warn(e);
    renderUI();

  }
}

/* =====================================================
   CAMERA
===================================================== */

function fitView(top=false){

  const box=
    new THREE.Box3()
      .setFromObject(
        builder.root
      );

  if(box.isEmpty()){

    controls.target.set(0,5,0);
    camera.position.set(28,24,34);

    controls.update();
    requestRender();

    return;
  }

  const c=new THREE.Vector3();
  const s=new THREE.Vector3();

  box.getCenter(c);
  box.getSize(s);

  controls.target.copy(c);

  camera.up.set(0,1,0);

  if(top){

    camera.up.set(0,0,-1);

    camera.position.set(
      c.x,
      c.y+
      Math.max(
        35,
        s.x,
        s.z
      )*1.6,
      c.z+.01
    );

  }
  else{

    const d=
      Math.max(
        18,
        s.x,
        s.y,
        s.z
      )*1.25;

    camera.position.set(
      c.x+d*.85,
      c.y+d*.62,
      c.z+d
    );
  }

  controls.update();
  requestRender();
}

/* =====================================================
   APPLY
===================================================== */

function applySelected(){

  if(!selectedId)return;

  const d=
    builder.update(
      selectedId,
      readForm(selectedId)
    );

  setSelected(d.id);
}

/* =====================================================
   NUDGE
===================================================== */

function nudge(dx,dz){

  if(!selectedId)return;

  const d=
    builder.nudge(
      selectedId,
      dx,
      dz
    );

  writeForm(d);

  refreshHelper();
  renderUI();
  requestRender();
}

/* =====================================================
   버튼 길게 누르기
===================================================== */

function bindHoldNudge(
  selector,
  dx,
  dz
){

  const el=$(selector);

  let holdTimer=null;
  let repeatTimer=null;
  let active=false;

  function stop(){

    active=false;

    clearTimeout(holdTimer);
    clearInterval(repeatTimer);

    holdTimer=null;
    repeatTimer=null;
  }

  el.addEventListener(
    "pointerdown",
    e=>{

      if(!selectedId)return;

      e.preventDefault();

      stop();

      active=true;

      try{
        el.setPointerCapture(
          e.pointerId
        );
      }
      catch{}

      /*
        한 번 누르면 즉시 50cm
      */
      nudge(dx,dz);

      /*
        320ms 이상 누르면
        자동 연속 이동 시작
      */
      holdTimer=
        setTimeout(
          ()=>{

            if(!active)return;

            repeatTimer=
              setInterval(
                ()=>{
                  if(active){
                    nudge(dx,dz);
                  }
                },
                120
              );

          },
          320
        );
    }
  );

  [
    "pointerup",
    "pointercancel",
    "lostpointercapture"
  ]
  .forEach(eventName=>{

    el.addEventListener(
      eventName,
      stop
    );

  });

  el.addEventListener(
    "contextmenu",
    e=>e.preventDefault()
  );
}

/* =====================================================
   ATTACH
===================================================== */

function attach(side){

  if(
    !selectedId||
    !targetEl.value
  ){
    return;
  }

  const d=
    builder.attach(
      selectedId,
      targetEl.value,
      side,
      0
    );

  if(d){

    writeForm(d);

    refreshHelper();
    renderUI();
    requestRender();
  }
}

/* =====================================================
   JSON SAVE
===================================================== */

function makeJsonFileName(){

  const now=new Date();

  const pad=
    n=>String(n).padStart(2,"0");

  return(
    `building-layout-`+
    `${now.getFullYear()}`+
    `${pad(now.getMonth()+1)}`+
    `${pad(now.getDate())}-`+
    `${pad(now.getHours())}`+
    `${pad(now.getMinutes())}`+
    `.json`
  );
}

function saveJson(){

  const layout=
    builder.serialize();

  if(!layout.length){

    alert(
      "저장할 배치가 없습니다."
    );

    return;
  }

  const data={
    format:"HAUSTORY_BUILDING_LAYOUT",
    version:1,
    savedAt:new Date().toISOString(),
    floorHeight:2.85,
    layout
  };

  const blob=
    new Blob(
      [
        JSON.stringify(
          data,
          null,
          2
        )
      ],
      {
        type:"application/json"
      }
    );

  const url=
    URL.createObjectURL(blob);

  const a=
    document.createElement("a");

  a.href=url;
  a.download=makeJsonFileName();

  document.body.appendChild(a);

  a.click();
  a.remove();

  setTimeout(
    ()=>URL.revokeObjectURL(url),
    1000
  );
}

/* =====================================================
   JSON LOAD
===================================================== */

function validateLayout(rows){

  if(!Array.isArray(rows)){
    throw new Error(
      "layout 배열이 없습니다."
    );
  }

  return rows.map(
    (row,index)=>{

      if(
        !row||
        typeof row!=="object"
      ){
        throw new Error(
          `${index+1}번째 배치 데이터가 올바르지 않습니다.`
        );
      }

      const type=
        String(
          row.type??""
        ).toUpperCase();

      if(!UNIT_TYPES.includes(type)){
        throw new Error(
          `${index+1}번째 주택형 "${type}"을 사용할 수 없습니다.`
        );
      }

      const front=
        row.front??"+Z";

      if(
        ![
          "+Z",
          "+X",
          "-Z",
          "-X"
        ].includes(front)
      ){
        throw new Error(
          `${index+1}번째 FRONT 값이 올바르지 않습니다.`
        );
      }

      const startFloor=
        Math.max(
          1,
          Math.floor(
            Number(
              row.startFloor
            )||1
          )
        );

      const topFloor=
        Math.max(
          startFloor,
          Math.floor(
            Number(
              row.topFloor
            )||startFloor
          )
        );

      return{
        id:String(
          row.id??
          `L${String(index+1).padStart(2,"0")}`
        ),
        type,
        mirror:Boolean(row.mirror),
        front,
        startFloor,
        topFloor,
        x:Number(row.x)||0,
        z:Number(row.z)||0
      };
    }
  );
}

async function loadJson(file){

  if(!file)return;

  try{

    const text=
      await file.text();

    const parsed=
      JSON.parse(text);

    const rawRows=
      Array.isArray(parsed)
        ?parsed
        :parsed.layout;

    const rows=
      validateLayout(rawRows);

    if(
      !confirm(
        "현재 배치를 지우고 이 JSON 배치를 불러올까요?"
      )
    ){
      return;
    }

    setSelected(null);

    builder.clear();

    rows.forEach(
      row=>builder.add(row)
    );

    recalcCounter();

    if(rows.length){

      setSelected(rows[0].id);
      fitView(false);

    }
    else{

      renderUI();

    }

  }
  catch(e){

    console.error(e);

    alert(
      "JSON 파일을 불러오지 못했습니다.\n\n"+
      e.message
    );

  }
  finally{

    jsonFile.value="";

  }
}

/* =====================================================
   BUTTONS
===================================================== */

$("#addBtn").onclick=()=>{

  const id=
    nextId();

  const d=
    builder.add(
      readForm(id)
    );

  setSelected(d.id);
  fitView(false);
};

$("#applyBtn").onclick=
  applySelected;

$("#duplicateBtn").onclick=()=>{

  if(!selectedId)return;

  const src=
    builder.get(selectedId);

  const d=
    builder.add({
      ...src,
      id:nextId(),
      x:src.x+.5,
      z:src.z+.5
    });

  setSelected(d.id);
};

$("#deleteBtn").onclick=()=>{

  if(!selectedId)return;

  const id=selectedId;

  setSelected(null);

  builder.remove(id);

  renderUI();
};

$("#clearBtn").onclick=()=>{

  if(
    !confirm(
      "현재 번들을 전부 비울까요?"
    )
  ){
    return;
  }

  setSelected(null);

  builder.clear();

  counter=1;

  renderUI();
};

$("#fitBtn").onclick=
  ()=>fitView(false);

$("#topBtn").onclick=
  ()=>fitView(true);

/* =====================================================
   JSON BUTTONS
===================================================== */

$("#saveJsonBtn").onclick=
  saveJson;

$("#loadJsonBtn").onclick=
  ()=>jsonFile.click();

jsonFile.addEventListener(
  "change",
  ()=>{
    loadJson(
      jsonFile.files?.[0]
    );
  }
);

/* =====================================================
   COPY CODE
===================================================== */

$("#copyBtn").onclick=
  async()=>{

    codeEl.value=
      builder.toModuleCode(
        "BUILDING_LAYOUT"
      );

    try{

      await navigator
        .clipboard
        .writeText(
          codeEl.value
        );

      $("#copyBtn")
        .textContent=
          "복사됨";

      setTimeout(
        ()=>{
          $("#copyBtn")
            .textContent=
              "코드 복사";
        },
        900
      );

    }
    catch{

      codeEl.select();

      document.execCommand(
        "copy"
      );
    }
  };

/* =====================================================
   AXIS BUTTONS
   한 번 = 0.5m
   길게 = 0.5m 연속 이동
===================================================== */

bindHoldNudge(
  "#nLeft",
  -.5,
  0
);

bindHoldNudge(
  "#nRight",
  .5,
  0
);

bindHoldNudge(
  "#nFront",
  0,
  .5
);

bindHoldNudge(
  "#nRear",
  0,
  -.5
);

/* =====================================================
   ATTACH BUTTONS
===================================================== */

$("#attachLeft").onclick=
  ()=>attach("left");

$("#attachRight").onclick=
  ()=>attach("right");

$("#attachFront").onclick=
  ()=>attach("front");

$("#attachRear").onclick=
  ()=>attach("rear");

/* =====================================================
   FORM AUTO APPLY
===================================================== */

[
  xEl,
  zEl,
  topFloorEl,
  typeEl,
  frontEl,
  mirrorEl,
  pilotiEl
]
.forEach(
  el=>
    el.addEventListener(
      "change",
      ()=>{
        if(selectedId){
          applySelected();
        }
      }
    )
);

/* =====================================================
   3D PICK
===================================================== */

const raycaster=
  new THREE.Raycaster();

const pointer=
  new THREE.Vector2();

renderer.domElement
  .addEventListener(
    "pointerup",
    e=>{

      if(
        e.target!==
        renderer.domElement
      ){
        return;
      }

      const r=
        renderer.domElement
          .getBoundingClientRect();

      pointer.x=
        (
          (
            e.clientX-r.left
          )/
          r.width
        )*2-1;

      pointer.y=
        -(
          (
            e.clientY-r.top
          )/
          r.height
        )*2+1;

      raycaster.setFromCamera(
        pointer,
        camera
      );

      const hits=
        raycaster
          .intersectObjects(
            builder.root.children,
            true
          );

      const hit=
        hits.find(
          h=>
            h.object
              .userData
              .stackId
        );

      if(hit){

        setSelected(
          hit.object
            .userData
            .stackId
        );

      }
    }
  );

/* =====================================================
   KEYBOARD
===================================================== */

addEventListener(
  "keydown",
  e=>{

    if(
      !selectedId||
      [
        "INPUT",
        "TEXTAREA",
        "SELECT"
      ]
      .includes(
        document
          .activeElement
          ?.tagName
      )
    ){
      return;
    }

    const step=.5;

    if(e.key==="ArrowLeft"){
      e.preventDefault();
      nudge(-step,0);
    }

    if(e.key==="ArrowRight"){
      e.preventDefault();
      nudge(step,0);
    }

    if(e.key==="ArrowUp"){
      e.preventDefault();
      nudge(0,step);
    }

    if(e.key==="ArrowDown"){
      e.preventDefault();
      nudge(0,-step);
    }
  }
);

/* =====================================================
   DOUBLE TAP ZOOM 방지
===================================================== */

/*
  PC 더블클릭 기본 확대/선택 방지
*/
document.addEventListener(
  "dblclick",
  e=>{
    e.preventDefault();
  },
  {
    passive:false
  }
);

/*
  iPhone / 모바일 Safari의
  빠른 두 번 탭 확대 방지
*/
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

/* =====================================================
   RESIZE
===================================================== */

addEventListener(
  "resize",
  ()=>{

    camera.aspect=
      innerWidth/
      innerHeight;

    camera.updateProjectionMatrix();

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

/* =====================================================
   START
===================================================== */

loadLocal();

controls.update();

requestRender();
