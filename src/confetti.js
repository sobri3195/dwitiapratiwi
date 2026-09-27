const COLORS = ['#f5d07a', '#d05b6e', '#fff4df', '#9d3146', '#e8a5ac'];

export function launchConfetti(canvas) {
  const context = canvas.getContext('2d');
  const ratio = Math.min(window.devicePixelRatio, 2);
  canvas.width = innerWidth * ratio;
  canvas.height = innerHeight * ratio;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  const pieces = Array.from({ length: innerWidth < 600 ? 80 : 150 }, () => ({
    x: innerWidth / 2 + (Math.random() - 0.5) * 100,
    y: innerHeight * 0.55,
    vx: (Math.random() - 0.5) * 14,
    vy: -Math.random() * 13 - 5,
    size: Math.random() * 7 + 4,
    rotation: Math.random() * Math.PI,
    spin: (Math.random() - 0.5) * 0.3,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  }));
  let frame;
  const start = performance.now();
  function draw(now) {
    context.clearRect(0, 0, innerWidth, innerHeight);
    pieces.forEach((piece) => {
      piece.x += piece.vx; piece.vy += 0.22; piece.y += piece.vy; piece.rotation += piece.spin;
      context.save(); context.translate(piece.x, piece.y); context.rotate(piece.rotation);
      context.fillStyle = piece.color; context.fillRect(-piece.size / 2, -piece.size / 4, piece.size, piece.size / 2); context.restore();
    });
    if (now - start < 3500) frame = requestAnimationFrame(draw);
    else context.clearRect(0, 0, innerWidth, innerHeight);
  }
  cancelAnimationFrame(frame);
  requestAnimationFrame(draw);
}
