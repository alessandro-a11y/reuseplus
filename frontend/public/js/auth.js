// Validação básica dos formulários de autenticação no client-side

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    const senha = document.getElementById('senha');
    const email = document.getElementById('email');

    if (email && !email.value.includes('@')) {
      e.preventDefault();
      alert('Informe um e-mail válido.');
      return;
    }

    if (senha && senha.value.length < 6) {
      e.preventDefault();
      alert('A senha deve ter no mínimo 6 caracteres.');
    }
  });
});