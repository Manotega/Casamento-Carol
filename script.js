document.addEventListener("DOMContentLoaded", () => {
  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
      // Se o elemento etiver pelo menos 50% visivel, adiciona a classe "visivel"
      if (entrada.isIntersecting) {
        entrada.target.classList.add("visivel");
      }
      // Caso contrario, remove a classe "visivel"
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



  // Contador de dias para o casamento
  const dataCasamento = new Date('2025-09-12T00:00:00');
  const contadorDias = document.querySelector('.presenca__contador__dias');
  const faltam = document.querySelector('.presenca__contador__texto')

  function atualizarContador() {
    const hoje = new Date();
    const diferenca = dataCasamento - hoje;
    const diasRestantes = Math.ceil(diferenca / (1000 * 60 * 60 * 24));
    
    if (diasRestantes > 0) {
      contadorDias.textContent = `${diasRestantes}`;
    } else if (diasRestantes === 0) {
      faltam.textContent = ' ';
      contadorDias.textContent = 'É HOJE!';
    } else {
      faltam.textContent = 'Ainda contamos os dias do o nosso sim...';
      contadorDias.textContent = `${-1 * diasRestantes}`;
    }
  }
    
  // Atualiza o contador imediatamente e a cada dia
  atualizarContador();
  setInterval(atualizarContador, 24 * 60 * 60 * 1000); // Atualiza a cada 24 horas
});