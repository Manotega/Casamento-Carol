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

  // Sistema de confirmação de presença
  const presencaTextbox = document.getElementById('presenca__textbox');
  const presencaBotao = document.getElementById('presenca__botao');

  // Função para mostrar mensagem de feedback
  function mostrarMensagem(mensagem, tipo = 'sucesso') {
    // Remove mensagem anterior se existir
    const mensagemAnterior = document.querySelector('.mensagem-feedback');
    if (mensagemAnterior) {
      mensagemAnterior.remove();
    }

    // Cria nova mensagem
    const mensagemElement = document.createElement('div');
    mensagemElement.className = `mensagem-feedback mensagem-${tipo}`;
    mensagemElement.textContent = mensagem;
    mensagemElement.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 8px;
      color: white;
      font-weight: bold;
      z-index: 1000;
      animation: slideIn 0.3s ease-out;
      ${tipo === 'sucesso' ? 'background-color: #4CAF50;' : 'background-color: #f44336;'}
    `;

    // Adiciona CSS para animação
    if (!document.querySelector('#mensagem-styles')) {
      const style = document.createElement('style');
      style.id = 'mensagem-styles';
      style.textContent = `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(mensagemElement);

    // Remove a mensagem após 5 segundos
    setTimeout(() => {
      if (mensagemElement.parentNode) {
        mensagemElement.remove();
      }
    }, 5000);
  }

  // Função para confirmar presença
  async function confirmarPresenca() {
    const nome = presencaTextbox.value.trim();
    
    if (!nome) {
      mostrarMensagem('Por favor, digite seu nome', 'erro');
      return;
    }

    // Desabilita o botão durante o envio
    presencaBotao.disabled = true;
    presencaBotao.textContent = 'Enviando...';

    try {
      const response = await fetch('/api/confirm-presence', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: nome })
      });

      const data = await response.json();

      if (data.success) {
        mostrarMensagem(data.message, 'sucesso');
        presencaTextbox.value = ''; // Limpa o campo
      } else {
        mostrarMensagem(data.message, 'erro');
      }
    } catch (error) {
      console.error('Erro ao confirmar presença:', error);
      mostrarMensagem('Erro ao conectar com o servidor. Tente novamente.', 'erro');
    } finally {
      // Reabilita o botão
      presencaBotao.disabled = false;
      presencaBotao.textContent = 'Enviar';
    }
  }

  // Event listeners
  presencaBotao.addEventListener('click', confirmarPresenca);
  
  // Permite enviar com Enter
  presencaTextbox.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      confirmarPresenca();
    }
  });
});
