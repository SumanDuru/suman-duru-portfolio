(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const dialog = document.querySelector('.project-dialog');
  const stages = [
    ['START WITH THE WHY', 'Understand expected behavior, user needs and risk before deciding what to test.'],
    ['CHOOSE WHAT MATTERS', 'Shape a proportionate test strategy around risk, coverage and the feedback teams need.'],
    ['DESIGN FOR MAINTENANCE', 'Create automation that is readable, dependable and practical to evolve as a product changes.'],
    ['MAKE RESULTS VISIBLE', 'Run checks consistently and make outcomes clear enough to support confident decisions.'],
    ['LEARN FROM SIGNALS', 'Investigate defects with context, identify patterns and help turn findings into useful action.'],
    ['IMPROVE THE LOOP', 'Use feedback from each cycle to sharpen coverage, remove friction and keep raising quality.']
  ];
  const projects = {
    framework: {number:'01', title:'Automation framework thinking', intro:'A learning concept about making automation understandable and sustainable.', body:'<p><strong>Question:</strong> What makes an automation suite useful after the first release?</p><p><strong>Exploration:</strong> Consider clear test boundaries, reusable setup, stable selectors, meaningful reporting and feedback speed. The goal is a framework that helps people understand failures and maintain intent as software evolves.</p><p><strong>Focus areas:</strong> Test design · maintainability · readable feedback</p>'},
    intelligent: {number:'02', title:'Human-guided AI testing', intro:'A learning concept exploring useful, observable AI-assisted quality workflows.', body:'<p><strong>Question:</strong> How can AI support testing while keeping human judgment visible?</p><p><strong>Exploration:</strong> Look at test idea generation, evaluation of AI agents and the signals needed to review generated output. A human remains responsible for context, risk and whether a result is trustworthy.</p><p><strong>Focus areas:</strong> LLM testing · agent evaluation · human-in-the-loop review</p>'},
    api: {number:'03', title:'API quality from the contract up', intro:'A learning concept about making API checks useful beyond the happy path.', body:'<p><strong>Question:</strong> What behaviors should an API test protect?</p><p><strong>Exploration:</strong> Examine response contracts, boundary cases, failure modes and the diagnostics that make an issue actionable. Tests should explain what broke and why it matters.</p><p><strong>Focus areas:</strong> REST APIs · behavior · edge cases · diagnostics</p>'}
  };

  document.body.classList.remove('no-js');
  document.querySelector('#year').textContent = new Date().getFullYear();

  const setMenu = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    mobileNav.hidden = !open;
  };
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setMenu(false); toggle.focus(); } });

  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, {passive:true});

  if ('IntersectionObserver' in window && !reducedMotion) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), {threshold:.12, rootMargin:'0px 0px -35px 0px'});
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  } else document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));

  const processButtons = [...document.querySelectorAll('.process-step')];
  processButtons.forEach((button, index) => {
    const activate = () => {
      processButtons.forEach((item, i) => { item.classList.toggle('is-active', i === index); item.setAttribute('aria-selected', String(i === index)); item.tabIndex = i === index ? 0 : -1; });
      const detail = document.querySelector('#process-detail');
      detail.setAttribute('aria-labelledby', button.id);
      detail.querySelector('.detail-label').textContent = `${String(index + 1).padStart(2,'0')} / ${stages[index][0]}`;
      detail.querySelector('p').textContent = stages[index][1];
    };
    button.addEventListener('click', activate);
    button.addEventListener('keydown', event => {
      if (['ArrowRight','ArrowDown','ArrowLeft','ArrowUp'].includes(event.key)) { event.preventDefault(); const delta = ['ArrowRight','ArrowDown'].includes(event.key) ? 1 : -1; const next = processButtons[(index + delta + processButtons.length) % processButtons.length]; next.focus(); next.click(); }
    });
  });

  const openProject = (key, trigger) => {
    const data = projects[key]; if (!data) return;
    dialog.querySelector('.dialog-number').textContent = data.number;
    dialog.querySelector('#dialog-title').textContent = data.title;
    dialog.querySelector('.dialog-intro').textContent = data.intro;
    dialog.querySelector('.dialog-body').innerHTML = data.body;
    dialog.returnValue = '';
    dialog.showModal(); document.body.classList.add('dialog-open');
    dialog.dataset.trigger = trigger?.dataset.project || key;
    dialog.querySelector('.dialog-close').focus();
  };
  document.querySelectorAll('.project-open').forEach(button => button.addEventListener('click', () => openProject(button.dataset.project, button)));
  const closeDialog = () => { if (dialog.open) dialog.close(); document.body.classList.remove('dialog-open'); };
  dialog.querySelector('.dialog-close').addEventListener('click', closeDialog);
  dialog.addEventListener('click', event => { if (event.target === dialog) closeDialog(); });
  dialog.addEventListener('close', () => { document.body.classList.remove('dialog-open'); document.querySelector(`.project-open[data-project="${dialog.dataset.trigger}"]`)?.focus(); });

  document.querySelector('.copy-email').addEventListener('click', async event => {
    const button = event.currentTarget; const feedback = document.querySelector('.copy-feedback');
    try { await navigator.clipboard.writeText(button.dataset.email); feedback.textContent = 'Email copied to clipboard.'; }
    catch { feedback.textContent = `Email: ${button.dataset.email}`; }
    window.setTimeout(() => { feedback.textContent = ''; }, 3200);
  });

  if (!reducedMotion && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.magnetic').forEach(button => {
      button.addEventListener('pointermove', event => { const rect = button.getBoundingClientRect(); const x = (event.clientX - rect.left - rect.width/2) * .08; const y = (event.clientY - rect.top - rect.height/2) * .12; button.style.transform = `translate(${x}px,${y}px)`; });
      button.addEventListener('pointerleave', () => { button.style.transform = ''; });
    });
    document.querySelectorAll('[data-tilt]').forEach(card => {
      card.addEventListener('pointermove', event => { const r=card.getBoundingClientRect(); const x=(event.clientX-r.left)/r.width-.5; const y=(event.clientY-r.top)/r.height-.5; card.style.transform=`perspective(850px) rotateY(${x*3}deg) rotateX(${-y*2.5}deg) translateY(-2px)`; });
      card.addEventListener('pointerleave', () => { card.style.transform=''; });
    });
  }

  const canvas = document.querySelector('.hero-canvas');
  const ctx = canvas.getContext?.('2d', {alpha:true});
  if (ctx) {
    let width=0,height=0,dpr=1,start=performance.now(),lastFrame=0,mouse={x:-9999,y:-9999},inView=true,raf=0;
    const resize = () => { const r=canvas.getBoundingClientRect();width=r.width;height=r.height;dpr=Math.min(window.devicePixelRatio||1,1.5);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);draw(performance.now()); };
    const polygon = (points, fill, stroke, lineWidth=1) => {ctx.beginPath();ctx.moveTo(points[0][0],points[0][1]);points.slice(1).forEach(p=>ctx.lineTo(p[0],p[1]));ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lineWidth;ctx.stroke();}};
    const line = (points, color, lineWidth=1, dash=[]) => {ctx.beginPath();ctx.setLineDash(dash);ctx.moveTo(points[0][0],points[0][1]);points.slice(1).forEach(p=>ctx.lineTo(p[0],p[1]));ctx.strokeStyle=color;ctx.lineWidth=lineWidth;ctx.stroke();ctx.setLineDash([]);};
    const label = (text,x,y,color='#94a8b7',size=8) => {ctx.fillStyle=color;ctx.font=`${size}px 'DM Mono', monospace`;ctx.letterSpacing='1.4px';ctx.fillText(text,x,y);ctx.letterSpacing='0px';};
    const drawBox = (x,y,size,bad,alpha,tilt=0) => {
      ctx.save();ctx.globalAlpha=alpha;ctx.translate(x,y);ctx.rotate(tilt);const w=size,h=size*.73,d=size*.47;
      polygon([[-w/2,-h/2],[-w/2+d,-h/2-d],[w/2+d,-h/2-d],[w/2,-h/2]],bad?'#42232b':'#183840',bad?'rgba(255,127,116,.78)':'rgba(112,230,242,.58)');
      polygon([[-w/2,-h/2],[0,0],[0,h],[ -w/2,h/2]],bad?'#512630':'#17434a',bad?'rgba(255,127,116,.72)':'rgba(112,230,242,.7)');
      polygon([[0,0],[w/2, -h/2],[w/2,h/2],[0,h]],bad?'#301b25':'#102d35',bad?'rgba(255,127,116,.6)':'rgba(112,230,242,.4)');
      line([[-w*.25,-h*.05],[0,h*.23],[w*.24,-h*.06]],bad?'rgba(255,154,137,.52)':'rgba(134,238,245,.48)',1);
      ctx.restore();
    };
    const drawRobot = (time, scale) => {
      const px=x=>x*width, py=y=>y*height, pulse=(Math.sin(time*1.5)+1)/2;
      const baseX=px(.925), baseY=py(.365), shoulder=[px(.91),py(.35)];
      const reach=.09+.055*(.5+.5*Math.sin(time*1.05-.8));
      const elbow=[px(.86-reach*.36),py(.29+.035*Math.sin(time*1.05))];
      const wrist=[px(.805-reach*.58),py(.405+.035*Math.sin(time*1.05-.5))];
      // A suspended gantry and machined joints give the sorting arm a clear silhouette.
      polygon([[px(.866),py(.11)],[px(.99),py(.11)],[px(.99),py(.145)],[px(.866),py(.145)]],'rgba(20,34,47,.92)','rgba(122,166,190,.34)');
      line([[px(.89),py(.145)],[px(.89),py(.30)],[px(.96),py(.30)],[px(.96),py(.145)]],'rgba(119,156,179,.35)',2);
      polygon([[shoulder[0]-12*scale,shoulder[1]-7*scale],[shoulder[0]+10*scale,shoulder[1]-7*scale],[shoulder[0]+13*scale,shoulder[1]+7*scale],[shoulder[0]-10*scale,shoulder[1]+7*scale]],'#182532','rgba(131,179,199,.7)',1.2*scale);
      line([shoulder,elbow],'#294454',11*scale);line([shoulder,elbow],'#6e98a8',5*scale);
      line([elbow,wrist],'#273b4a',8*scale);line([elbow,wrist],'#70d9e8',3*scale);
      [shoulder,elbow,wrist].forEach((p,i)=>{ctx.beginPath();ctx.arc(p[0],p[1],(i===1?9:7)*scale,0,Math.PI*2);ctx.fillStyle=i===2?'#73e5ef':'#263d4a';ctx.fill();ctx.strokeStyle=i===2?'rgba(180,255,255,.8)':'rgba(135,193,210,.7)';ctx.lineWidth=1.2*scale;ctx.stroke();ctx.beginPath();ctx.arc(p[0],p[1],2.3*scale,0,Math.PI*2);ctx.fillStyle='#b2fbff';ctx.fill();});
      const clawY=wrist[1]+12*scale, clawX=wrist[0];line([[clawX,clawY],[clawX,clawY+8*scale],[clawX-5*scale,clawY+14*scale]],'#8ceaf1',1.8*scale);line([[clawX,clawY+8*scale],[clawX+5*scale,clawY+14*scale]],'#8ceaf1',1.8*scale);
      ctx.beginPath();ctx.arc(px(.79),py(.405),24*scale,0,Math.PI*2);ctx.strokeStyle=`rgba(112,230,242,${.1+pulse*.15})`;ctx.lineWidth=1*scale;ctx.stroke();
    };
    const draw = now => {
      if(!width||!height)return;
      if(!reducedMotion&&now-lastFrame<31){raf=requestAnimationFrame(draw);return;}
      lastFrame=now;
      const time=reducedMotion?3.1:(now-start)/1000;
      ctx.clearRect(0,0,width,height);
      const unit=Math.min(width/1440,height/820), X=v=>v*width, Y=v=>v*height;
      // Factory bay: a dark glass enclosure with restrained architectural light.
      const haze=ctx.createRadialGradient(X(.83),Y(.43),2,X(.83),Y(.43),Math.min(width,height)*.48);haze.addColorStop(0,'rgba(32,111,145,.17)');haze.addColorStop(.58,'rgba(31,65,97,.09)');haze.addColorStop(1,'rgba(4,8,14,0)');ctx.fillStyle=haze;ctx.fillRect(X(.48),Y(.06),width*.54,height*.8);
      polygon([[X(.57),Y(.20)],[X(.98),Y(.20)],[X(.98),Y(.63)],[X(.57),Y(.47)]],'rgba(7,14,22,.20)','rgba(119,170,194,.13)',1*unit);
      line([[X(.57),Y(.20)],[X(.57),Y(.47)],[X(.98),Y(.63)]],'rgba(125,184,205,.21)',1*unit);
      line([[X(.64),Y(.20)],[X(.64),Y(.49)]],'rgba(112,230,242,.08)',1*unit);
      line([[X(.96),Y(.20)],[X(.96),Y(.57)]],'rgba(112,230,242,.08)',1*unit);
      // Machine enclosure and inspection portal.
      polygon([[X(.675),Y(.25)],[X(.748),Y(.25)],[X(.748),Y(.405)],[X(.675),Y(.39)]],'rgba(12,24,34,.95)','rgba(101,156,179,.54)',1.2*unit);
      polygon([[X(.675),Y(.25)],[X(.70),Y(.20)],[X(.773),Y(.20)],[X(.748),Y(.25)]],'#172c39','rgba(112,230,242,.38)',1*unit);
      line([[X(.692),Y(.266)],[X(.692),Y(.376)]],'rgba(112,230,242,.18)',1*unit);
      ctx.fillStyle='rgba(88,215,231,.08)';ctx.fillRect(X(.703),Y(.271),width*.037,height*.096);
      label('VISION',X(.682),Y(.236),'#a5bac7',7*unit);
      // Inspection portal straddles the moving belt; its scan line reacts as packages pass.
      line([[X(.785),Y(.275)],[X(.785),Y(.438)]],'rgba(110,172,193,.65)',2*unit);
      line([[X(.785),Y(.275)],[X(.853),Y(.29)],[X(.853),Y(.443)]],'rgba(110,172,193,.55)',2*unit);
      line([[X(.778),Y(.275)],[X(.858),Y(.292)]],'rgba(138,200,216,.76)',3*unit);
      const scan=Math.sin(time*1.9), scanY=Y(.318+((scan+1)/2)*.12);
      const scanGlow=ctx.createLinearGradient(X(.79),scanY,X(.855),scanY+height*.012);scanGlow.addColorStop(0,'rgba(112,230,242,0)');scanGlow.addColorStop(.5,scan<-.6?'rgba(255,120,111,.82)':'rgba(112,230,242,.8)');scanGlow.addColorStop(1,'rgba(112,230,242,0)');ctx.strokeStyle=scanGlow;ctx.lineWidth=2*unit;ctx.beginPath();ctx.moveTo(X(.79),scanY);ctx.lineTo(X(.855),scanY+height*.014);ctx.stroke();
      ctx.beginPath();ctx.arc(X(.817),Y(.29),3*unit,0,Math.PI*2);ctx.fillStyle=scan<-.6?'#ff978e':'#70e6f2';ctx.shadowColor=ctx.fillStyle;ctx.shadowBlur=12*unit;ctx.fill();ctx.shadowBlur=0;
      // Conveyor deck and side rails in a strong isometric perspective.
      polygon([[X(.602),Y(.385)],[X(.916),Y(.405)],[X(1.015),Y(.607)],[X(.70),Y(.565)]],'#11232d','rgba(115,178,198,.62)',1.3*unit);
      polygon([[X(.70),Y(.565)],[X(1.015),Y(.607)],[X(1.015),Y(.655)],[X(.70),Y(.612)]],'#101922','rgba(112,230,242,.28)',1*unit);
      line([[X(.614),Y(.383)],[X(.711),Y(.554)],[X(1.015),Y(.598)]],'rgba(112,230,242,.52)',2*unit);
      line([[X(.70),Y(.575)],[X(.993),Y(.621)]],'rgba(90,125,144,.58)',1*unit);
      // Conveyor slats travel toward inspection; the loop is slow enough to read as motion.
      const beltPhase=reducedMotion?0:(time*.62)%1;
      for(let i=0;i<12;i++){const t=(i/12+beltPhase)%1,x=.612+t*.384,y=.393+t*.205;line([[X(x),Y(y)],[X(x+.018),Y(y+.004)]],`rgba(127,197,214,${.12+(i%3)*.035})`,1*unit);}
      // Reject chute and approved-product output make the quality decision legible.
      polygon([[X(.725),Y(.637)],[X(.802),Y(.648)],[X(.837),Y(.698)],[X(.752),Y(.685)]],'#251923','rgba(255,135,123,.55)',1*unit);
      polygon([[X(.752),Y(.685)],[X(.837),Y(.698)],[X(.837),Y(.746)],[X(.752),Y(.73)]],'#17161e','rgba(255,135,123,.38)',1*unit);
      label('REJECT',X(.758),Y(.718),'#e99a91',7*unit);
      polygon([[X(.927),Y(.642)],[X(1.006),Y(.654)],[X(1.027),Y(.687)],[X(.947),Y(.674)]],'#14272f','rgba(112,230,242,.5)',1*unit);
      label('PASS  →',X(.934),Y(.708),'#93eaf0',7*unit);
      // Three products progress through inspect → pick/reject or pass.
      for(let i=0;i<4;i++){
        const travel=(time*.061+i*.27), t=travel%1, loop=Math.floor(travel), defective=((loop+i*2)%4===2);
        if(t<.06||t>.96)continue;
        let x=.615+t*.373,y=.395+t*.20,alpha=1,fall=0;
        if(defective&&t>.56&&t<.79){fall=(t-.56)/.23;alpha=Math.max(0,1-fall*.7);x-=fall*.045;y+=fall*.15;}
        if(defective&&t>=.79)continue;
        if(t<.21&&i>2)continue;
        const size=(18+t*24)*unit;
        drawBox(X(x),Y(y),size,defective,alpha,Math.sin(time*1.4+i)*.025);
        if(!defective&&t>.78){ctx.beginPath();ctx.arc(X(x),Y(y-.045),2.2*unit,0,Math.PI*2);ctx.fillStyle='#83f1d0';ctx.fill();}
      }
      drawRobot(time,unit);
      // Status labels and small control lights anchor the three-beat story.
      label('01 / FEED',X(.584),Y(.34),'#8193a0',7*unit);
      label('02 / INSPECT',X(.767),Y(.246),'#a7c3cf',7*unit);
      label('03 / SORT',X(.894),Y(.36),'#8193a0',7*unit);
      [0,1,2].forEach(i=>{ctx.beginPath();ctx.arc(X(.909+i*.014),Y(.214),2*unit,0,Math.PI*2);ctx.fillStyle=(Math.floor(time*1.6)%3===i)?'#70e6f2':'#38515e';ctx.fill();});
      line([[X(.59),Y(.765)],[X(.975),Y(.765)]],'rgba(127,177,197,.18)',1*unit);
      label('QUALITY CELL  /  AUTOMATED INSPECTION',X(.59),Y(.787),'#748b98',7*unit);
      // Soft cursor light responds without stealing focus from the scene.
      if(mouse.x>-1000){const glow=ctx.createRadialGradient(mouse.x,mouse.y,0,mouse.x,mouse.y,75*unit);glow.addColorStop(0,'rgba(112,230,242,.10)');glow.addColorStop(1,'rgba(112,230,242,0)');ctx.fillStyle=glow;ctx.fillRect(mouse.x-75*unit,mouse.y-75*unit,150*unit,150*unit);}
      if(!reducedMotion&&inView)raf=requestAnimationFrame(draw);
    };
    window.addEventListener('resize',resize,{passive:true});
    document.querySelector('.hero').addEventListener('pointermove',e=>{const r=canvas.getBoundingClientRect();mouse={x:e.clientX-r.left,y:e.clientY-r.top};});
    document.querySelector('.hero').addEventListener('pointerleave',()=>{mouse={x:-9999,y:-9999};});
    if('IntersectionObserver'in window&&!reducedMotion)new IntersectionObserver(entries=>{const visible=entries[0].isIntersecting;if(visible&&!inView){inView=true;raf=requestAnimationFrame(draw);}else if(!visible&&inView){inView=false;cancelAnimationFrame(raf);raf=0;}}).observe(document.querySelector('.hero'));
    resize();if(reducedMotion)draw(start);
  }
})();
