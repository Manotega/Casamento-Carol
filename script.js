document.addEventListener("DOMContentLoaded", () => {
  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
      // Se o elemento etiver pelo menos 50% visível, adiciona a classe "visivel"
      if (entrada.isIntersecting) {
        entrada.target.classList.add("visivel");
      }
      // Caso contrário, remove a classe "visivel"
      else {
        entrada.target.classList.remove("visivel");
      }
    });
  }, {
    threshold: 0.5 // Animacao comeca quando 50% do elemento estiver visivel
  });

  // Seleciona os elementos que devem ser observadas
  const fotosParaAnimar = document.querySelectorAll('.inicio__fotos__foto1, .inicio__fotos__foto2, .inicio__fotos__foto3');
  fotosParaAnimar.forEach(foto => {
    observador.observe(foto);
  });
});