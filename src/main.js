// create by LamberthRumpaidus
import './style.css';
import { Game } from './core/Game.js';
try { window.LAST_ASYLUM = new Game(); }
catch(error){console.error('LAST ASYLUM startup error',error);document.getElementById('overlay').innerHTML='<div class="panel"><h2>GAME TIDAK DAPAT DIMULAI</h2><p>Browser ini membutuhkan WebGL2 dan akselerasi grafis. Periksa konsol untuk detail.</p></div>'}
