export function LoginView({ viewState, handlers }) {
  const { loginError, isSubmitting } = viewState;
  const container = document.createElement('div');
  container.className = 'flex items-center justify-center min-h-[60vh]';

  const card = document.createElement('div');
  card.className = 'bg-white rounded-lg shadow-md p-8 w-full max-w-sm';

  const title = document.createElement('h2');
  title.className = 'text-2xl font-bold text-slate-800 mb-6 text-center';
  title.textContent = 'Přihlášení';
  card.appendChild(title);

  if (loginError) {
    const err = document.createElement('div');
    err.className = 'bg-red-50 border border-red-200 text-red-700 text-sm rounded px-4 py-3 mb-4';
    err.textContent = loginError;
    card.appendChild(err);
  }

  const form = document.createElement('form');
  form.className = 'flex flex-col gap-4';

  const emailLabel = document.createElement('label');
  emailLabel.className = 'flex flex-col gap-1';
  emailLabel.innerHTML =
    '<span class="text-sm font-medium text-slate-700">Email</span>';
  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.required = true;
  emailInput.placeholder = 'vas@email.cz';
  emailInput.className =
    'border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500';
  emailLabel.appendChild(emailInput);

  const passLabel = document.createElement('label');
  passLabel.className = 'flex flex-col gap-1';
  passLabel.innerHTML =
    '<span class="text-sm font-medium text-slate-700">Heslo</span>';
  const passInput = document.createElement('input');
  passInput.type = 'password';
  passInput.required = true;
  passInput.placeholder = '••••••••';
  passInput.className =
    'border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500';
  passLabel.appendChild(passInput);

  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.disabled = isSubmitting;
  submitBtn.className =
    'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 rounded transition-colors mt-2';
  submitBtn.textContent = isSubmitting ? 'Přihlašování…' : 'Přihlásit se';

  form.appendChild(emailLabel);
  form.appendChild(passLabel);
  form.appendChild(submitBtn);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    handlers.onLogin(emailInput.value, passInput.value);
  });

  card.appendChild(form);

  const backLink = document.createElement('button');
  backLink.className = 'text-sm text-blue-600 hover:text-blue-800 mt-4 block text-center w-full';
  backLink.textContent = '← Zpět na hotely';
  backLink.addEventListener('click', handlers.onGoBack);
  card.appendChild(backLink);

  container.appendChild(card);
  return container;
}
