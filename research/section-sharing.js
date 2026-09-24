// The fragment itself cannot select OG metadata. Copy a static share URL whose
// metadata belongs to this section, and which opens the canonical essay anchor.
document.querySelectorAll('[data-section-share]').forEach(link => {
  link.addEventListener('click', async event => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const url = new URL(link.getAttribute('href'), 'https://kareem.me/research/').href;
    const status = document.getElementById('section-share-status');
    try {
      await navigator.clipboard.writeText(url);
      status.textContent = 'Section link copied.';
      const label = link.querySelector('span');
      label.textContent = 'Link copied';
      clearTimeout(link.copyTimer);
      link.copyTimer = setTimeout(() => { label.textContent = 'Copy section link'; }, 2200);
    } catch {
      // Clipboard access can be unavailable or denied. Keep a selectable link.
      let input = link.parentElement.querySelector('input');
      if (!input) {
        input = document.createElement('input');
        input.type = 'text';
        input.readOnly = true;
        input.value = url;
        input.setAttribute('aria-label', 'Section link to copy');
        link.parentElement.append(input);
      }
      input.focus();
      input.select();
      status.textContent = 'Copy the selected section link.';
    }
  });
});
