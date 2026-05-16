const schedule = (window.PURION_SCHEDULE_PARTS || []).flat();
const assets = [
  ['Artigo / Tema','Title'],
  ['Hook','Hook principal'],
  ['Reel','Reel Idea'],
  ['Carrossel','Carrossel Idea'],
  ['Post foto + legenda','Post'],
  ['GBP','GBP Post'],
  ['LinkedIn','LinkedIn Post'],
  ['Stories','Stories'],
  ['CTA','CTA ideal']
];
let currentIndex = 0;
let currentAsset = assets[0];
function parseLocalDate(s){ const [y,m,d]=s.split('-').map(Number); return new Date(y,m-1,d); }
function fmtDate(s){
  const d=parseLocalDate(s);
  return d.toLocaleDateString('pt-PT',{weekday:'long',day:'2-digit',month:'long',year:'numeric'});
}
function nearestIndexToToday(){
  const today = new Date(); today.setHours(0,0,0,0);
  let best=0, bestDiff=Infinity;
  schedule.forEach((x,i)=>{const d=parseLocalDate(x.date); const diff=Math.abs(d-today); if(diff<bestDiff){best=i;bestDiff=diff;}});
  return best;
}
function goToday(){ currentIndex=nearestIndexToToday(); renderAll(); }
function moveDay(n){ currentIndex=Math.max(0,Math.min(schedule.length-1,currentIndex+n)); renderAll(); }
function moveWeek(n){
  const wk=schedule[currentIndex].week+n;
  const found=schedule.findIndex(x=>x.week===wk);
  if(found>=0){ currentIndex=found; renderAll(); }
}
function safe(v){return (v===undefined||v===null||v==='')?'—':String(v)}
function renderDaily(){
  const x=schedule[currentIndex];
  document.getElementById('kpiWeek').textContent=x.week;
  document.getElementById('kpiCluster').textContent=x.Cluster;
  document.getElementById('dateTitle').textContent=fmtDate(x.date);
  document.getElementById('dailyTitle').textContent=x.Title;
  document.getElementById('pain').textContent=safe(x['Dor principal']);
  document.getElementById('perception').textContent=safe(x['Percepção construída']);
  document.getElementById('cta').textContent=safe(x['CTA ideal']);
  document.getElementById('dayObjective').textContent=safe(x.dayObjective);
  document.getElementById('meta').innerHTML=`<span class="pill">${x.weekday}</span><span class="pill">Semana ${x.week}</span><span class="pill">${x.Cluster}</span><span class="pill">${safe(x['Formato ideal'])}</span>`;
  renderAssets();
}
function renderWeek(){
  const x=schedule[currentIndex];
  const wk=x.week;
  const days=schedule.filter(i=>i.week===wk);
  document.getElementById('weekTitle').textContent='Semana '+wk;
  document.getElementById('weekHint').textContent=`${fmtDate(days[0].date)} — ${fmtDate(days[days.length-1].date)}`;
  document.getElementById('weekGrid').innerHTML=days.map((d)=>{
    const i=schedule.indexOf(d);
    const done=localStorage.getItem('purion_done_'+d.date)==='1';
    return `<div class="dayCard ${i===currentIndex?'active':''}" onclick="currentIndex=${i};renderAll()">
      <div class="dow">${d.weekday} · ${d.date.slice(5)}</div>
      <div class="t">${d.Title}</div>
      <div class="c">${d.Cluster} ${done?' · feito':''}</div>
    </div>`
  }).join('');
}
function renderAssets(){
  document.getElementById('assetTabs').innerHTML=assets.map(a=>`<button class="${a[0]===currentAsset[0]?'active':''}" onclick="currentAsset=['${a[0]}','${a[1]}'];renderAssets()">${a[0]}</button>`).join('');
  const x=schedule[currentIndex];
  const key=currentAsset[1];
  let value=safe(x[key]);
  if(key==='Title') value=`Tema do artigo:
${x.Title}

Cluster: ${x.Cluster}
Formato ideal: ${safe(x['Formato ideal'])}

Dor principal: ${safe(x['Dor principal'])}
Percepção construída: ${safe(x['Percepção construída'])}
CTA: ${safe(x['CTA ideal'])}`;
  document.getElementById('assetBox').textContent=value;
}
function renderFilters(){
  const clusters=[...new Set(schedule.map(x=>x.Cluster))];
  document.getElementById('clusterFilter').innerHTML='<option value="">Todos os clusters</option>'+clusters.map(c=>`<option>${c}</option>`).join('');
}
function renderList(){
  const c=document.getElementById('clusterFilter').value;
  const q=document.getElementById('searchInput').value.toLowerCase();
  const filtered=schedule.filter(x=>(!c||x.Cluster===c)&&JSON.stringify(x).toLowerCase().includes(q));
  document.getElementById('contentList').innerHTML=filtered.map(x=>{ const i=schedule.indexOf(x); return `<div class="listItem" onclick="currentIndex=${i};renderAll();window.scrollTo({top:0,behavior:'smooth'})"><span class="tag">Sem. ${x.week}</span><b>${x.Title}</b><span class="tag">${x.Cluster}</span></div>` }).join('') || '<div class="empty">Nenhum conteúdo encontrado.</div>';
}
function renderAll(){ renderDaily(); renderWeek(); renderList(); }
function copyAsset(){ navigator.clipboard.writeText(document.getElementById('assetBox').textContent); }
function copyDailyBrief(){
  const x=schedule[currentIndex];
  const text=`PURION — BRIEFING DO DIA
${fmtDate(x.date)}

Tema: ${x.Title}
Cluster: ${x.Cluster}

Dor: ${safe(x['Dor principal'])}
Percepção: ${safe(x['Percepção construída'])}
CTA: ${safe(x['CTA ideal'])}

Hook: ${safe(x['Hook principal'])}

Reel: ${safe(x['Reel Idea'])}

Carrossel: ${safe(x['Carrossel Idea'])}

Post foto+legenda: ${safe(x['Post'])}

GBP: ${safe(x['GBP Post'])}

LinkedIn: ${safe(x['LinkedIn Post'])}

Stories: ${safe(x['Stories'])}`;
  navigator.clipboard.writeText(text);
}
function markDone(){ const x=schedule[currentIndex]; localStorage.setItem('purion_done_'+x.date,'1'); renderAll(); }
function exportCSV(){
  const cols=['date','weekday','week','Cluster','Title','Hook principal','CTA ideal','Reel Idea','Carrossel Idea','Post','GBP Post','LinkedIn Post','Stories'];
  const esc=v=>'"'+String(v??'').replaceAll('"','""')+'"';
  const csv=[cols.join(',')].concat(schedule.map(r=>cols.map(c=>esc(r[c])).join(','))).join('\n');
  const blob=new Blob([csv],{type:'text/csv;charset=utf-8'}); const a=document.createElement('a');
  a.href=URL.createObjectURL(blob); a.download='purion_cronograma_editorial.csv'; a.click(); URL.revokeObjectURL(a.href);
}
renderFilters();
goToday();
