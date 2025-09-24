document.addEventListener("DOMContentLoaded", () => {
  const steps = document.querySelectorAll(".wizard-step");
  let currentStep = 0;

  const nextBtns = document.querySelectorAll(".nextBtn");
  const prevBtns = document.querySelectorAll(".prevBtn");

  const themeOptions = document.querySelectorAll("#themeOptions .balloon");
  const emojiOptionsContainer = document.getElementById("emojiOptions");
  const descriptionInput = document.getElementById("descriptionInput");
  const fontPicker = document.getElementById("fontPicker");
  const colorOptionsContainer = document.getElementById("colorOptions");
  const customColorPicker = document.getElementById("customColorPicker");

  const profileEmoji = document.getElementById("profileEmoji");
  const description = document.getElementById("description");
  const card = document.getElementById("card");
  const instagramTag = document.getElementById("instagramTag");
  const shareBtn = document.getElementById("shareBtn");

  const toastContainer = document.getElementById("toast-container");

  const themeEmojis = {
    romantico: ["💖","😍","🥰","🌹","💌","💕","💓","💗","💘","💝","🌺","💞","💟","💑","💍"],
    gamer: ["🎮","👾","🕹️","🔥","💥","⚡","🛡️","🏹","🗡️","🎲","🎯","🤖","🕷️","💣","🪐"],
    comedia: ["😂","🤣","😜","😹","🤡","😆","😝","🙃","😎","😏","🤪","😺","🎉","🥳","😇"]
  };

  const themeColors = {
    romantico: ["#FF6B81", "#FF92A9", "#FFC1CC"],
    gamer: ["#1E90FF", "#00BFFF", "#3CB3FF"],
    comedia: ["#FFD93D", "#FFEC4B", "#FFF176"]
  };

  let selectedTheme = "";
  let selectedEmoji = "";
  let selectedColor = "";

  let toastTimeout;

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
      nextBtns.forEach(btn => btn.disabled = false); // sempre habilitado, vamos checar no clique
    } else if (currentStep === 1) {
      nextBtns.forEach(btn => btn.disabled = selectedEmoji === "");
    } else if (currentStep === 2) {
      nextBtns.forEach(btn => btn.disabled = descriptionInput.value.trim() === "");
    }
  }

  descriptionInput.addEventListener("input", updateButtons);

  function isColorDark(hexColor) {
    const c = hexColor.charAt(0) === '#' ? hexColor.substring(1) : hexColor;
    const r = parseInt(c.substr(0,2),16);
    const g = parseInt(c.substr(2,2),16);
    const b = parseInt(c.substr(4,2),16);
    const luminance = (0.299*r + 0.587*g + 0.114*b)/255;
    return luminance < 0.5;
  }

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

      // Carrega cores
      colorOptionsContainer.innerHTML = "";
      themeColors[selectedTheme].forEach(c => {
        const colorBalloon = document.createElement("div");
        colorBalloon.className = "balloon";
        colorBalloon.style.backgroundColor = c;
        colorBalloon.addEventListener("click", () => {
          colorOptionsContainer.querySelectorAll(".balloon").forEach(b => b.classList.remove("selected"));
          colorBalloon.classList.add("selected");
          selectedColor = c;
          customColorPicker.value = c;
        });
        colorOptionsContainer.appendChild(colorBalloon);
      });

      selectedColor = themeColors[selectedTheme][0];
      customColorPicker.value = selectedColor;
      updateButtons();
    });
  });

  customColorPicker.addEventListener("input", (e) => {
    selectedColor = e.target.value;
    updateButtons();
  });

  // Próximo
  nextBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      // Bloqueia primeiro passo se não tiver tema
      if (currentStep === 0 && !selectedTheme) {
        showToast("Selecione um tema antes de continuar!");
        return;
      }

      if (currentStep < steps.length - 1) {
        if(currentStep === 2){
          description.textContent = descriptionInput.value || "Sua mensagem aparecerá aqui";
          profileEmoji.textContent = selectedEmoji || "💖";
          card.style.backgroundColor = selectedColor;
          card.style.fontFamily = fontPicker.value;
          card.style.color = isColorDark(selectedColor) ? "#fff" : "#000";
          instagramTag.textContent = "@CLICK.CARD";
        }
        currentStep++;
        showStep(currentStep);
      }
    });
  });

  // Anterior
  prevBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      if(currentStep > 0){
        currentStep--;
        showStep(currentStep);
      }
    });
  });

  // Download / Instagram
  shareBtn.addEventListener("click", () => {
    html2canvas(card, { scale: 3, useCORS: true }).then(canvas => {
      const link = document.createElement("a");
      link.download = "cartao.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
      showToast("Cartão baixado com sucesso!");

      // Reset completo
      currentStep = 0;
      selectedEmoji = "";
      selectedColor = "";
      descriptionInput.value = "";
      profileEmoji.textContent = "💖";
      description.textContent = "Sua mensagem aparecerá aqui";
      emojiOptionsContainer.innerHTML = "";
      colorOptionsContainer.innerHTML = "";
      themeOptions.forEach(b => b.classList.remove("selected"));
      instagramTag.textContent = "@CLICK.CARD";

      showStep(currentStep);
    });
  });

  showStep(currentStep);
});
