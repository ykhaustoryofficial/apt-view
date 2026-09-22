import * as THREE from"three";
import{OrbitControls}from"three/addons/controls/OrbitControls.js";
import{BuildingLayoutBuilder}from"./builders/building-layout-builder.js";
import{UNIT_TYPES}from"./builders/unit-catalog.js";

const $=s=>document.querySelector(s),view=$("#view"),typeEl=$("#type"),frontEl=$("#front"),mirrorEl=$("#mirror"),pilotiEl=$("#piloti"),topFloorEl=$("#topFloor"),xEl=$("#x"),zEl=$("#z"),selectedLabel=$("#selectedLabel"),listEl=$("#lineList"),targetEl=$("#attachTarget"),codeEl=$("#exportCode"),statsEl=$("#stats");
UNIT_TYPES.forEach(t=>typeEl.insertAdjacentHTML("beforeend",`<option value="${t}">${t}형</option>`));

const scene=new THREE.Scene();scene.background=new THREE.Color(0xdfe8e5);
const camera=new THREE.PerspectiveCamera(42,innerWidth/innerHeight,.1,500);camera.position.set(28,24,34);
const renderer=new THREE.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setSize(innerWidth,innerHeight);renderer.outputColorSpace=THREE.SRGBColorSpace;view.appendChild(renderer.domElement);
const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.08;controls.target.set(0,8,0);controls.maxPolarAngle=Math.PI/2.02;
scene.add(new THREE.HemisphereLight(0xffffff,0x9aa49f,2.2));const sun=new THREE.DirectionalLight(0xffffff,2.2);sun.position.set(-18,35,22);scene.add(sun);
const grid=new THREE.GridHelper(100,100,0x8d9994,0xb7c1bd);scene.add(grid);
const ground=new THREE.Mesh(new THREE.PlaneGeometry(100,100),new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}));ground.rotation.x=-Math.PI/2;ground.userData.ground=true;scene.add(ground);
const builder=new BuildingLayoutBuilder(scene);
let selectedId=null,counter=1,selectionHelper=null;

function nextId(){let id;do{id=`L${String(counter++).padStart(2,"0")}`;}while(builder.get(id));return id;}
function readForm(id=selectedId??nextId()){return{id,type:typeEl.value,mirror:mirrorEl.checked,front:frontEl.value,startFloor:pilotiEl.checked?2:1,topFloor:Number(topFloorEl.value)||25,x:Number(xEl.value)||0,z:Number(zEl.value)||0};}
function writeForm(d){if(!d)return;typeEl.value=d.type;frontEl.value=d.front;mirrorEl.checked=d.mirror;pilotiEl.checked=d.startFloor>1;topFloorEl.value=d.topFloor;xEl.value=d.x;zEl.value=d.z;}
function setSelected(id){selectedId=builder.get(id)?id:null;selectedLabel.textContent=selectedId??"선택 없음";if(selectionHelper){scene.remove(selectionHelper);selectionHelper.geometry?.dispose?.();selectionHelper.material?.dispose?.();selectionHelper=null;}if(selectedId){writeForm(builder.get(selectedId));selectionHelper=new THREE.BoxHelper(builder.getRoot(selectedId),0xf2a900);scene.add(selectionHelper);}renderUI();}
function refreshHelper(){selectionHelper?.update();}
function renderUI(){
  const all=builder.getAll();listEl.innerHTML=all.length?all.map(d=>`<button class="line-item ${d.id===selectedId?"active":""}" data-id="${d.id}"><b>${d.id} · ${d.type}형${d.mirror?" ↔":""}</b><span>${d.front} · ${d.startFloor}~${d.topFloor}F · X ${d.x.toFixed(2)} / Z ${d.z.toFixed(2)}</span></button>`).join(""):`<div class="empty">아직 배치된 유닛 라인이 없습니다.</div>`;
  listEl.querySelectorAll("[data-id]").forEach(el=>el.onclick=()=>setSelected(el.dataset.id));
  targetEl.innerHTML='<option value="">붙일 대상 선택</option>'+all.filter(d=>d.id!==selectedId).map(d=>`<option value="${d.id}">${d.id} · ${d.type}형</option>`).join("");
  const units=all.reduce((n,d)=>n+(d.topFloor-d.startFloor+1),0),maxF=all.reduce((m,d)=>Math.max(m,d.topFloor),0);statsEl.textContent=`라인 ${all.length} · 세대모듈 ${units} · 최고 ${maxF||0}F`;
  codeEl.value=builder.toModuleCode("BUILDING_LAYOUT");saveLocal();
}
function saveLocal(){localStorage.setItem("apt-building-bundle-v1",JSON.stringify(builder.serialize()));}
function loadLocal(){try{const rows=JSON.parse(localStorage.getItem("apt-building-bundle-v1")||"[]");if(Array.isArray(rows))rows.forEach(r=>builder.add(r));if(rows.length){counter=Math.max(...rows.map(r=>Number(String(r.id).replace(/\D/g,""))||0))+1;setSelected(rows[0].id);}else renderUI();}catch(e){console.warn(e);renderUI();}}
function fitView(top=false){const box=new THREE.Box3().setFromObject(builder.root);if(box.isEmpty()){controls.target.set(0,5,0);camera.position.set(28,24,34);return;}const c=new THREE.Vector3(),s=new THREE.Vector3();box.getCenter(c);box.getSize(s);controls.target.copy(c);camera.up.set(0,1,0);if(top){camera.up.set(0,0,-1);camera.position.set(c.x,c.y+Math.max(35,s.x,s.z)*1.6,c.z+.01);}else{const d=Math.max(18,s.x,s.y,s.z)*1.25;camera.position.set(c.x+d*.85,c.y+d*.62,c.z+d);}}
function applySelected(){if(!selectedId)return;const d=builder.update(selectedId,readForm(selectedId));setSelected(d.id);}
function nudge(dx,dz){if(!selectedId)return;const d=builder.nudge(selectedId,dx,dz);writeForm(d);refreshHelper();renderUI();}
function attach(side){if(!selectedId||!targetEl.value)return;const d=builder.attach(selectedId,targetEl.value,side,0);if(d){writeForm(d);refreshHelper();renderUI();}}

$("#addBtn").onclick=()=>{const id=nextId(),d=builder.add(readForm(id));setSelected(d.id);fitView(false);};
$("#applyBtn").onclick=applySelected;
$("#duplicateBtn").onclick=()=>{if(!selectedId)return;const src=builder.get(selectedId),d=builder.add({...src,id:nextId(),x:src.x+.5,z:src.z+.5});setSelected(d.id);};
$("#deleteBtn").onclick=()=>{if(!selectedId)return;const id=selectedId;setSelected(null);builder.remove(id);renderUI();};
$("#clearBtn").onclick=()=>{if(!confirm("현재 번들을 전부 비울까요?"))return;setSelected(null);builder.clear();counter=1;renderUI();};
$("#fitBtn").onclick=()=>fitView(false);$("#topBtn").onclick=()=>fitView(true);
$("#copyBtn").onclick=async()=>{codeEl.value=builder.toModuleCode("BUILDING_LAYOUT");try{await navigator.clipboard.writeText(codeEl.value);$("#copyBtn").textContent="복사됨";setTimeout(()=>$("#copyBtn").textContent="코드 복사",900);}catch{codeEl.select();document.execCommand("copy");}};
$("#nLeft").onclick=()=>nudge(-.1,0);$("#nRight").onclick=()=>nudge(.1,0);$("#nFront").onclick=()=>nudge(0,.1);$("#nRear").onclick=()=>nudge(0,-.1);
$("#attachLeft").onclick=()=>attach("left");$("#attachRight").onclick=()=>attach("right");$("#attachFront").onclick=()=>attach("front");$("#attachRear").onclick=()=>attach("rear");
[xEl,zEl,topFloorEl,typeEl,frontEl,mirrorEl,pilotiEl].forEach(el=>el.addEventListener("change",()=>{if(selectedId)applySelected();}));

const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();
renderer.domElement.addEventListener("pointerup",e=>{if(e.target!==renderer.domElement)return;const r=renderer.domElement.getBoundingClientRect();pointer.x=((e.clientX-r.left)/r.width)*2-1;pointer.y=-((e.clientY-r.top)/r.height)*2+1;raycaster.setFromCamera(pointer,camera);const hits=raycaster.intersectObjects(builder.root.children,true);const hit=hits.find(h=>h.object.userData.stackId);if(hit)setSelected(hit.object.userData.stackId);});

addEventListener("keydown",e=>{if(!selectedId||["INPUT","TEXTAREA","SELECT"].includes(document.activeElement?.tagName))return;const step=e.shiftKey?.5:.1;if(e.key==="ArrowLeft")nudge(-step,0);if(e.key==="ArrowRight")nudge(step,0);if(e.key==="ArrowUp")nudge(0,step);if(e.key==="ArrowDown")nudge(0,-step);});
addEventListener("resize",()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
function loop(){requestAnimationFrame(loop);controls.update();refreshHelper();renderer.render(scene,camera);}loadLocal();loop();
