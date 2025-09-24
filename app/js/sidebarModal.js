// Modal Sidebar
const menuIcon = document.getElementById("menu");
const sidebarModal = document.getElementById("sidebarModal");
const closeModal = document.getElementById("closeModal");

// Abrir modal
menuIcon.addEventListener("click", () => {
  sidebarModal.classList.add("active");
  sidebarModal.style.display = "block";
});

// Fechar modal ao clicar no "x"
closeModal.addEventListener("click", () => {
  sidebarModal.classList.remove("active");
  setTimeout(() => {
    sidebarModal.style.display = "none";
  }, 300); // esperar animação
});

// Fechar modal ao clicar fora da sidebar
sidebarModal.addEventListener("click", (e) => {
  if(e.target === sidebarModal){
    sidebarModal.classList.remove("active");
    setTimeout(() => {
      sidebarModal.style.display = "none";
    }, 300);
  }
});
