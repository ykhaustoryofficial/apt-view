import * as THREE from "three";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";

export function createUnitViewer(data){
  const {width,depth,floorHeight:H,wall:T}=data.size;
  const front=data.frontOpenings??[],rear=data.rearOpenings??[],left=data.leftOpenings??[],right=data.rightOpenings??[];
  const baseRearZ=-depth/2,baseFrontZ=depth/2,baseLeftX=-width/2,baseRightX=width/2;
  const frontProfile=(data.frontProfile??[{xMin:baseLeftX,xMax:baseRightX,offset:0}]).slice().sort((a,b)=>a.xMin-b.xMin);
  const rearProfile=(data.rearProfile??[{xMin:baseLeftX,xMax:baseRightX,offset:0}]).slice().sort((a,b)=>a.xMin-b.xMin);
  const leftInset=data.leftRearInset??null;

  const offsetAt=(profile,x)=>(profile.find(p=>x>=p.xMin&&x<=p.xMax)?.offset??0);
  const frontZAt=x=>baseFrontZ+offsetAt(frontProfile,x);
  const rearZAt=x=>baseRearZ+offsetAt(rearProfile,x);

  const scene=new THREE.Scene(); scene.background=new THREE.Color(0xdce9ed);
  const camera=new THREE.PerspectiveCamera(38,innerWidth/innerHeight,.1,100); camera.position.set(10,8,13);
  const renderer=new THREE.WebGLRenderer({antialias:true}); renderer.setPixelRatio(Math.min(devicePixelRatio,2)); renderer.setSize(innerWidth,innerHeight); renderer.shadowMap.enabled=true; renderer.outputColorSpace=THREE.SRGBColorSpace;
  document.getElementById("view").appendChild(renderer.domElement);

  const controls=new OrbitControls(camera,renderer.domElement); controls.enableDamping=true; controls.dampingFactor=.07; controls.target.set(0,1.2,0); controls.minDistance=7; controls.maxDistance=30; controls.maxPolarAngle=Math.PI/2.02;

  scene.add(new THREE.HemisphereLight(0xf4f9ff,0xb7b9b5,2.1));
  const sun=new THREE.DirectionalLight(0xffffff,2.6); sun.position.set(-8,12,10); sun.castShadow=true; scene.add(sun);

  const wallMat=new THREE.MeshStandardMaterial({color:0xe9ece9,roughness:.72});
  const slabMat=new THREE.MeshStandardMaterial({color:0xcfd4d2,roughness:.82});
  const glassMat=new THREE.MeshStandardMaterial({color:0x6b8798,roughness:.18,metalness:.08});
  const frameMat=new THREE.MeshStandardMaterial({color:0xe8ecec,roughness:.42});
  const louverMat=new THREE.MeshStandardMaterial({color:0x7f8a90,roughness:.66,metalness:.35});
  const darkMat=new THREE.MeshStandardMaterial({color:0x505c62,roughness:.95});

  const unit=new THREE.Group(); unit.name=`UNIT_${data.code}`; scene.add(unit);

  function box(w,h,d,mat,x,y,z){
    const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);
    m.position.set(x,y,z); m.castShadow=true; m.receiveShadow=true; unit.add(m); return m;
  }

  /* 실제 외곽형상대로 바닥 생성 */
  function makeBoundary(){
    const pts=[];
    frontProfile.forEach((p,i)=>{
      const z=baseFrontZ+(p.offset??0);
      if(!i)pts.push([p.xMin,z]);
      pts.push([p.xMax,z]);
      if(i<frontProfile.length-1){
        const nz=baseFrontZ+(frontProfile[i+1].offset??0);
        if(Math.abs(nz-z)>.001)pts.push([p.xMax,nz]);
      }
    });

    const rightRearZ=rearZAt(baseRightX-.001);
    if(Math.abs(pts.at(-1)[1]-rightRearZ)>.001)pts.push([baseRightX,rightRearZ]);

    const rearLeftX=leftInset?baseLeftX+leftInset.offset:baseLeftX;
    [...rearProfile].reverse().forEach((p,i,arr)=>{
      const xMax=Math.min(p.xMax,baseRightX),xMin=Math.max(p.xMin,rearLeftX);
      if(xMax<=xMin)return;
      const z=baseRearZ+(p.offset??0);
      if(!i&&Math.abs(pts.at(-1)[0]-xMax)>.001)pts.push([xMax,z]);
      pts.push([xMin,z]);
      const next=arr[i+1];
      if(next&&xMin>rearLeftX){
        const nz=baseRearZ+(next.offset??0);
        if(Math.abs(nz-z)>.001)pts.push([xMin,nz]);
      }
    });

    const frontLeftZ=frontZAt(baseLeftX+.001);
    if(leftInset){
      pts.push([rearLeftX,leftInset.untilZ]);
      pts.push([baseLeftX,leftInset.untilZ]);
      pts.push([baseLeftX,frontLeftZ]);
    }else{
      pts.push([baseLeftX,frontLeftZ]);
    }
    return pts;
  }

  const boundary=makeBoundary();
  const shape=new THREE.Shape();
  shape.moveTo(boundary[0][0],-boundary[0][1]);
  for(let i=1;i<boundary.length;i++)shape.lineTo(boundary[i][0],-boundary[i][1]);
  shape.closePath();

  const floor=new THREE.Mesh(new THREE.ExtrudeGeometry(shape,{depth:.12,bevelEnabled:false}),slabMat);
  floor.rotation.x=-Math.PI/2; floor.castShadow=true; floor.receiveShadow=true; unit.add(floor);

  function frontRearWindow(o,z,isFront){
    const f=z+(isFront?.012:-.012);
    box(o.w-.10,o.h-.10,.055,glassMat,o.x,o.sill+o.h/2,f);
    box(o.w,.055,.07,frameMat,o.x,o.sill,f); box(o.w,.055,.07,frameMat,o.x,o.sill+o.h,f);
    box(.055,o.h,.07,frameMat,o.x-o.w/2,o.sill+o.h/2,f); box(.055,o.h,.07,frameMat,o.x+o.w/2,o.sill+o.h/2,f);
    const n=o.type==="largeWindow"?2:1;
    for(let i=1;i<=n;i++)box(.04,o.h-.06,.05,frameMat,o.x-o.w/2+o.w/(n+1)*i,o.sill+o.h/2,f);
  }

  function frontRearLouver(o,z,isFront){
    const f=z+(isFront?.015:-.015),inside=z+(isFront?-.05:.05);
    box(o.w-.06,o.h-.06,.12,darkMat,o.x,o.sill+o.h/2,inside);
    box(o.w,.05,.07,frameMat,o.x,o.sill,f); box(o.w,.05,.07,frameMat,o.x,o.sill+o.h,f);
    box(.05,o.h,.07,frameMat,o.x-o.w/2,o.sill+o.h/2,f); box(.05,o.h,.07,frameMat,o.x+o.w/2,o.sill+o.h/2,f);
    for(let i=0;i<10;i++){const y=o.sill+.12+i*((o.h-.24)/9); const s=new THREE.Mesh(new THREE.BoxGeometry(o.w-.14,.028,.075),louverMat); s.position.set(o.x,y,f); s.rotation.x=isFront?-.28:.28; s.castShadow=true; unit.add(s);}
  }

  function sideWindow(o,x,isLeft){
    const f=x+(isLeft?-.012:.012);
    box(.055,o.h-.10,o.w-.10,glassMat,f,o.sill+o.h/2,o.z);
    box(.07,.055,o.w,frameMat,f,o.sill,o.z); box(.07,.055,o.w,frameMat,f,o.sill+o.h,o.z);
    box(.07,o.h,.055,frameMat,f,o.sill+o.h/2,o.z-o.w/2); box(.07,o.h,.055,frameMat,f,o.sill+o.h/2,o.z+o.w/2);
    box(.05,o.h-.06,.04,frameMat,f,o.sill+o.h/2,o.z);
  }

  function sideLouver(o,x,isLeft){
    const f=x+(isLeft?-.015:.015),inside=x+(isLeft?.05:-.05);
    box(.12,o.h-.06,o.w-.06,darkMat,inside,o.sill+o.h/2,o.z);
    box(.07,.05,o.w,frameMat,f,o.sill,o.z); box(.07,.05,o.w,frameMat,f,o.sill+o.h,o.z);
    box(.07,o.h,.05,frameMat,f,o.sill+o.h/2,o.z-o.w/2); box(.07,o.h,.05,frameMat,f,o.sill+o.h/2,o.z+o.w/2);
    for(let i=0;i<10;i++){const y=o.sill+.12+i*((o.h-.24)/9); const s=new THREE.Mesh(new THREE.BoxGeometry(.075,.028,o.w-.14),louverMat); s.position.set(f,y,o.z); s.rotation.z=isLeft?-.28:.28; s.castShadow=true; unit.add(s);}
  }

  function horizontalWall(z,xMin,xMax,openings,isFront){
    const valid=[...openings].filter(o=>o.x>=xMin&&o.x<=xMax).sort((a,b)=>a.x-b.x); let c=xMin;
    valid.forEach(o=>{
      const l=o.x-o.w/2,r=o.x+o.w/2;
      if(l>c)box(l-c,H,T,wallMat,(c+l)/2,H/2,z);
      if(o.sill>0)box(o.w,o.sill,T,wallMat,o.x,o.sill/2,z);
      const top=o.sill+o.h;
      if(top<H)box(o.w,H-top,T,wallMat,o.x,top+(H-top)/2,z);
      o.type==="louver"?frontRearLouver(o,z,isFront):frontRearWindow(o,z,isFront); c=r;
    });
    if(c<xMax)box(xMax-c,H,T,wallMat,(c+xMax)/2,H/2,z);
  }

  frontProfile.forEach((p,i)=>{
    const z=baseFrontZ+(p.offset??0); horizontalWall(z,p.xMin,p.xMax,front,true);
    if(i<frontProfile.length-1){const nz=baseFrontZ+(frontProfile[i+1].offset??0); if(Math.abs(nz-z)>.001)box(T,H,Math.abs(nz-z),wallMat,p.xMax,H/2,(z+nz)/2);}
  });

  const rearMinX=leftInset?baseLeftX+leftInset.offset:baseLeftX;
  rearProfile.forEach((p,i)=>{
    const x1=Math.max(p.xMin,rearMinX),x2=p.xMax;
    if(x2<=x1)return;
    const z=baseRearZ+(p.offset??0); horizontalWall(z,x1,x2,rear,false);
    if(i<rearProfile.length-1){const nz=baseRearZ+(rearProfile[i+1].offset??0); if(Math.abs(nz-z)>.001)box(T,H,Math.abs(nz-z),wallMat,p.xMax,H/2,(z+nz)/2);}
  });

  function sideWall(x,zMin,zMax,openings,isLeft){
    const valid=[...openings].filter(o=>o.z>=zMin&&o.z<=zMax).sort((a,b)=>a.z-b.z); let c=zMin;
    valid.forEach(o=>{
      const a=o.z-o.w/2,b=o.z+o.w/2;
      if(a>c)box(T,H,a-c,wallMat,x,H/2,(c+a)/2);
      if(o.sill>0)box(T,o.sill,o.w,wallMat,x,o.sill/2,o.z);
      const top=o.sill+o.h;
      if(top<H)box(T,H-top,o.w,wallMat,x,top+(H-top)/2,o.z);
      o.type==="louver"?sideLouver(o,x,isLeft):sideWindow(o,x,isLeft); c=b;
    });
    if(c<zMax)box(T,H,zMax-c,wallMat,x,H/2,(c+zMax)/2);
  }

  const lf=frontZAt(baseLeftX+.001),rf=frontZAt(baseRightX-.001),rr=rearZAt(baseRightX-.001);

  if(leftInset){
    const insetX=baseLeftX+leftInset.offset;
    const lr=rearZAt(insetX+.001);

    /* 뒤쪽 들어간 왼쪽벽: 루버/주방창이 이 벽에 직접 붙음 */
    sideWall(insetX,lr,leftInset.untilZ,left,true);

    /* ㄱ자 연결벽 */
    box(leftInset.offset,H,T,wallMat,baseLeftX+leftInset.offset/2,H/2,leftInset.untilZ);

    /* 앞쪽 원래 왼쪽벽 */
    sideWall(baseLeftX,leftInset.untilZ,lf,left,true);
  }else{
    const lr=rearZAt(baseLeftX+.001);
    sideWall(baseLeftX,lr,lf,left,true);
  }

  sideWall(baseRightX,rr,rf,right,false);

  const ground=new THREE.Mesh(new THREE.PlaneGeometry(40,40),new THREE.MeshStandardMaterial({color:0xaab7a6,roughness:1}));
  ground.rotation.x=-Math.PI/2; ground.receiveShadow=true; scene.add(ground);

  const title=document.getElementById("unitTitle"),subtitle=document.getElementById("unitSubtitle");
  if(title)title.textContent=`UNIT_${data.code} · ${data.id}`;
  if(subtitle)subtitle.textContent=`전용면적 ${data.area.toFixed(4)}㎡ · 모듈러 UNIT`;

  function animate(){requestAnimationFrame(animate);controls.update();renderer.render(scene,camera);} animate();
  addEventListener("resize",()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});

  return{scene,camera,renderer,controls,unit};
}
