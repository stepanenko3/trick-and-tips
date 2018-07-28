let canvas = document.querySelector('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let ctx = canvas.getContext('2d');
// ctx.fillStyle = 'blue';
// ctx.fillRect(10, 10, 100, 100);
// ctx.fillStyle = 'yellow';
// ctx.fillRect(10, 240, 100, 100);
// ctx.fillStyle = 'green';
// ctx.fillRect(240, 10, 100, 100);
// ctx.fillStyle = 'red';
// ctx.fillRect(120, 120, 100, 100);
// ctx.fillStyle = 'orange';
// ctx.fillRect(240, 240, 100, 100);
//
// ctx.beginPath();
// ctx.moveTo(300, 300);
// ctx.lineTo(400, 400);
// ctx.lineTo(400, 500);
// ctx.strokeStyle = 'red';
// ctx.stroke();

// ctx.beginPath();
// ctx.arc(500, 500, 40, 0, Math.PI * 2, false);
// ctx.strokeStyle = 'blue';
// ctx.stroke();

// for(let i = 0; i < 10; i++) {
//     let x = Math.random() * window.innerWidth;
//     let y = Math.random() * window.innerHeight;
//
//     ctx.beginPath();
//     ctx.arc(x, y, 40, 0, Math.PI * 2, false);
//     ctx.strokeStyle = 'blue';
//     ctx.stroke();
// }

let circleArray = [];
let mouse = {
    x: undefined,
    y: undefined
};

let maxRadius = 50;

let colorArray = [
    '#ffaa33',
    '#99ffaa',
    '#00ff00',
    '#4411aa',
    '#ff1100',
];

window.addEventListener('mousemove', e => {
    mouse.x = e.x;
    mouse.y = e.y;
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    init();
});

function Circle(x, y, dx, dy, r) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.r = r;
    this.color = colorArray[Math.floor(Math.random() * colorArray.length)];
    this.minR = r;

    this.draw = function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    };

    this.update = function() {
        if(this.x + this.r > innerWidth || this.x - this.r < 0) {
            this.dx = -this.dx;
        }

        if(this.y + this.r > innerHeight || this.y - this.r < 0) {
            this.dy = -this.dy;
        }

        this.x+= this.dx;
        this.y+= this.dy;

        // interactivity

        if(mouse.x - this.x < 50 && mouse.x - this.x > -50 && mouse.y - this.y < 50 && mouse.y - this.y > -50) {
            if(this.r < maxRadius) {
                this.r += 1;
            }
        } else if(this.r > this.minR) {
            this.r -= 1
        }

        this.draw();
    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    for(let i = 0; i < circleArray.length; i++) {
        circleArray[i].update();
    }
}

function init() {
    circleArray = [];

    for(let i = 0; i < 800; i++) {
        let r = Math.random() * 3 + 1;
        let x = Math.random() * (innerWidth - r * 2) + r;
        let y = Math.random() * (innerHeight - r * 2) + r;
        let dx = (Math.random() - 0.5) * 1.5;
        let dy = (Math.random() - 0.5) * 1.5;

        circleArray.push(new Circle(x, y, dx, dy, r))
    }

    animate();
}

init();