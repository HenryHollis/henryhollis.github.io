/* assets/js/game-of-life.js */
(function() {
    // CONFIGURATION
    const colors = {
      alive: '#2E8B57', // SeaGreen (Matches your bio theme)
      dead:  '#000000'  // Transparent/Black
    };
    const cellSize = 10; // Pixel size (bigger = more retro)
    const speed = 100;   // Speed in ms
  
    // SETUP CANVAS
    const footer = document.querySelector('.page__footer');
    if (!footer) return;
  
    // Create canvas and style it to sit behind footer content
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '0'; // Behind text
    canvas.style.opacity = '0.3'; // Subtle effect
    canvas.style.pointerEvents = 'none'; // Let clicks pass through to links
    
    // Ensure footer text sits on top
    footer.style.position = 'relative'; 
    const footerContent = footer.querySelector('footer') || footer.firstElementChild;
    if (footerContent) {
        footerContent.style.position = 'relative';
        footerContent.style.zIndex = '1';
    }
  
    footer.insertBefore(canvas, footer.firstChild);
    const ctx = canvas.getContext('2d');
  
    // STATE
    let width, height, cols, rows;
    let grid;
  
    function resize() {
      width = footer.clientWidth;
      height = footer.clientHeight;
      canvas.width = width;
      canvas.height = height;
      cols = Math.ceil(width / cellSize);
      rows = Math.ceil(height / cellSize);
      initGrid();
    }
  
    function initGrid() {
      grid = new Array(cols).fill(null).map(() => 
        new Array(rows).fill(null).map(() => Math.random() > 0.85 ? 1 : 0) // 15% start alive
      );
    }
  
    function draw() {
      // Clear with a slight fade for trails (optional, use clearRect for clean look)
      ctx.clearRect(0, 0, width, height);
      
      ctx.fillStyle = colors.alive;
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          if (grid[i][j]) {
            ctx.fillRect(i * cellSize, j * cellSize, cellSize - 1, cellSize - 1);
          }
        }
      }
    }
  
    function update() {
      const next = grid.map(arr => [...arr]);
  
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const state = grid[i][j];
          
          // Count neighbors
          let neighbors = 0;
          for (let x = -1; x < 2; x++) {
            for (let y = -1; y < 2; y++) {
              if (x === 0 && y === 0) continue;
              const col = (i + x + cols) % cols;
              const row = (j + y + rows) % rows;
              neighbors += grid[col][row];
            }
          }
  
          // Rules of Life
          if (state === 0 && neighbors === 3) next[i][j] = 1;
          else if (state === 1 && (neighbors < 2 || neighbors > 3)) next[i][j] = 0;
          else next[i][j] = state;
        }
      }
      grid = next;
    }
  
    function loop() {
      update();
      draw();
      setTimeout(() => requestAnimationFrame(loop), speed);
    }
  
    // INITIALIZE
    window.addEventListener('resize', resize);
    resize();
    loop();
  })();