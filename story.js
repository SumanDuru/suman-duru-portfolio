(() => {
  const section = document.querySelector('.film-sequence');
  const stage = document.querySelector('.film-stage');
  const canvas = document.querySelector('.story-canvas');
  const ctx = canvas.getContext?.('2d', { alpha: false });
  if (!ctx) return;
  const engineerSprite = new Image();
  engineerSprite.src = 'assets/suman-story-character.webp';

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scenes = [
    { act:'ACT 01 · THE FIRST SPARK', title:'It starts with<br><em>a question.</em>', caption:'Curiosity lives in the details: what should happen, and what isn’t happening yet?', voice:'Every good check starts with a question. What should happen, and what is not happening yet?' },
    { act:'ACT 02 · THE QUALITY CELL', title:'Inspect with<br><em>intention.</em>', caption:'A small inspection robot checks each product. A defect is lifted clear; good products keep moving. A visual metaphor for careful verification.', voice:'Inspect with intention. A defect is lifted clear, and good products keep moving. This factory is a visual metaphor for careful verification.' },
    { act:'ACT 03 · THE AUTOMATION LOOP', title:'Repetition becomes<br><em>signal.</em>', caption:'Automated checks make repeatable work visible. A failed test is a signal to investigate, understand and improve.', voice:'Automation makes repeatable work visible. A failed check is a signal to investigate and improve.' },
    { act:'ACT 04 · QUALITY AS A SYSTEM', title:'Connect the<br><em>whole process.</em>', caption:'Requirements, strategy, execution, analysis and improvement: each stage shapes the reliability of the whole.', voice:'Requirements, strategy, execution, analysis and improvement. Quality is a connected practice.' },
    { act:'ACT 05 · INTELLIGENCE, WITH JUDGMENT', title:'Explore what’s<br><em>next.</em>', caption:'Claude, Devin-style agents, vibe coding, MCP and AI-assisted testing are areas of interest and continued learning—with human judgment at the center.', voice:'Claude, autonomous agents, vibe coding, MCP, and AI assisted testing are areas of interest and continued learning, with human judgment at the center.' },
    { act:'ACT 06 · STILL IN MOTION', title:'Every question<br><em>opens a door.</em>', caption:'Thoughtful investigation and continuous learning keep the practice moving forward.', voice:'Thoughtful investigation and continuous learning keep the practice moving forward.' },
    { act:'ACT 07 · THE WORK AHEAD', title:'Suman Duru<br><em>Beyond the code.</em>', caption:'QA Automation Engineer · SDET · Senior Consultant at Deloitte.', voice:'Suman Duru. QA Automation Engineer, SDET, and Senior Consultant at Deloitte. Engineering quality. Automating confidence.' }
  ];
  let width=0,height=0,dpr=1,progress=0,manualIndex=0,chapter=-1,start=performance.now(),lastFrame=0,inView=false,raf=0,captionTimer=0;
  let audioContext=null,scoreGain=null,scoreVoices=[],scoreOn=false;

  const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
  const ease=v=>{v=clamp(v);return v*v*(3-2*v)};
  const P=(x,y)=>[x*width,y*height];
  const path=(pts,fill,stroke='rgba(132,193,213,.34)',lineWidth=1)=>{
    ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);pts.slice(1).forEach(p=>ctx.lineTo(p[0],p[1]));ctx.closePath();
    if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lineWidth;ctx.stroke();}
  };
  const stroke=(pts,color='rgba(140,201,222,.45)',lineWidth=1)=>{ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);pts.slice(1).forEach(p=>ctx.lineTo(p[0],p[1]));ctx.strokeStyle=color;ctx.lineWidth=lineWidth;ctx.stroke();};
  const text=(s,x,y,color='#a8bac5',size=8)=>{ctx.fillStyle=color;ctx.font=`${size}px 'DM Mono', monospace`;ctx.letterSpacing='1px';ctx.fillText(s,x*width,y*height);ctx.letterSpacing='0px';};
  const glow=(x,y,r,color)=>{const g=ctx.createRadialGradient(x*width,y*height,0,x*width,y*height,r*width);g.addColorStop(0,color);g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect((x-r)*width,(y-r)*height,r*2*width,r*2*height);};
  const drawCity=(sunset,t)=>{
    const sky=ctx.createLinearGradient(0,.12*height,0,.82*height);sky.addColorStop(0,sunset?'#182536':'#0b1826');sky.addColorStop(.58,sunset?'#70444a':'#132333');sky.addColorStop(1,'#101820');ctx.fillStyle=sky;ctx.fillRect(0,0,width,height);
    glow(.79,.42,.28,sunset?'rgba(246,173,112,.23)':'rgba(72,170,197,.20)');
    ctx.beginPath();ctx.arc(.82*width,.43*height,.07*Math.min(width,height),0,Math.PI*2);ctx.fillStyle=sunset?'rgba(249,190,137,.84)':'rgba(111,220,236,.7)';ctx.fill();
    const buildings=[[.48,.43,.065,.36],[.55,.51,.08,.28],[.65,.35,.07,.44],[.73,.48,.05,.31],[.84,.38,.075,.40],[.93,.49,.07,.30],[1.01,.42,.08,.37]];
    buildings.forEach((b,i)=>{const [x,y,w,h]=b;ctx.fillStyle=i%2?'#101b27':'#14212c';ctx.fillRect(x*width,y*height,w*width,h*height);stroke([P(x,y),P(x+w,y)],'rgba(160,197,211,.2)',1);for(let row=0;row<5;row++)for(let col=0;col<2;col++){const light=Math.sin(t*.7+i*4+row+col)>-.3;ctx.fillStyle=light?(sunset?'rgba(255,202,143,.48)':'rgba(112,230,242,.42)'):'rgba(115,150,171,.13)';ctx.fillRect((x+.012+col*.026)*width,(y+.04+row*.052)*height,Math.max(1,w*width*.11),Math.max(1,height*.008));}});
  };
  const drawEngineer=(x,y,size,pose,t)=>{
    const s=Math.min(width,height)*size, bob=pose==='walk'?Math.sin(t*5)*s*.012:Math.sin(t*1.4)*s*.004;
    if(engineerSprite.complete&&engineerSprite.naturalWidth){
      const h=Math.min(height*.31,width*.50)*size/.20,w=h*engineerSprite.naturalWidth/engineerSprite.naturalHeight;
      const step=pose==='walk'?Math.sin(t*2.5)*Math.min(width,height)*.006:0;
      const personX=Math.min(x*width+step,width-w/2-6);
      ctx.save();ctx.translate(personX,y*height+bob);
      if(pose==='walk'&&Math.sin(t*2.5)>0)ctx.scale(-1,1);
      ctx.drawImage(engineerSprite,-w/2,-h,w,h);ctx.restore();return;
    }
    ctx.save();ctx.translate(x*width,y*height+bob);ctx.scale(s,s);
    // Consistent original South Asian male engineer: short dark hair, warm skin, deep-teal jacket.
    // Legs and torso stay simple and graphic so every scene uses the same readable silhouette.
    if(pose==='walk'){
      stroke([[-.14,-.21],[ -.17+Math.sin(t*5)*.04,-.08],[ -.20+Math.sin(t*5)*.09,0]],'#18242f',.035);
      stroke([[.12,-.21],[.15-Math.sin(t*5)*.04,-.08],[.19-Math.sin(t*5)*.09,0]],'#18242f',.035);
    }else{
      stroke([[-.11,-.21],[-.10,-.04],[ -.18,0]],'#19242e',.035);stroke([[.10,-.21],[.10,-.04],[.18,0]],'#19242e',.035);
    }
    path([[-.23,-.53],[-.19,-.65],[-.12,-.68],[.12,-.68],[.2,-.63],[.24,-.42],[.18,-.25],[-.18,-.25]],'#143c46','rgba(117,223,231,.56)',.012);
    // Face, ears and neck.
    ctx.fillStyle='#b97856';ctx.fillRect(-.045,-.68,.09,.09);ctx.beginPath();ctx.ellipse(0,-.79,.125,.16,0,0,Math.PI*2);ctx.fillStyle='#c98a66';ctx.fill();
    ctx.beginPath();ctx.ellipse(-.126,-.78,.025,.045,0,0,Math.PI*2);ctx.ellipse(.126,-.78,.025,.045,0,0,Math.PI*2);ctx.fillStyle='#bd7958';ctx.fill();
    // Short textured hair with a light wave over the forehead.
    ctx.beginPath();ctx.moveTo(-.127,-.79);ctx.bezierCurveTo(-.16,-.93,-.11,-.99,.01,-.96);ctx.bezierCurveTo(.10,-.97,.15,-.90,.13,-.81);ctx.lineTo(.09,-.84);ctx.quadraticCurveTo(.035,-.88,-.015,-.86);ctx.quadraticCurveTo(-.07,-.83,-.127,-.79);ctx.closePath();ctx.fillStyle='#172029';ctx.fill();
    // Expressive eyes and quiet, focused expression.
    ctx.fillStyle='#f2dfce';ctx.beginPath();ctx.ellipse(-.045,-.79,.018,.012,0,0,Math.PI*2);ctx.ellipse(.045,-.79,.018,.012,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#18232a';ctx.beginPath();ctx.arc(-.043,-.79,.007,0,Math.PI*2);ctx.arc(.047,-.79,.007,0,Math.PI*2);ctx.fill();
    stroke([[-.045,-.73],[0,-.718],[.04,-.73]],'rgba(93,48,41,.8)',.006);
    stroke([[-.075,-.82],[-.038,-.83]],'#4c332d',.006);stroke([[.025,-.83],[.07,-.82]],'#4c332d',.006);
    // One articulated arm gestures toward the work; the other rests near the body.
    const reach=pose==='work'?.09+.025*Math.sin(t*2):pose==='walk'?.03*Math.sin(t*5):0;
    stroke([[-.18,-.60],[-.30,-.46],[ -.25+reach,-.42]],'#b97856',.035);
    stroke([[.18,-.59],[.27,-.44],[.25,-.32]],'#b97856',.035);
    ctx.restore();
  };
  const drawRobot=(x,y,s,t,active=true)=>{
    s=Math.min(width,height)*s;
    ctx.save();ctx.translate(x*width,y*height);ctx.scale(s,s);
    const pulse=.5+.5*Math.sin(t*4);
    path([[-.52,-.12],[-.4,-.30],[.32,-.30],[.5,-.11],[.43,.18],[-.43,.18]],'#18303b','rgba(112,230,242,.78)',.025);
    ctx.beginPath();ctx.ellipse(0,-.34,.34,.11,0,Math.PI,Math.PI*2);ctx.fillStyle='#223a47';ctx.fill();ctx.strokeStyle='rgba(112,230,242,.6)';ctx.lineWidth=.018;ctx.stroke();
    ctx.beginPath();ctx.arc(.08,-.18,.09,0,Math.PI*2);ctx.fillStyle=active?`rgba(112,230,242,${.65+pulse*.3})`:'#ff927f';ctx.shadowColor=ctx.fillStyle;ctx.shadowBlur=.12;ctx.fill();ctx.shadowBlur=0;
    stroke([[-.23,-.10],[-.34,.03],[-.45,.04]],'#70e6f2',.025);stroke([[.25,-.10],[.36,.02],[.48,.02]],'#70e6f2',.025);
    ctx.restore();
  };
  const drawFactory=(t)=>{
    drawCity(false,t);glow(.80,.43,.32,'rgba(37,119,155,.18)');
    path([P(.52,.48),P(.85,.42),P(1.02,.61),P(.67,.68)],'#11232c','rgba(110,188,209,.78)',1.2);
    path([P(.67,.68),P(1.02,.61),P(1.02,.67),P(.67,.75)],'#101820','rgba(102,163,181,.36)',1);
    for(let i=0;i<8;i++){const xx=.56+((i/8+t*.05)%1)*.39;stroke([P(xx,.49-(xx-.56)*.2),P(xx+.012,.67-(xx-.56)*.1)],'rgba(130,193,209,.25)',1);}
    // Compact inspection gate and cyan scanning plane.
    path([P(.68,.29),P(.80,.28),P(.80,.49),P(.68,.5)],'rgba(16,34,45,.75)','rgba(112,230,242,.48)',1.3);
    stroke([P(.69,.31),P(.69,.48)],'rgba(112,230,242,.6)',2);stroke([P(.79,.29),P(.79,.47)],'rgba(112,230,242,.58)',2);
    const scanY=.34+(.5+.5*Math.sin(t*1.9))*.12;stroke([P(.69,scanY),P(.80,scanY+.015)],'rgba(113,231,242,.8)',2);
    drawRobot(.735,.45,Math.min(width,height)<700?.17:.12,t,true);
    // Boxes progress along a three-quarter perspective lane. Defective goods visibly leave it.
    for(let i=0;i<4;i++){
      const travel=t*.055+i*.26,pos=travel%1,round=Math.floor(travel),bad=(round+i*2)%4===2;
      if(pos<.08||pos>.94||(bad&&pos>.82))continue;
      let x=.55+pos*.40,y=.48+pos*.16,fall=0;
      if(bad&&pos>.56&&pos<.82){fall=(pos-.56)/.26;x-=fall*.045;y+=fall*.18;}
      const box=.018+pos*.018;ctx.globalAlpha=1-fall*.55;
      path([P(x-box,y),P(x,y-box*.65),P(x+box,y),P(x,y+box*.68)],bad?'#512932':'#16414a',bad?'rgba(255,141,127,.86)':'rgba(119,236,243,.78)',1.2);
      stroke([P(x-box,y),P(x-box,y+box*1.3),P(x,y+box*2)],bad?'rgba(255,141,127,.7)':'rgba(119,236,243,.6)',1);
      ctx.globalAlpha=1;
    }
    path([P(.69,.76),P(.77,.77),P(.82,.82),P(.73,.81)],'#2c1d24','rgba(255,139,125,.72)',1.1);text('REJECT',.722,.802,'#f0a093',7);
    path([P(.91,.69),P(.99,.70),P(1.02,.74),P(.93,.73)],'#12313a','rgba(112,230,242,.68)',1);text('PASS →',.93,.778,'#9cf4ee',7);
    drawEngineer(.90,.87,.20,'work',t);text('QUALITY CELL  /  INSPECTION',.55,.90,'#879aa6',7);
  };
  const drawOffice=(t)=>{
    drawCity(true,t);
    path([P(.53,.17),P(.98,.17),P(.98,.65),P(.53,.65)],'rgba(9,19,29,.30)','rgba(199,213,222,.43)',2);
    stroke([P(.74,.17),P(.74,.65)],'rgba(206,220,228,.26)',1);stroke([P(.53,.41),P(.98,.41)],'rgba(206,220,228,.22)',1);
    const desk=ctx.createLinearGradient(0,.68*height,0,.78*height);desk.addColorStop(0,'#27343a');desk.addColorStop(1,'#111c24');ctx.fillStyle=desk;ctx.fillRect(.47*width,.68*height,.56*width,.10*height);stroke([P(.47,.68),P(1,.68)],'rgba(209,188,158,.52)',2);
    path([P(.68,.42),P(.83,.42),P(.83,.65),P(.68,.65)],'#121f29','rgba(112,230,242,.54)',1.4);ctx.fillStyle='rgba(85,198,214,.11)';ctx.fillRect(.69*width,.435*height,.13*width,.19*height);
    for(let i=0;i<5;i++)stroke([P(.705,.47+i*.028),P(.81,.47+i*.028)],i===2?'rgba(255,130,112,.72)':'rgba(112,230,242,.42)',1.5);
    stroke([P(.755,.65),P(.755,.68)],'rgba(170,196,209,.54)',3);
    drawEngineer(.76,.88,.22,'sit',t);
    const pixel=.44+((t*.09)%1)*.34;glow(pixel,.37,.055,'rgba(112,230,242,.15)');ctx.beginPath();ctx.arc(pixel*width,.37*height,3+Math.sin(t*3)*1,0,Math.PI*2);ctx.fillStyle='#a2f7ff';ctx.fill();
    text('OBSERVE  ·  UNDERSTAND  ·  VERIFY',.56,.24,'#d0c3ab',7);
  };
  const drawAutomation=(t)=>{
    drawCity(false,t);glow(.76,.42,.35,'rgba(37,120,166,.16)');
    const panels=[[.53,.25,.16,.32],[.72,.20,.19,.38],[.93,.29,.12,.28]];
    panels.forEach((p,j)=>{const [x,y,w,h]=p;path([P(x,y),P(x+w,y-.02),P(x+w,y+h),P(x,y+h+.02)],'rgba(9,21,31,.82)','rgba(112,230,242,.46)',1.2);text(j===1?'PLAYWRIGHT':'TEST RUN',x+.012,y+.04,'#a8dfe7',6);for(let i=0;i<5;i++){const yy=y+.09+i*.045;stroke([P(x+.012,yy),P(x+w*(.55+((i+j)%3)*.12),yy)],i===3&&j===1?'rgba(255,129,111,.88)':'rgba(112,230,242,.45)',2);if(i!==3||j!==1){ctx.beginPath();ctx.arc((x+w-.022)*width,yy*height,2.2,0,Math.PI*2);ctx.fillStyle='#86f1d4';ctx.fill();}}});
    for(let i=0;i<5;i++){const x=.55+i*.084;stroke([P(x,.65),P(x+.04,.59),P(x+.08,.65)],`rgba(112,230,242,${.22+.13*Math.sin(t*2+i)})`,1.4);}
    drawEngineer(.86,.90,.21,'work',t);text('REPEAT  →  OBSERVE  →  IMPROVE',.57,.78,'#94a7b3',7);
  };
  const drawSystem=(t)=>{
    drawCity(false,t);glow(.81,.40,.35,'rgba(69,137,163,.14)');
    const nodes=[[.57,.31],[.69,.23],[.80,.34],[.92,.24],[.99,.41],[.87,.53],[.72,.52],[.58,.62]];
    const edges=[[0,1],[1,2],[2,3],[3,4],[2,5],[5,6],[6,7],[0,7],[1,6],[2,6],[4,5]];
    edges.forEach(([a,b],i)=>stroke([P(...nodes[a]),P(...nodes[b])],`rgba(112,230,242,${.20+.13*Math.sin(t+i)})`,1.1));
    nodes.forEach(([x,y],i)=>{glow(x,y,.035,i===2?'rgba(112,230,242,.28)':'rgba(91,153,196,.15)');ctx.beginPath();ctx.arc(x*width,y*height,3+(i===2?Math.sin(t*2)*1:0),0,Math.PI*2);ctx.fillStyle=i===2?'#8ef4f5':'#8099aa';ctx.fill();});
    ['REQUIREMENTS','STRATEGY','EXECUTION','ANALYSIS','IMPROVEMENT'].forEach((s,i)=>text(s,.54+i*.093,.69,'#b1c1ca',6));
    drawEngineer(.90,.91,.20,'walk',t);
  };
  const drawAI=(t)=>{
    drawCity(false,t);glow(.79,.40,.40,'rgba(94,65,169,.25)');
    const cx=.81,cy=.41,nodes=[];for(let i=0;i<18;i++){const a=i*Math.PI*2/18,rad=.13+.035*Math.sin(i*3+t*.3);nodes.push([cx+Math.cos(a)*rad,cy+Math.sin(a)*rad*.78]);}
    nodes.forEach((p,i)=>{[1,4,7].forEach(d=>{const q=nodes[(i+d)%nodes.length];stroke([P(...p),P(...q)],`rgba(153,129,255,${.09+.035*Math.sin(t+i)})`,.8);});glow(p[0],p[1],.025,'rgba(112,230,242,.18)');ctx.beginPath();ctx.arc(p[0]*width,p[1]*height,2.2,0,Math.PI*2);ctx.fillStyle=i%4===0?'#b4a4ff':'#84e4ef';ctx.fill();});
    ctx.beginPath();ctx.arc(cx*width,cy*height,.042*width,0,Math.PI*2);ctx.fillStyle='rgba(70,69,130,.5)';ctx.fill();ctx.strokeStyle='rgba(173,156,255,.68)';ctx.lineWidth=1.5;ctx.stroke();text('AI',.799,.416,'#ece6ff',11);
    [['CLAUDE',.58,.28],['DEVIN / AGENTS',.91,.30],['MCP',.63,.54],['VIBE CODING',.90,.57],['HUMAN JUDGMENT',.82,.65]].forEach(([s,x,y])=>{text(s,x,y,'#c7c0ef',7);stroke([P(.81,.45),P(x+.03,y-.02)],'rgba(157,143,243,.20)',.8);});
    drawEngineer(.94,.91,.20,'work',t);
  };
  const drawPath=(t,finale=false)=>{
    drawCity(!finale,t);const horizon=.47;
    path([P(.59,1),P(.96,1),P(.84,horizon),P(.77,horizon)],finale?'rgba(50,113,135,.42)':'rgba(30,77,96,.42)','rgba(112,230,242,.4)',1.3);
    stroke([P(.775,horizon),P(.765,1)],'rgba(152,220,233,.35)',1);
    const labels=['TESTING FOUNDATIONS','AUTOMATION','FRAMEWORKS','QUALITY ENGINEERING','AI-ASSISTED LEARNING'];
    labels.forEach((s,i)=>{const p=(i+1)/6,y=horizon+(1-p)*.42,x=.77+(1-p)*.13;glow(x,y,.035,`rgba(112,230,242,${.09+.04*Math.sin(t*1.4+i)})`);ctx.beginPath();ctx.arc(x*width,y*height,3.1,0,Math.PI*2);ctx.fillStyle=i<3?'#70e6f2':'#b8a8ff';ctx.fill();text(s,x+.02,y,'#c0ccd4',6);});
    drawEngineer(finale?.76:.70,.91,.23,finale?'still':'walk',t);
    if(finale){for(let i=0;i<16;i++){const a=i*Math.PI*2/16,rx=.24+Math.sin(t*.5+i)*.01,ry=.22;ctx.beginPath();ctx.arc(.76*width+Math.cos(a)*rx*width,.60*height+Math.sin(a)*ry*height,1.6,0,Math.PI*2);ctx.fillStyle='rgba(134,232,241,.8)';ctx.fill();}text('SUMAN DURU',.54,.31,'#f4f6f7',16);text('QA AUTOMATION ENGINEER  ·  SDET',.54,.35,'#95eaf0',7);}
  };
  const renderScene=(i,t)=>{switch(i){case 0:drawOffice(t);break;case 1:drawFactory(t);break;case 2:drawAutomation(t);break;case 3:drawSystem(t);break;case 4:drawAI(t);break;case 5:drawPath(t,false);break;default:drawPath(t,true);}};
  const updateChapter=(i)=>{
    const next=scenes[i];if(i===chapter)return;chapter=i;stage.dataset.chapter=String(i);
    const caption=document.querySelector('.film-caption');caption.classList.add('is-changing');
    clearTimeout(captionTimer);captionTimer=window.setTimeout(()=>{document.querySelector('.film-act').textContent=next.act;document.querySelector('#film-heading').innerHTML=next.title;document.querySelector('.film-copy').textContent=next.caption;caption.classList.remove('is-changing');},reduce?0:150);
    document.querySelector('.film-count span').textContent=String(i+1).padStart(2,'0');
    const bar=document.querySelector('.film-progress');bar.setAttribute('aria-valuenow',String(i+1));
    document.querySelector('.story-canvas').setAttribute('aria-label',`${next.act}. ${next.caption}`);
    if(scoreOn)updateScore(i);
    if(document.querySelector('.film-narration').getAttribute('aria-pressed')==='true'&&'speechSynthesis'in window){speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(next.voice);utterance.rate=.94;utterance.pitch=.98;speechSynthesis.speak(utterance);}
  };
  const syncScroll=()=>{
    if(reduce)return;
    const rect=section.getBoundingClientRect(),travel=Math.max(1,section.offsetHeight-innerHeight);
    progress=clamp(-rect.top/travel);document.querySelector('.film-progress span').style.width=`${progress*100}%`;
    updateChapter(Math.min(6,Math.round(progress*6)));
  };
  const draw=(now)=>{
    if(!inView||!width||!height)return;
    if(now-lastFrame<32){raf=requestAnimationFrame(draw);return;}lastFrame=now;
    const t=(now-start)/1000, value=reduce?manualIndex/6:progress*6,index=Math.min(5,Math.floor(value)),blend=ease((value-index-.76)/.24);
    ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,width,height);
    ctx.globalAlpha=1-blend;renderScene(index,t);if(blend>0){ctx.globalAlpha=blend;renderScene(index+1,t);}ctx.globalAlpha=1;
    const wash=ctx.createLinearGradient(0,0,width,height);wash.addColorStop(0,'rgba(10,13,20,.12)');wash.addColorStop(.62,'rgba(10,13,20,0)');wash.addColorStop(1,'rgba(12,18,25,.22)');ctx.fillStyle=wash;ctx.fillRect(0,0,width,height);
    raf=requestAnimationFrame(draw);
  };
  const resize=()=>{const rect=canvas.getBoundingClientRect();width=rect.width;height=rect.height;dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);if(reduce){progress=manualIndex/6;document.querySelector('.film-progress span').style.width=`${progress*100}%`;updateChapter(manualIndex);}if(inView){cancelAnimationFrame(raf);raf=requestAnimationFrame(draw);}};
  engineerSprite.addEventListener('load',()=>{if(inView){cancelAnimationFrame(raf);raf=requestAnimationFrame(draw);}});
  const goTo=(index)=>{
    const next=clamp(index,0,6)|0;
    if(reduce){manualIndex=next;progress=next/6;document.querySelector('.film-progress span').style.width=`${progress*100}%`;updateChapter(next);cancelAnimationFrame(raf);raf=requestAnimationFrame(draw);return;}
    const top=section.getBoundingClientRect().top+scrollY;
    const travel=section.offsetHeight-innerHeight;
    window.scrollTo({top:top+travel*(next/6),behavior:'smooth'});
  };
  const ensureAudio=()=>{
    if(audioContext)return true;
    const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return false;
    audioContext=new Audio();scoreGain=audioContext.createGain();const filter=audioContext.createBiquadFilter();filter.type='lowpass';filter.frequency.value=1100;filter.Q.value=.45;scoreGain.gain.value=0;filter.connect(scoreGain);scoreGain.connect(audioContext.destination);
    const bases=[110,164.81,220,329.63];
    bases.forEach((hz,i)=>{const osc=audioContext.createOscillator(),gain=audioContext.createGain();osc.type=i===3?'triangle':'sine';osc.frequency.value=hz;gain.gain.value=i===3?.018:.027;osc.connect(gain);gain.connect(filter);osc.start();scoreVoices.push(osc);});
    return true;
  };
  const updateScore=(i)=>{
    if(!scoreOn||!audioContext)return;
    const root=[110,123.47,130.81,146.83,164.81,174.61,196][i]||110;
    const ratios=[1,1.5,2,3];scoreVoices.forEach((osc,k)=>osc.frequency.setTargetAtTime(root*ratios[k],audioContext.currentTime,.85));
  };
  const ambient=document.querySelector('.film-ambient');
  ambient.addEventListener('click',async()=>{
    const enable=ambient.getAttribute('aria-pressed')!=='true';
    if(!ensureAudio()){ambient.textContent='Audio unavailable';ambient.disabled=true;return;}
    if(enable){await audioContext.resume();scoreOn=true;scoreGain.gain.setTargetAtTime(.34,audioContext.currentTime,.8);ambient.setAttribute('aria-pressed','true');ambient.setAttribute('aria-label','Turn ambient score off');ambient.firstChild.textContent='Ambient score on ';updateScore(chapter<0?0:chapter);}
    else{scoreOn=false;scoreGain.gain.setTargetAtTime(0,audioContext.currentTime,.35);ambient.setAttribute('aria-pressed','false');ambient.setAttribute('aria-label','Turn ambient score on');ambient.firstChild.textContent='Ambient score off ';window.setTimeout(()=>{if(!scoreOn&&audioContext)audioContext.suspend();},900);}
  });
  document.querySelector('.film-back').addEventListener('click',()=>goTo(Math.max(0,chapter-1)));
  document.querySelector('.film-next').addEventListener('click',()=>goTo(Math.min(6,chapter+1)));
  document.querySelector('.film-replay').addEventListener('click',()=>{
    if('speechSynthesis'in window)speechSynthesis.cancel();
    if(reduce)goTo(0);else window.scrollTo({top:section.getBoundingClientRect().top+scrollY,behavior:'smooth'});
  });
  const narration=document.querySelector('.film-narration');
  narration.addEventListener('click',()=>{
    const enabled=narration.getAttribute('aria-pressed')!=='true';narration.setAttribute('aria-pressed',String(enabled));narration.firstChild.textContent=enabled?'Narration on ':'Narration off ';
    if(!enabled&&'speechSynthesis'in window)speechSynthesis.cancel();else if('speechSynthesis'in window){const utterance=new SpeechSynthesisUtterance(scenes[chapter<0?0:chapter].voice);utterance.rate=.94;window.speechSynthesis.speak(utterance);}
    narration.setAttribute('aria-label',enabled?'Turn narration off':'Turn narration on');
  });
  document.querySelector('.film-skip').addEventListener('click',()=>{if('speechSynthesis'in window)speechSynthesis.cancel();});
  window.addEventListener('scroll',syncScroll,{passive:true});window.addEventListener('resize',resize,{passive:true});
  if('IntersectionObserver'in window)new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;if(inView){syncScroll();cancelAnimationFrame(raf);raf=requestAnimationFrame(draw);if(scoreOn&&audioContext){audioContext.resume();scoreGain.gain.setTargetAtTime(.34,audioContext.currentTime,.8);}}else{cancelAnimationFrame(raf);raf=0;if('speechSynthesis'in window)speechSynthesis.cancel();if(scoreOn&&audioContext){scoreGain.gain.setTargetAtTime(0,audioContext.currentTime,.35);window.setTimeout(()=>{if(scoreOn&&!inView)audioContext.suspend();},900);}}}).observe(section);else{inView=true;syncScroll();raf=requestAnimationFrame(draw);}
  resize();syncScroll();
})();
