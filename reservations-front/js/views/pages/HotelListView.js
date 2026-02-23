export function HotelListView({ viewState, handlers }) {
  const { hotels } = viewState;
  const container = document.createElement('div');

  const title = document.createElement('h2');
  title.textContent = 'Hotely';
  container.appendChild(title);

  const list = document.createElement('ul');

  hotels.forEach((hotel) => {
    const li = document.createElement('li');

    const label = document.createElement('span');
    label.textContent = `${hotel.name} – ${hotel.city}`;
    li.appendChild(label);

    list.appendChild(li);
  });

  container.appendChild(list);
  return container;
}
