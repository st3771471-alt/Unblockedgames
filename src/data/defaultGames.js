export const DEFAULT_GAMES = [
  {
    id: 'neon-snake',
    title: 'Neon Snake',
    category: 'Arcade',
    description: 'Guide the glowing cyber snake to collect energy orbs without crashing into walls or yourself.',
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
    iframeUrl: 'about:blank',
    tags: ['Snake', 'Retro', 'Arcade', 'Neon'],
    controls: 'Arrow Keys or WASD to turn. Space to Pause.',
    author: 'Vault Arcade',
    rating: 4.9,
    featured: true,
    srcDoc: `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Neon Snake</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; }
  body { background: #0b0f19; color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; overflow: hidden; }
  #hud { display: flex; justify-content: space-between; width: 440px; margin-bottom: 12px; font-weight: 600; font-size: 15px; letter-spacing: 0.5px; }
  .stat { background: #1e293b; padding: 6px 14px; border-radius: 8px; border: 1px solid #334155; }
  .stat span { color: #38bdf8; font-weight: bold; }
  canvas { background: #0f172a; border: 2px solid #0284c7; border-radius: 12px; box-shadow: 0 0 25px rgba(2, 132, 199, 0.3); }
  #overlay { position: absolute; background: rgba(11, 15, 25, 0.88); backdrop-filter: blur(4px); border-radius: 12px; width: 440px; height: 440px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
  h1 { font-size: 28px; color: #38bdf8; margin-bottom: 8px; }
  p { color: #94a3b8; font-size: 14px; margin-bottom: 20px; }
  button { background: linear-gradient(135deg, #0284c7, #0369a1); color: white; border: none; padding: 10px 24px; font-size: 16px; font-weight: bold; border-radius: 8px; cursor: pointer; transition: transform 0.1s, box-shadow 0.2s; }
  button:hover { transform: scale(1.05); box-shadow: 0 0 15px rgba(56, 189, 248, 0.5); }
  .hidden { display: none !important; }
</style>
</head>
<body>
  <div id="hud">
    <div class="stat">SCORE: <span id="score">0</span></div>
    <div class="stat">HIGH: <span id="high">0</span></div>
  </div>
  <div style="position: relative;">
    <canvas id="c" width="440" height="440"></canvas>
    <div id="overlay">
      <h1 id="title">NEON SNAKE</h1>
      <p id="msg">Use Arrow Keys or WASD to navigate</p>
      <button id="startBtn">START GAME</button>
    </div>
  </div>
  <script>
    const c = document.getElementById('c'), ctx = c.getContext('2d');
    const scoreEl = document.getElementById('score'), highEl = document.getElementById('high');
    const overlay = document.getElementById('overlay'), titleEl = document.getElementById('title'), msgEl = document.getElementById('msg'), startBtn = document.getElementById('startBtn');
    
    const GRID = 20, COUNT = 22;
    let snake = [], food = {x: 5, y: 5}, dir = {x: 1, y: 0}, nextDir = {x: 1, y: 0};
    let score = 0, high = parseInt(localStorage.getItem('snake_high') || '0');
    let gameLoop = null, running = false;
    
    highEl.innerText = high;

    function reset() {
      snake = [{x: 10, y: 10}, {x: 9, y: 10}, {x: 8, y: 10}];
      dir = {x: 1, y: 0};
      nextDir = {x: 1, y: 0};
      score = 0;
      scoreEl.innerText = score;
      spawnFood();
    }

    function spawnFood() {
      let valid = false;
      while (!valid) {
        food = {
          x: Math.floor(Math.random() * COUNT),
          y: Math.floor(Math.random() * COUNT)
        };
        valid = !snake.some(s => s.x === food.x && s.y === food.y);
      }
    }

    function draw() {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, c.width, c.height);

      // Grid dots
      ctx.fillStyle = '#1e293b';
      for(let x=0; x<COUNT; x++) {
        for(let y=0; y<COUNT; y++) {
          ctx.fillRect(x*GRID + 9, y*GRID + 9, 2, 2);
        }
      }

      // Food
      ctx.fillStyle = '#f43f5e';
      ctx.shadowColor = '#f43f5e';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(food.x * GRID + GRID/2, food.y * GRID + GRID/2, GRID/2 - 2, 0, Math.PI*2);
      ctx.fill();

      // Snake
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 10;
      snake.forEach((segment, idx) => {
        ctx.fillStyle = idx === 0 ? '#38bdf8' : '#0284c7';
        ctx.fillRect(segment.x * GRID + 1, segment.y * GRID + 1, GRID - 2, GRID - 2);
      });
      ctx.shadowBlur = 0;
    }

    function tick() {
      dir = nextDir;
      const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

      // Wall collision
      if (head.x < 0 || head.x >= COUNT || head.y < 0 || head.y >= COUNT) {
        return gameOver();
      }
      // Self collision
      if (snake.some(s => s.x === head.x && s.y === head.y)) {
        return gameOver();
      }

      snake.unshift(head);

      if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreEl.innerText = score;
        if (score > high) {
          high = score;
          highEl.innerText = high;
          localStorage.setItem('snake_high', high);
        }
        spawnFood();
      } else {
        snake.pop();
      }

      draw();
    }

    function gameOver() {
      running = false;
      clearInterval(gameLoop);
      titleEl.innerText = 'GAME OVER';
      msgEl.innerText = 'Final Score: ' + score;
      startBtn.innerText = 'PLAY AGAIN';
      overlay.classList.remove('hidden');
    }

    function start() {
      reset();
      overlay.classList.add('hidden');
      running = true;
      if (gameLoop) clearInterval(gameLoop);
      gameLoop = setInterval(tick, 90);
      draw();
    }

    window.addEventListener('keydown', e => {
      if (!running && (e.code === 'Space' || e.code === 'Enter')) {
        start();
        return;
      }
      switch (e.key) {
        case 'ArrowUp': case 'w': case 'W':
          if (dir.y === 0) nextDir = {x: 0, y: -1}; break;
        case 'ArrowDown': case 's': case 'S':
          if (dir.y === 0) nextDir = {x: 0, y: 1}; break;
        case 'ArrowLeft': case 'a': case 'A':
          if (dir.x === 0) nextDir = {x: -1, y: 0}; break;
        case 'ArrowRight': case 'd': case 'D':
          if (dir.x === 0) nextDir = {x: 1, y: 0}; break;
      }
    });

    startBtn.onclick = start;
    draw();
  </script>
</body>
</html>`
  },
  {
    id: 'puzzle-2048',
    title: '2048 Master',
    category: 'Puzzle',
    description: 'Join tiles with matching numbers to reach the legendary 2048 tile and rack up high scores.',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    iframeUrl: 'about:blank',
    tags: ['Puzzle', 'Numbers', 'Math', 'Brain'],
    controls: 'Arrow Keys or Swipe to slide tiles.',
    author: 'Vault Games',
    rating: 4.8,
    featured: true,
    srcDoc: `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>2048</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; }
  body { background: #0f172a; color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; overflow: hidden; }
  .header { width: 380px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
  .title { font-size: 32px; font-weight: 900; color: #f59e0b; }
  .scores { display: flex; gap: 8px; }
  .score-box { background: #1e293b; border: 1px solid #334155; padding: 4px 12px; border-radius: 6px; text-align: center; }
  .score-label { font-size: 10px; color: #94a3b8; font-weight: bold; }
  .score-val { font-size: 16px; font-weight: bold; color: #f8fafc; }
  #board { width: 380px; height: 380px; background: #1e293b; border-radius: 12px; padding: 12px; display: grid; grid-template-columns: repeat(4, 1fr); grid-gap: 12px; position: relative; border: 2px solid #334155; }
  .cell { background: #334155; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 800; transition: transform 0.1s; }
  .btn-row { width: 380px; display: flex; justify-content: space-between; margin-top: 14px; }
  button { background: #f59e0b; color: #0f172a; border: none; padding: 8px 16px; font-weight: bold; border-radius: 6px; cursor: pointer; }
  button:hover { background: #fbbf24; }
  #overlay { position: absolute; inset: 0; background: rgba(15, 23, 42, 0.9); border-radius: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
  .hidden { display: none !important; }
</style>
</head>
<body>
  <div class="header">
    <div class="title">2048</div>
    <div class="scores">
      <div class="score-box"><div class="score-label">SCORE</div><div class="score-val" id="score">0</div></div>
      <div class="score-box"><div class="score-label">BEST</div><div class="score-val" id="best">0</div></div>
    </div>
  </div>
  <div id="board">
    <div id="overlay" class="hidden">
      <h2 id="over-title" style="font-size: 24px; margin-bottom: 8px;">GAME OVER</h2>
      <button onclick="initGame()">Try Again</button>
    </div>
  </div>
  <div class="btn-row">
    <span style="font-size: 13px; color: #94a3b8; align-self: center;">Use Arrow keys to combine tiles</span>
    <button onclick="initGame()">New Game</button>
  </div>
  <script>
    const board = document.getElementById('board');
    const scoreEl = document.getElementById('score'), bestEl = document.getElementById('best');
    const overlay = document.getElementById('overlay'), overTitle = document.getElementById('over-title');
    let grid = [], score = 0, best = parseInt(localStorage.getItem('2048_best') || '0');
    bestEl.innerText = best;

    const colors = {
      0: '#334155', 2: '#e2e8f0', 4: '#cbd5e1', 8: '#fed7aa', 16: '#fdba74',
      32: '#fb923c', 64: '#f97316', 128: '#fde047', 256: '#facc15', 512: '#eab308',
      1024: '#ca8a04', 2048: '#a16207'
    };
    const textColors = { 0: 'transparent', 2: '#0f172a', 4: '#0f172a' };

    function initGame() {
      grid = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
      score = 0;
      scoreEl.innerText = score;
      overlay.classList.add('hidden');
      spawn();
      spawn();
      render();
    }

    function spawn() {
      let empty = [];
      for(let r=0; r<4; r++) for(let c=0; c<4; c++) if(grid[r][c]===0) empty.push({r,c});
      if(!empty.length) return;
      let spot = empty[Math.floor(Math.random() * empty.length)];
      grid[spot.r][spot.c] = Math.random() < 0.9 ? 2 : 4;
    }

    function render() {
      document.querySelectorAll('.cell').forEach(e => e.remove());
      for(let r=0; r<4; r++) {
        for(let c=0; c<4; c++) {
          const val = grid[r][c];
          const d = document.createElement('div');
          d.className = 'cell';
          d.innerText = val > 0 ? val : '';
          d.style.backgroundColor = colors[val] || '#854d0e';
          d.style.color = (val === 2 || val === 4) ? '#0f172a' : '#ffffff';
          board.appendChild(d);
        }
      }
    }

    function slide(row) {
      let arr = row.filter(v => v);
      for(let i=0; i<arr.length-1; i++) {
        if(arr[i] === arr[i+1]) {
          arr[i] *= 2;
          score += arr[i];
          arr[i+1] = 0;
        }
      }
      arr = arr.filter(v => v);
      while(arr.length < 4) arr.push(0);
      return arr;
    }

    function move(dir) {
      let prev = JSON.stringify(grid);
      if(dir === 'left') {
        grid = grid.map(r => slide(r));
      } else if(dir === 'right') {
        grid = grid.map(r => slide(r.reverse()).reverse());
      } else if(dir === 'up') {
        for(let c=0; c<4; c++) {
          let col = [grid[0][c], grid[1][c], grid[2][c], grid[3][c]];
          col = slide(col);
          for(let r=0; r<4; r++) grid[r][c] = col[r];
        }
      } else if(dir === 'down') {
        for(let c=0; c<4; c++) {
          let col = [grid[0][c], grid[1][c], grid[2][c], grid[3][c]].reverse();
          col = slide(col).reverse();
          for(let r=0; r<4; r++) grid[r][c] = col[r];
        }
      }
      if(JSON.stringify(grid) !== prev) {
        scoreEl.innerText = score;
        if(score > best) {
          best = score;
          bestEl.innerText = best;
          localStorage.setItem('2048_best', best);
        }
        spawn();
        render();
        checkGameOver();
      }
    }

    function checkGameOver() {
      for(let r=0; r<4; r++) {
        for(let c=0; c<4; c++) {
          if(grid[r][c] === 0) return;
          if(r < 3 && grid[r][c] === grid[r+1][c]) return;
          if(c < 3 && grid[r][c] === grid[r][c+1]) return;
        }
      }
      overTitle.innerText = 'GAME OVER';
      overlay.classList.remove('hidden');
    }

    window.addEventListener('keydown', e => {
      if(['ArrowUp','KeyW'].includes(e.code)) { e.preventDefault(); move('up'); }
      if(['ArrowDown','KeyS'].includes(e.code)) { e.preventDefault(); move('down'); }
      if(['ArrowLeft','KeyA'].includes(e.code)) { e.preventDefault(); move('left'); }
      if(['ArrowRight','KeyD'].includes(e.code)) { e.preventDefault(); move('right'); }
    });

    initGame();
  </script>
</body>
</html>`
  },
  {
    id: 'space-defender',
    title: 'Galaxy Defender',
    category: 'Action',
    description: 'Battle waves of alien starships in deep space with rapid laser cannons and energy shields.',
    thumbnail: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=600&q=80',
    iframeUrl: 'about:blank',
    tags: ['Space', 'Shooter', 'Action', 'Retro'],
    controls: 'Left/Right or A/D to move. Space to Fire lasers.',
    author: 'Vault Arcade',
    rating: 4.9,
    featured: true,
    srcDoc: `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Galaxy Defender</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; }
  body { background: #050811; color: #fff; font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; overflow: hidden; }
  #hud { display: flex; justify-content: space-between; width: 440px; margin-bottom: 8px; font-weight: bold; font-size: 14px; }
  canvas { background: #02040a; border: 2px solid #6366f1; border-radius: 12px; box-shadow: 0 0 20px rgba(99, 102, 241, 0.4); }
  #overlay { position: absolute; background: rgba(5, 8, 17, 0.85); width: 440px; height: 500px; border-radius: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
  button { background: #6366f1; color: white; border: none; padding: 10px 24px; font-size: 16px; font-weight: bold; border-radius: 8px; cursor: pointer; margin-top: 15px; }
  button:hover { background: #4f46e5; }
  .hidden { display: none !important; }
</style>
</head>
<body>
  <div id="hud">
    <div>SCORE: <span id="score" style="color: #a5b4fc;">0</span></div>
    <div>LIVES: <span id="lives" style="color: #f43f5e;">❤❤❤</span></div>
    <div>WAVE: <span id="wave" style="color: #38bdf8;">1</span></div>
  </div>
  <div style="position: relative;">
    <canvas id="c" width="440" height="500"></canvas>
    <div id="overlay">
      <h1 id="title" style="font-size: 28px; color: #818cf8; margin-bottom: 8px;">GALAXY DEFENDER</h1>
      <p id="msg" style="color: #94a3b8; font-size: 14px;">Arrow Keys / A & D to move | Space to shoot</p>
      <button id="startBtn">ENGAGE</button>
    </div>
  </div>
  <script>
    const c = document.getElementById('c'), ctx = c.getContext('2d');
    const scoreEl = document.getElementById('score'), livesEl = document.getElementById('lives'), waveEl = document.getElementById('wave');
    const overlay = document.getElementById('overlay'), titleEl = document.getElementById('title'), msgEl = document.getElementById('msg'), startBtn = document.getElementById('startBtn');

    let player = { x: 200, y: 450, w: 32, h: 24, speed: 6 };
    let bullets = [], enemies = [], stars = [], particles = [];
    let keys = {}, score = 0, lives = 3, wave = 1, running = false, lastShot = 0;

    for(let i=0; i<60; i++) stars.push({ x: Math.random()*440, y: Math.random()*500, s: Math.random()*2+0.5, speed: Math.random()*2+0.5 });

    function spawnEnemies() {
      enemies = [];
      const rows = 3 + Math.min(wave, 3);
      const cols = 6;
      for(let r=0; r<rows; r++) {
        for(let col=0; col<cols; col++) {
          enemies.push({
            x: 40 + col * 60,
            y: 40 + r * 45,
            w: 26,
            h: 20,
            color: r === 0 ? '#f43f5e' : (r === 1 ? '#fb923c' : '#38bdf8'),
            hp: r === 0 ? 2 : 1
          });
        }
      }
    }

    let enemyDir = 1, enemySpeed = 1.2;

    function loop() {
      if(!running) return;

      // Update Stars
      stars.forEach(st => {
        st.y += st.speed;
        if(st.y > 500) { st.y = 0; st.x = Math.random()*440; }
      });

      // Player Movement
      if((keys['ArrowLeft'] || keys['KeyA']) && player.x > 10) player.x -= player.speed;
      if((keys['ArrowRight'] || keys['KeyD']) && player.x < 440 - player.w - 10) player.x += player.speed;

      // Shoot
      if(keys['Space'] && Date.now() - lastShot > 160) {
        bullets.push({ x: player.x + player.w/2 - 2, y: player.y, w: 4, h: 12 });
        lastShot = Date.now();
      }

      // Update Bullets
      bullets.forEach(b => b.y -= 9);
      bullets = bullets.filter(b => b.y > -20);

      // Move Enemies
      let hitWall = false;
      enemies.forEach(e => {
        e.x += enemyDir * enemySpeed;
        if(e.x < 15 || e.x > 440 - e.w - 15) hitWall = true;
      });
      if(hitWall) {
        enemyDir *= -1;
        enemies.forEach(e => e.y += 12);
      }

      // Collision Bullets -> Enemies
      bullets.forEach((b, bi) => {
        enemies.forEach((e, ei) => {
          if(b.x < e.x + e.w && b.x + b.w > e.x && b.y < e.y + e.h && b.y + b.h > e.y) {
            bullets.splice(bi, 1);
            e.hp--;
            if(e.hp <= 0) {
              enemies.splice(ei, 1);
              score += 20;
              scoreEl.innerText = score;
              for(let p=0; p<8; p++) particles.push({ x: e.x + e.w/2, y: e.y + e.h/2, vx: (Math.random()-0.5)*5, vy: (Math.random()-0.5)*5, life: 1, color: e.color });
            }
          }
        });
      });

      // Check Enemy Reaching Bottom
      enemies.forEach(e => {
        if(e.y + e.h > player.y) {
          lives--;
          updateLives();
          if(lives <= 0) gameOver();
          else spawnEnemies();
        }
      });

      // Next wave
      if(enemies.length === 0) {
        wave++;
        enemySpeed += 0.3;
        waveEl.innerText = wave;
        spawnEnemies();
      }

      // Draw
      ctx.fillStyle = '#050811';
      ctx.fillRect(0, 0, 440, 500);

      // Stars
      ctx.fillStyle = '#94a3b8';
      stars.forEach(st => ctx.fillRect(st.x, st.y, st.s, st.s));

      // Player
      ctx.fillStyle = '#6366f1';
      ctx.beginPath();
      ctx.moveTo(player.x + player.w/2, player.y);
      ctx.lineTo(player.x + player.w, player.y + player.h);
      ctx.lineTo(player.x, player.y + player.h);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(player.x + player.w/2 - 2, player.y + 6, 4, 8);

      // Bullets
      ctx.fillStyle = '#38bdf8';
      bullets.forEach(b => ctx.fillRect(b.x, b.y, b.w, b.h));

      // Enemies
      enemies.forEach(e => {
        ctx.fillStyle = e.color;
        ctx.fillRect(e.x, e.y, e.w, e.h);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(e.x + 5, e.y + 4, 4, 4);
        ctx.fillRect(e.x + e.w - 9, e.y + 4, 4, 4);
      });

      // Particles
      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy; p.life -= 0.04;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillRect(p.x, p.y, 3, 3);
        ctx.globalAlpha = 1;
      });
      particles = particles.filter(p => p.life > 0);

      requestAnimationFrame(loop);
    }

    function updateLives() {
      livesEl.innerText = '❤'.repeat(Math.max(0, lives));
    }

    function gameOver() {
      running = false;
      titleEl.innerText = 'MISSION FAILED';
      msgEl.innerText = 'Score: ' + score + ' | Waves: ' + wave;
      startBtn.innerText = 'RETRY';
      overlay.classList.remove('hidden');
    }

    function start() {
      score = 0; lives = 3; wave = 1; enemySpeed = 1.2;
      scoreEl.innerText = score; waveEl.innerText = wave;
      updateLives();
      spawnEnemies();
      overlay.classList.add('hidden');
      running = true;
      requestAnimationFrame(loop);
    }

    window.addEventListener('keydown', e => { keys[e.code] = true; });
    window.addEventListener('keyup', e => { keys[e.code] = false; });
    startBtn.onclick = start;
  </script>
</body>
</html>`
  },
  {
    id: 'flappy-pixel',
    title: 'Flappy Orbit',
    category: 'Arcade',
    description: 'Flap through perilous neon pipe gates in this high-precision arcade tap challenge.',
    thumbnail: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=600&q=80',
    iframeUrl: 'about:blank',
    tags: ['Flappy', 'Arcade', 'Tap', 'Precision'],
    controls: 'Space, Click, or Up Arrow to jump/flap.',
    author: 'Vault Games',
    rating: 4.7,
    featured: false,
    srcDoc: `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Flappy Orbit</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; }
  body { background: #0f172a; color: #fff; font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; overflow: hidden; }
  canvas { background: #0284c7; border-radius: 12px; border: 2px solid #38bdf8; }
  #overlay { position: absolute; width: 360px; height: 500px; border-radius: 12px; background: rgba(15, 23, 42, 0.85); display: flex; flex-direction: column; align-items: center; justify-content: center; }
  button { background: #f59e0b; color: #0f172a; border: none; padding: 10px 24px; font-weight: bold; border-radius: 8px; cursor: pointer; margin-top: 15px; font-size: 16px; }
  .hidden { display: none !important; }
</style>
</head>
<body>
  <div style="position: relative;">
    <canvas id="c" width="360" height="500"></canvas>
    <div id="overlay">
      <h1 id="title" style="color: #38bdf8; font-size: 26px; margin-bottom: 6px;">FLAPPY ORBIT</h1>
      <p id="msg" style="color: #cbd5e1; font-size: 14px;">Press Space or Click to Jump</p>
      <button id="startBtn">START</button>
    </div>
  </div>
  <script>
    const c = document.getElementById('c'), ctx = c.getContext('2d');
    const overlay = document.getElementById('overlay'), titleEl = document.getElementById('title'), msgEl = document.getElementById('msg'), startBtn = document.getElementById('startBtn');

    let bird = { x: 60, y: 220, vy: 0, rad: 14 };
    let pipes = [], score = 0, high = parseInt(localStorage.getItem('flappy_high') || '0');
    let running = false, frame = 0;

    function reset() {
      bird.y = 220; bird.vy = 0;
      pipes = []; score = 0; frame = 0;
    }

    function jump() {
      if(!running) return;
      bird.vy = -6.5;
    }

    function loop() {
      if(!running) return;
      frame++;

      bird.vy += 0.32;
      bird.y += bird.vy;

      if(frame % 90 === 0) {
        let gap = 115;
        let topH = Math.floor(Math.random() * (260 - 60)) + 60;
        pipes.push({ x: 360, top: topH, bottom: 500 - topH - gap, scored: false });
      }

      pipes.forEach(p => {
        p.x -= 2.2;
        if(!p.scored && p.x + 50 < bird.x) {
          score++;
          p.scored = true;
          if(score > high) { high = score; localStorage.setItem('flappy_high', high); }
        }
      });
      pipes = pipes.filter(p => p.x > -60);

      // Collisions
      if(bird.y + bird.rad > 500 || bird.y - bird.rad < 0) return gameOver();
      for(let p of pipes) {
        if(bird.x + bird.rad > p.x && bird.x - bird.rad < p.x + 50) {
          if(bird.y - bird.rad < p.top || bird.y + bird.rad > 500 - p.bottom) {
            return gameOver();
          }
        }
      }

      // Draw
      ctx.fillStyle = '#0369a1';
      ctx.fillRect(0, 0, 360, 500);

      // Pipes
      ctx.fillStyle = '#22c55e';
      pipes.forEach(p => {
        ctx.fillRect(p.x, 0, 50, p.top);
        ctx.fillRect(p.x, 500 - p.bottom, 50, p.bottom);
        ctx.fillStyle = '#16a34a';
        ctx.fillRect(p.x - 3, p.top - 16, 56, 16);
        ctx.fillRect(p.x - 3, 500 - p.bottom, 56, 16);
        ctx.fillStyle = '#22c55e';
      });

      // Bird
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(bird.x, bird.y, bird.rad, 0, Math.PI*2);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(bird.x + 5, bird.y - 3, 3, 0, Math.PI*2);
      ctx.fill();
      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.moveTo(bird.x + 8, bird.y);
      ctx.lineTo(bird.x + 18, bird.y + 3);
      ctx.lineTo(bird.x + 8, bird.y + 6);
      ctx.fill();

      // Score
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 28px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(score, 180, 50);

      requestAnimationFrame(loop);
    }

    function gameOver() {
      running = false;
      titleEl.innerText = 'CRASHED!';
      msgEl.innerText = 'Score: ' + score + ' | Best: ' + high;
      startBtn.innerText = 'PLAY AGAIN';
      overlay.classList.remove('hidden');
    }

    function start() {
      reset();
      overlay.classList.add('hidden');
      running = true;
      jump();
      requestAnimationFrame(loop);
    }

    window.addEventListener('keydown', e => {
      if(e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        if(!running) start();
        else jump();
      }
    });
    c.addEventListener('pointerdown', () => {
      if(!running) start();
      else jump();
    });
    startBtn.onclick = start;
  </script>
</body>
</html>`
  },
  {
    id: 'brick-breaker',
    title: 'Neon Breakout',
    category: 'Arcade',
    description: 'Smash every brick on the board with your high-velocity ball and precision paddle control.',
    thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80',
    iframeUrl: 'about:blank',
    tags: ['Breakout', 'Bricks', 'Arcade', 'Retro'],
    controls: 'Left/Right or Mouse to move paddle.',
    author: 'Vault Arcade',
    rating: 4.8,
    featured: false,
    srcDoc: `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Neon Breakout</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; }
  body { background: #0f172a; color: #fff; font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; overflow: hidden; }
  #hud { display: flex; justify-content: space-between; width: 440px; margin-bottom: 8px; font-weight: bold; }
  canvas { background: #020617; border: 2px solid #a855f7; border-radius: 12px; }
  #overlay { position: absolute; width: 440px; height: 480px; background: rgba(15, 23, 42, 0.9); border-radius: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
  button { background: #a855f7; color: white; border: none; padding: 10px 24px; font-weight: bold; border-radius: 8px; cursor: pointer; margin-top: 12px; }
  .hidden { display: none !important; }
</style>
</head>
<body>
  <div id="hud">
    <div>SCORE: <span id="score" style="color: #c084fc;">0</span></div>
    <div>LIVES: <span id="lives" style="color: #f43f5e;">❤❤❤</span></div>
  </div>
  <div style="position: relative;">
    <canvas id="c" width="440" height="480"></canvas>
    <div id="overlay">
      <h1 id="title" style="color: #c084fc; font-size: 26px; margin-bottom: 8px;">NEON BREAKOUT</h1>
      <p id="msg" style="color: #94a3b8; font-size: 14px;">Move mouse or Arrow keys to steer paddle</p>
      <button id="startBtn">START</button>
    </div>
  </div>
  <script>
    const c = document.getElementById('c'), ctx = c.getContext('2d');
    const scoreEl = document.getElementById('score'), livesEl = document.getElementById('lives');
    const overlay = document.getElementById('overlay'), titleEl = document.getElementById('title'), msgEl = document.getElementById('msg'), startBtn = document.getElementById('startBtn');

    let paddle = { x: 180, y: 450, w: 80, h: 12 };
    let ball = { x: 220, y: 430, dx: 3, dy: -4, rad: 6 };
    let bricks = [], score = 0, lives = 3, running = false;
    const colors = ['#f43f5e', '#fb923c', '#eab308', '#22c55e', '#38bdf8', '#a855f7'];

    function initBricks() {
      bricks = [];
      for(let r=0; r<5; r++) {
        for(let col=0; col<7; col++) {
          bricks.push({ x: 16 + col * 59, y: 35 + r * 24, w: 52, h: 18, color: colors[r], alive: true });
        }
      }
    }

    function loop() {
      if(!running) return;

      ball.x += ball.dx;
      ball.y += ball.dy;

      // Wall collision
      if(ball.x - ball.rad < 0 || ball.x + ball.rad > 440) ball.dx *= -1;
      if(ball.y - ball.rad < 0) ball.dy *= -1;

      // Paddle collision
      if(ball.y + ball.rad >= paddle.y && ball.y - ball.rad <= paddle.y + paddle.h &&
         ball.x >= paddle.x && ball.x <= paddle.x + paddle.w) {
        let hitSpot = (ball.x - (paddle.x + paddle.w/2)) / (paddle.w/2);
        ball.dx = hitSpot * 5;
        ball.dy = -Math.abs(ball.dy);
      }

      // Bricks collision
      bricks.forEach(b => {
        if(b.alive && ball.x > b.x && ball.x < b.x + b.w && ball.y > b.y && ball.y < b.y + b.h) {
          b.alive = false;
          ball.dy *= -1;
          score += 15;
          scoreEl.innerText = score;
        }
      });

      if(bricks.every(b => !b.alive)) {
        initBricks();
        ball.dx *= 1.1; ball.dy *= 1.1;
      }

      // Bottom death
      if(ball.y > 480) {
        lives--;
        livesEl.innerText = '❤'.repeat(Math.max(0, lives));
        if(lives <= 0) return gameOver();
        ball = { x: paddle.x + paddle.w/2, y: 430, dx: 3, dy: -4, rad: 6 };
      }

      // Draw
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, 440, 480);

      // Paddle
      ctx.fillStyle = '#a855f7';
      ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);

      // Ball
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.rad, 0, Math.PI*2);
      ctx.fill();

      // Bricks
      bricks.forEach(b => {
        if(b.alive) {
          ctx.fillStyle = b.color;
          ctx.fillRect(b.x, b.y, b.w, b.h);
        }
      });

      requestAnimationFrame(loop);
    }

    function gameOver() {
      running = false;
      titleEl.innerText = 'GAME OVER';
      msgEl.innerText = 'Final Score: ' + score;
      startBtn.innerText = 'PLAY AGAIN';
      overlay.classList.remove('hidden');
    }

    function start() {
      score = 0; lives = 3;
      scoreEl.innerText = score;
      livesEl.innerText = '❤❤❤';
      initBricks();
      ball = { x: 220, y: 430, dx: 3, dy: -4, rad: 6 };
      overlay.classList.add('hidden');
      running = true;
      requestAnimationFrame(loop);
    }

    window.addEventListener('mousemove', e => {
      const rect = c.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      paddle.x = Math.max(0, Math.min(440 - paddle.w, mouseX - paddle.w/2));
    });
    window.addEventListener('keydown', e => {
      if(e.code === 'ArrowLeft') paddle.x = Math.max(0, paddle.x - 20);
      if(e.code === 'ArrowRight') paddle.x = Math.min(440 - paddle.w, paddle.x + 20);
    });
    startBtn.onclick = start;
  </script>
</body>
</html>`
  },
  {
    id: 'pong-pro',
    title: 'Retro Pong Pro',
    category: 'Sports',
    description: 'Fast-paced table tennis showdown against a dynamic AI opponent with angle deflection.',
    thumbnail: 'https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?auto=format&fit=crop&w=600&q=80',
    iframeUrl: 'about:blank',
    tags: ['Pong', 'Retro', 'Sports', '2Player'],
    controls: 'Mouse or W/S to move paddle.',
    author: 'Vault Games',
    rating: 4.6,
    featured: false,
    srcDoc: `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Retro Pong</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; }
  body { background: #090d16; color: #fff; font-family: monospace; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; overflow: hidden; }
  canvas { background: #000; border: 2px solid #22c55e; border-radius: 12px; }
  #hud { display: flex; justify-content: space-around; width: 480px; font-size: 24px; font-weight: bold; margin-bottom: 8px; color: #22c55e; }
  #overlay { position: absolute; width: 480px; height: 380px; background: rgba(0, 0, 0, 0.88); border-radius: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
  button { background: #22c55e; color: #000; border: none; padding: 8px 20px; font-size: 16px; font-weight: bold; border-radius: 6px; cursor: pointer; margin-top: 15px; }
  .hidden { display: none !important; }
</style>
</head>
<body>
  <div id="hud">
    <span>PLAYER: <span id="pScore">0</span></span>
    <span>CPU: <span id="cScore">0</span></span>
  </div>
  <div style="position: relative;">
    <canvas id="c" width="480" height="380"></canvas>
    <div id="overlay">
      <h1 id="title" style="color: #22c55e; margin-bottom: 8px;">PONG CHAMPION</h1>
      <p style="color: #86efac;">First to 5 points wins!</p>
      <button id="startBtn">SERVE BALL</button>
    </div>
  </div>
  <script>
    const c = document.getElementById('c'), ctx = c.getContext('2d');
    const pScoreEl = document.getElementById('pScore'), cScoreEl = document.getElementById('cScore');
    const overlay = document.getElementById('overlay'), titleEl = document.getElementById('title'), startBtn = document.getElementById('startBtn');

    let pY = 150, cY = 150, pH = 70, pW = 10;
    let ball = { x: 240, y: 190, dx: 4, dy: 3, r: 6 };
    let pScore = 0, cScore = 0, running = false;

    function resetBall(dir) {
      ball.x = 240; ball.y = 190;
      ball.dx = (dir || (Math.random() > 0.5 ? 1 : -1)) * 4.5;
      ball.dy = (Math.random() * 4 - 2);
    }

    function loop() {
      if(!running) return;

      ball.x += ball.dx;
      ball.y += ball.dy;

      // Top/bottom walls
      if(ball.y < 0 || ball.y > 380) ball.dy *= -1;

      // CPU tracking
      if(cY + pH/2 < ball.y - 10) cY += 3.8;
      else if(cY + pH/2 > ball.y + 10) cY -= 3.8;
      cY = Math.max(0, Math.min(380 - pH, cY));

      // Player collision
      if(ball.x - ball.r <= 25 && ball.y >= pY && ball.y <= pY + pH) {
        ball.dx = Math.abs(ball.dx) * 1.05;
        let delta = (ball.y - (pY + pH/2)) / (pH/2);
        ball.dy = delta * 5;
      }

      // CPU collision
      if(ball.x + ball.r >= 480 - 25 && ball.y >= cY && ball.y <= cY + pH) {
        ball.dx = -Math.abs(ball.dx) * 1.05;
        let delta = (ball.y - (cY + pH/2)) / (pH/2);
        ball.dy = delta * 5;
      }

      // Score check
      if(ball.x < 0) {
        cScore++;
        cScoreEl.innerText = cScore;
        if(cScore >= 5) gameOver(false);
        else resetBall(1);
      } else if(ball.x > 480) {
        pScore++;
        pScoreEl.innerText = pScore;
        if(pScore >= 5) gameOver(true);
        else resetBall(-1);
      }

      // Draw
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, 480, 380);

      // Center dotted line
      ctx.strokeStyle = '#333';
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(240, 0); ctx.lineTo(240, 380);
      ctx.stroke();
      ctx.setLineDash([]);

      // Paddles
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(15, pY, pW, pH);
      ctx.fillRect(480 - 25, cY, pW, pH);

      // Ball
      ctx.fillStyle = '#fff';
      ctx.fillRect(ball.x - ball.r, ball.y - ball.r, ball.r*2, ball.r*2);

      requestAnimationFrame(loop);
    }

    function gameOver(win) {
      running = false;
      titleEl.innerText = win ? 'YOU WON!' : 'CPU WON!';
      startBtn.innerText = 'PLAY AGAIN';
      overlay.classList.remove('hidden');
    }

    function start() {
      pScore = 0; cScore = 0;
      pScoreEl.innerText = 0; cScoreEl.innerText = 0;
      resetBall();
      overlay.classList.add('hidden');
      running = true;
      requestAnimationFrame(loop);
    }

    c.addEventListener('mousemove', e => {
      const rect = c.getBoundingClientRect();
      pY = Math.max(0, Math.min(380 - pH, (e.clientY - rect.top) - pH/2));
    });
    startBtn.onclick = start;
  </script>
</body>
</html>`
  },
  {
    id: 'block-stacker',
    title: 'Block Drop Classic',
    category: 'Puzzle',
    description: 'Arrange falling tetrominoes into complete horizontal lines to clear board real estate.',
    thumbnail: 'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?auto=format&fit=crop&w=600&q=80',
    iframeUrl: 'about:blank',
    tags: ['Tetris', 'Blocks', 'Puzzle', 'Retro'],
    controls: 'Arrow Keys (Left/Right to move, Up to rotate, Down to soft drop, Space to hard drop).',
    author: 'Vault Arcade',
    rating: 4.9,
    featured: true,
    srcDoc: `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Block Drop</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; }
  body { background: #0f172a; color: #fff; font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; overflow: hidden; }
  .container { display: flex; gap: 16px; align-items: flex-start; }
  canvas { background: #020617; border: 2px solid #38bdf8; border-radius: 8px; }
  .side { display: flex; flex-direction: column; gap: 12px; width: 120px; }
  .box { background: #1e293b; padding: 10px; border-radius: 8px; border: 1px solid #334155; text-align: center; }
  .box-label { font-size: 11px; color: #94a3b8; font-weight: bold; }
  .box-val { font-size: 18px; font-weight: bold; color: #38bdf8; margin-top: 4px; }
  button { background: #38bdf8; color: #0f172a; border: none; padding: 8px; font-weight: bold; border-radius: 6px; cursor: pointer; }
  #overlay { position: absolute; inset: 0; background: rgba(15, 23, 42, 0.9); border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
  .hidden { display: none !important; }
</style>
</head>
<body>
  <div class="container">
    <div style="position: relative;">
      <canvas id="c" width="240" height="440"></canvas>
      <div id="overlay">
        <h2 id="title" style="color: #38bdf8; margin-bottom: 8px; font-size: 20px;">BLOCK DROP</h2>
        <button id="startBtn">PLAY</button>
      </div>
    </div>
    <div class="side">
      <div class="box"><div class="box-label">SCORE</div><div class="box-val" id="score">0</div></div>
      <div class="box"><div class="box-label">LINES</div><div class="box-val" id="lines">0</div></div>
      <div class="box"><div class="box-label">LEVEL</div><div class="box-val" id="level">1</div></div>
      <button onclick="start()">Restart</button>
    </div>
  </div>
  <script>
    const c = document.getElementById('c'), ctx = c.getContext('2d');
    const scoreEl = document.getElementById('score'), linesEl = document.getElementById('lines'), levelEl = document.getElementById('level');
    const overlay = document.getElementById('overlay'), titleEl = document.getElementById('title'), startBtn = document.getElementById('startBtn');

    const COLS = 10, ROWS = 20, BLOCK = 22, X_OFF = 10, Y_OFF = 0;
    let board = Array.from({length: ROWS}, () => Array(COLS).fill(0));
    let score = 0, lines = 0, level = 1, dropInterval = 800, lastDrop = 0, running = false;

    const SHAPES = [
      { color: '#06b6d4', shape: [[1,1,1,1]] }, // I
      { color: '#3b82f6', shape: [[1,0,0],[1,1,1]] }, // J
      { color: '#f97316', shape: [[0,0,1],[1,1,1]] }, // L
      { color: '#eab308', shape: [[1,1],[1,1]] }, // O
      { color: '#22c55e', shape: [[0,1,1],[1,1,0]] }, // S
      { color: '#a855f7', shape: [[0,1,0],[1,1,1]] }, // T
      { color: '#ef4444', shape: [[1,1,0],[0,1,1]] }, // Z
    ];

    let current = null;

    function newPiece() {
      const p = SHAPES[Math.floor(Math.random() * SHAPES.length)];
      current = {
        shape: p.shape,
        color: p.color,
        x: Math.floor(COLS/2) - Math.floor(p.shape[0].length/2),
        y: 0
      };
      if(collide(current)) gameOver();
    }

    function collide(piece) {
      for(let r=0; r<piece.shape.length; r++) {
        for(let col=0; col<piece.shape[r].length; col++) {
          if(piece.shape[r][col]) {
            let bx = piece.x + col, by = piece.y + r;
            if(bx < 0 || bx >= COLS || by >= ROWS) return true;
            if(by >= 0 && board[by][bx]) return true;
          }
        }
      }
      return false;
    }

    function lock() {
      current.shape.forEach((row, r) => {
        row.forEach((val, col) => {
          if(val) {
            let by = current.y + r, bx = current.x + col;
            if(by >= 0) board[by][bx] = current.color;
          }
        });
      });
      clearLines();
      newPiece();
    }

    function clearLines() {
      let cleared = 0;
      for(let r=ROWS-1; r>=0; r--) {
        if(board[r].every(cell => cell !== 0)) {
          board.splice(r, 1);
          board.unshift(Array(COLS).fill(0));
          cleared++;
          r++;
        }
      }
      if(cleared > 0) {
        lines += cleared;
        score += [0, 100, 300, 500, 800][cleared] * level;
        level = Math.floor(lines / 10) + 1;
        dropInterval = Math.max(150, 800 - (level - 1) * 70);
        scoreEl.innerText = score;
        linesEl.innerText = lines;
        levelEl.innerText = level;
      }
    }

    function rotate() {
      const rotated = current.shape[0].map((_, i) => current.shape.map(row => row[i]).reverse());
      const prev = current.shape;
      current.shape = rotated;
      if(collide(current)) current.shape = prev;
    }

    function loop(time = 0) {
      if(!running) return;
      if(time - lastDrop > dropInterval) {
        current.y++;
        if(collide(current)) {
          current.y--;
          lock();
        }
        lastDrop = time;
      }

      // Render
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, 240, 440);

      // Board
      for(let r=0; r<ROWS; r++) {
        for(let col=0; col<COLS; col++) {
          if(board[r][col]) {
            ctx.fillStyle = board[r][col];
            ctx.fillRect(X_OFF + col*BLOCK, r*BLOCK, BLOCK-1, BLOCK-1);
          }
        }
      }

      // Current piece
      if(current) {
        ctx.fillStyle = current.color;
        current.shape.forEach((row, r) => {
          row.forEach((val, col) => {
            if(val) {
              ctx.fillRect(X_OFF + (current.x + col)*BLOCK, (current.y + r)*BLOCK, BLOCK-1, BLOCK-1);
            }
          });
        });
      }

      requestAnimationFrame(loop);
    }

    function gameOver() {
      running = false;
      titleEl.innerText = 'GAME OVER';
      startBtn.innerText = 'TRY AGAIN';
      overlay.classList.remove('hidden');
    }

    function start() {
      board = Array.from({length: ROWS}, () => Array(COLS).fill(0));
      score = 0; lines = 0; level = 1; dropInterval = 800;
      scoreEl.innerText = 0; linesEl.innerText = 0; levelEl.innerText = 1;
      newPiece();
      overlay.classList.add('hidden');
      running = true;
      requestAnimationFrame(loop);
    }

    window.addEventListener('keydown', e => {
      if(!running) return;
      if(e.code === 'ArrowLeft') {
        current.x--;
        if(collide(current)) current.x++;
      } else if(e.code === 'ArrowRight') {
        current.x++;
        if(collide(current)) current.x--;
      } else if(e.code === 'ArrowDown') {
        current.y++;
        if(collide(current)) { current.y--; lock(); }
      } else if(e.code === 'ArrowUp') {
        rotate();
      } else if(e.code === 'Space') {
        while(!collide(current)) current.y++;
        current.y--;
        lock();
      }
    });

    startBtn.onclick = start;
  </script>
</body>
</html>`
  },
  {
    id: 'minesweeper-pro',
    title: 'Minesweeper Tactics',
    category: 'Strategy',
    description: 'Use deductive logic to flag hidden explosive mines across the tactical grid.',
    thumbnail: 'https://images.unsplash.com/photo-1618042164219-62c820f10723?auto=format&fit=crop&w=600&q=80',
    iframeUrl: 'about:blank',
    tags: ['Minesweeper', 'Logic', 'Strategy', 'Puzzle'],
    controls: 'Left Click to sweep, Right Click to place flag.',
    author: 'Vault Games',
    rating: 4.7,
    featured: false,
    srcDoc: `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Minesweeper</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; }
  body { background: #0f172a; color: #fff; font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; overflow: hidden; }
  .panel { background: #1e293b; border: 2px solid #334155; border-radius: 12px; padding: 14px; display: flex; flex-direction: column; gap: 10px; }
  .top { display: flex; justify-content: space-between; align-items: center; background: #0f172a; padding: 8px 14px; border-radius: 8px; }
  .val { font-family: monospace; font-size: 20px; font-weight: bold; color: #ef4444; }
  #grid { display: grid; grid-template-columns: repeat(9, 32px); grid-gap: 3px; }
  .cell { width: 32px; height: 32px; background: #334155; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 15px; cursor: pointer; }
  .cell:hover { background: #475569; }
  .cell.revealed { background: #0f172a; cursor: default; }
  .face { font-size: 22px; cursor: pointer; }
</style>
</head>
<body>
  <div class="panel">
    <div class="top">
      <div class="val" id="mines">010</div>
      <div class="face" id="face" onclick="init()">🙂</div>
      <div class="val" id="timer">000</div>
    </div>
    <div id="grid"></div>
  </div>
  <script>
    const gridEl = document.getElementById('grid'), face = document.getElementById('face');
    const minesEl = document.getElementById('mines'), timerEl = document.getElementById('timer');

    const ROWS = 9, COLS = 9, MINES = 10;
    let board = [], revealedCount = 0, flags = 0, timer = 0, interval = null, started = false, over = false;

    const numColors = { 1: '#38bdf8', 2: '#22c55e', 3: '#ef4444', 4: '#a855f7', 5: '#f97316', 6: '#06b6d4' };

    function init() {
      clearInterval(interval);
      timer = 0; flags = 0; revealedCount = 0; started = false; over = false;
      timerEl.innerText = '000';
      minesEl.innerText = '010';
      face.innerText = '🙂';
      gridEl.innerHTML = '';
      
      board = Array.from({length: ROWS}, () => Array.from({length: COLS}, () => ({ mine: false, count: 0, rev: false, flag: false })));

      // Plant mines
      let planted = 0;
      while(planted < MINES) {
        let r = Math.floor(Math.random() * ROWS), c = Math.floor(Math.random() * COLS);
        if(!board[r][c].mine) { board[r][c].mine = true; planted++; }
      }

      // Count neighbors
      for(let r=0; r<ROWS; r++) {
        for(let c=0; c<COLS; c++) {
          if(board[r][c].mine) continue;
          let cnt = 0;
          for(let dr=-1; dr<=1; dr++) {
            for(let dc=-1; dc<=1; dc++) {
              let nr = r+dr, nc = c+dc;
              if(nr>=0 && nr<ROWS && nc>=0 && nc<COLS && board[nr][nc].mine) cnt++;
            }
          }
          board[r][c].count = cnt;
        }
      }

      // Create HTML cells
      for(let r=0; r<ROWS; r++) {
        for(let c=0; c<COLS; c++) {
          const d = document.createElement('div');
          d.className = 'cell';
          d.oncontextmenu = (e) => { e.preventDefault(); toggleFlag(r, c); };
          d.onclick = () => reveal(r, c);
          d.id = 'c-' + r + '-' + c;
          gridEl.appendChild(d);
        }
      }
    }

    function toggleFlag(r, c) {
      if(over || board[r][c].rev) return;
      board[r][c].flag = !board[r][c].flag;
      flags += board[r][c].flag ? 1 : -1;
      minesEl.innerText = String(Math.max(0, MINES - flags)).padStart(3, '0');
      document.getElementById('c-' + r + '-' + c).innerText = board[r][c].flag ? '🚩' : '';
    }

    function reveal(r, c) {
      if(over || board[r][c].rev || board[r][c].flag) return;
      if(!started) {
        started = true;
        interval = setInterval(() => { timer++; timerEl.innerText = String(timer).padStart(3, '0'); }, 1000);
      }

      board[r][c].rev = true;
      revealedCount++;
      const el = document.getElementById('c-' + r + '-' + c);
      el.classList.add('revealed');

      if(board[r][c].mine) {
        el.innerText = '💣';
        el.style.backgroundColor = '#ef4444';
        return gameOver(false);
      }

      if(board[r][c].count > 0) {
        el.innerText = board[r][c].count;
        el.style.color = numColors[board[r][c].count] || '#fff';
      } else {
        for(let dr=-1; dr<=1; dr++) {
          for(let dc=-1; dc<=1; dc++) {
            let nr = r+dr, nc = c+dc;
            if(nr>=0 && nr<ROWS && nc>=0 && nc<COLS) reveal(nr, nc);
          }
        }
      }

      if(revealedCount === ROWS * COLS - MINES) gameOver(true);
    }

    function gameOver(win) {
      over = true;
      clearInterval(interval);
      face.innerText = win ? '😎' : '😵';
      if(!win) {
        for(let r=0; r<ROWS; r++) {
          for(let c=0; c<COLS; c++) {
            if(board[r][c].mine) {
              const el = document.getElementById('c-' + r + '-' + c);
              el.innerText = '💣';
            }
          }
        }
      }
    }

    init();
  </script>
</body>
</html>`
  },
  {
    id: 'dino-runner',
    title: 'Dino Desert Dash',
    category: 'Casual',
    description: 'Jump over spiky cacti and duck under flying pterodactyls in this infinite runner.',
    thumbnail: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
    iframeUrl: 'about:blank',
    tags: ['Runner', 'Dino', 'Casual', 'Jump'],
    controls: 'Space or Up Arrow to jump, Down Arrow to duck.',
    author: 'Vault Games',
    rating: 4.8,
    featured: false,
    srcDoc: `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Dino Runner</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; }
  body { background: #0f172a; color: #fff; font-family: monospace; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; overflow: hidden; }
  #hud { width: 500px; display: flex; justify-content: space-between; font-size: 16px; font-weight: bold; margin-bottom: 8px; color: #e2e8f0; }
  canvas { background: #1e293b; border: 2px solid #475569; border-radius: 8px; }
  #overlay { position: absolute; width: 500px; height: 220px; background: rgba(15, 23, 42, 0.88); border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
  button { background: #38bdf8; color: #0f172a; border: none; padding: 8px 18px; font-weight: bold; border-radius: 6px; cursor: pointer; margin-top: 10px; }
  .hidden { display: none !important; }
</style>
</head>
<body>
  <div id="hud">
    <span>SCORE: <span id="score" style="color: #38bdf8;">0</span></span>
    <span>HI: <span id="high" style="color: #94a3b8;">0</span></span>
  </div>
  <div style="position: relative;">
    <canvas id="c" width="500" height="220"></canvas>
    <div id="overlay">
      <h2 id="title" style="color: #38bdf8; margin-bottom: 6px;">DINO DASH</h2>
      <p style="color: #cbd5e1; font-size: 13px;">Press Space or Up Arrow to Jump</p>
      <button id="startBtn">START RUN</button>
    </div>
  </div>
  <script>
    const c = document.getElementById('c'), ctx = c.getContext('2d');
    const scoreEl = document.getElementById('score'), highEl = document.getElementById('high');
    const overlay = document.getElementById('overlay'), titleEl = document.getElementById('title'), startBtn = document.getElementById('startBtn');

    let dino = { x: 40, y: 160, w: 22, h: 32, vy: 0, grounded: true };
    let obstacles = [], score = 0, high = parseInt(localStorage.getItem('dino_hi') || '0');
    let speed = 5, running = false, frame = 0;
    highEl.innerText = high;

    function jump() {
      if(dino.grounded) {
        dino.vy = -10.5;
        dino.grounded = false;
      }
    }

    function loop() {
      if(!running) return;
      frame++;
      score++;
      scoreEl.innerText = Math.floor(score/5);
      if(Math.floor(score/5) > high) { high = Math.floor(score/5); highEl.innerText = high; localStorage.setItem('dino_hi', high); }

      speed += 0.001;

      // Dino physics
      dino.vy += 0.55;
      dino.y += dino.vy;
      if(dino.y >= 160) {
        dino.y = 160;
        dino.vy = 0;
        dino.grounded = true;
      }

      // Obstacles
      if(frame % Math.floor(Math.max(60, 100 - speed*3)) === 0 && Math.random() > 0.3) {
        obstacles.push({ x: 500, y: 168, w: 16, h: 24 });
      }

      obstacles.forEach(o => o.x -= speed);
      obstacles = obstacles.filter(o => o.x > -30);

      // Collision
      for(let o of obstacles) {
        if(dino.x < o.x + o.w && dino.x + dino.w > o.x && dino.y < o.y + o.h && dino.y + dino.h > o.y) {
          return gameOver();
        }
      }

      // Draw
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, 500, 220);

      // Ground
      ctx.fillStyle = '#475569';
      ctx.fillRect(0, 192, 500, 2);

      // Dino
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(dino.x, dino.y, dino.w, dino.h);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(dino.x + 14, dino.y + 4, 4, 4);

      // Obstacles
      ctx.fillStyle = '#ef4444';
      obstacles.forEach(o => ctx.fillRect(o.x, o.y, o.w, o.h));

      requestAnimationFrame(loop);
    }

    function gameOver() {
      running = false;
      titleEl.innerText = 'GAME OVER';
      startBtn.innerText = 'RUN AGAIN';
      overlay.classList.remove('hidden');
    }

    function start() {
      score = 0; speed = 5; frame = 0;
      obstacles = [];
      dino.y = 160; dino.vy = 0; dino.grounded = true;
      overlay.classList.add('hidden');
      running = true;
      requestAnimationFrame(loop);
    }

    window.addEventListener('keydown', e => {
      if(e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        if(!running) start();
        else jump();
      }
    });
    c.addEventListener('pointerdown', () => {
      if(!running) start();
      else jump();
    });
    startBtn.onclick = start;
  </script>
</body>
</html>`
  }
];
