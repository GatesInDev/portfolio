import { projects } from './data.js';
import { posts } from './posts.js';
const terminal=document.createElement('section');terminal.className='activity-terminal';terminal.setAttribute('aria-label','Terminal visual de navegação');
terminal.innerHTML='<details open><summary>gates@portfolio <span>sessão visual</span></summary><div class="terminal-log" role="log" aria-live="polite" aria-relevant="additions"></div></details><form role="search"><label for="portfolio-search">$ grep</label><input id="portfolio-search" type="search" placeholder="Buscar no portfólio…" autocomplete="off"><button type="submit" aria-label="Buscar">↵</button></form><div class="terminal-results"></div>';
document.body.append(terminal);
const log=terminal.querySelector('.terminal-log'),input=terminal.querySelector('input'),results=terminal.querySelector('.terminal-results');
function write(command){const line=document.createElement('div');line.textContent='$ '+command;log.append(line);while(log.children.length>4)log.firstChild.remove();log.scrollTop=log.scrollHeight;}
function route(){const h=location.hash.slice(1)||'home';const names={home:'inicio',projects:'projetos',articles:'artigos',contact:'contato'};write('cd ~/portfolio/'+(names[h]||h));}
route();addEventListener('hashchange',()=>{route();results.replaceChildren();input.value='';});
let timer;
function search(){const q=input.value.trim();results.replaceChildren();if(!q)return;write('grep -i -- '+JSON.stringify(q)+' ~/portfolio/*');const normalize=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();const matches=[...projects.map(p=>({...p,href:'#project/'+p.id})),...posts.map(p=>({...p,href:'#article/'+p.id}))].filter(p=>normalize([p.title,p.description,p.excerpt,...(p.tags||[])].join(' ')).includes(normalize(q)));
for(const item of matches.slice(0,8)){const a=document.createElement('a');a.href=item.href;a.textContent=item.title;results.append(a);}if(!matches.length){const p=document.createElement('p');p.textContent='Nenhum resultado encontrado.';results.append(p);}}
input.addEventListener('input',()=>{clearTimeout(timer);timer=setTimeout(search,250);});terminal.querySelector('form').addEventListener('submit',e=>{e.preventDefault();clearTimeout(timer);search();});
addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='f'&&document.activeElement!==input){e.preventDefault();terminal.querySelector('details').open=true;input.focus();input.select();}else if(e.key==='Escape'&&terminal.contains(document.activeElement)){results.replaceChildren();input.value='';input.blur();}});
// Ctrl+F again while in the search box retains the browser's native find.
document.addEventListener('click',e=>{const a=e.target.closest('a');if(a?.getAttribute('href')?.endsWith('.pdf'))write('open '+a.getAttribute('href'));});
