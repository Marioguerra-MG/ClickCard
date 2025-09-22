// Elementos do DOM
const uploadPic = document.getElementById('uploadPic');
const profilePic = document.getElementById('profilePic');
const colorPicker = document.getElementById('colorPicker');
const description = document.getElementById('description');
const generateTextBtn = document.getElementById('generateTextBtn');
const shareBtn = document.getElementById('shareBtn');
const card = document.getElementById('card');
const fileName = document.getElementById('file-name');
const steps = document.querySelectorAll('.wizard-step');
let currentStep = 0;

// Mostrar primeiro passo do wizard
steps[currentStep].classList.add('active');

// Wizard: próximo
document.querySelectorAll('.nextBtn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (currentStep < steps.length - 1) {
      steps[currentStep].classList.remove('active');
      currentStep++;
      steps[currentStep].classList.add('active');
    }
  });
});

// Wizard: anterior
document.querySelectorAll('.prevBtn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (currentStep > 0) {
      steps[currentStep].classList.remove('active');
      currentStep--;
      steps[currentStep].classList.add('active');
    }
  });
});

// Toasts
function showToast(message, type = 'info', duration = 3000) {
  const toastContainer = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  toastContainer.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 100);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 500);
  }, duration);
}

// Upload de foto
uploadPic.addEventListener('change', () => {
  if (uploadPic.files.length > 0) {
    let name = uploadPic.files[0].name;
    let nameWithoutExt = name.replace(/\.[^/.]+$/, "");
    let displayName = nameWithoutExt.length > 5 ? nameWithoutExt.slice(0, 5) + '...' : nameWithoutExt;
    fileName.textContent = displayName;
    profilePic.src = URL.createObjectURL(uploadPic.files[0]);
    showToast("Foto carregada com sucesso!", "success");
  } else {
    showToast("Nenhuma foto selecionada.", "alert");
  }
});

// Escolher cor de fundo
colorPicker.addEventListener('input', e => {
  card.style.background = e.target.value;
  showToast("Cor de fundo alterada!", "info");
});

// Mensagens românticas
const messages = [
  "Você é meu lugar favorito no mundo 💖",
  "Meu coração bate mais forte quando penso em você ❤️",
  "Você faz meus dias mais coloridos 🌹",
  "Cada momento com você é especial 💌",
  "Você é a razão do meu sorriso todos os dias 😘",
  "Amar você é a melhor parte da minha vida 💞",
  "Com você, tudo se torna mais mágico ✨",
  "Meu amor por você cresce a cada segundo 💖"
];

// Gerar mensagem
generateTextBtn.addEventListener('click', () => {
  const randomIndex = Math.floor(Math.random() * messages.length);
  description.textContent = messages[randomIndex];
  showToast("Mensagem gerada!", "success");
});

// Compartilhar gerando download
shareBtn.addEventListener('click', () => {
  html2canvas(card, { scale: 2 }).then(canvas => {
    canvas.toBlob(blob => {
      const link = document.createElement('a');
      link.download = 'cartao-romantico.png';
      link.href = URL.createObjectURL(blob);
      link.click();
      showToast("Imagem gerada! Você pode enviar no WhatsApp ou outra rede social.", "success");
    });
  }).catch(() => showToast("Erro ao gerar a imagem.", "alert"));
});
