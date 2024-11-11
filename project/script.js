document.addEventListener('DOMContentLoaded', function() {
    const wrapper = document.querySelector('.wrapper');
    const btnPopup = document.querySelector('.btnLogin-popup');
    const iconClose = document.querySelector('.icon-close');
    const siteTitle = document.querySelector('.site-title'); // Select the site title
  
    btnPopup.addEventListener('click', () => {
      wrapper.classList.add('active-popup');
      siteTitle.style.opacity = '0'; // Make the title vanish
    });
  
    iconClose.addEventListener('click', () => {
      wrapper.classList.remove('active-popup');
      siteTitle.style.opacity = '1'; // Make the title visible again when closing
    });
  });
  