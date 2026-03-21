export function RegisterView({ viewState, handlers }) {
  const { registerError, isSubmitting } = viewState;
  const container = document.createElement('div');
  container.className = 'flex items-center justify-center min-h-[60vh]';

  const card = document.createElement('div');
  card.className = 'bg-white rounded-lg shadow-md p-8 w-full max-w-sm';

  const title = document.createElement('h2');
  title.className = 'text-2xl font-bold text-slate-800 mb-6 text-center';
  title.textContent = 'Registrace';
  card.appendChild(title);

  if (registerError) {
    const err = document.createElement('div');
    err.className = 'bg-red-50 border border-red-200 text-red-700 text-sm rounded px-4 py-3 mb-4';
    err.textContent = registerError;
    card.appendChild(err);
  }

  const form = document.createElement('form');
  form.className = 'flex flex-col gap-4';

  const firstNameLabel = document.createElement('label');
  firstNameLabel.className = 'flex flex-col gap-1';
  const firstNameSpan = document.createElement('span');
  firstNameSpan.className = 'text-sm font-medium text-slate-700';
  firstNameSpan.textContent = 'Jméno';
  firstNameLabel.appendChild(firstNameSpan);
  const firstNameInput = document.createElement('input');
  firstNameInput.type = 'text';
  firstNameInput.required = true;
  firstNameInput.placeholder = 'Jan';
  firstNameInput.className =
    'border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500';
  firstNameLabel.appendChild(firstNameInput);

  const lastNameLabel = document.createElement('label');
  lastNameLabel.className = 'flex flex-col gap-1';
  const lastNameSpan = document.createElement('span');
  lastNameSpan.className = 'text-sm font-medium text-slate-700';
  lastNameSpan.textContent = 'Příjmení';
  lastNameLabel.appendChild(lastNameSpan);
  const lastNameInput = document.createElement('input');
  lastNameInput.type = 'text';
  lastNameInput.required = true;
  lastNameInput.placeholder = 'Novák';
  lastNameInput.className =
    'border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500';
  lastNameLabel.appendChild(lastNameInput);

  const emailLabel = document.createElement('label');
  emailLabel.className = 'flex flex-col gap-1';
  const emailSpan = document.createElement('span');
  emailSpan.className = 'text-sm font-medium text-slate-700';
  emailSpan.textContent = 'Email';
  emailLabel.appendChild(emailSpan);
  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.required = true;
  emailInput.placeholder = 'vas@email.cz';
  emailInput.className =
    'border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500';
  emailLabel.appendChild(emailInput);

  const passLabel = document.createElement('label');
  passLabel.className = 'flex flex-col gap-1';
  const passSpan = document.createElement('span');
  passSpan.className = 'text-sm font-medium text-slate-700';
  passSpan.textContent = 'Heslo';
  passLabel.appendChild(passSpan);
  const passInput = document.createElement('input');
  passInput.type = 'password';
  passInput.required = true;
  passInput.minLength = 8;
  passInput.placeholder = '••••••••';
  passInput.className =
    'border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500';
  passLabel.appendChild(passInput);

  const passHint = document.createElement('span');
  passHint.className = 'text-xs text-slate-400';
  passHint.textContent = 'Minimálně 8 znaků';
  passLabel.appendChild(passHint);

  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.disabled = isSubmitting;
  submitBtn.className =
    'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 rounded transition-colors mt-2';
  submitBtn.textContent = isSubmitting ? 'Registrace…' : 'Zaregistrovat se';

  form.appendChild(firstNameLabel);
  form.appendChild(lastNameLabel);
  form.appendChild(emailLabel);
  form.appendChild(passLabel);
  form.appendChild(submitBtn);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    handlers.onRegister(
      firstNameInput.value,
      lastNameInput.value,
      emailInput.value,
      passInput.value,
    );
  });

  card.appendChild(form);

  const loginLink = document.createElement('button');
  loginLink.className = 'text-sm text-blue-600 hover:text-blue-800 mt-4 block text-center w-full';
  loginLink.textContent = 'Už máte účet? Přihlásit se';
  loginLink.addEventListener('click', handlers.onGoToLogin);
  card.appendChild(loginLink);

  const backLink = document.createElement('button');
  backLink.className = 'text-sm text-slate-500 hover:text-slate-700 mt-2 block text-center w-full';
  backLink.textContent = '← Zpět na hotely';
  backLink.addEventListener('click', handlers.onGoBack);
  card.appendChild(backLink);

  container.appendChild(card);
  return container;
}
