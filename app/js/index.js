document.addEventListener("DOMContentLoaded", () => {
  const steps = document.querySelectorAll(".wizard-step");
  let currentStep = 0;

  const nextBtns = document.querySelectorAll(".nextBtn");
  const prevBtns = document.querySelectorAll(".prevBtn");

  const themePicker = document.getElementById("themePicker");
  const emojiPicker = document.getElementById("emojiPicker");
  const descriptionInput = document.getElementById("descriptionInput");
  const colorPicker = document.getElementById("colorPicker");
  const fontPicker = document.getElementById("fontPicker");

  const profileEmojiPreview = document.getElementById("profileEmojiPreview");
  const descriptionPreview = document.getElementById("descriptionPreview");
  const cardPreview = document.getElementById("cardPreview");

  const profileEmoji = document.getElementById("profileEmoji");
  const description = document.getElementById("description");
  const card = document.getElementById("card");
  const shareBtn = document.getElementById("shareBtn");

  const progressFill = document.getElementById("progressFill");

  const themeEmojis = {
    romantico: ["💖","😍","🥰","🌹","💌"],
    gamer: ["🎮","👾","🕹️","🔥","💥"],
    comedia: ["😂","🤣","😜","😹","🤡"]
  };

  const themeColors = {
    romantico: "#ff97a4ff",
    gamer: "#81f4ffff",
    comedia: "#ffeda7ff"
  };

  function showStep(index) {
    steps.forEach((step, i) => step.style.display = i === index ? "block" : "none");
    progressFill.style.width = ((index) / (steps.length - 1)) * 100 + "%";
  }

  nextBtns.forEach((btn, i) => btn.addEventListener("click", () => {
    if(currentStep < steps.length - 1){
      // Atualiza cartão final na etapa 4
      if(currentStep === 2){
        profileEmoji.textContent = profileEmojiPreview.textContent;
        description.textContent = descriptionPreview.textContent;
        card.style.backgroundColor = colorPicker.value;
        card.style.fontFamily = fontPicker.value;
      }
      currentStep++;
      showStep(currentStep);
    }
  }));

  prevBtns.forEach(btn => btn.addEventListener("click", () => {
    if(currentStep > 0){
      currentStep--;
      showStep(currentStep);
    }
  }));

  function updatePreview() {
    profileEmojiPreview.textContent = emojiPicker.value;
    descriptionPreview.textContent = descriptionInput.value || "Sua mensagem aparecerá aqui";
    cardPreview.style.backgroundColor = colorPicker.value;
    cardPreview.style.fontFamily = fontPicker.value;
  }

  themePicker.addEventListener("change", () => {
    const selectedTheme = themePicker.value;
    nextBtns[0].disabled = selectedTheme === "";

    emojiPicker.innerHTML = "";
    themeEmojis[selectedTheme]?.forEach(e => {
      const option = document.createElement("option");
      option.value = e;
      option.textContent = e;
      emojiPicker.appendChild(option);
    });

    // Define cor inicial do preview
    colorPicker.value = themeColors[selectedTheme] || "#ffffff";
    updatePreview();
  });

  emojiPicker.addEventListener("change", () => {
    nextBtns[1].disabled = emojiPicker.value === "";
    updatePreview();
  });

  descriptionInput.addEventListener("input", updatePreview);
  colorPicker.addEventListener("input", updatePreview);
  fontPicker.addEventListener("change", updatePreview);

  shareBtn.addEventListener("click", () => {
    html2canvas(card).then(canvas => {
      const link = document.createElement("a");
      link.download = "cartao-tematico.png";
      link.href = canvas.toDataURL();
      link.click();
    });
  });

  showStep(currentStep);
});
