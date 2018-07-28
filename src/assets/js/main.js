// TODO: Изучить математику на уровне программирования(тригонометрия, геометрия). Первостепенно: sin,cos,th,ctg,теорема пифагора
// TODO: Изучить WebGL
// TODO: Изучить Canvas на отличном уровне

import '../sass/main.scss';

import {Mouse, Ball} from './classesJelly';

let canvas = document.getElementById('canvas-jelly');
let ctx = canvas.getContext('2d');
let pos = new Mouse(canvas);

let balls = [];
for(let i = 0; i < 1; i++) {
    balls.push(new Ball(Math.random() * 800, Math.random() * 600));
}

function render() {
    requestAnimationFrame(render);

    ctx.clearRect(0, 0, 800, 600);
    balls.forEach(ball => {
        ball.think(pos);
        ball.draw(ctx);
    });
}

render();