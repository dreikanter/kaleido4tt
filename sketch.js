let objs = [];
let maxNum = 3000;
let minSize = 10;
let maxSize = 150;
let minAlp = 200;
let back_col;
let canvas_size = 500;
let quart_size = canvas_size/4;
let pg;
let size1 = canvas_size;
let pg2;
let size2 = size1;
let size3 = quart_size;
let time_scale=1500;
let min_col = 50;
let max_col = 255;
let triangleMask;
let rotatedBuffer;
let kaleidoscopeBuffer;

function setup() {
  back_col = color(random(min_col,max_col),random(min_col,max_col), random(min_col,max_col));
  createCanvas(windowWidth, windowHeight);

  pg = createGraphics(size1, size1);
  pg2 = createGraphics(size2, size2);
  pg3 = createGraphics(size3, size3);
  triangleMask = createGraphics(quart_size, quart_size);
  rotatedBuffer = createGraphics(quart_size, quart_size);
  kaleidoscopeBuffer = createGraphics(canvas_size, canvas_size);

  pg.angleMode(DEGREES);
  pg2.angleMode(DEGREES);
  triangleMask.angleMode(DEGREES);
  rotatedBuffer.angleMode(DEGREES);
  kaleidoscopeBuffer.angleMode(DEGREES);
  angleMode(DEGREES);

  pg.background(back_col);
  pg.noStroke();
  pg.translate(quart_size,quart_size);

  triangleMask.background(0);
  triangleMask.fill(255);
  triangleMask.noStroke();
  triangleMask.triangle(0, 0, quart_size, 0, quart_size, quart_size);

  background(back_col);
  drawArr(pg);
  frameRate(30);
  console.log("Setup done!");
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function genRand() {
  let x = random(-quart_size-maxSize,canvas_size-maxSize);
  let y = random(-quart_size-maxSize,canvas_size-maxSize);
  let x2 = random(random(4) % 2 == 1? x + random(maxSize/4) : x - random(maxSize/4));
  let y2 = random(random(4) % 2 == 1? y + random(maxSize/4) : y - random(maxSize/4));
  let x3 = random(random(4) % 2 == 1? x + random(maxSize/4) : x - random(maxSize/4));
  let y3 = random(random(4) % 2 == 1? y + random(maxSize/4) : y - random(maxSize/4));

  let w = int(random(minSize, maxSize));
  let h = int(random(minSize, maxSize));
  let r = random(min_col, max_col);
  let g = random(min_col,max_col);
  let b = random(min_col,max_col);
  let c = color(r,g,b, random(minAlp, 255));
  if (c == back_col) c = color(r,g,b, random(minAlp, 255));
  let shape = int(random(0, 5));
  let angle = int(random(0, 90));
  return [x,y,w,h,c,shape,angle,x2,y2,x3,y3];
}

function drawArr(buf) {
  for (i=0; i < maxNum; i++){
    if(objs.length < maxNum) {
      let newobj = genRand();
      objs.push(newobj);
    }
    drawPrim(buf,objs[i]);
  }
}

function drawPrim(buf, prim) {
  buf.fill(prim[4]);
  buf.rotate(-prim[6]);
  switch(prim[5]) {
    case 0: buf.square(prim[0], prim[1], prim[2]/4);break;
    case 1: buf.rect(prim[0], prim[1], prim[2]/2, prim[3]); break;
    case 2: buf.circle(prim[0],prim[1],prim[2]/4); break;
    case 3:buf.ellipse(prim[0],prim[1],prim[2]/2,prim[3]/2);break;
    case 4:buf.triangle(prim[0],prim[1],prim[7],prim[8],prim[9],prim[10]);
    default: buf.line(prim[0], prim[1], prim[2], prim[3]);
  }
  buf.rotate(prim[6]);
}

function createTriangularReflection(buffer) {
  rotatedBuffer.background(back_col);
  rotatedBuffer.copy(pg3, 0, 0, quart_size, quart_size, 0, 0, quart_size, quart_size);

  let maskedImage = rotatedBuffer.get();
  maskedImage.mask(triangleMask);

  buffer.image(maskedImage, 0, 0);

  buffer.push();
  buffer.translate(quart_size, quart_size);
  buffer.rotate(180);
  buffer.scale(1, -1);
  buffer.image(maskedImage, 0, 0);
  buffer.pop();
}

function mirror_quart_right(buffer) {
  buffer.push();
  buffer.scale(-1,1);
  buffer.copy(buffer, 0,0,quart_size,quart_size,-quart_size,0,-quart_size,quart_size);
  buffer.pop();
}

function mirror_half_down(buffer){
  buffer.push();
  buffer.scale(1,-1);
  buffer.copy(buffer, 0,0,canvas_size,quart_size,0,-quart_size,canvas_size,-quart_size);
  buffer.pop();
}

function mirror_half_right(buffer){
  buffer.push();
  buffer.scale(-1,1);
  buffer.copy(buffer, 0,0,quart_size*2,quart_size*2,-quart_size*2,0,-quart_size*2,quart_size*2);
  buffer.pop();
}

function mirror_whole_down(buffer){
  buffer.push();
  buffer.scale(1,-1);
  buffer.copy(buffer, 0,0,canvas_size,quart_size*2,0,-quart_size*2,canvas_size,-quart_size*2);
  buffer.pop();
}

function draw() {
  if (frameCount < 10000) {
    background(back_col);

    kaleidoscopeBuffer.background(back_col);

    pg.push();
    pg2.translate(quart_size*2,quart_size*2);
    let angle = 0.3;

    pg2.rotate(-angle);
    pg2.copy(pg,0,0,size2, size2,-quart_size*2,-quart_size*2,size2, size2);

    pg2.translate(-quart_size*2,-quart_size*2);
    pg3.copy(pg2,quart_size*2,quart_size*2,size2,size2,0,0,size2, size2);

    kaleidoscopeBuffer.image(pg3,0,0);
    createTriangularReflection(kaleidoscopeBuffer);

    pg.pop();

    mirror_quart_right(kaleidoscopeBuffer);
    mirror_half_down(kaleidoscopeBuffer);
    mirror_half_right(kaleidoscopeBuffer);
    mirror_whole_down(kaleidoscopeBuffer);

    // Calculate scale factor to fill the screen while preserving proportions
    let scale_factor = max(width / canvas_size, height / canvas_size);

    // Calculate the scaled size
    let scaled_size = canvas_size * scale_factor;

    // Calculate the position to center the cropped animation
    let offset_x = (scaled_size - width) / 2;
    let offset_y = (scaled_size - height) / 2;

    // Draw the scaled kaleidoscope with cropping
    copy(kaleidoscopeBuffer, offset_x / scale_factor, offset_y / scale_factor,
         width / scale_factor, height / scale_factor,
         0, 0, width, height);

    console.log("Drawing "  + frameCount + " angle: " + angle);
  }
}
