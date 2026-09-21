import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export function createUnitViewer(data){

  const {
    width,
    depth,
    floorHeight:H,
    wall:T
  }=data.size;

  const front=data.frontOpenings??[];
  const rear=data.rearOpenings??[];
  const left=data.leftOpenings??[];
  const right=data.rightOpenings??[];

  const rearZ=-depth/2;
  const baseFrontZ=depth/2;

  /* 기본은 평평한 정면 */
  const profile=(
    data.frontProfile ?? [
      {
        xMin:-width/2,
        xMax: width/2,
        offset:0
      }
    ]
  ).slice().sort((a,b)=>a.xMin-b.xMin);

  /* ================= SCENE ================= */

  const scene=new THREE.Scene();
  scene.background=new THREE.Color(0xdce9ed);

  const camera=new THREE.PerspectiveCamera(
    38,
    innerWidth/innerHeight,
    .1,
    100
  );

  camera.position.set(10,8,13);

  const renderer=new THREE.WebGLRenderer({
    antialias:true
  });

  renderer.setPixelRatio(
    Math.min(devicePixelRatio,2)
  );

  renderer.setSize(
    innerWidth,
    innerHeight
  );

  renderer.shadowMap.enabled=true;
  renderer.outputColorSpace=THREE.SRGBColorSpace;

  document
    .getElementById("view")
    .appendChild(renderer.domElement);

  const controls=new OrbitControls(
    camera,
    renderer.domElement
  );

  controls.enableDamping=true;
  controls.dampingFactor=.07;
  controls.target.set(0,1.2,0);
  controls.minDistance=7;
  controls.maxDistance=30;
  controls.maxPolarAngle=Math.PI/2.02;

  /* ================= LIGHT ================= */

  scene.add(
    new THREE.HemisphereLight(
      0xf4f9ff,
      0xb7b9b5,
      2.1
    )
  );

  const sun=new THREE.DirectionalLight(
    0xffffff,
    2.6
  );

  sun.position.set(-8,12,10);
  sun.castShadow=true;
  scene.add(sun);

  /* ================= MATERIAL ================= */

  const wallMat=new THREE.MeshStandardMaterial({
    color:0xe9ece9,
    roughness:.72
  });

  const slabMat=new THREE.MeshStandardMaterial({
    color:0xcfd4d2,
    roughness:.82
  });

  const glassMat=new THREE.MeshStandardMaterial({
    color:0x6b8798,
    roughness:.18,
    metalness:.08
  });

  const frameMat=new THREE.MeshStandardMaterial({
    color:0xe8ecec,
    roughness:.42
  });

  const louverMat=new THREE.MeshStandardMaterial({
    color:0x7f8a90,
    roughness:.66,
    metalness:.35
  });

  const darkMat=new THREE.MeshStandardMaterial({
    color:0x505c62,
    roughness:.95
  });

  /* ================= ROOT ================= */

  const unit=new THREE.Group();
  unit.name=`UNIT_${data.code}`;
  scene.add(unit);

  function box(w,h,d,mat,x,y,z){

    const mesh=new THREE.Mesh(
      new THREE.BoxGeometry(w,h,d),
      mat
    );

    mesh.position.set(x,y,z);
    mesh.castShadow=true;
    mesh.receiveShadow=true;

    unit.add(mesh);

    return mesh;
  }

  /* ================= FLOOR =================
     frontProfile에 맞춰 바닥도 함께 후퇴
  ========================================== */

  profile.forEach(zone=>{

    const frontZ=
      baseFrontZ+
      (zone.offset??0);

    const zoneDepth=
      frontZ-rearZ;

    box(
      zone.xMax-zone.xMin,
      .12,
      zoneDepth,
      slabMat,
      (zone.xMin+zone.xMax)/2,
      .06,
      (rearZ+frontZ)/2
    );
  });

  /* ================= FRONT/REAR WINDOW ================= */

  function frontRearWindow(o,z,isFront){

    const faceZ=
      z+(isFront?.012:-.012);

    box(
      o.w-.10,
      o.h-.10,
      .055,
      glassMat,
      o.x,
      o.sill+o.h/2,
      faceZ
    );

    box(o.w,.055,.07,frameMat,o.x,o.sill,faceZ);
    box(o.w,.055,.07,frameMat,o.x,o.sill+o.h,faceZ);

    box(
      .055,o.h,.07,
      frameMat,
      o.x-o.w/2,
      o.sill+o.h/2,
      faceZ
    );

    box(
      .055,o.h,.07,
      frameMat,
      o.x+o.w/2,
      o.sill+o.h/2,
      faceZ
    );

    const bars=
      o.type==="largeWindow"
        ?2
        :1;

    for(let i=1;i<=bars;i++){

      const x=
        o.x-o.w/2+
        o.w/(bars+1)*i;

      box(
        .04,
        o.h-.06,
        .05,
        frameMat,
        x,
        o.sill+o.h/2,
        faceZ
      );
    }
  }

  /* ================= FRONT/REAR LOUVER ================= */

  function frontRearLouver(o,z,isFront){

    const faceZ=
      z+(isFront?.015:-.015);

    const insideZ=
      z+(isFront?-.05:.05);

    box(
      o.w-.06,
      o.h-.06,
      .12,
      darkMat,
      o.x,
      o.sill+o.h/2,
      insideZ
    );

    box(o.w,.05,.07,frameMat,o.x,o.sill,faceZ);
    box(o.w,.05,.07,frameMat,o.x,o.sill+o.h,faceZ);

    box(
      .05,o.h,.07,
      frameMat,
      o.x-o.w/2,
      o.sill+o.h/2,
      faceZ
    );

    box(
      .05,o.h,.07,
      frameMat,
      o.x+o.w/2,
      o.sill+o.h/2,
      faceZ
    );

    const count=10;

    for(let i=0;i<count;i++){

      const y=
        o.sill+.12+
        i*((o.h-.24)/(count-1));

      const slat=new THREE.Mesh(
        new THREE.BoxGeometry(
          o.w-.14,
          .028,
          .075
        ),
        louverMat
      );

      slat.position.set(
        o.x,
        y,
        faceZ
      );

      slat.rotation.x=
        isFront?-.28:.28;

      slat.castShadow=true;
      unit.add(slat);
    }

    for(let i=1;i<=2;i++){

      const x=
        o.x-o.w/2+
        o.w/3*i;

      box(
        .03,
        o.h-.08,
        .05,
        louverMat,
        x,
        o.sill+o.h/2,
        faceZ
      );
    }
  }

  /* ================= SIDE WINDOW ================= */

  function sideWindow(o,x,isLeft){

    const faceX=
      x+(isLeft?-.012:.012);

    box(
      .055,
      o.h-.10,
      o.w-.10,
      glassMat,
      faceX,
      o.sill+o.h/2,
      o.z
    );

    box(.07,.055,o.w,frameMat,faceX,o.sill,o.z);
    box(.07,.055,o.w,frameMat,faceX,o.sill+o.h,o.z);

    box(
      .07,o.h,.055,
      frameMat,
      faceX,
      o.sill+o.h/2,
      o.z-o.w/2
    );

    box(
      .07,o.h,.055,
      frameMat,
      faceX,
      o.sill+o.h/2,
      o.z+o.w/2
    );

    box(
      .05,
      o.h-.06,
      .04,
      frameMat,
      faceX,
      o.sill+o.h/2,
      o.z
    );
  }

  /* ================= SIDE LOUVER ================= */

  function sideLouver(o,x,isLeft){

    const faceX=
      x+(isLeft?-.015:.015);

    const insideX=
      x+(isLeft?.05:-.05);

    box(
      .12,
      o.h-.06,
      o.w-.06,
      darkMat,
      insideX,
      o.sill+o.h/2,
      o.z
    );

    box(.07,.05,o.w,frameMat,faceX,o.sill,o.z);
    box(.07,.05,o.w,frameMat,faceX,o.sill+o.h,o.z);

    box(
      .07,o.h,.05,
      frameMat,
      faceX,
      o.sill+o.h/2,
      o.z-o.w/2
    );

    box(
      .07,o.h,.05,
      frameMat,
      faceX,
      o.sill+o.h/2,
      o.z+o.w/2
    );

    const count=10;

    for(let i=0;i<count;i++){

      const y=
        o.sill+.12+
        i*((o.h-.24)/(count-1));

      const slat=new THREE.Mesh(
        new THREE.BoxGeometry(
          .075,
          .028,
          o.w-.14
        ),
        louverMat
      );

      slat.position.set(
        faceX,
        y,
        o.z
      );

      slat.rotation.z=
        isLeft?-.28:.28;

      slat.castShadow=true;
      unit.add(slat);
    }

    for(let i=1;i<=2;i++){

      const z=
        o.z-o.w/2+
        o.w/3*i;

      box(
        .05,
        o.h-.08,
        .03,
        louverMat,
        faceX,
        o.sill+o.h/2,
        z
      );
    }
  }

  /* ================= HORIZONTAL WALL ================= */

  function horizontalWall(
    z,
    xMin,
    xMax,
    openings,
    isFront
  ){

    const sorted=[...openings]
      .sort((a,b)=>a.x-b.x);

    let cursor=xMin;

    sorted.forEach(o=>{

      const L=o.x-o.w/2;
      const R=o.x+o.w/2;

      if(L>cursor){

        box(
          L-cursor,
          H,
          T,
          wallMat,
          (cursor+L)/2,
          H/2,
          z
        );
      }

      if(o.sill>0){

        box(
          o.w,
          o.sill,
          T,
          wallMat,
          o.x,
          o.sill/2,
          z
        );
      }

      const top=o.sill+o.h;

      if(top<H){

        box(
          o.w,
          H-top,
          T,
          wallMat,
          o.x,
          top+(H-top)/2,
          z
        );
      }

      if(o.type==="louver"){
        frontRearLouver(o,z,isFront);
      }else{
        frontRearWindow(o,z,isFront);
      }

      cursor=R;
    });

    if(cursor<xMax){

      box(
        xMax-cursor,
        H,
        T,
        wallMat,
        (cursor+xMax)/2,
        H/2,
        z
      );
    }
  }

  /* ================= FRONT PROFILE ================= */

  profile.forEach((zone,index)=>{

    const z=
      baseFrontZ+
      (zone.offset??0);

    const openings=front.filter(o=>
      o.x>=zone.xMin &&
      o.x<=zone.xMax
    );

    horizontalWall(
      z,
      zone.xMin,
      zone.xMax,
      openings,
      true
    );

    /* 단차가 생기는 세로 리턴벽 */
    if(index<profile.length-1){

      const next=profile[index+1];

      const nextZ=
        baseFrontZ+
        (next.offset??0);

      if(Math.abs(nextZ-z)>.001){

        box(
          T,
          H,
          Math.abs(nextZ-z),
          wallMat,
          zone.xMax,
          H/2,
          (z+nextZ)/2
        );
      }
    }
  });

  /* ================= REAR ================= */

  horizontalWall(
    rearZ,
    -width/2,
    width/2,
    rear,
    false
  );

  /* ================= SIDE WALL ================= */

  function sideWall(
    x,
    zMin,
    zMax,
    openings,
    isLeft
  ){

    const valid=openings
      .filter(o=>
        o.z>=zMin &&
        o.z<=zMax
      )
      .sort((a,b)=>a.z-b.z);

    let cursor=zMin;

    valid.forEach(o=>{

      const A=o.z-o.w/2;
      const B=o.z+o.w/2;

      if(A>cursor){

        box(
          T,
          H,
          A-cursor,
          wallMat,
          x,
          H/2,
          (cursor+A)/2
        );
      }

      if(o.sill>0){

        box(
          T,
          o.sill,
          o.w,
          wallMat,
          x,
          o.sill/2,
          o.z
        );
      }

      const top=o.sill+o.h;

      if(top<H){

        box(
          T,
          H-top,
          o.w,
          wallMat,
          x,
          top+(H-top)/2,
          o.z
        );
      }

      if(o.type==="louver"){
        sideLouver(o,x,isLeft);
      }else{
        sideWindow(o,x,isLeft);
      }

      cursor=B;
    });

    if(cursor<zMax){

      box(
        T,
        H,
        zMax-cursor,
        wallMat,
        x,
        H/2,
        (cursor+zMax)/2
      );
    }
  }

  const leftFrontZ=
    baseFrontZ+
    (profile[0].offset??0);

  const rightFrontZ=
    baseFrontZ+
    (profile[profile.length-1].offset??0);

  sideWall(
    -width/2,
    rearZ,
    leftFrontZ,
    left,
    true
  );

  sideWall(
    width/2,
    rearZ,
    rightFrontZ,
    right,
    false
  );

  /* ================= GROUND ================= */

  const ground=new THREE.Mesh(
    new THREE.PlaneGeometry(40,40),
    new THREE.MeshStandardMaterial({
      color:0xaab7a6,
      roughness:1
    })
  );

  ground.rotation.x=-Math.PI/2;
  ground.receiveShadow=true;
  scene.add(ground);

  /* ================= UI ================= */

  const title=document.getElementById("unitTitle");
  const subtitle=document.getElementById("unitSubtitle");

  if(title){
    title.textContent=
      `UNIT_${data.code} · ${data.id}`;
  }

  if(subtitle){
    subtitle.textContent=
      `전용면적 ${data.area.toFixed(4)}㎡ · 모듈러 UNIT`;
  }

  /* ================= LOOP ================= */

  function animate(){

    requestAnimationFrame(animate);

    controls.update();

    renderer.render(
      scene,
      camera
    );
  }

  animate();

  addEventListener("resize",()=>{

    camera.aspect=
      innerWidth/innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
      innerWidth,
      innerHeight
    );
  });

  return{
    scene,
    camera,
    renderer,
    controls,
    unit
  };
}
