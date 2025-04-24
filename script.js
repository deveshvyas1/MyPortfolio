function scrollDown() {
    window.scrollBy({
      top: 450, // pixels to scroll vertically
      behavior: 'smooth' // smooth scrolling
    });
  }

  function allDown() {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    });
  }
  
  function reloadPage() {
    location.reload();
  }