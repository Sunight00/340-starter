
    const toggle = document.getElementById('toggle');
    const navLinks = document.getElementById('navLinks');

    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
