// TODO: Изучить математику на уровне программирования(тригонометрия, геометрия). Первостепенно: sin,cos,th,ctg,теорема пифагора
// TODO: Изучить WebGL
// TODO: Изучить Canvas на отличном уровне

import '../sass/main.scss';

import $ from 'jquery';
import {Mouse, Ball} from './classesJelly';
import {throttle, debounce} from 'underscore';
import * as THREE from 'three';
import {TweenMax, Power3} from 'gsap';


// THREE.JS 3D SVG
(() => {
    let vertexShader = document.getElementById('vertexShaderWater');
    let fragmentShader = document.getElementById('fragmentShaderWater');
    let container = document.getElementById('3d-svg');
    if (container && vertexShader && fragmentShader) {
        let camera, controls, scene, renderer, geometry;

        function init() {
            scene = new THREE.Scene();
            scene.background = new THREE.Color(0xcccccc);

            renderer = new THREE.WebGLRenderer();
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerHeight);

            container.appendChild(renderer.domElement);

            camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 3000);
            camera.position.z = 500;

            // controls = new THREE.OrbitControls(camera, renderer.domElement);


            let texture = (new THREE.TextureLoader).load('src/assets/img/particle.png');
            let material = new THREE.PointCloudMaterial({
                size: 10,
                vertexColors: THREE.VertexColors,
                map: texture
            });

            geometry = new THREE.Geometry();

            let x, y, z;

            for(let i = 0; i < 1; i++) {
                x = 0;
                y = 0;
                z = 0;

                geometry.vertices.push(new THREE.Vector3(x, y, z));
                geometry.colors.push(new THREE.Color(Math.random(), Math.random(), Math.random()));
            }

            let pointCloud = new THREE.PointCloud(geometry, material);
            scene.add(pointCloud);

            window.addEventListener('resize', onWindowResize, false);
        }

        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        let i = 0;
        function animate() {
            i++;
            requestAnimationFrame(animate);

            geometry.verticesNeedUpdate = true;

            render();
        }

        function render() {
            renderer.render(scene, camera);
        }

        init();
    }
})();


// SIN COS EXPERIMENT
(() => {
    let canvas = document.getElementById('sin-cos-experiment');
    if(canvas) {
        let ctx = canvas.getContext('2d');

        let t = 0;


        function draw() {
            ctx.clearRect(0, 0, 800, 600);
            let i;
            // for (i = 0; i < 360; i += 20) {
            //     ctx.moveTo(i + 5, 180);
            //     ctx.lineTo(i, 180);
            //
            // }
            // ctx.stroke();

            let counter = 1, x = 0, y = 180;

            let increase = 90 / 180 * Math.PI / 9;
            for (i = 0; i <= 960; i += 10) {

                ctx.beginPath();
                ctx.moveTo(x, y);
                x = i;
                y =  200 + 100 * Math.sin(counter + t);
                counter += increase;

                ctx.lineTo(x, y);
                ctx.strokeStyle = '#fff';
                ctx.stroke();
                ctx.closePath();
            }
        }

        function render() {
            requestAnimationFrame(render);
            t += 0.05;
            draw();
        }

        render();
    }
})();

// NEW YEAR THREE
(() => {
    let canvas = document.getElementById('new-year-three');
    if(canvas) {
        let ctx = canvas.getContext('2d');
        let c = 70;
        let t = 10;

        function draw() {
            for(let i = 0; i < c; i++) {
                ctx.beginPath();
                ctx.fillStyle = 'hsl(' + 10*(i%10) + ',100%,50%)';
                ctx.arc(
                    300 + 4*i * Math.sin(i*t),
                    300 + 4*i * Math.cos(i*t),
                    10, 0, 2 * Math.PI);
                ctx.fill();
                ctx.closePath();
            }
        }

        function render() {
            requestAnimationFrame(render);
            ctx.clearRect(0, 0, 800, 600);
            draw();
            t += 0.00005;
        }

        render();
    }
})();

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