for (const marker of document.querySelectorAll('.tutorial-marker')) {
  const topic = document.getElementById(marker.getAttribute('aria-controls'));
  marker.hidden = false;

  topic.addEventListener('toggle', () => {
    marker.setAttribute('aria-expanded', String(topic.open));
  });

  marker.addEventListener('click', () => {
    topic.open = !topic.open;
    if (topic.open) {
      topic.querySelector('summary').focus({ preventScroll: true });
      topic.scrollIntoView({ block: 'nearest' });
    }
  });
}
