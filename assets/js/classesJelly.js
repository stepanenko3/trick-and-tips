export class Mouse {
    constructor(canvas) {
        this.x = 0;
        this.y = 0;

        canvas.onmousemove = (e) => {
            let rect = canvas.getBoundingClientRect();
            this.x = e.clientX - rect.left;
            this.y = e.clientY - rect.top;
        }
    }
}

export class Ball {
    constructor(x=0, y=0, radius=5, color='#ff6600') {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }

    setPos(x, y) {
        this.x = x;
        this.y = y;
    }

    think(mouse) {
        let dx = this.x - mouse.x;
        let dy = this.y - mouse.y;

        let dist = Math.sqrt(dx*dx + dy*dy);

        if(dist > 100) {

        }
    }

    draw(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }
}