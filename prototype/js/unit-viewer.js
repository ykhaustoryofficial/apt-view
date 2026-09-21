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

  const baseRearZ=-depth/2;
  const baseFrontZ=depth/2;

  /* =====================================================
     FRONT / REAR PROFILE

     FRONT
     offset 음수 = 뒤로 후퇴

     REAR
     offset 양수 = 앞쪽으로 들어옴
  ===================================================== */

  const frontProfile=(
    data.frontProfile ?? [
      {
        xMin:-width/2,
        xMax: width/2,
        offset:0
      }
    ]
  ).slice().sort((a,b)=>a.xMin-b.xMin);

  const rearProfile=(
    data.rearProfile ?? [
      {
        xMin:-width/2,
        xMax: width/2,
        offset:0
      }
    ]
  ).slice().sort((a,b)=>a.xMin-b.xMin);

  function profileOffset(profile,x){

    const zone=profile.find(
      p=>x>=p.xMin && x<=p.xMax
    );

    return zone?.offset??0;
  }

  function frontZAt(x){

    return baseFrontZ+
      profileOffset(frontProfile,x);
  }

  function rearZAt(x){

    return baseRearZ+
      profileOffset(rearProfile,x);
  }

  /* =====================================================
     SCENE
  ===================================================== */

  const scene=new THREE.Scene();

  scene.background=
    new THREE.Color(0xdce9ed);

  const camera=
    new THREE.PerspectiveCamera(
      38,
      innerWidth/innerHeight,
      .1,
      100
    );

  camera.position.set(
    10,
    8,
    13
  );

  const renderer=
    new THREE.WebGLRenderer({
      antialias:true
    });

  renderer.setPixelRatio(
    Math.min(
      devicePixelRatio,
      2
    )
  );

  renderer.setSize(
    innerWidth,
    innerHeight
  );

  renderer.shadowMap.enabled=true;

  renderer.outputColorSpace=
    THREE.SRGBColorSpace;

  document
    .getElementById("view")
    .appendChild(
      renderer.domElement
    );

  /* =====================================================
     CONTROLS
  ===================================================== */

  const controls=
    new OrbitControls(
      camera,
      renderer.domElement
    );

  controls.enableDamping=true;
  controls.dampingFactor=.07;

  controls.target.set(
    0,
    1.2,
    0
  );

  controls.minDistance=7;
  controls.maxDistance=30;

  controls.maxPolarAngle=
    Math.PI/2.02;

  /* =====================================================
     LIGHT
  ===================================================== */

  scene.add(
    new THREE.HemisphereLight(
      0xf4f9ff,
      0xb7b9b5,
      2.1
    )
  );

  const sun=
    new THREE.DirectionalLight(
      0xffffff,
      2.6
    );

  sun.position.set(
    -8,
    12,
    10
  );

  sun.castShadow=true;

  scene.add(sun);

  /* =====================================================
     MATERIALS
  ===================================================== */

  const wallMat=
    new THREE.MeshStandardMaterial({
      color:0xe9ece9,
      roughness:.72
    });

  const slabMat=
    new THREE.MeshStandardMaterial({
      color:0xcfd4d2,
      roughness:.82
    });

  const glassMat=
    new THREE.MeshStandardMaterial({
      color:0x6b8798,
      roughness:.18,
      metalness:.08
    });

  const frameMat=
    new THREE.MeshStandardMaterial({
      color:0xe8ecec,
      roughness:.42
    });

  const louverMat=
    new THREE.MeshStandardMaterial({
      color:0x7f8a90,
      roughness:.66,
      metalness:.35
    });

  const darkMat=
    new THREE.MeshStandardMaterial({
      color:0x505c62,
      roughness:.95
    });

  /* =====================================================
     ROOT
  ===================================================== */

  const unit=
    new THREE.Group();

  unit.name=
    `UNIT_${data.code}`;

  scene.add(unit);

  function box(
    w,
    h,
    d,
    material,
    x,
    y,
    z
  ){

    const mesh=
      new THREE.Mesh(
        new THREE.BoxGeometry(
          w,
          h,
          d
        ),
        material
      );

    mesh.position.set(
      x,
      y,
      z
    );

    mesh.castShadow=true;
    mesh.receiveShadow=true;

    unit.add(mesh);

    return mesh;
  }

  /* =====================================================
     FLOOR

     FRONT와 REAR의 모든 단차를 합쳐
     실제 footprint대로 바닥 생성
  ===================================================== */

  const xPoints=[
    -width/2,
    width/2,

    ...frontProfile.flatMap(
      p=>[
        p.xMin,
        p.xMax
      ]
    ),

    ...rearProfile.flatMap(
      p=>[
        p.xMin,
        p.xMax
      ]
    )
  ]
  .filter(
    x=>x>=-width/2 &&
       x<= width/2
  )
  .sort(
    (a,b)=>a-b
  )
  .filter(
    (x,i,arr)=>
      i===0 ||
      Math.abs(
        x-arr[i-1]
      )>.001
  );

  for(
    let i=0;
    i<xPoints.length-1;
    i++
  ){

    const x1=xPoints[i];
    const x2=xPoints[i+1];

    const mid=
      (x1+x2)/2;

    const frontZ=
      frontZAt(mid);

    const rearZ=
      rearZAt(mid);

    const sliceDepth=
      frontZ-rearZ;

    box(
      x2-x1,
      .12,
      sliceDepth,
      slabMat,
      mid,
      .06,
      (frontZ+rearZ)/2
    );
  }

  /* =====================================================
     FRONT / REAR WINDOW
  ===================================================== */

  function frontRearWindow(
    opening,
    z,
    isFront
  ){

    const faceZ=
      z+
      (
        isFront
          ?.012
          :-.012
      );

    box(
      opening.w-.10,
      opening.h-.10,
      .055,
      glassMat,
      opening.x,
      opening.sill+
        opening.h/2,
      faceZ
    );

    box(
      opening.w,
      .055,
      .07,
      frameMat,
      opening.x,
      opening.sill,
      faceZ
    );

    box(
      opening.w,
      .055,
      .07,
      frameMat,
      opening.x,
      opening.sill+
        opening.h,
      faceZ
    );

    box(
      .055,
      opening.h,
      .07,
      frameMat,
      opening.x-
        opening.w/2,
      opening.sill+
        opening.h/2,
      faceZ
    );

    box(
      .055,
      opening.h,
      .07,
      frameMat,
      opening.x+
        opening.w/2,
      opening.sill+
        opening.h/2,
      faceZ
    );

    const bars=
      opening.type===
      "largeWindow"
        ?2
        :1;

    for(
      let i=1;
      i<=bars;
      i++
    ){

      const xx=
        opening.x-
        opening.w/2+
        (
          opening.w/
          (bars+1)
        )*i;

      box(
        .04,
        opening.h-.06,
        .05,
        frameMat,
        xx,
        opening.sill+
          opening.h/2,
        faceZ
      );
    }
  }

  /* =====================================================
     FRONT / REAR LOUVER
  ===================================================== */

  function frontRearLouver(
    opening,
    z,
    isFront
  ){

    const faceZ=
      z+
      (
        isFront
          ?.015
          :-.015
      );

    const insideZ=
      z+
      (
        isFront
          ?-.05
          :.05
      );

    box(
      opening.w-.06,
      opening.h-.06,
      .12,
      darkMat,
      opening.x,
      opening.sill+
        opening.h/2,
      insideZ
    );

    box(
      opening.w,
      .05,
      .07,
      frameMat,
      opening.x,
      opening.sill,
      faceZ
    );

    box(
      opening.w,
      .05,
      .07,
      frameMat,
      opening.x,
      opening.sill+
        opening.h,
      faceZ
    );

    box(
      .05,
      opening.h,
      .07,
      frameMat,
      opening.x-
        opening.w/2,
      opening.sill+
        opening.h/2,
      faceZ
    );

    box(
      .05,
      opening.h,
      .07,
      frameMat,
      opening.x+
        opening.w/2,
      opening.sill+
        opening.h/2,
      faceZ
    );

    const count=10;

    for(
      let i=0;
      i<count;
      i++
    ){

      const yy=
        opening.sill+
        .12+
        i*
        (
          (opening.h-.24)/
          (count-1)
        );

      const slat=
        new THREE.Mesh(
          new THREE.BoxGeometry(
            opening.w-.14,
            .028,
            .075
          ),
          louverMat
        );

      slat.position.set(
        opening.x,
        yy,
        faceZ
      );

      slat.rotation.x=
        isFront
          ?-.28
          :.28;

      slat.castShadow=true;

      unit.add(slat);
    }

    for(
      let i=1;
      i<=2;
      i++
    ){

      const xx=
        opening.x-
        opening.w/2+
        opening.w/3*i;

      box(
        .03,
        opening.h-.08,
        .05,
        louverMat,
        xx,
        opening.sill+
          opening.h/2,
        faceZ
      );
    }
  }

  /* =====================================================
     SIDE WINDOW
  ===================================================== */

  function sideWindow(
    opening,
    x,
    isLeft
  ){

    const faceX=
      x+
      (
        isLeft
          ?-.012
          :.012
      );

    box(
      .055,
      opening.h-.10,
      opening.w-.10,
      glassMat,
      faceX,
      opening.sill+
        opening.h/2,
      opening.z
    );

    box(
      .07,
      .055,
      opening.w,
      frameMat,
      faceX,
      opening.sill,
      opening.z
    );

    box(
      .07,
      .055,
      opening.w,
      frameMat,
      faceX,
      opening.sill+
        opening.h,
      opening.z
    );

    box(
      .07,
      opening.h,
      .055,
      frameMat,
      faceX,
      opening.sill+
        opening.h/2,
      opening.z-
        opening.w/2
    );

    box(
      .07,
      opening.h,
      .055,
      frameMat,
      faceX,
      opening.sill+
        opening.h/2,
      opening.z+
        opening.w/2
    );

    box(
      .05,
      opening.h-.06,
      .04,
      frameMat,
      faceX,
      opening.sill+
        opening.h/2,
      opening.z
    );
  }

  /* =====================================================
     SIDE LOUVER
  ===================================================== */

  function sideLouver(
    opening,
    x,
    isLeft
  ){

    const faceX=
      x+
      (
        isLeft
          ?-.015
          :.015
      );

    const insideX=
      x+
      (
        isLeft
          ?.05
          :-.05
      );

    box(
      .12,
      opening.h-.06,
      opening.w-.06,
      darkMat,
      insideX,
      opening.sill+
        opening.h/2,
      opening.z
    );

    box(
      .07,
      .05,
      opening.w,
      frameMat,
      faceX,
      opening.sill,
      opening.z
    );

    box(
      .07,
      .05,
      opening.w,
      frameMat,
      faceX,
      opening.sill+
        opening.h,
      opening.z
    );

    box(
      .07,
      opening.h,
      .05,
      frameMat,
      faceX,
      opening.sill+
        opening.h/2,
      opening.z-
        opening.w/2
    );

    box(
      .07,
      opening.h,
      .05,
      frameMat,
      faceX,
      opening.sill+
        opening.h/2,
      opening.z+
        opening.w/2
    );

    const count=10;

    for(
      let i=0;
      i<count;
      i++
    ){

      const yy=
        opening.sill+
        .12+
        i*
        (
          (opening.h-.24)/
          (count-1)
        );

      const slat=
        new THREE.Mesh(
          new THREE.BoxGeometry(
            .075,
            .028,
            opening.w-.14
          ),
          louverMat
        );

      slat.position.set(
        faceX,
        yy,
        opening.z
      );

      slat.rotation.z=
        isLeft
          ?-.28
          :.28;

      slat.castShadow=true;

      unit.add(slat);
    }
  }

  /* =====================================================
     HORIZONTAL WALL
  ===================================================== */

  function horizontalWall(
    z,
    xMin,
    xMax,
    openings,
    isFront
  ){

    const valid=
      [...openings]
      .filter(
        o=>
          o.x>=xMin &&
          o.x<=xMax
      )
      .sort(
        (a,b)=>
          a.x-b.x
      );

    let cursor=xMin;

    valid.forEach(
      opening=>{

        const left=
          opening.x-
          opening.w/2;

        const right=
          opening.x+
          opening.w/2;

        if(left>cursor){

          box(
            left-cursor,
            H,
            T,
            wallMat,
            (cursor+left)/2,
            H/2,
            z
          );
        }

        if(
          opening.sill>0
        ){

          box(
            opening.w,
            opening.sill,
            T,
            wallMat,
            opening.x,
            opening.sill/2,
            z
          );
        }

        const top=
          opening.sill+
          opening.h;

        if(top<H){

          box(
            opening.w,
            H-top,
            T,
            wallMat,
            opening.x,
            top+
              (H-top)/2,
            z
          );
        }

        if(
          opening.type===
          "louver"
        ){

          frontRearLouver(
            opening,
            z,
            isFront
          );

        }else{

          frontRearWindow(
            opening,
            z,
            isFront
          );
        }

        cursor=right;
      }
    );

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

  /* =====================================================
     FRONT PROFILE
  ===================================================== */

  frontProfile.forEach(
    (zone,index)=>{

      const z=
        baseFrontZ+
        (zone.offset??0);

      horizontalWall(
        z,
        zone.xMin,
        zone.xMax,
        front,
        true
      );

      if(
        index<
        frontProfile.length-1
      ){

        const next=
          frontProfile[index+1];

        const nextZ=
          baseFrontZ+
          (next.offset??0);

        if(
          Math.abs(
            nextZ-z
          )>.001
        ){

          box(
            T,
            H,
            Math.abs(
              nextZ-z
            ),
            wallMat,
            zone.xMax,
            H/2,
            (z+nextZ)/2
          );
        }
      }
    }
  );

  /* =====================================================
     REAR PROFILE
  ===================================================== */

  rearProfile.forEach(
    (zone,index)=>{

      const z=
        baseRearZ+
        (zone.offset??0);

      horizontalWall(
        z,
        zone.xMin,
        zone.xMax,
        rear,
        false
      );

      /*
        계단 사이의 세로 리턴벽
      */
      if(
        index<
        rearProfile.length-1
      ){

        const next=
          rearProfile[index+1];

        const nextZ=
          baseRearZ+
          (next.offset??0);

        if(
          Math.abs(
            nextZ-z
          )>.001
        ){

          box(
            T,
            H,
            Math.abs(
              nextZ-z
            ),
            wallMat,
            zone.xMax,
            H/2,
            (z+nextZ)/2
          );
        }
      }
    }
  );

  /* =====================================================
     SIDE WALL
  ===================================================== */

  function sideWall(
    x,
    zMin,
    zMax,
    openings,
    isLeft
  ){

    const valid=
      [...openings]
      .filter(
        o=>
          o.z>=zMin &&
          o.z<=zMax
      )
      .sort(
        (a,b)=>
          a.z-b.z
      );

    let cursor=zMin;

    valid.forEach(
      opening=>{

        const A=
          opening.z-
          opening.w/2;

        const B=
          opening.z+
          opening.w/2;

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

        if(
          opening.sill>0
        ){

          box(
            T,
            opening.sill,
            opening.w,
            wallMat,
            x,
            opening.sill/2,
            opening.z
          );
        }

        const top=
          opening.sill+
          opening.h;

        if(top<H){

          box(
            T,
            H-top,
            opening.w,
            wallMat,
            x,
            top+
              (H-top)/2,
            opening.z
          );
        }

        if(
          opening.type===
          "louver"
        ){

          sideLouver(
            opening,
            x,
            isLeft
          );

        }else{

          sideWindow(
            opening,
            x,
            isLeft
          );
        }

        cursor=B;
      }
    );

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

  const epsilon=.001;

  const leftRearZ=
    rearZAt(
      -width/2+
      epsilon
    );

  const rightRearZ=
    rearZAt(
      width/2-
      epsilon
    );

  const leftFrontZ=
    frontZAt(
      -width/2+
      epsilon
    );

  const rightFrontZ=
    frontZAt(
      width/2-
      epsilon
    );

  sideWall(
    -width/2,
    leftRearZ,
    leftFrontZ,
    left,
    true
  );

  sideWall(
    width/2,
    rightRearZ,
    rightFrontZ,
    right,
    false
  );

  /* =====================================================
     GROUND
  ===================================================== */

  const ground=
    new THREE.Mesh(
      new THREE.PlaneGeometry(
        40,
        40
      ),
      new THREE.MeshStandardMaterial({
        color:0xaab7a6,
        roughness:1
      })
    );

  ground.rotation.x=
    -Math.PI/2;

  ground.receiveShadow=true;

  scene.add(ground);

  /* =====================================================
     UI
  ===================================================== */

  const title=
    document.getElementById(
      "unitTitle"
    );

  const subtitle=
    document.getElementById(
      "unitSubtitle"
    );

  if(title){

    title.textContent=
      `UNIT_${data.code} · ${data.id}`;
  }

  if(subtitle){

    subtitle.textContent=
      `전용면적 ${data.area.toFixed(4)}㎡ · 모듈러 UNIT`;
  }

  /* =====================================================
     LOOP
  ===================================================== */

  function animate(){

    requestAnimationFrame(
      animate
    );

    controls.update();

    renderer.render(
      scene,
      camera
    );
  }

  animate();

  /* =====================================================
     RESIZE
  ===================================================== */

  addEventListener(
    "resize",
    ()=>{

      camera.aspect=
        innerWidth/
        innerHeight;

      camera
        .updateProjectionMatrix();

      renderer.setSize(
        innerWidth,
        innerHeight
      );
    }
  );

  return{
    scene,
    camera,
    renderer,
    controls,
    unit
  };
}
