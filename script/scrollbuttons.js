document.addEventListener('DOMContentLoaded', function() {
  document.addEventListener('click', function(event) {
    if (event.target.classList.contains('scroll-button')) {
      const button = event.target;
      const direction = button.classList.contains('scroll-up') ? 'up' : 'down';
      const scrollAmount = 50; // Adjust as needed

      // Find the closest scrollable container
      let scrollableContainer = null;
      let element = button.parentNode;

      while (element) {
        if (element.scrollHeight > element.clientHeight &&
            (getComputedStyle(element).overflowY === 'auto' ||
             getComputedStyle(element).overflowY === 'scroll' ||
             getComputedStyle(element).overflow === 'auto' ||
             getComputedStyle(element).overflow === 'scroll')) {
          scrollableContainer = element;
          break;
        }
        element = element.parentNode;
      }

      if (scrollableContainer) {
        if (direction === 'up') {
          scrollableContainer.scrollTop -= scrollAmount;
        } else {
          scrollableContainer.scrollTop += scrollAmount;
        }

        // Update button visibility *after* scrolling
        updateButtonVisibility(scrollableContainer, button);
      }
    }
  });

  function updateButtonVisibility(container, button) {
     const upButton = container.querySelector('.scroll-up');
     const downButton = container.querySelector('.scroll-down');


    if (container.scrollHeight > container.clientHeight) {
      // Content overflows vertically

      if (container.scrollTop > 0) {
          upButton.style.display = 'block'; // Show the up button
      } else {
          upButton.style.display = 'none'; // Hide the up button at the start
      }

      if (container.scrollTop >= (container.scrollHeight - container.clientHeight)) {
          downButton.style.display = 'none'; // Hide the down button at the end
      } else {
          downButton.style.display = 'block';
      }

      if(upButton && downButton) {
          upButton.style.display = container.scrollTop > 0 ? 'block' : 'none';
          downButton.style.display = container.scrollTop < (container.scrollHeight - container.clientHeight) ? 'block' : 'none';
      }

    } else {
      // Content does not overflow
      if(upButton) upButton.style.display = 'none';
      if(downButton) downButton.style.display = 'none';
    }
  }

  // Initial button visibility setup (finds all relevant containers on page load)
   const containers = document.querySelectorAll('.content'); // Or whatever your scrollable content's class is

  containers.forEach(container => {
    const upButton = container.parentNode.querySelector('.scroll-up');
    const downButton = container.parentNode.querySelector('.scroll-down');

      if (upButton && downButton) {
          updateButtonVisibility(container);
      }

  });


  // Re-evaluate visibility on resize (consider debouncing)
  window.addEventListener('resize', () => {

    const containers = document.querySelectorAll('.content');
    containers.forEach(container => {
       const upButton = container.parentNode.querySelector('.scroll-up');
       const downButton = container.parentNode.querySelector('.scroll-down');

        if (upButton && downButton) {
          updateButtonVisibility(container);
        }
    });

  });

});
