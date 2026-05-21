// Scripts gerais do frontend

document.addEventListener('DOMContentLoaded', () => {
  // Marca o link ativo na sidebar com base na URL atual
  const links = document.querySelectorAll('.sidebar nav a');
  links.forEach(link => {
    if (link.href === window.location.href) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Fecha alertas automaticamente após 4 segundos
  const alerts = document.querySelectorAll('.alert-error');
  alerts.forEach(alert => {
    setTimeout(() => {
      alert.style.opacity = '0';
      alert.style.transition = 'opacity 0.5s';
      setTimeout(() => alert.remove(), 500);
    }, 4000);
  });
});