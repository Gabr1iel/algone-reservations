export function LoadingView() {
  const root = document.createElement('div');
  root.className = 'flex items-center justify-center h-64';

  const spinner = document.createElement('div');
  spinner.className = 'text-center';

  const dot = document.createElement('div');
  dot.className =
    'w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4';

  const text = document.createElement('p');
  text.className = 'text-slate-500 text-sm';
  text.textContent = 'Načítání…';

  spinner.appendChild(dot);
  spinner.appendChild(text);
  root.appendChild(spinner);
  return root;
}
