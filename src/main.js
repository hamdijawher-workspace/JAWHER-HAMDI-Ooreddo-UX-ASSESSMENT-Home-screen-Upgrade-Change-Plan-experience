const screens = [...document.querySelectorAll('.screen')];
const modalScreens = [...document.querySelectorAll('.modal-screen')];
const steps = [...document.querySelectorAll('[data-step]')];
const phone = document.querySelector('#phone');
let current = 'home';
let selectedBenefits = new Set();
let reviewSource = 'detail';
let refreshTimer;

const planCopy = {
  detail: {
    title: 'Shahry+ Family Pro',
    summary: 'QR 500/month · 3 lines · 2 entertainment benefits'
  },
  'detail-family': {
    title: 'Shahry+ Family',
    summary: 'QR 350/month · 2 main lines · shared family allowance'
  },
  'detail-lite': {
    title: 'Shahry+ Family Lite',
    summary: 'QR 250/month · 2 lines · lighter shared family bundle'
  }
};

function screenEl(name) {
  return document.querySelector(`[data-screen="${name}"]`);
}

function setStep(name) {
  steps.forEach((step) => step.classList.toggle('active', step.dataset.step === name));
  phone.classList.toggle('show-home-nav', name === 'home');
}

function updateReviewNote(source) {
  const note = document.querySelector('[data-review-note]');
  if (!note) return;
  const plan = planCopy[source];
  if (!plan || source === 'detail') {
    note.hidden = true;
    note.innerHTML = '';
    return;
  }
  note.innerHTML = `<strong>${plan.title}</strong>${plan.summary}`;
  note.hidden = false;
}

function go(name) {
  if (current.startsWith('detail') && name === 'review') {
    reviewSource = current;
    updateReviewNote(reviewSource);
  }

  if (current === 'review' && name === 'detail') {
    name = reviewSource;
  }

  const active = screenEl(current);
  const next = screenEl(name);
  if (!next || active === next) return;

  closeModal();
  active.classList.remove('active');
  active.classList.add('leaving');
  next.classList.add('active', 'entering');
  next.scrollTop = 0;

  window.setTimeout(() => {
    active.classList.remove('leaving');
    next.classList.remove('entering');
  }, 320);

  current = name;
  setStep(name);
}

function resetBenefits() {
  selectedBenefits = new Set();
  document.querySelectorAll('.benefit.selected').forEach((item) => item.classList.remove('selected'));
}

function openModal(name) {
  const modal = document.querySelector(`[data-modal-screen="${name}"]`);
  if (!modal) return;
  window.clearTimeout(refreshTimer);
  document.querySelectorAll('[data-refresh]').forEach((button) => {
    button.hidden = true;
    button.classList.remove('show');
  });
  modalScreens.forEach((item) => {
    item.classList.remove('active');
    item.setAttribute('aria-hidden', 'true');
  });
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  phone.classList.add('modal-open');

  if (name === 'success') {
    const refresh = modal.querySelector('[data-refresh]');
    if (refresh) {
      refreshTimer = window.setTimeout(() => {
        refresh.hidden = false;
        requestAnimationFrame(() => refresh.classList.add('show'));
      }, 900);
    }
  }
}

function closeModal() {
  window.clearTimeout(refreshTimer);
  modalScreens.forEach((item) => {
    item.classList.remove('active');
    item.setAttribute('aria-hidden', 'true');
  });
  phone.classList.remove('modal-open');
}

function refreshPrototype() {
  closeModal();
  resetBenefits();
  reviewSource = 'detail';
  updateReviewNote(reviewSource);
  go('home');
}

function showToast(message) {
  const toast = document.querySelector('.screen.active .toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 1800);
}

function toggleBenefit(button) {
  const name = button.dataset.benefit;
  if (selectedBenefits.has(name)) {
    selectedBenefits.delete(name);
    button.classList.remove('selected');
    showToast(`${name} removed`);
    return;
  }

  if (selectedBenefits.size >= 2) {
    showToast('You can choose only 2 benefits');
    button.animate(
      [
        { transform: 'translateY(0)' },
        { transform: 'translateY(-2px)' },
        { transform: 'translateY(0)' }
      ],
      { duration: 220, easing: 'ease-out' }
    );
    return;
  }

  selectedBenefits.add(name);
  button.classList.add('selected');
  showToast(`${name} selected (${selectedBenefits.size}/2)`);
}

document.addEventListener('click', (event) => {
  const benefit = event.target.closest('.benefit');
  if (benefit) {
    toggleBenefit(benefit);
    return;
  }

  const target = event.target.closest('[data-go]');
  if (target) {
    const next = target.dataset.go;
    if (next.startsWith('detail')) resetBenefits();
    if (current === 'detail' && next === 'review' && selectedBenefits.size < 2) {
      showToast('Please choose 2 entertainment benefits');
      return;
    }
    go(next);
    return;
  }

  const modalTarget = event.target.closest('[data-modal]');
  if (modalTarget) {
    openModal(modalTarget.dataset.modal);
    return;
  }

  if (event.target.closest('[data-close]')) {
    closeModal();
    return;
  }

  if (event.target.closest('[data-refresh]')) {
    refreshPrototype();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeModal();
});

setStep(current);
