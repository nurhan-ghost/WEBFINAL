
let cars = [];
async function loadCars(){
  try{
    const res = await fetch('data/cars.json');
    cars = await res.json();
    renderCars(cars);
    const last = JSON.parse(localStorage.getItem('lastSearch')||'null');
    if(last) renderCars(last);
  }catch(e){
    console.error('Error loading data', e);
  }
}
function renderCars(list){
  const container = document.getElementById('cards');
  if(!container) return;
  if(list.length===0){ container.innerHTML = '<p>Nothing found.</p>'; return; }
  container.innerHTML = list.map(car=>`
    <article class="card" tabindex="0" role="article" aria-label="${car.name}">
      <img src="${car.img}" alt="${car.name}">
      <h3>${car.name}</h3>
      <p class="muted">${car.category.toUpperCase()} · ${car.power} hp</p>
      <p><strong>$${car.price.toLocaleString()}</strong></p>
      <a class="btn" href="car.html?id=${car.id}">Details</a>
    </article>
  `).join('');
  localStorage.setItem('lastSearch', JSON.stringify(list));
}

document.addEventListener('DOMContentLoaded', ()=>{
  if(document.getElementById('cards')) loadCars();

  const search = document.getElementById('search');
  const cat = document.getElementById('cat');
  const priceMax = document.getElementById('priceMax');
  const clear = document.getElementById('clearFilters');

  if(search) search.addEventListener('input', applyFilters);
  if(cat) cat.addEventListener('change', applyFilters);
  if(priceMax) priceMax.addEventListener('input', applyFilters);
  if(clear) clear.addEventListener('click', ()=>{
    if(search) search.value='';
    if(cat) cat.value='all';
    if(priceMax) priceMax.value='';
    renderCars(cars);
  });

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if(id && cars.length===0){
    loadCars().then(()=> showDetail(id));
  } else if(id){
    showDetail(id);
  }
});

function applyFilters(){
  const q = (document.getElementById('search')?.value||'').trim().toLowerCase();
  const category = document.getElementById('cat')?.value || 'all';
  const priceMax = Number(document.getElementById('priceMax')?.value || 0);
  let filtered = cars.slice();
  if(q) filtered = filtered.filter(c=> c.name.toLowerCase().includes(q) || c.category.toLowerCase().includes(q));
  if(category && category!=='all') filtered = filtered.filter(c=> c.category===category);
  if(priceMax>0) filtered = filtered.filter(c=> c.price <= priceMax);
  renderCars(filtered);
}

function showDetail(id){
  const car = cars.find(c=>c.id===id);
  const container = document.getElementById('carDetail');
  if(!container) return;
  if(!car){ container.innerHTML = '<p>Model not found.</p>'; return; }
  container.innerHTML = `
    <div>
      <img src="${car.img}" alt="${car.name}">
    </div>
    <div>
      <h1>${car.name}</h1>
      <p>${car.description}</p>
      <ul>
        <li><strong>Category:</strong> ${car.category}</li>
        <li><strong>Power:</strong> ${car.power} hp</li>
        <li><strong>0-100 km/h:</strong> ${car.acceleration} s</li>
        <li><strong>Price:</strong> $${car.price.toLocaleString()}</li>
      </ul>
      <button class="btn" onclick="alert('Thank you! Test drive request sent.')">Book a test drive</button>
    </div>
  `;
}
