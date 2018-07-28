(() => {
    let canvas = document.querySelector('canvas');
    let ctx = canvas.getContext('2d');

    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    let random = n => Math.random() * n;
    let stars = new Array(1000).fill().map(() => {
        return {r: random(w), s: random(0.01), a: random(Math.PI*2)};
    });

    function loop() {
        ctx.fillStyle = 'rgba(0,0,8,.1)';
        ctx.fillRect(0,0,w,h);
        stars.forEach(e => {
            e.a+=e.s;
            ctx.beginPath();
            ctx.arc(Math.cos(e.a) * e.r + w/2, Math.sin(e.a)*e.r + h/2, 1,0,Math.PI*2);
            ctx.closePath();
            ctx.fillStyle = 'white';
            ctx.fill();
        });

        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    window.addEventListener('resize', () => {
        let w = canvas.width = window.innerWidth;
        let h = canvas.height = window.innerHeight;
    });
})();