let objs = [];
let maxNum = 3000;
let minSize = 10;
let maxSize = 150;
let minAlp = 200;
let back_col;
let canvas_size = 500;
let quart_size=canvas_size/4;
let pg;
let size1 = canvas_size;
let pg2;
let size2 = size1;
let size3 = quart_size;
let time_scale=1500;
let min_col = 50;
let max_col = 255;
function setup() {
  back_col = color(random(min_col,max_col),random(min_col,max_col), random(min_col,max_col));
  createCanvas(canvas_size, canvas_size);
  pg = createGraphics(size1, size1);
  pg2 = createGraphics(size2, size2);
  pg3 = createGraphics(size3,size3);
  pg.angleMode(DEGREES);
  pg2.angleMode(DEGREES);
  angleMode(DEGREES);
  pg.background(back_col);
  pg.noStroke();
  pg.translate(quart_size,quart_size);
  background(back_col);
  drawArr(pg);
  frameRate(30);
  console.log("Setup done!");

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
  let r = random(min_col, max_col);// if (r < 50) r += 50;
  let g = random(min_col,max_col);// if (g < 50) g += 50;
  let b = random(min_col,max_col);//  if (b < 50) b += 50;
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
};

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

function mirror_quart_right() {
    push();
    scale(-1,1);
    copy(0,0,quart_size,quart_size,-quart_size,0,-quart_size,quart_size);
    pop();
}
function mirror_half_down (){
    push();
    scale(1,-1);
    copy(0,0,canvas_size,quart_size,0,-quart_size,canvas_size,-quart_size);
    pop();
}

function mirror_half_right(){
    push();
    scale(-1,1);
    copy(0,0,quart_size*2,quart_size*2,-quart_size*2,0,-quart_size*2,quart_size*2);
    pop();
}

function mirror_whole_down(){
    push();
    scale(1,-1);
    copy(0,0,canvas_size,quart_size*2,0,-quart_size*2,canvas_size,-quart_size*2);
    pop();
}

function draw() {
  if (frameCount < 10000) {
    background(back_col);
    push();
    pg.push();

    pg2.translate(quart_size*2,quart_size*2);
    let angle = 0.3;

    pg2.rotate(-angle);
    pg2.copy(pg,0,0,size2, size2,-quart_size*2,-quart_size*2,size2, size2);

    pg2.translate(-quart_size*2,-quart_size*2);
    pg3.copy(pg2,quart_size*2,quart_size*2,size2,size2,0,0,size2, size2);

    image(pg3,0,0);
    pop();
    let d = pixelDensity();
    loadPixels();
    for (i=0; i < quart_size; i++) {
      for(j=0; j < quart_size; j++) {
        for(xd = 0; xd < d; xd ++) {
          for (yd = 0; yd < d; yd ++){

        if (j <= i) {
          let index = 4 * ((j * d + xd) * canvas_size * d + (i * d + yd));
          let inv_index = 4 * ((i * d + xd) * canvas_size * d + (j * d + yd));
          pixels[index] = pixels[inv_index];
          pixels[index +1 ] = pixels[inv_index +1];
          pixels[index +2] = pixels[inv_index +2];
          pixels[index +3 ] = pixels[inv_index +3];
        } else continue;
          }
        }
      }
    }
    updatePixels();
    pg.pop();

    console.log("Drawing "  + frameCount + " angle: " + angle);

    mirror_quart_right();
    mirror_half_down();
    mirror_half_right();
    mirror_whole_down();
  }
}

