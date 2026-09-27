import * as THREE from 'three';

export function createBirthdayScene(canvas) {
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x4b1824, 0.038);
  const camera = new THREE.PerspectiveCamera(42, innerWidth / innerHeight, 0.1, 100);
  camera.position.set(0, 1.2, 12);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
  renderer.setSize(innerWidth, innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  scene.add(new THREE.AmbientLight(0xffd8ca, 1.7));
  const warmLight = new THREE.PointLight(0xffb56b, 35, 18);
  warmLight.position.set(2, 4, 4); scene.add(warmLight);
  const group = new THREE.Group(); scene.add(group);

  const cakeMaterial = new THREE.MeshStandardMaterial({ color: 0xf0c5b8, roughness: 0.75 });
  const cake = new THREE.Mesh(new THREE.CylinderGeometry(2, 2.15, 1.35, 48), cakeMaterial);
  cake.position.set(2.7, -2.25, -1.5); group.add(cake);
  const icing = new THREE.Mesh(new THREE.CylinderGeometry(2.03, 2.03, 0.2, 48), new THREE.MeshStandardMaterial({ color: 0xfff1dc }));
  icing.position.set(2.7, -1.53, -1.5); group.add(icing);
  const candle = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.9, 16), new THREE.MeshStandardMaterial({ color: 0xd45968 }));
  candle.position.set(2.7, -0.98, -1.5); group.add(candle);
  const flame = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 16), new THREE.MeshBasicMaterial({ color: 0xffc65c }));
  flame.scale.y = 1.7; flame.position.set(2.7, -0.36, -1.5); group.add(flame);

  const balloonGeo = new THREE.SphereGeometry(0.72, 20, 20);
  const balloons = [];
  [[-4,2,-2,0xb7475b],[-2.8,3,-4,0xe9a2a7],[4.3,2.7,-4,0xe2bd70],[5.2,0.8,-5,0xa72e45]].forEach(([x,y,z,color], index) => {
    const mesh = new THREE.Mesh(balloonGeo, new THREE.MeshStandardMaterial({ color, roughness: 0.55 }));
    mesh.scale.y = 1.2; mesh.position.set(x,y,z); mesh.userData.phase = index; group.add(mesh); balloons.push(mesh);
    const points = [new THREE.Vector3(x,y-0.85,z), new THREE.Vector3(x + 0.25,y-2.2,z)];
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), new THREE.LineBasicMaterial({ color: 0xe8c99a, transparent: true, opacity: 0.5 })); group.add(line);
  });

  const petalGeo = new THREE.SphereGeometry(0.12, 8, 5); const petals = [];
  for (let i = 0; i < 42; i++) {
    const petal = new THREE.Mesh(petalGeo, new THREE.MeshBasicMaterial({ color: i % 3 ? 0xd66676 : 0xffb4b4, transparent: true, opacity: 0.7 }));
    petal.scale.set(1.6, 0.35, 1); petal.position.set((Math.random()-.5)*16, Math.random()*12-5, (Math.random()-.5)*8-2);
    petal.userData.speed = .006 + Math.random()*.01; group.add(petal); petals.push(petal);
  }
  const starGeo = new THREE.BufferGeometry(); const positions = new Float32Array(210 * 3);
  for (let i=0;i<positions.length;i++) positions[i] = (Math.random()-.5) * (i%3 === 2 ? 14 : 22);
  starGeo.setAttribute('position', new THREE.BufferAttribute(positions,3));
  const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color:0xffdf9c, size:.035, transparent:true, opacity:.85 })); scene.add(stars);

  const clock = new THREE.Clock(); let animationId; let destroyed = false;
  function animate() {
    const t = clock.getElapsedTime();
    balloons.forEach((b) => { b.position.y += Math.sin(t*.8+b.userData.phase)*.0015; b.rotation.z=Math.sin(t*.5+b.userData.phase)*.04; });
    petals.forEach((p) => { p.position.y -= p.userData.speed; p.rotation.x += .006; p.rotation.z += .004; if(p.position.y < -6) p.position.y=6; });
    flame.scale.setScalar(1 + Math.sin(t*12)*.08); flame.scale.y=1.7;
    stars.rotation.y=t*.008; group.rotation.y=Math.sin(t*.18)*.025;
    renderer.render(scene,camera); if (!destroyed) animationId=requestAnimationFrame(animate);
  }
  animate();
  function resize() { camera.aspect=innerWidth/innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth,innerHeight); renderer.setPixelRatio(Math.min(devicePixelRatio,1.6)); }
  addEventListener('resize',resize,{passive:true});
  return { destroy() { destroyed=true; cancelAnimationFrame(animationId); removeEventListener('resize',resize); scene.traverse((obj)=>{ obj.geometry?.dispose(); if(Array.isArray(obj.material)) obj.material.forEach(m=>m.dispose()); else obj.material?.dispose(); }); renderer.dispose(); } };
}
