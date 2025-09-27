const password = document.getElementById('account_password');
const repassword = document.getElementById('re_password');
const message = document.getElementById('message');
const form = document.getElementById('form-element');
const show_hide = document.getElementById('show-hide');





form.addEventListener('submit', (event) => {
  if (password.value !== repassword.value) {
    event.preventDefault();
    message.style.color = 'red';
    message.textContent = 'Passwords do not match';
  } else {
    message.style.color = 'green';
    message.textContent = 'Passwords match';
  }
});

show_hide.addEventListener('click', (event) => {
  if (password.type ===   'password') {
    password.setAttribute('type', 'text');
    show_hide.textContent = 'Hide Password';
    event.preventDefault();
  }
  else{
    password.setAttribute('type', 'password');
    show_hide.textContent = 'Show Password';
    event.preventDefault(); 
  }})









//javascript:for(var f=document.forms,i=f.length;i--;)f[i].setAttribute("novalidate",i)