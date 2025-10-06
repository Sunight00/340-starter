    const passwor = document.getElementById('account_password');
const forM = document.querySelector('.form-element');
const show_hid = document.getElementById('show-Hide');




show_hid.addEventListener('click', (event) => {
  if (password.type ===   'password') {
    passwor.setAttribute('type', 'text');
    show_hid.textContent = 'Hide Password';
    event.preventDefault();
  }
  else{
    passwor.setAttribute('type', 'password');
    show_hid.textContent = 'Show Password';
    event.preventDefault(); 
  }})




  




//javascript:for(var f=document.forms,i=f.length;i--;)f[i].setAttribute("novalidate",i)