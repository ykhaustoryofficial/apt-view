import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export function createUnitViewer(unitData) {

  const {
    width,
    depth,
    floorHeight,
    wall
  } = unitData.size;

  const frontOpenings = unitData.frontOpenings ?? [];
  const rearOpenings  = unitData.rearOpenings  ?? [];
  const leftOpenings  = unitData.leftOpenings  ?? [];
  const rightOpenings = unitData.rightOpenings ?? [];

  /* =====================================================
     SCENE
  ===================================================== */

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xdce9ed);

  const camera = new THREE.PerspectiveCamera(
    38,
    innerWidth / innerHeight,
    0.1,
    100
  );

  camera.position.set(10, 8, 13);

  const renderer = new THREE.WebGLRenderer({
    antialias: true
  });

  renderer.setPixelRatio(
    Math.min(devicePixelRatio, 2)
  );

  renderer.setSize(
    innerWidth,
    innerHeight
  );

  renderer.shadowMap.enabled = true;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  document
    .getElementById("view")
    .appendChild(renderer.domElement);

  /* =====================================================
     CONTROLS
  ===================================================== */

  const controls = new OrbitControls(
    camera,
    renderer.domElement
  );

  controls.enableDamping = true;
  controls.dampingFactor = 0.07;

  controls.target.set(
    0,
    1.2,
    0
  );

  controls.minDistance = 7;
  controls.maxDistance = 30;
  controls.maxPolarAngle = Math.PI / 2.02;

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

  const sun = new THREE.DirectionalLight(
    0xffffff,
    2.6
  );

  sun.position.set(-8, 12, 10);
  sun.castShadow = true;

  scene.add(sun);

  /* =====================================================
     MATERIALS
  ===================================================== */

  const wallMat = new THREE.MeshStandardMaterial({
    color: 0xe9ece9,
    roughness: 0.72
  });

  const slabMat = new THREE.MeshStandardMaterial({
    color: 0xcfd4d2,
    roughness: 0.82
  });

  const glassMat = new THREE.MeshStandardMaterial({
    color: 0x6b8798,
    roughness: 0.18,
    metalness: 0.08
  });

  const frameMat = new THREE.MeshStandardMaterial({
    color: 0xe8ecec,
    roughness: 0.42
  });

  const socketMat = new THREE.MeshStandardMaterial({
    color: 0x89969c,
    transparent: true,
    opacity: 0.32,
    roughness: 0.7
  });

  const louverMat = new THREE.MeshStandardMaterial({
    color: 0x7f8a90,
    roughness: 0.66,
    metalness: 0.35
  });

  const louverInsideMat = new THREE.MeshStandardMaterial({
    color: 0x505c62,
    roughness: 0.95
  });

  /* =====================================================
     ROOT
  ===================================================== */

  const unit = new THREE.Group();
  unit.name = `UNIT_${unitData.code}`;

  scene.add(unit);

  function box(
    w,
    h,
    d,
    material,
    x,
    y,
    z
  ) {

    const mesh = new THREE.Mesh(
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

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    unit.add(mesh);

    return mesh;
  }

  /* =====================================================
     FLOOR
  ===================================================== */

  box(
    width,
    0.12,
    depth,
    slabMat,
    0,
    0.06,
    0
  );

  /* =====================================================
     FRONT / REAR WINDOW
  ===================================================== */

  function makeFrontRearWindow(
    opening,
    z,
    isFront
  ) {

    const faceZ =
      z + (isFront ? 0.012 : -0.012);

    box(
      opening.w - 0.10,
      opening.h - 0.10,
      0.055,
      glassMat,
      opening.x,
      opening.sill + opening.h / 2,
      faceZ
    );

    box(
      opening.w,
      0.055,
      0.07,
      frameMat,
      opening.x,
      opening.sill,
      faceZ
    );

    box(
      opening.w,
      0.055,
      0.07,
      frameMat,
      opening.x,
      opening.sill + opening.h,
      faceZ
    );

    box(
      0.055,
      opening.h,
      0.07,
      frameMat,
      opening.x - opening.w / 2,
      opening.sill + opening.h / 2,
      faceZ
    );

    box(
      0.055,
      opening.h,
      0.07,
      frameMat,
      opening.x + opening.w / 2,
      opening.sill + opening.h / 2,
      faceZ
    );

    const mullionCount =
      opening.type === "largeWindow"
        ? 2
        : 1;

    for (
      let i = 1;
      i <= mullionCount;
      i++
    ) {

      const mullionX =
        opening.x -
        opening.w / 2 +
        (
          opening.w /
          (mullionCount + 1)
        ) * i;

      box(
        0.04,
        opening.h - 0.06,
        0.05,
        frameMat,
        mullionX,
        opening.sill + opening.h / 2,
        faceZ
      );
    }
  }

  /* =====================================================
     FRONT / REAR LOUVER
  ===================================================== */

  function makeFrontRearLouver(
    opening,
    z,
    isFront
  ) {

    const insideZ =
      z + (isFront ? -0.05 : 0.05);

    const faceZ =
      z + (isFront ? 0.015 : -0.015);

    box(
      opening.w - 0.06,
      opening.h - 0.06,
      0.12,
      louverInsideMat,
      opening.x,
      opening.sill + opening.h / 2,
      insideZ
    );

    box(
      opening.w,
      0.05,
      0.07,
      frameMat,
      opening.x,
      opening.sill,
      faceZ
    );

    box(
      opening.w,
      0.05,
      0.07,
      frameMat,
      opening.x,
      opening.sill + opening.h,
      faceZ
    );

    box(
      0.05,
      opening.h,
      0.07,
      frameMat,
      opening.x - opening.w / 2,
      opening.sill + opening.h / 2,
      faceZ
    );

    box(
      0.05,
      opening.h,
      0.07,
      frameMat,
      opening.x + opening.w / 2,
      opening.sill + opening.h / 2,
      faceZ
    );

    const slatCount = 10;

    for (
      let i = 0;
      i < slatCount;
      i++
    ) {

      const yy =
        opening.sill +
        0.12 +
        i *
        (
          (opening.h - 0.24) /
          (slatCount - 1)
        );

      const slat = new THREE.Mesh(
        new THREE.BoxGeometry(
          opening.w - 0.14,
          0.028,
          0.075
        ),
        louverMat
      );

      slat.position.set(
        opening.x,
        yy,
        faceZ
      );

      slat.rotation.x =
        isFront ? -0.28 : 0.28;

      slat.castShadow = true;
      unit.add(slat);
    }

    for (
      let i = 1;
      i <= 2;
      i++
    ) {

      const xx =
        opening.x -
        opening.w / 2 +
        (opening.w / 3) * i;

      box(
        0.03,
        opening.h - 0.08,
        0.05,
        louverMat,
        xx,
        opening.sill + opening.h / 2,
        faceZ
      );
    }
  }

  /* =====================================================
     SIDE WINDOW
  ===================================================== */

  function makeSideWindow(
    opening,
    x,
    isLeft
  ) {

    const faceX =
      x + (isLeft ? -0.012 : 0.012);

    box(
      0.055,
      opening.h - 0.10,
      opening.w - 0.10,
      glassMat,
      faceX,
      opening.sill + opening.h / 2,
      opening.z
    );

    box(
      0.07,
      0.055,
      opening.w,
      frameMat,
      faceX,
      opening.sill,
      opening.z
    );

    box(
      0.07,
      0.055,
      opening.w,
      frameMat,
      faceX,
      opening.sill + opening.h,
      opening.z
    );

    box(
      0.07,
      opening.h,
      0.055,
      frameMat,
      faceX,
      opening.sill + opening.h / 2,
      opening.z - opening.w / 2
    );

    box(
      0.07,
      opening.h,
      0.055,
      frameMat,
      faceX,
      opening.sill + opening.h / 2,
      opening.z + opening.w / 2
    );

    const mullionCount =
      opening.type === "largeWindow"
        ? 2
        : 1;

    for (
      let i = 1;
      i <= mullionCount;
      i++
    ) {

      const mullionZ =
        opening.z -
        opening.w / 2 +
        (
          opening.w /
          (mullionCount + 1)
        ) * i;

      box(
        0.05,
        opening.h - 0.06,
        0.04,
        frameMat,
        faceX,
        opening.sill + opening.h / 2,
        mullionZ
      );
    }
  }

  /* =====================================================
     SIDE LOUVER
  ===================================================== */

  function makeSideLouver(
    opening,
    x,
    isLeft
  ) {

    const insideX =
      x + (isLeft ? 0.05 : -0.05);

    const faceX =
      x + (isLeft ? -0.015 : 0.015);

    box(
      0.12,
      opening.h - 0.06,
      opening.w - 0.06,
      louverInsideMat,
      insideX,
      opening.sill + opening.h / 2,
      opening.z
    );

    box(
      0.07,
      0.05,
      opening.w,
      frameMat,
      faceX,
      opening.sill,
      opening.z
    );

    box(
      0.07,
      0.05,
      opening.w,
      frameMat,
      faceX,
      opening.sill + opening.h,
      opening.z
    );

    box(
      0.07,
      opening.h,
      0.05,
      frameMat,
      faceX,
      opening.sill + opening.h / 2,
      opening.z - opening.w / 2
    );

    box(
      0.07,
      opening.h,
      0.05,
      frameMat,
      faceX,
      opening.sill + opening.h / 2,
      opening.z + opening.w / 2
    );

    const slatCount = 10;

    for (
      let i = 0;
      i < slatCount;
      i++
    ) {

      const yy =
        opening.sill +
        0.12 +
        i *
        (
          (opening.h - 0.24) /
          (slatCount - 1)
        );

      const slat = new THREE.Mesh(
        new THREE.BoxGeometry(
          0.075,
          0.028,
          opening.w - 0.14
        ),
        louverMat
      );

      slat.position.set(
        faceX,
        yy,
        opening.z
      );

      slat.rotation.z =
        isLeft ? -0.28 : 0.28;

      slat.castShadow = true;
      unit.add(slat);
    }

    for (
      let i = 1;
      i <= 2;
      i++
    ) {

      const zz =
        opening.z -
        opening.w / 2 +
        (opening.w / 3) * i;

      box(
        0.05,
        opening.h - 0.08,
        0.03,
        louverMat,
        faceX,
        opening.sill + opening.h / 2,
        zz
      );
    }
  }

  /* =====================================================
     FRONT / REAR WALL BUILDER
  ===================================================== */

  function buildFrontRearWall(
    z,
    openings,
    isFront
  ) {

    const sorted = [...openings]
      .sort((a, b) => a.x - b.x);

    let cursor = -width / 2;

    sorted.forEach(opening => {

      const left =
        opening.x - opening.w / 2;

      const right =
        opening.x + opening.w / 2;

      if (left > cursor) {

        box(
          left - cursor,
          floorHeight,
          wall,
          wallMat,
          (cursor + left) / 2,
          floorHeight / 2,
          z
        );
      }

      if (opening.sill > 0) {

        box(
          opening.w,
          opening.sill,
          wall,
          wallMat,
          opening.x,
          opening.sill / 2,
          z
        );
      }

      const topY =
        opening.sill + opening.h;

      if (topY < floorHeight) {

        box(
          opening.w,
          floorHeight - topY,
          wall,
          wallMat,
          opening.x,
          topY +
          (floorHeight - topY) / 2,
          z
        );
      }

      if (opening.type === "louver") {

        makeFrontRearLouver(
          opening,
          z,
          isFront
        );

      } else {

        makeFrontRearWindow(
          opening,
          z,
          isFront
        );
      }

      cursor = right;
    });

    if (cursor < width / 2) {

      box(
        width / 2 - cursor,
        floorHeight,
        wall,
        wallMat,
        (cursor + width / 2) / 2,
        floorHeight / 2,
        z
      );
    }
  }

  /* =====================================================
     SIDE WALL BUILDER
  ===================================================== */

  function buildSideWall(
    x,
    openings,
    isLeft
  ) {

    const sorted = [...openings]
      .sort((a, b) => a.z - b.z);

    let cursor = -depth / 2;

    sorted.forEach(opening => {

      const rearEdge =
        opening.z - opening.w / 2;

      const frontEdge =
        opening.z + opening.w / 2;

      if (rearEdge > cursor) {

        box(
          wall,
          floorHeight,
          rearEdge - cursor,
          wallMat,
          x,
          floorHeight / 2,
          (cursor + rearEdge) / 2
        );
      }

      if (opening.sill > 0) {

        box(
          wall,
          opening.sill,
          opening.w,
          wallMat,
          x,
          opening.sill / 2,
          opening.z
        );
      }

      const topY =
        opening.sill + opening.h;

      if (topY < floorHeight) {

        box(
          wall,
          floorHeight - topY,
          opening.w,
          wallMat,
          x,
          topY +
          (floorHeight - topY) / 2,
          opening.z
        );
      }

      if (opening.type === "louver") {

        makeSideLouver(
          opening,
          x,
          isLeft
        );

      } else {

        makeSideWindow(
          opening,
          x,
          isLeft
        );
      }

      cursor = frontEdge;
    });

    if (cursor < depth / 2) {

      box(
        wall,
        floorHeight,
        depth / 2 - cursor,
        wallMat,
        x,
        floorHeight / 2,
        (cursor + depth / 2) / 2
      );
    }
  }

  /* =====================================================
     BUILD FOUR SIDES
  ===================================================== */

  buildFrontRearWall(
    depth / 2,
    frontOpenings,
    true
  );

  buildFrontRearWall(
    -depth / 2,
    rearOpenings,
    false
  );

  buildSideWall(
    -width / 2,
    leftOpenings,
    true
  );

  buildSideWall(
    width / 2,
    rightOpenings,
    false
  );

  /* =====================================================
     SOCKET MARKERS
  ===================================================== */

  box(
    0.03,
    1.20,
    2.2,
    socketMat,
    -width / 2 - 0.11,
    1.10,
    0
  );

  box(
    0.03,
    1.20,
    2.2,
    socketMat,
    width / 2 + 0.11,
    1.10,
    0
  );

  /* =====================================================
     ORIENTATION MARKERS
  ===================================================== */

  const frontMarker = new THREE.Mesh(
    new THREE.BoxGeometry(
      2.1,
      0.035,
      0.18
    ),
    new THREE.MeshStandardMaterial({
      color: 0x4b88aa
    })
  );

  frontMarker.position.set(
    0,
    0.15,
    depth / 2 + 0.38
  );

  unit.add(frontMarker);

  const rearMarker = new THREE.Mesh(
    new THREE.BoxGeometry(
      2.1,
      0.035,
      0.18
    ),
    new THREE.MeshStandardMaterial({
      color: 0x7f8b90
    })
  );

  rearMarker.position.set(
    0,
    0.15,
    -depth / 2 - 0.38
  );

  unit.add(rearMarker);

  /* =====================================================
     GROUND
  ===================================================== */

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(
      40,
      40
    ),
    new THREE.MeshStandardMaterial({
      color: 0xaab7a6,
      roughness: 1
    })
  );

  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;

  scene.add(ground);

  /* =====================================================
     UI
  ===================================================== */

  const title =
    document.getElementById("unitTitle");

  const subtitle =
    document.getElementById("unitSubtitle");

  if (title) {

    title.textContent =
      `UNIT_${unitData.code} · ${unitData.id}`;
  }

  if (subtitle) {

    subtitle.textContent =
      `전용면적 ${unitData.area.toFixed(4)}㎡ · 모듈러 UNIT`;
  }

  /* =====================================================
     LOOP
  ===================================================== */

  function animate() {

    requestAnimationFrame(animate);

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
    () => {

      camera.aspect =
        innerWidth / innerHeight;

      camera.updateProjectionMatrix();

      renderer.setSize(
        innerWidth,
        innerHeight
      );
    }
  );

  return {
    scene,
    camera,
    renderer,
    controls,
    unit
  };
}
