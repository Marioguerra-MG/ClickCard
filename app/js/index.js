document.addEventListener("DOMContentLoaded", () => {
  const steps = document.querySelectorAll(".wizard-step");
  let currentStep = 0;

  const nextBtns = document.querySelectorAll(".nextBtn");
  const prevBtns = document.querySelectorAll(".prevBtn");

  const themeOptions = document.querySelectorAll("#themeOptions .balloon");
  const emojiOptionsContainer = document.getElementById("emojiOptions");
  const descriptionInput = document.getElementById("descriptionInput");
  const fontPicker = document.getElementById("fontPicker");

  const profileEmoji = document.getElementById("profileEmoji");
  const description = document.getElementById("description");
  const card = document.getElementById("card");
  const cardBg = document.querySelector("#card .card-bg"); // fundo real

  const instagramTag = document.getElementById("instagramTag");
  const shareBtn = document.getElementById("shareBtn");

  const toastContainer = document.getElementById("toast-container");

  const themeEmojis = {
    romantico: ["💖", "😍", "🥰", "🌹", "💌", "💕", "💓", "💗", "💘", "💝", "🌺", "💞", "💟", "💑", "💍"],
    gamer: ["🎮", "👾", "🕹️", "🔥", "💥", "⚡", "🛡️", "🏹", "🗡️", "🎲", "🎯", "🤖", "🕷️", "💣", "🪐"],
    comedia: ["😂", "🤣", "😜", "😹", "🤡", "😆", "😝", "🙃", "😎", "😏", "🤪", "😺", "🎉", "🥳", "😇"]
  };

  let selectedTheme = "";
  let selectedEmoji = "";
  let toastTimeout;

  // ===== Número aleatório no topo direito =====
  const cardRandomNumber = document.createElement("div");
  cardRandomNumber.id = "cardRandomNumber";
  cardRandomNumber.style.position = "absolute";
  cardRandomNumber.style.top = "10px";
  cardRandomNumber.style.right = "10px";
  cardRandomNumber.style.fontSize = "18px";
  cardRandomNumber.style.fontWeight = "bold";
  cardRandomNumber.style.color = "#fff";
  cardRandomNumber.style.padding = "3px 6px";
  cardRandomNumber.style.borderRadius = "4px";
  cardRandomNumber.style.textShadow = "1px 1px 3px rgba(0,0,0,0.7)";
  card.appendChild(cardRandomNumber);

  function showStep(index) {
    steps.forEach((step, i) => step.style.display = i === index ? "block" : "none");
    updateButtons();
  }

  function showToast(message) {
    if (toastTimeout) {
      clearTimeout(toastTimeout);
      toastContainer.innerHTML = "";
    }
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    toastContainer.appendChild(toast);
    toastTimeout = setTimeout(() => toast.remove(), 2500);
  }

  function updateButtons() {
    nextBtns.forEach(btn => btn.style.display = "inline-block");
    prevBtns.forEach(btn => btn.style.display = "inline-block");

    if (currentStep === 0) {
      prevBtns.forEach(btn => btn.style.display = "none");
      nextBtns.forEach(btn => btn.disabled = false);
    } else if (currentStep === 1) {
      nextBtns.forEach(btn => btn.disabled = selectedEmoji === "");
    } else if (currentStep === 2) {
      nextBtns.forEach(btn => btn.disabled = descriptionInput.value.trim() === "");
    }
  }

  descriptionInput.addEventListener("input", updateButtons);

  themeOptions.forEach(balloon => {
    balloon.addEventListener("click", () => {
      themeOptions.forEach(b => b.classList.remove("selected"));
      balloon.classList.add("selected");
      selectedTheme = balloon.dataset.value;
      showToast(`Tema "${selectedTheme}" selecionado!`);

      // Carrega emojis
      emojiOptionsContainer.innerHTML = "";
      themeEmojis[selectedTheme].forEach(e => {
        const emojiBalloon = document.createElement("div");
        emojiBalloon.className = "balloon";
        emojiBalloon.textContent = e;
        emojiBalloon.addEventListener("click", () => {
          emojiOptionsContainer.querySelectorAll(".balloon").forEach(b => b.classList.remove("selected"));
          emojiBalloon.classList.add("selected");
          selectedEmoji = e;
          showToast(`Emoji "${selectedEmoji}" selecionado!`);
          updateButtons();
        });
        emojiOptionsContainer.appendChild(emojiBalloon);
      });
      updateButtons();
    });
  });

  // ===== Função para calcular cor do número baseado no fundo =====
  function updateNumberColor(img) {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let r = 0, g = 0, b = 0, count = 0;
    for (let i = 0; i < imgData.length; i += 4) {
      r += imgData[i];
      g += imgData[i + 1];
      b += imgData[i + 2];
      count++;
    }
    r = r / count;
    g = g / count;
    b = b / count;

    // Calcula luminosidade
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    // Se claro -> número preto, se escuro -> número branco
    if (brightness > 128) {
      cardRandomNumber.style.color = "#000";
      
    } else {
      cardRandomNumber.style.color = "#fff";
      
    }
  }

  // Próximo
  nextBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      if (currentStep === 0 && !selectedTheme) {
        showToast("Selecione um tema antes de continuar!");
        return;
      }
      if (currentStep < steps.length - 1) {
        if (currentStep === 2) {
          description.textContent = descriptionInput.value || "Sua mensagem aparecerá aqui";
          profileEmoji.textContent = selectedEmoji || "💖";
          card.style.fontFamily = fontPicker.value;

          // Gera número aleatório 0 a 10
          const randomNum = Math.floor(Math.random() * 11);
          cardRandomNumber.textContent = randomNum;
        }
        currentStep++;
        showStep(currentStep);
      }
    });
  });

  // Anterior
  prevBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      if (currentStep > 0) {
        currentStep--;
        showStep(currentStep);
      }
    });
  });

  // Download / Instagram
  shareBtn.addEventListener("click", () => {
    const clone = card.cloneNode(true);
    clone.style.position = "absolute";
    clone.style.top = "-9999px";
    clone.style.left = "-9999px";
    clone.style.zIndex = "9999";
    document.body.appendChild(clone);

    const cloneBg = clone.querySelector(".card-bg");
    if (cloneBg) {
      cloneBg.style.backgroundImage = cardBg.style.backgroundImage;
      cloneBg.style.backgroundSize = "cover";
      cloneBg.style.backgroundPosition = "center";
      cloneBg.style.filter = 'blur(15px)';
      cloneBg.style.position = "absolute";
      cloneBg.style.inset = "0";
      cloneBg.style.zIndex = "0";
    }

    // Copia o número aleatório para o clone
    const cloneNumber = clone.querySelector("#cardRandomNumber");
    cloneNumber.textContent = cardRandomNumber.textContent;

    html2canvas(clone, { scale: 3, useCORS: true }).then(canvas => {
      const link = document.createElement("a");
      link.download = "cartao.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
      showToast("Cartão baixado com sucesso!");
      clone.remove();

      // Reset completo
      currentStep = 0;
      selectedEmoji = "";
      descriptionInput.value = "";
      profileEmoji.textContent = "💖";
      description.textContent = "Sua mensagem aparecerá aqui";
      emojiOptionsContainer.innerHTML = "";
      themeOptions.forEach(b => b.classList.remove("selected"));
      instagramTag.textContent = "@CLICK.CARD";
      cardRandomNumber.textContent = "";

      showStep(currentStep);
    });
  });

  showStep(currentStep);

  // ===== Fundo personalizado com desfoque =====
  const bgImageInput = document.getElementById("bgImageInput");

  bgImageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        const maxWidth = 800;
        const maxHeight = 600;
        let scale = Math.min(maxWidth / img.width, maxHeight / img.height, 1);
        const canvas = document.createElement("canvas");
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext("2d");

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const blurLevels = 3;
        const blurAmount = 8;
        ctx.globalAlpha = 0.5;
        for (let i = 0; i < blurLevels; i++) {
          ctx.filter = `blur(${blurAmount}px)`;
          ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height);
        }
        ctx.globalAlpha = 1;

        cardBg.style.backgroundImage = `url(${canvas.toDataURL()})`;
        cardBg.style.backgroundSize = "cover";
        cardBg.style.backgroundPosition = "center";
        cardBg.style.position = "absolute";
        cardBg.style.inset = "0";
        cardBg.style.zIndex = "0";

        // Atualiza cor do número de acordo com o fundo
        updateNumberColor(img);
      };
    };
    reader.readAsDataURL(file);
  });


const fileLabelText = document.getElementById("fileLabelText");

bgImageInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    fileLabelText.textContent = file.name;
  } else {
    fileLabelText.textContent = "Escolha um plano de fundo";
  }
});

// ===== Mensagem de aviso de navegador =====
const browserWarning = document.createElement("div");
browserWarning.id = "browserWarning";
browserWarning.style.position = "fixed";
browserWarning.style.top = "0";
browserWarning.style.left = "0";
browserWarning.style.width = "100%";
browserWarning.style.padding = "12px 0";
browserWarning.style.background = "#ffcc00";
browserWarning.style.color = "#000";
browserWarning.style.textAlign = "center";
browserWarning.style.fontWeight = "bold";
browserWarning.style.zIndex = "10000";
browserWarning.style.display = "none"; // inicialmente escondido
browserWarning.style.boxShadow = "0 2px 5px rgba(0,0,0,0.2)";
browserWarning.textContent = "Para melhor funcionamento, abra este site no Chrome ou Safari, para conseguir baixar a imagem";
document.body.appendChild(browserWarning);

// Detecta navegador
const ua = navigator.userAgent;
const isChrome = ua.includes("Chrome") && !ua.includes("Edge") && !ua.includes("OPR");
const isSafari = /^((?!chrome|android).)*safari/i.test(ua);

if (!isChrome && !isSafari) {
  browserWarning.style.display = "block";
}


});
