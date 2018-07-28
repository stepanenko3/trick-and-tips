// TODO: Изучить математику на уровне программирования(тригонометрия, геометрия). Первостепенно: sin,cos,th,ctg,теорема пифагора
// TODO: Изучить WebGL
// TODO: Изучить Canvas на отличном уровне

import '../sass/main.scss';

import $ from 'jquery';
import {Mouse, Ball} from './classesJelly';
import {throttle, debounce} from 'underscore';
import * as THREE from 'three';
import {TweenMax, Power3} from 'gsap';

// THREE.JS SHADER WATER
(() => {
    let vertexShader = document.getElementById('vertexShaderWater');
    let fragmentShader = document.getElementById('fragmentShaderWater');
    let container = document.getElementById('shader-water');
    if (container && vertexShader && fragmentShader) {
        let camera, scene, renderer;
        let uniforms = [];
        let mouse = {x: 0, y: 0};
        let loader = new THREE.TextureLoader();
        document.onmousemove = getMouseXY;

        let MyTexture = loader.load('src/assets/img/foto.jpg', () => {
            init();
            animate();
        });

        function getMouseXY(e) {
            mouse.x = e.pageX;
            mouse.y = e.pageY;
            uniforms.u_mouse.value.x = mouse.x;
            uniforms.u_mouse.value.y = mouse.y;
        }

        function init() {
            camera = new THREE.Camera();
            camera.position.z = 1;

            scene = new THREE.Scene();

            let geometry = new THREE.PlaneBufferGeometry(2, 2);

            uniforms = {
                u_time: {type: "f", value: 1.0},
                u_animation: {type: "f", value: 0.0},
                u_mouse: {type: "v2", value: new THREE.Vector2()},
                u_resolution: {type: "v2", value: new THREE.Vector2()},
                u_size: {type: "v2", value: new THREE.Vector2(MyTexture.image.width, MyTexture.image.height)},
                texture: {value: MyTexture},
                map: {value: loader.load('src/assets/img/popkamap.jpg')}
            };

            let material = new THREE.ShaderMaterial({
                uniforms: uniforms,
                vertexShader: vertexShader.textContent,
                fragmentShader: fragmentShader.textContent
            });

            let mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);

            renderer = new THREE.WebGLRenderer();
            renderer.setPixelRatio(window.devicePixelRatio);

            container.appendChild(renderer.domElement);

            onWindowResize();
            window.addEventListener('resize', onWindowResize, false);

            document.onmousemove = (e) => {
                uniforms.u_mouse.value.x = e.pageX;
                uniforms.u_mouse.value.y = e.pageY;
            }
        }

        function onWindowResize(event) {
            renderer.setSize(window.innerWidth, window.innerHeight);
            uniforms.u_resolution.value.x = renderer.domElement.width;
            uniforms.u_resolution.value.y = renderer.domElement.height;
            uniforms.u_mouse.value.x = mouse.x;
            uniforms.u_mouse.value.y = mouse.y;
        }

        function animate() {
            requestAnimationFrame(animate);
            render();
        }

        function render() {
            uniforms.u_time.value += 0.05;
            renderer.render(scene, camera);
        }

        document.addEventListener('click', () => {
           TweenMax.to(uniforms.u_animation, 2, {value: 1, ease: Power3.easeInOut})
        });
    }
})();

// CANVAS JELLY EFFECT
(() => {
    let canvas = document.getElementById('canvas-jelly');
    if (canvas) {
        let ctx = canvas.getContext('2d');
        let pos = new Mouse(canvas);

        let balls = [];
        for (let i = 0; i < 1; i++) {
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
    }
})();

// SKEW JELLY TEXT
(() => {
    let maxSpeed = 50;

    let checkScrollSpeed = (function (settings) {
        settings = settings || {};

        let lastPos, newPos, timer, delta,
            delay = settings.delay || 50; // in "ms" (higher means lower fidelity )

        function clear() {
            lastPos = null;
            delta = 0;
        }

        clear();

        return function () {
            newPos = window.scrollY;
            if (lastPos != null) { // && newPos < maxScroll
                delta = newPos - lastPos;
            }
            lastPos = newPos;
            clearTimeout(timer);
            timer = setTimeout(clear, delay);
            return delta;
        };
    })();

    let setSkew = throttle((skew) => {
        $('p').css('transform', 'skewY(' + skew + 'deg)');
    }, 16);

    let setBack = debounce(() => {
        setSkew(0);
    }, 50);

    $(window).on('scroll', () => {
        let speed = checkScrollSpeed();
        if (speed > maxSpeed) speed = maxSpeed;
        if (speed < -maxSpeed) speed = -maxSpeed;
        setSkew(speed / 10);
        setBack();
    });
})();