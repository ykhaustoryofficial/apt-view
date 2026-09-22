import * as THREE from "three";

export function createUnitModel(data,{instanceId=`UNIT_${data.code}`}={}){
  const {width,depth,floorHeight:H,wall:T}=data.size;
  const front=data.frontOpenings??[],rear=data.rearOpenings??[],left=data.leftOpenings??[],right=data.rightOpenings??[];
  const rearZ=-depth/2,frontZ=depth/2,leftX=-width/2,rightX=width/2;
  const fp=(data.frontProfile??[{xMin:leftX,xMax:rightX,offset:0}]).slice().sort((a,b)=>a.xMin-b.xMin);
  const rp=(data.rearProfile??[{xMin:leftX,xMax:rightX,offset:0}]).slice().sort((a,b)=>a.xMin-b.xMin);
  const inset=data.leftRearInset??null,group=new THREE.Group(); group.name=instanceId;

  const wallMat=new THREE.MeshStandardMaterial({color:0xe9ece9,roughness:.72});
  const slabMat=new THREE.MeshStandardMaterial({color:0xcfd4d2,roughness:.82});
  const glassMat=new THREE.MeshStandardMaterial({color:0x6b8798,roughness:.18,metalness:.08});
  const frameMat=new THREE.MeshStandardMaterial({color:0xe8ecec,roughness:.42});
  const louverMat=new THREE.MeshStandardMaterial({color:0x7f8a90,roughness:.66,metalness:.35});
  const darkMat=new THREE.MeshStandardMaterial({color:0x505c62,roughness:.95});

  let wallNo=0;
  const tag=(m,id,label,type)=>{m.userData={...m.userData,pickable:true,objectId:`${instanceId}-${id}`,objectLabel:label,objectType:type,unitId:instanceId};return m;};
  const box=(w,h,d,mat,x,y,z,meta)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;if(meta)tag(m,...meta);group.add(m);return m;};
  const WM=label=>[`W${String(++wallNo).padStart(2,"0")}`,label,"wall"];
  const OM=o=>[o.id,o.name??o.preset??o.type,o.type];

  const off=(p,x)=>(p.find(v=>x>=v.xMin&&x<=v.xMax)?.offset??0);
  const fz=x=>frontZ+off(fp,x),rz=x=>rearZ+off(rp,x);

  /* FLOOR */
  const xs=[leftX,rightX,...fp.flatMap(v=>[v.xMin,v.xMax]),...rp.flatMap(v=>[v.xMin,v.xMax])].sort((a,b)=>a-b).filter((v,i,a)=>i===0||Math.abs(v-a[i-1])>.001);
  for(let i=0;i<xs.length-1;i++){const a=xs[i],b=xs[i+1],x=(a+b)/2;let lx=leftX;if(inset&&x<leftX+inset.offset)continue;const z1=rz(x),z2=fz(x);box(b-a,.12,z2-z1,slabMat,x,.06,(z1+z2)/2);}

  function winFR(o,z,frontSide){
    const f=z+(frontSide?.012:-.012),M=OM(o);
    box(o.w-.10,o.h-.10,.055,glassMat,o.x,o.sill+o.h/2,f,M);
    box(o.w,.055,.07,frameMat,o.x,o.sill,f,M);box(o.w,.055,.07,frameMat,o.x,o.sill+o.h,f,M);
    box(.055,o.h,.07,frameMat,o.x-o.w/2,o.sill+o.h/2,f,M);box(.055,o.h,.07,frameMat,o.x+o.w/2,o.sill+o.h/2,f,M);
    const n=o.type==="largeWindow"?2:1;for(let i=1;i<=n;i++)box(.04,o.h-.06,.05,frameMat,o.x-o.w/2+o.w/(n+1)*i,o.sill+o.h/2,f,M);
  }

  function louverFR(o,z,frontSide){
    const f=z+(frontSide?.015:-.015),inside=z+(frontSide?-.05:.05),M=OM(o);
    box(o.w-.06,o.h-.06,.12,darkMat,o.x,o.sill+o.h/2,inside,M);
    box(o.w,.05,.07,frameMat,o.x,o.sill,f,M);box(o.w,.05,.07,frameMat,o.x,o.sill+o.h,f,M);
    box(.05,o.h,.07,frameMat,o.x-o.w/2,o.sill+o.h/2,f,M);box(.05,o.h,.07,frameMat,o.x+o.w/2,o.sill+o.h/2,f,M);
    for(let i=0;i<10;i++){const y=o.sill+.12+i*((o.h-.24)/9),s=new THREE.Mesh(new THREE.BoxGeometry(o.w-.14,.028,.075),louverMat);s.position.set(o.x,y,f);s.rotation.x=frontSide?-.28:.28;s.castShadow=true;tag(s,...M);group.add(s);}
  }

  function winSide(o,x,isLeft){
    const f=x+(isLeft?-.012:.012),M=OM(o);
    box(.055,o.h-.10,o.w-.10,glassMat,f,o.sill+o.h/2,o.z,M);
    box(.07,.055,o.w,frameMat,f,o.sill,o.z,M);box(.07,.055,o.w,frameMat,f,o.sill+o.h,o.z,M);
    box(.07,o.h,.055,frameMat,f,o.sill+o.h/2,o.z-o.w/2,M);box(.07,o.h,.055,frameMat,f,o.sill+o.h/2,o.z+o.w/2,M);
  }

  function louverSide(o,x,isLeft){
    const f=x+(isLeft?-.015:.015),inside=x+(isLeft?.05:-.05),M=OM(o);
    box(.12,o.h-.06,o.w-.06,darkMat,inside,o.sill+o.h/2,o.z,M);
    box(.07,.05,o.w,frameMat,f,o.sill,o.z,M);box(.07,.05,o.w,frameMat,f,o.sill+o.h,o.z,M);
    box(.07,o.h,.05,frameMat,f,o.sill+o.h/2,o.z-o.w/2,M);box(.07,o.h,.05,frameMat,f,o.sill+o.h/2,o.z+o.w/2,M);
  }

  function wallFR(z,x1,x2,ops,isFront,label){
    const M=WM(label),valid=[...ops].filter(o=>o.x>=x1&&o.x<=x2).sort((a,b)=>a.x-b.x);let c=x1;
    valid.forEach(o=>{const l=o.x-o.w/2,r=o.x+o.w/2;if(l>c)box(l-c,H,T,wallMat,(c+l)/2,H/2,z,M);if(o.sill)box(o.w,o.sill,T,wallMat,o.x,o.sill/2,z,M);const top=o.sill+o.h;if(top<H)box(o.w,H-top,T,wallMat,o.x,top+(H-top)/2,z,M);o.type==="louver"?louverFR(o,z,isFront):winFR(o,z,isFront);c=r;});if(c<x2)box(x2-c,H,T,wallMat,(c+x2)/2,H/2,z,M);
  }

  function wallSide(x,z1,z2,ops,isLeft,label){
    const M=WM(label),valid=[...ops].filter(o=>o.z>=z1&&o.z<=z2).sort((a,b)=>a.z-b.z);let c=z1;
    valid.forEach(o=>{const a=o.z-o.w/2,b=o.z+o.w/2;if(a>c)box(T,H,a-c,wallMat,x,H/2,(c+a)/2,M);if(o.sill)box(T,o.sill,o.w,wallMat,x,o.sill/2,o.z,M);const top=o.sill+o.h;if(top<H)box(T,H-top,o.w,wallMat,x,top+(H-top)/2,o.z,M);o.type==="louver"?louverSide(o,x,isLeft):winSide(o,x,isLeft);c=b;});if(c<z2)box(T,H,z2-c,wallMat,x,H/2,(c+z2)/2,M);
  }

  fp.forEach((p,i)=>{const z=frontZ+(p.offset??0);wallFR(z,p.xMin,p.xMax,front,true,`FRONT ${i+1}`);if(i<fp.length-1){const nz=frontZ+(fp[i+1].offset??0);if(Math.abs(nz-z)>.001)box(T,H,Math.abs(nz-z),wallMat,p.xMax,H/2,(z+nz)/2,WM(`FRONT STEP ${i+1}`));}});
  const rearMin=inset?leftX+inset.offset:leftX;
  rp.forEach((p,i)=>{const a=Math.max(p.xMin,rearMin),b=p.xMax;if(b<=a)return;const z=rearZ+(p.offset??0);wallFR(z,a,b,rear,false,`REAR ${i+1}`);if(i<rp.length-1){const nz=rearZ+(rp[i+1].offset??0);if(Math.abs(nz-z)>.001)box(T,H,Math.abs(nz-z),wallMat,p.xMax,H/2,(z+nz)/2,WM(`REAR STEP ${i+1}`));}});

  const lf=fz(leftX+.001),rf=fz(rightX-.001),rr=rz(rightX-.001);
  if(inset){const ix=leftX+inset.offset,lr=rz(ix+.001);wallSide(ix,lr,inset.untilZ,left,true,"LEFT REAR INSET");box(inset.offset,H,T,wallMat,leftX+inset.offset/2,H/2,inset.untilZ,WM("LEFT CONNECTOR"));wallSide(leftX,inset.untilZ,lf,left,true,"LEFT FRONT");}
  else wallSide(leftX,rz(leftX+.001),lf,left,true,"LEFT");
  wallSide(rightX,rr,rf,right,false,"RIGHT");

  return group;
}