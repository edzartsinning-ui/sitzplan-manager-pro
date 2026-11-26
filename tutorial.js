const explanation = document.createElement('div');
explanation.id = 'tutorial-explanation';
explanation.className = 'tutorial-explanation';
explanation.tabIndex = -1;
explanation.setAttribute('role', 'region');
explanation.setAttribute('aria-labelledby', 'tutorial-explanation-title');
explanation.setAttribute('aria-describedby', 'tutorial-explanation-text');

const heading = document.createElement('strong');
heading.id = 'tutorial-explanation-title';
const description = document.createElement('p');
description.id = 'tutorial-explanation-text';
explanation.append(heading, description);

let activeMarker;

function closeExplanation() {
  activeMarker?.setAttribute('aria-expanded', 'false');
  activeMarker = undefined;
  explanation.remove();
}

function positionExplanation() {
  if (!activeMarker) return;

  const image = activeMarker.parentElement.getBoundingClientRect();
  const marker = activeMarker.getBoundingClientRect();
  const panel = explanation.getBoundingClientRect();
  const gap = 8;
  const right = marker.right - image.left + gap;
  const left = marker.left - image.left - panel.width - gap;
  const limit = Math.max(0, image.width - panel.width);
  const fitsBeside = right <= limit || left >= 0;
  const x = right <= limit ? right : left >= 0 ? left : marker.left - image.left;
  const above = marker.top - panel.height - gap;
  const below = marker.bottom + gap;
  const y = fitsBeside
    ? Math.max(image.top, Math.min(marker.top, window.innerHeight - panel.height - gap))
    : below + panel.height <= window.innerHeight || above < 0 ? below : above;

  explanation.style.left = Math.max(0, Math.min(x, limit)) + 'px';
  explanation.style.top = y - image.top + 'px';
}

for (const marker of document.querySelectorAll('.tutorial-marker')) {
  const topic = document.getElementById(marker.getAttribute('aria-controls'));
  marker.setAttribute('aria-controls', explanation.id);
  marker.hidden = false;

  marker.addEventListener('click', () => {
    const wasOpen = activeMarker === marker;
    closeExplanation();
    if (wasOpen) return;

    activeMarker = marker;
    heading.textContent = marker.title;
    description.textContent = topic.querySelector('p').textContent;
    marker.after(explanation);
    marker.setAttribute('aria-expanded', 'true');
    positionExplanation();
    explanation.focus({ preventScroll: true });
  });
}

document.addEventListener('click', event => {
  if (activeMarker && !activeMarker.contains(event.target) && !explanation.contains(event.target)) {
    closeExplanation();
  }
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && activeMarker) {
    const marker = activeMarker;
    closeExplanation();
    marker.focus({ preventScroll: true });
  }
});

window.addEventListener('resize', positionExplanation);
