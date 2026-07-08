const screens = [...document.querySelectorAll('.screen')];
const modalScreens = [...document.querySelectorAll('.modal-screen')];
const phone = document.querySelector('#phone');
const benefitButtons = [...document.querySelectorAll('.benefit-item')];
let selectedBenefits = new Set();
let currentScreen = 'home';

function activateScreen(name) {
  screens.forEach((screen) => {
    const isActive = screen.dataset.screen === name;
    screen.classList.toggle('active', isActive);
    if (isActive) {
      screen.scrollTop = 0;
    }
  });
  currentScreen = name;
}

function closeModals() {
  modalScreens.forEach((modal) => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  });
}

function openModal(name) {
  closeModals();
  const modal = document.querySelector(`[data-modal-screen="${name}"]`);
  if (!modal) return;
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
}

function updateBenefits() {
  benefitButtons.forEach((button) => {
    button.classList.toggle('selected', selectedBenefits.has(button.dataset.benefit));
  });
}

function toggleBenefit(name) {
  if (selectedBenefits.has(name)) {
    selectedBenefits.delete(name);
  } else {
    if (selectedBenefits.size >= 2) {
      return;
    }
    selectedBenefits.add(name);
  }
  updateBenefits();
}

function handleButtonClick(event) {
  const button = event.target.closest('[data-go], [data-modal], [data-refresh], [data-close], .benefit-item');
  if (!button) return;

  if (button.matches('.benefit-item')) {
    toggleBenefit(button.dataset.benefit);
    return;
  }

  if (button.dataset.go) {
    const next = button.dataset.go;
    if (next !== 'none') {
      activateScreen(next);
      closeModals();
    }
    return;
  }

  if (button.dataset.modal) {
    openModal(button.dataset.modal);
    return;
  }

  if (button.dataset.refresh) {
    closeModals();
    activateScreen('home');
    selectedBenefits.clear();
    updateBenefits();
    return;
  }

  if (button.dataset.close) {
    closeModals();
    return;
  }
}

document.body.addEventListener('click', handleButtonClick);
activateScreen('home');
