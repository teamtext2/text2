(function(){
  // Starfield background script
  const canvas = document.getElementById('stars');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const dpr = window.devicePixelRatio || 1;

  function resize(){
    // reset transforms then set logical size for DPR
    ctx.setTransform(1,0,0,1,0,0);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.scale(dpr, dpr);
  }

  // Create stars with random properties
  function createStars(count){
    return Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.5 + 0.2,
      s: Math.random() * 0.6 + 0.05
    }));
  }

  resize();
  window.addEventListener('resize', () => { resize(); });

  let stars = createStars(150);

  // If the window size changes significantly, re-generate stars so positions fit new size
  let lastW = window.innerWidth;
  let lastH = window.innerHeight;
  window.addEventListener('resize', () => {
    if (Math.abs(window.innerWidth - lastW) > 80 || Math.abs(window.innerHeight - lastH) > 80) {
      stars = createStars(stars.length);
      lastW = window.innerWidth; lastH = window.innerHeight;
    }
  });

  function animate(){
    // Draw a translucent rect each frame to create nice trailing/fade effect
    ctx.fillStyle = 'rgba(13,13,13,0.32)';
    ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);

    ctx.fillStyle = 'white';
    for (let i = 0; i < stars.length; i++){
      const star = stars[i];
      star.x += star.s;
      if (star.x > window.innerWidth + 10) star.x = -10;
      // slight twinkle by varying alpha by small random
      ctx.globalAlpha = 0.7 + Math.sin((performance.now() / 1000) + i) * 0.25;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(animate);
  }

  // Start animation loop
  animate();
})();
