// create by LamberthRumpaidus
import * as THREE from 'three';
// Dense slot manager: one draw call per material/geometry/chunk, no per-entity Mesh allocations.
export class InstancePool {
  constructor(scene,geometry,material,capacity=128){this.mesh=new THREE.InstancedMesh(geometry,material,capacity);this.mesh.count=0;this.mesh.frustumCulled=false;this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);this.items=[];this.capacity=capacity;scene.add(this.mesh);this.dummy=new THREE.Object3D()}
  set(items,locate){const count=Math.min(items.length,this.capacity);this.mesh.count=count;const d=this.dummy;for(let i=0;i<count;i++){const item=items[i];const p=locate(item,i);d.position.set(p.x,p.y||0,p.z);d.rotation.set(0,p.rot||0,0);d.scale.setScalar(p.size||1);d.updateMatrix();this.mesh.setMatrixAt(i,d.matrix)}this.mesh.instanceMatrix.needsUpdate=true;this.mesh.computeBoundingSphere()}
  dispose(){this.mesh.parent?.remove(this.mesh);this.mesh.dispose?.()}
}
// Geometry is shared; chunk visibility is checked against the camera frustum, not just distance.
export function visibleChunks(camera,chunks){const frustum=new THREE.Frustum();const matrix=new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse);frustum.setFromProjectionMatrix(matrix);for(const c of chunks)c.mesh.visible=frustum.intersectsSphere(c.bounds)}
