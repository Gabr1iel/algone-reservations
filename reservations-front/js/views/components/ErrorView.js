export function ErrorView({ message, handlers }) {
  const { onContinue } = handlers;

  const root = document.createElement('div');
  root.className = 'bg-white rounded-lg shadow p-8 max-w-md mx-auto mt-12 text-center';

  const icon = document.createElement('div');
  icon.className = 'text-red-500 text-4xl mb-4';
  icon.textContent = '⚠';

  const h1 = document.createElement('h1');
  h1.className = 'text-xl font-semibold text-slate-800 mb-2';
  h1.textContent = 'Chyba';

  const p = document.createElement('p');
  p.className = 'text-slate-500 mb-6';
  p.textContent = message;

  const button = document.createElement('button');
  button.className =
    'bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded transition-colors';
  button.textContent = 'Pokračovat';
  button.addEventListener('click', onContinue);

  root.appendChild(icon);
  root.appendChild(h1);
  root.appendChild(p);
  root.appendChild(button);
  return root;
}
