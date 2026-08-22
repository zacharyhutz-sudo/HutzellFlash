"use strict";

// HutzellFlash Pixel Renderer
// Gameplay still runs at 960x540. This renderer maps it onto a true 320x180 art grid.
const ART_W = 320, ART_H = 180, ART_SCALE = 3;
const atlas = new Image();
atlas.src = "assets/hutzellflash-atlas.png";

const SPR = {
  planeNeutralA:[0,0,32,16], planeNeutralB:[40,0,32,16],
  planeUpA:[80,0,32,16], planeUpB:[120,0,32,16],
  planeDownA:[160,0,32,16], planeDownB:[200,0,32,16],
  cloud:[0,20,32,16], storm:[36,20,40,24], balloon:[80,20,14,26],
  birdUp:[100,20,18,12], birdDown:[120,20,18,12],
  coin0:[144,20,10,10], coin1:[156,20,10,10], coin2:[168,20,10,10], coin3:[180,20,10,10],
  ring0:[0,48,44,44], ring1:[48,48,44,44], ring2:[96,48,44,44], ring3:[144,48,44,44],
  wind:[196,48,48,28],
  tree:[0,100,18,28], bush:[22,100,20,12], farmhouse:[46,100,26,20],
  mountain:[76,100,48,24], grass:[128,100,14,8], fence:[146,100,28,12], flock:[180,100,14,8]
};

const P = {
  ink:"#243746", ink2:"#355064", white:"#f8f4e8", cloud:"#f4f9ff", cloudShade:"#dce8f1",
  sky1:"#4d93d4", sky2:"#69afe8", sky3:"#8bc8ed", sky4:"#b9e1f3",
  sunset1:"#6b75b8", sunset2:"#9a7dc2", sunset3:"#d9939e", sunset4:"#f1bd86",
  storm1:"#405d75", storm2:"#54718a", storm3:"#718aa0", storm4:"#9fb1bf",
  night1:"#172a47", night2:"#254163", night3:"#365b78", night4:"#52748b",
  grass:"#659d57", grassLight:"#80b866", grassDark:"#3f7148", dirt:"#6e5138", asphalt:"#43515a",
  gold:"#ffd866", blue:"#8bdcff", red:"#ff7558", panel:"rgba(19,35,48,.84)"
};

// 5x7 bitmap alphabet. Every game-facing character is drawn as real pixels, not browser font glyphs.
const FONT = {
"A":["01110","10001","10001","11111","10001","10001","10001"],
"B":["11110","10001","10001","11110","10001","10001","11110"],
"C":["01111","10000","10000","10000","10000","10000","01111"],
"D":["11110","10001","10001","10001","10001","10001","11110"],
"E":["11111","10000","10000","11110","10000","10000","11111"],
"F":["11111","10000","10000","11110","10000","10000","10000"],
"G":["01111","10000","10000","10111","10001","10001","01111"],
"H":["10001","10001","10001","11111","10001","10001","10001"],
"I":["11111","00100","00100","00100","00100","00100","11111"],
"J":["00111","00010","00010","00010","10010","10010","01100"],
"K":["10001","10010","10100","11000","10100","10010","10001"],
"L":["10000","10000","10000","10000","10000","10000","11111"],
"M":["10001","11011","10101","10101","10001","10001","10001"],
"N":["10001","11001","10101","10011","10001","10001","10001"],
"O":["01110","10001","10001","10001","10001","10001","01110"],
"P":["11110","10001","10001","11110","10000","10000","10000"],
"Q":["01110","10001","10001","10001","10101","10010","01101"],
"R":["11110","10001","10001","11110","10100","10010","10001"],
"S":["01111","10000","10000","01110","00001","00001","11110"],
"T":["11111","00100","00100","00100","00100","00100","00100"],
"U":["10001","10001","10001","10001","10001","10001","01110"],
"V":["10001","10001","10001","10001","10001","01010","00100"],
"W":["10001","10001","10001","10101","10101","10101","01010"],
"X":["10001","10001","01010","00100","01010","10001","10001"],
"Y":["10001","10001","01010","00100","00100","00100","00100"],
"Z":["11111","00001","00010","00100","01000","10000","11111"],
"0":["01110","10001","10011","10101","11001","10001","01110"],
"1":["00100","01100","00100","00100","00100","00100","01110"],
"2":["01110","10001","00001","00010","00100","01000","11111"],
"3":["11110","00001","00001","01110","00001","00001","11110"],
"4":["00010","00110","01010","10010","11111","00010","00010"],
"5":["11111","10000","10000","11110","00001","00001","11110"],
"6":["01110","10000","10000","11110","10001","10001","01110"],
"7":["11111","00001","00010","00100","01000","01000","01000"],
"8":["01110","10001","10001","01110","10001","10001","01110"],
"9":["01110","10001","10001","01111","00001","00001","01110"],
"-":["00000","00000","00000","11111","00000","00000","00000"],
"+":["00000","00100","00100","11111","00100","00100","00000"],
"!":["00100","00100","00100","00100","00100","00000","00100"],
"/ ":["00000","00000","00000","00000","00000","00000","00000"],
"/":["00001","00010","00010","00100","01000","01000","10000"],
".":["00000","00000","00000","00000","00000","00110","00110"],
":":["00000","00110","00110","00000","00110","00110","00000"],
"% ":["00000","00000","00000","00000","00000","00000","00000"],
"%":["11001","11010","00100","01000","10110","00110","00000"],
" ":["00000","00000","00000","00000","00000","00000","00000"]
};

function A(v){ return Math.round(v / ART_SCALE); }
function clamp(v,a,b){ return Math.max(a,Math.min(b,v)); }

function sprite(name, x, y, opts={}) {
  if (!atlas.complete || !atlas.naturalWidth) return;
  const s = SPR[name]; if (!s) return;
  const w = opts.w ?? s[2], h = opts.h ?? s[3];
  ctx.save();
  ctx.globalAlpha = opts.alpha ?? 1;
  ctx.translate(Math.round(x), Math.round(y));
  if (opts.flipX || opts.flipY) {
    ctx.scale(opts.flipX ? -1 : 1, opts.flipY ? -1 : 1);
    ctx.drawImage(atlas,s[0],s[1],s[2],s[3],opts.flipX?-w:0,opts.flipY?-h:0,w,h);
  } else ctx.drawImage(atlas,s[0],s[1],s[2],s[3],0,0,w,h);
  ctx.restore();
}
function spriteCentered(name,x,y,opts={}) {
  const s=SPR[name]; const w=opts.w??s[2],h=opts.h??s[3];
  sprite(name,Math.round(x-w/2),Math.round(y-h/2),{...opts,w,h});
}

function textWidth(str, scale=1){ return Math.max(0, str.length*(6*scale)-scale); }
function pixelText(str,x,y,scale=1,color=P.white,align="left",shadow=true){
  str=String(str).toUpperCase();
  let sx=x;
  const w=textWidth(str,scale);
  if(align==="center") sx-=Math.floor(w/2); else if(align==="right") sx-=w;
  const drawAt=(dx,dy,col)=>{
    ctx.fillStyle=col;
    let cx=sx+dx;
    for(const ch of str){
      const glyph=FONT[ch]||FONT[" "];
      for(let gy=0;gy<7;gy++) for(let gx=0;gx<5;gx++) if(glyph[gy][gx]==="1") ctx.fillRect(cx+gx*scale,y+dy+gy*scale,scale,scale);
      cx+=6*scale;
    }
  };
  if(shadow) drawAt(scale,scale,"rgba(20,32,43,.68)");
  drawAt(0,0,color);
}

function pixelDisc(cx,cy,r,color){
  ctx.fillStyle=color;
  for(let y=-r;y<=r;y++){
    const half=Math.floor(Math.sqrt(Math.max(0,r*r-y*y)));
    ctx.fillRect(cx-half,cy+y,half*2+1,1);
  }
}
function skyPalette(){
  const lv=state==="play"?levelForScore(score):1;
  if(lv>=9) return [P.night1,P.night2,P.night3,P.night4];
  if(lv>=7) return [P.sunset1,P.sunset2,P.sunset3,P.sunset4];
  if(lv>=4) return [P.storm1,P.storm2,P.storm3,P.storm4];
  return [P.sky1,P.sky2,P.sky3,P.sky4];
}

function drawSky(){
  const pal=skyPalette();
  const band=Math.ceil(ART_H/4);
  for(let i=0;i<4;i++){ ctx.fillStyle=pal[i]; ctx.fillRect(0,i*band,ART_W,band+1); }
  const lv=state==="play"?levelForScore(score):1;
  // sparse pixel texture / stars at the latest stages
  if(lv>=9){
    ctx.fillStyle="#d7ecff";
    const stars=[[18,18],[41,31],[69,12],[103,25],[139,18],[171,37],[211,14],[247,27],[279,10],[301,39],[87,47],[226,49]];
    for(const s of stars) ctx.fillRect(s[0],s[1],1,1);
    pixelDisc(280,28,9,"#e7e6c7");
    ctx.fillStyle=pal[0]; ctx.fillRect(276,20,7,12);
  } else {
    pixelDisc(280,29,10,lv>=7?"#ffd88c":"#fff0a7");
    ctx.fillStyle=lv>=7?"rgba(255,216,140,.25)":"rgba(255,240,167,.25)";
    ctx.fillRect(268,28,24,2); ctx.fillRect(279,17,2,24);
  }
  // very distant mountain chain, slow parallax
  const farOff=Math.floor((t*(state==="play"?speed:45)*0.018)%48);
  for(let x=-farOff-48;x<ART_W+48;x+=48) sprite("mountain",x,137,{alpha:.55});
  // field banding, gives the bottom of the world a tiled/pixel-art landscape
  ctx.fillStyle="rgba(46,94,67,.34)"; ctx.fillRect(0,151,ART_W,10);
  ctx.fillStyle="rgba(115,158,91,.24)";
  const fieldOff=Math.floor((t*(state==="play"?speed:35)*0.03)%28);
  for(let x=-fieldOff;x<ART_W;x+=28) ctx.fillRect(x,154,15,2);
  // distant farm / tree silhouettes on a separate parallax layer
  const midOff=Math.floor((t*(state==="play"?speed:40)*0.06)%96);
  for(let x=-midOff-96,i=0;x<ART_W+96;x+=96,i++){
    if(i%2===0) sprite("farmhouse",x+25,141,{alpha:.74});
    sprite("tree",x+68,136,{alpha:.72,w:12,h:19});
  }
}

function drawCloud(x,y,s){
  const sc=s<.9?1:(s>1.25?2:1);
  spriteCentered("cloud",A(x),A(y),{w:32*sc,h:16*sc,alpha:.82});
}

function drawHazard(h){
  const x=A(h.x), y=A(h.y);
  spriteCentered("wind",x,y,{flipX:h.dir<0,alpha:.78});
  // tiny pixel arrow shows vertical push without introducing a new mechanic/UI element
  ctx.fillStyle=P.white;
  const sy=h.push>0?1:-1;
  const ay=y+(sy>0?9:-9);
  ctx.fillRect(x-1,ay-2*sy,3,1); ctx.fillRect(x,ay-3*sy,1,4);
}

function drawRing(r){
  const frame=(Math.floor(r.spin*2)%4+4)%4;
  spriteCentered("ring"+frame,A(r.x),A(r.y));
  pixelText("+150",A(r.x),A(r.y)-3,1,"#fff0a7","center",true);
}

function drawObstacle(o){
  const x=A(o.x), y=A(o.y);
  if(o.kind==="cloud"){
    const w=clamp(A(o.w),28,44), h=clamp(A(o.h),18,34);
    spriteCentered("storm",x,y,{w,h});
  } else if(o.kind==="balloon"){
    spriteCentered("balloon",x,y+4);
  } else {
    spriteCentered(Math.sin(o.flap)>0?"birdUp":"birdDown",x,y,{flipX:true});
  }
}

function drawCoin(c){
  const frame=(Math.floor(c.spin*1.5)%4+4)%4;
  spriteCentered("coin"+frame,A(c.x),A(c.y));
}

function drawPlane(){
  const bank=plane.tilt<-.14?"Up":(plane.tilt>.14?"Down":"Neutral");
  const prop=(Math.floor(t*18)%2)===0?"A":"B";
  const x=A(plane.x), y=A(plane.y);
  // blocky contrail: deliberately not a gradient or vector taper
  ctx.fillStyle="rgba(244,249,255,.48)";
  const puff=Math.floor(t*8)%3;
  ctx.fillRect(x-25-puff,y+1,7,2); ctx.fillRect(x-35+puff,y,5,2); ctx.fillRect(x-42-puff,y+2,3,1);
  spriteCentered("plane"+bank+prop,x,y);
}

function drawGround(){
  const gy=A(GROUND);
  ctx.fillStyle=P.grass; ctx.fillRect(0,gy,ART_W,ART_H-gy);
  ctx.fillStyle=P.grassLight; ctx.fillRect(0,gy,ART_W,2);
  ctx.fillStyle=P.grassDark; ctx.fillRect(0,gy+2,ART_W,2);
  ctx.fillStyle=P.dirt; ctx.fillRect(0,gy+14,ART_W,ART_H-(gy+14));
  // runway band/stripes retain the original visual cue, but in crisp tiles
  ctx.fillStyle=P.asphalt; ctx.fillRect(0,gy+8,ART_W,6);
  const off=Math.floor((t*speed*.8/ART_SCALE)%27);
  ctx.fillStyle="#d9e2df";
  for(let x=-off;x<ART_W;x+=27) ctx.fillRect(x,gy+10,14,2);
  // foreground vegetation / fence passes quickly for a stronger sense of motion
  const fgOff=Math.floor((t*speed*.45/ART_SCALE)%54);
  for(let x=-fgOff-54,i=0;x<ART_W+54;x+=54,i++){
    sprite("bush",x,gy-10);
    if(i%2===0) sprite("grass",x+28,gy-6);
    if(i%3===0) sprite("fence",x+34,gy-8,{alpha:.88});
  }
}

function panel(x,y,w,h){
  ctx.fillStyle=P.panel; ctx.fillRect(x,y,w,h);
  ctx.fillStyle="rgba(255,255,255,.10)"; ctx.fillRect(x,y,w,1);
}

function drawHUD(){
  panel(0,0,ART_W,17);
  const lv=levelForScore(score), name=LEVEL_NAMES[lv-1];
  pixelText("SCORE "+String(Math.floor(score)).padStart(5,"0"),5,4,1,P.white,"left",false);
  pixelText("LV "+lv+" "+name,160,4,1,coinFlash>.4?"#fff0a7":P.gold,"center",false);
  pixelText("COINS "+coinCount,315,4,1,P.blue,"right",false);
  const next=LEVEL_THRESHOLDS[lv];
  ctx.fillStyle="rgba(255,255,255,.18)"; ctx.fillRect(5,14,310,1);
  if(next!==undefined){
    const cur=LEVEL_THRESHOLDS[lv-1]; const frac=clamp((score-cur)/(next-cur),0,1);
    ctx.fillStyle=P.blue; ctx.fillRect(5,14,Math.floor(310*frac),1);
  } else { ctx.fillStyle=P.blue; ctx.fillRect(5,14,310,1); }
  if(ring){
    panel(75,20,170,13);
    pixelText("FLY THROUGH THE RING +150",160,23,1,P.gold,"center",false);
  }
}

function titleCard(){
  panel(26,43,268,84);
  // compact decorative wings around the title
  ctx.fillStyle="#d8e6ef";
  ctx.fillRect(35,63,26,2); ctx.fillRect(39,60,18,1); ctx.fillRect(259,63,26,2); ctx.fillRect(263,60,18,1);
  pixelText("HUTZELLFLASH",160,54,3,P.white,"center",true);
  pixelText("FLY THE PLANE - DODGE THE WEATHER",160,84,1,"#dcecff","center",false);
  pixelText("UP/DOWN OR HOLD TO STEER - GRAB THE COINS",160,96,1,P.gold,"center",false);
  pixelText("CLIMB LEVELS - CLEAR THE GOLDEN RINGS",160,108,1,P.blue,"center",false);
  if(Math.sin(t*4)>-.3) pixelText("PRESS SPACE / TAP TO FLY",160,137,2,P.blue,"center",true);
}

function overCard(){
  const total=Math.floor(score), lv=levelForScore(total), name=LEVEL_NAMES[lv-1];
  const speedPct=Math.round((Math.min(speed,600)/600)*100);
  panel(42,46,236,91);
  pixelText("CRASHED!",160,54,3,"#ff8b6b","center",true);
  pixelText("SCORE "+total+"  COINS "+coinCount,160,84,1,P.white,"center",false);
  pixelText("LEVEL "+lv+" - "+name,160,96,1,P.blue,"center",false);
  pixelText("PEAK "+speedPct+"%  BEST "+best,160,108,1,P.gold,"center",false);
  if(total>=best&&total>0) pixelText("NEW BEST RUN!",160,120,1,"#8df2a2","center",false);
  if(Math.sin(t*4)>-.3) pixelText("PRESS SPACE / TAP TO RETRY",160,145,1,P.blue,"center",true);
}

function draw(){
  // No vector scaling inside the art buffer. Every shape lands directly on the 320x180 grid.
  ctx.setTransform(1,0,0,1,0,0);
  ctx.clearRect(0,0,ART_W,ART_H);
  ctx.save();
  if(shakeT>0) ctx.translate(Math.round(rnd(-3,3)*shakeT),Math.round(rnd(-3,3)*shakeT));
  drawSky();
  for(const c of clouds) drawCloud(c.x,c.y,c.s);
  for(const h of hazards) drawHazard(h);
  drawGround();
  for(const o of obstacles) drawObstacle(o);
  for(const c of coins) drawCoin(c);
  if(ring) drawRing(ring);
  if(state!=="over") drawPlane();
  for(const p of particles){
    const alpha=1-p.t/p.life;
    ctx.globalAlpha=alpha; ctx.fillStyle=p.color;
    const sz=clamp(Math.round(p.r/ART_SCALE),1,2);
    ctx.fillRect(A(p.x),A(p.y),sz,sz);
  }
  ctx.globalAlpha=1;
  if(state==="play") drawHUD();
  if(state==="title") titleCard();
  if(state==="over") overCard();
  ctx.restore();
  main.setTransform(1,0,0,1,0,0);
  main.imageSmoothingEnabled=false;
  main.clearRect(0,0,VW,VH);
  main.drawImage(pcan,0,0,VW,VH);
}
