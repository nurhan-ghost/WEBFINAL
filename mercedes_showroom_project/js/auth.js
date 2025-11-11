
document.addEventListener('DOMContentLoaded', ()=>{
  const signup = document.getElementById('signupForm');
  const login = document.getElementById('loginForm');
  if(signup) signup.addEventListener('submit', signUp);
  if(login) login.addEventListener('submit', logIn);
});

function signUp(e){
  e.preventDefault();
  const name = document.getElementById('su_name').value.trim();
  const email = document.getElementById('su_email').value.trim().toLowerCase();
  const password = document.getElementById('su_password').value;
  const phone = document.getElementById('su_phone').value.trim();
  const err = document.getElementById('err_signup');

  if(!name || !validateEmail(email) || !validatePhone(phone) || !validatePassword(password)){
    err.textContent = 'Invalid data. Password must be at least 8 chars and include letters and numbers.';
    return;
  }
  let users = JSON.parse(localStorage.getItem('users')||'[]');
  if(users.some(u=>u.email===email)){
    err.textContent = 'A user with this email already exists.';
    return;
  }
  users.push({name,email,password,phone});
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('currentUser', email);
  window.location.href = 'profile.html';
}

function logIn(e){
  e.preventDefault();
  const email = document.getElementById('li_email').value.trim().toLowerCase();
  const password = document.getElementById('li_password').value;
  const err = document.getElementById('err_login');
  const users = JSON.parse(localStorage.getItem('users')||'[]');
  const user = users.find(u=>u.email===email && u.password===password);
  if(!user){
    err.textContent = 'Incorrect email or password.';
    return;
  }
  localStorage.setItem('currentUser', email);
  window.location.href = 'profile.html';
}
