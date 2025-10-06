const passwordField = document.getElementById('account_password');
const showHide = document.getElementById('show-Hide');

showHide.addEventListener('click', (event) => {
  event.preventDefault();

  if (passwordField.type === 'password') {
    passwordField.type = 'text';
    showHide.textContent = 'Hide Password';
  } else {
    passwordField.type = 'password';
    showHide.textContent = 'Show Password';
  }
});