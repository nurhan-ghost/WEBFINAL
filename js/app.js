
(function(){
  const toggle = document.getElementById('themeToggle');
  const saved = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  if(toggle) toggle.checked = saved === 'dark';
  if(toggle) toggle.addEventListener('change', ()=>{
    const theme = toggle.checked ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  });
})();

document.addEventListener('DOMContentLoaded', ()=>{
  const contact = document.getElementById('contactForm');
  if(contact){
    contact.addEventListener('submit', (e)=>{
      e.preventDefault();
      const name = document.getElementById('ct_name').value.trim();
      const email = document.getElementById('ct_email').value.trim();
      const phone = document.getElementById('ct_phone').value.trim();
      const msg = document.getElementById('ct_msg').value.trim();
      const err = document.getElementById('err_contact');
      if(!name || !validateEmail(email) || !validatePhone(phone) || !msg){
        err.textContent = 'Please fill all fields correctly. Check email and phone.';
        return;
      }
      err.textContent = 'Message saved locally.';
      const msgs = JSON.parse(localStorage.getItem('messages')||'[]');
      msgs.push({name,email,phone,msg,at:new Date().toISOString()});
      localStorage.setItem('messages', JSON.stringify(msgs));
      contact.reset();
    });
  }

  const logout = document.getElementById('logoutBtn');
  if(logout){
    logout.addEventListener('click', ()=>{
      localStorage.removeItem('currentUser');
      window.location.href = 'index.html';
    });
  }
  if(document.getElementById('profileName')){
    loadProfile();
  }
});

function validateEmail(email){
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function validatePhone(phone){
  return /^\+?\d{9,15}$/.test(phone);
}
function validatePassword(pw){
  try{ return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(pw); }catch(e){ return false; }
}

function loadProfile(){
  const email = localStorage.getItem('currentUser');
  if(!email) {
    return;
  }
  const users = JSON.parse(localStorage.getItem('users')||'[]');
  const user = users.find(u=>u.email===email);
  if(!user) return;
  const elName = document.getElementById('profileName');
  const elEmail = document.getElementById('profileEmail');
  const elPhone = document.getElementById('profilePhone');
  if(elName) elName.textContent = user.name;
  if(elEmail) elEmail.textContent = user.email;
  if(elPhone) elPhone.textContent = user.phone;
}
document.addEventListener('DOMContentLoaded', () => {
  const gallery = document.getElementById('amgGallery');
  if (!gallery) return;

  const images = [
    'images/amg-gt-official.jpg',
    'images/amg-gt-rear.jpg',
    'images/amg-gt-side.jpg'
  ];

  const imgEl = document.createElement('img');
  imgEl.src = images[0];
  imgEl.alt = "Mercedes-AMG GT";
  imgEl.classList.add('fade');
  gallery.appendChild(imgEl);

  let current = 0;
  let interval;

  gallery.addEventListener('mouseenter', () => {
    interval = setInterval(() => {
      current = (current + 1) % images.length;
      imgEl.classList.remove('fade');
      void imgEl.offsetWidth; 
      imgEl.src = images[current];
      imgEl.classList.add('fade');
    }, 4000); 
  });

  gallery.addEventListener('mouseleave', () => {
    clearInterval(interval);
    current = 0;
    imgEl.src = images[0];
    imgEl.classList.add('fade');
  });
});
