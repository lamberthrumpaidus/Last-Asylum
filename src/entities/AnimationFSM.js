// create by LamberthRumpaidus
// Optional GLB skeletal animation layer. Procedural hero is playable without imported rigs.
import * as THREE from 'three';
export class AnimationFSM {
  constructor(root,clips,transitions={idle:.18,run:.14,dash:.08,attack:.06,hurt:.05}){this.mixer=new THREE.AnimationMixer(root);this.actions=new Map();this.current=null;this.transitions=transitions;
    for(const clip of clips){const action=this.mixer.clipAction(clip);this.actions.set(clip.name.toLowerCase(),action)}
  }
  play(state){const next=this.actions.get(state);if(!next||state===this.current)return false;
    const prev=this.current?this.actions.get(this.current):null;next.enabled=true;next.reset().fadeIn(this.transitions[state]??.14).play();prev?.fadeOut(this.transitions[state]??.14);this.current=state;return true
  }
  tick(dt){this.mixer.update(dt)}
  dispose(){this.mixer.stopAllAction()}
}
