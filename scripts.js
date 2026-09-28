'use strict';
// PERSONALIZE AQUI: troque textos, opções e destinos sem alterar o fluxo.
const CONFIG = {
  whatsapp: '556896147080',
  // Cole abaixo o endereço completo da surpresa (ex.: https://seusite.com).
  // Enquanto vazio, o card Prossiga aparece indisponível.
  linkProssiga: 'https://music.youtube.com/watch?v=izGwDsrQ1eQ',
  // TROCAS FUTURAS DE COMIDAS / RESTAURANTES: [emoji, nome].
  comidas: [['🍔','Hambúrguer'],['🍣','Sushi'],['🍝','Massas'],['🍦','Sorvete'],['🍕','Pizza'],['🍻','Cerva']],
  // TROCAS FUTURAS DE ATIVIDADES / LUGARES: [emoji, nome].
  atividades: [['🍽️','Restaurante'],['🚶','Caminhada'],['🎬','Cinema'],['🍻','Happy our'],['🎡','Parque'],['🕯️','Jantar caseiro'],],
  provocacoes: ['Tem certeza, gatinha? 🥺','Pensa com carinho, meu bem…','-  com  -  é  +','Aparentemente você está apertando no lugar errado 😂','Vai, linda… o SIM está te esperando ♥','Tenho o dia inteiro pra esperar', 'Vai negar comida pro down? 🥺' ]
};
// Estado apenas em memória: atualizar a página reinicia o convite.
const state = { step: 0, date: '', time: '18:00', food: '', activity: '', attempts: 0 };
const content = document.querySelector('#content');
const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const localDate = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
const heading = (label,title,subtitle) => `<div class="eyebrow">${label}</div><h1 tabindex="-1">${title}</h1><p>${subtitle}</p>`;
const back = () => '<button class="back" data-back>← Voltar um pouquinho</button>';
const next = (label='Próximo',disabled=false) => `<button class="button wide" data-next ${disabled?'disabled':''}>${label} <span aria-hidden="true">→</span></button>`;
function validFuture() { return state.date && state.time && new Date(`${state.date}T${state.time}:00`).getTime() > Date.now(); }
function render(focus=true) {
  document.querySelector('body > #no')?.remove();
  document.querySelector('#counter').textContent = `0${state.step+1} / 06`;
  document.querySelector('#progress').innerHTML = Array.from({length:6},(_,i)=>`<span class="dot ${i===state.step?'active':''}" ${i===state.step?'aria-current="step"':''} aria-label="Etapa ${i+1}"></span>`).join('');
  if(state.step===0) content.innerHTML = `<div class="seal" aria-hidden="true">♥</div>${heading('TENHO UMA PERGUNTINHA…','Que tal um encontro<br><em>comigo?</em>','Oi, gatinha. <br>Você topa sair comigo?')}<div class="actions"><button class="button" data-next>Sim, eu topo! ♥</button><button class="button secondary" id="no">Não</button></div><p class="tease" id="tease" role="status">Pode escolher… se conseguir 🤭</p>`;
  if(state.step===1) content.innerHTML = `<div class="seal" aria-hidden="true">💌</div>${heading('SABIA QUE VOCÊ QUERIA','Você disse <em>sim!</em>','Achava que não ia aceitar.<br>Mentira🤭')}${next('Vamos organizar melhor?')}${back()}`;
  if(state.step===2) content.innerHTML = `${heading('RESERVA:','Quando você<br>está <em>livre?</em>','Escolhe o dia e a hora, meu bem.<br>O resto deixa com o pae aqui😎.')}<form id="date-form"><div class="form"><label>O nosso dia<input id="date" type="date" required min="${localDate()}" value="${escapeHtml(state.date)}"></label><label>Melhor horário<input id="time" type="time" required value="${escapeHtml(state.time)}"></label></div><p class="error" id="date-error" role="alert"></p><button class="button wide" type="submit">Guardar essa data <span aria-hidden="true">→</span></button></form>${back()}`;
  if(state.step===3 || state.step===4) {
    const food = state.step===3, key=food?'food':'activity', options=food?CONFIG.comidas:CONFIG.atividades;
    content.innerHTML = heading(food?'Sua preferencia':'E DEPOIS, NÓS DOIS',food?'O que você<br>está <em>a fim?</em>':'Qual é a<br>nossa <em>vibe?</em>',food?'Escolha uma delícia pra acompanhar<br>a nossa conversa.':'Um passeio, umas risadas e você. Pra que melhor?:<br>Qual programa combina com a gente?')+`<div class="grid" role="group" aria-label="${food?'Comida':'Atividade'}">${options.map(([emoji,name],i)=>`<button class="choice" data-choice="${i}" aria-pressed="${state[key]===name}"><span aria-hidden="true">${emoji}</span>${escapeHtml(name)}</button>`).join('')}</div>${next(state[key]?'Boa escolha! Vamos lá':'Escolhe uma opção',!state[key])}${back()}`;
    content.querySelectorAll('[data-choice]').forEach(button=>button.addEventListener('click',()=>{state[key]=options[Number(button.dataset.choice)][1];content.querySelectorAll('[data-choice]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));const n=content.querySelector('[data-next]');n.disabled=false;n.innerHTML='Boa escolha! Vamos lá <span aria-hidden="true">→</span>';}));
  }
  if(state.step===5) {
    const dateLabel = new Date(`${state.date}T12:00:00`).toLocaleDateString('pt-BR',{day:'numeric',month:'long',year:'numeric'});
    const message = `Encontro marcado! ♥\nDia: ${dateLabel}\nHorário: ${state.time}\nComida: ${state.food}\nPasseio: ${state.activity}\nTe espero! 🥰`;
    const link = /^https?:\/\//i.test(CONFIG.linkProssiga) ? CONFIG.linkProssiga : '';
    content.innerHTML = heading('OFICIALMENTE COMBINADO','Tô contigo,<br><em>gatinha.</em>','Fica pronta que eu vou te buscar.<br>O melhor do encontro vai ser a companhia. ♥')+`<dl class="summary"><div><dt>📅 Nosso dia</dt><dd>${escapeHtml(dateLabel)}</dd></div><div><dt>🕒 Horário</dt><dd>${escapeHtml(state.time)}</dd></div><div><dt>🍽️ Pra comer</dt><dd>${escapeHtml(state.food)}</dd></div><div><dt>✨ Nosso passeio</dt><dd>${escapeHtml(state.activity)}</dd></div></dl><a class="button wide" href="https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(message)}" target="_blank" rel="noopener noreferrer">Confirmar no WhatsApp ↗</a><p class="hint">A mensagem vai prontinha. É só enviar por lá.</p><a class="continue-card" ${link?`href="${escapeHtml(link)}" target="_blank" rel="noopener noreferrer"`:'aria-disabled="true"'}><span><strong>Prossiga</strong><small>${link?'Ouça se arrumando...':'Uma surpresa vem por aí…'}</small></span><span aria-hidden="true">↗</span></a>${back()}`;
  }
  content.classList.remove('content-enter');void content.offsetWidth;content.classList.add('content-enter');
  content.querySelector('[data-next]')?.addEventListener('click',()=>{state.step++;render();});
  content.querySelector('[data-back]')?.addEventListener('click',()=>{state.step--;render();});
  const no=content.querySelector('#no');
  if(no){no.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse') dodge(no);});no.addEventListener('pointerdown',e=>{e.preventDefault();dodge(no);});no.addEventListener('click',()=>dodge(no));}
  content.querySelector('#date-form')?.addEventListener('submit',event=>{event.preventDefault();state.date=content.querySelector('#date').value;state.time=content.querySelector('#time').value;if(!validFuture()){content.querySelector('#date-error').textContent='Escolha uma data e um horário que ainda vão chegar, linda.';return;}state.step++;render();});
  if(focus) content.querySelector('h1')?.focus({preventScroll:true});
}
function dodge(button) {
  if(button.parentElement !== document.body) {
    // Reserva o espaço original: o SIM não cresce nem muda de posição.
    const rect=button.getBoundingClientRect();
    const placeholder=document.createElement('span');
    placeholder.setAttribute('aria-hidden','true');
    Object.assign(placeholder.style,{width:`${rect.width}px`,height:`${rect.height}px`,flex:'0 0 auto'});
    button.replaceWith(placeholder);
    document.body.appendChild(button);
    Object.assign(button.style,{position:'fixed',width:`${rect.width}px`,height:`${rect.height}px`,zIndex:'100',margin:'0',transform:'none'});
  }
  positionNo(button);
  document.querySelector('#tease').textContent=CONFIG.provocacoes[state.attempts++%CONFIG.provocacoes.length];
}
function positionNo(button) {
  const margin=12;
  const maxX=Math.max(margin,window.innerWidth-button.offsetWidth-margin);
  const maxY=Math.max(margin,window.innerHeight-button.offsetHeight-margin);
  const yes=content.querySelector('[data-next]').getBoundingClientRect();
  let x,y;
  // Sorteia pela tela inteira, evitando cobrir o SIM.
  for(let i=0;i<40;i++) {
    x=margin+Math.random()*(maxX-margin);
    y=margin+Math.random()*(maxY-margin);
    if(x+button.offsetWidth<yes.left-12 || x>yes.right+12 || y+button.offsetHeight<yes.top-12 || y>yes.bottom+12) break;
    if(i===39){x=margin;y=yes.top>button.offsetHeight+margin*2?margin:maxY;}
  }
  button.style.left=`${x}px`;button.style.top=`${y}px`;
}
window.addEventListener('resize',()=>{const button=document.querySelector('body > #no');if(button) positionNo(button);});
render(false);

