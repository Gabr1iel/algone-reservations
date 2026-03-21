export function HotelListView({ viewState, handlers }) {
  const { hotels } = viewState;
  const container = document.createElement('div');

  // ═══════════════════════════════════════════════
  // Section 1: Hero
  // ═══════════════════════════════════════════════
  const hero = document.createElement('section');
  hero.className = 'hero-section relative flex items-center justify-center text-center text-white';

  const heroOverlay = document.createElement('div');
  heroOverlay.className = 'absolute inset-0 bg-black/50';

  const heroContent = document.createElement('div');
  heroContent.className = 'relative z-[1] max-w-3xl px-6';

  const heroTitle = document.createElement('h1');
  heroTitle.className = 'text-5xl md:text-6xl font-bold leading-tight mb-6 drop-shadow-lg';
  heroTitle.textContent = 'Najděte svůj ideální pobyt';

  const heroSubtitle = document.createElement('p');
  heroSubtitle.className = 'text-xl md:text-2xl text-white/90 mb-10 leading-relaxed';
  heroSubtitle.textContent =
    'Objevte pečlivě vybrané hotely, které kombinují komfort, eleganci a nezapomenutelné zážitky.';

  const heroCta = document.createElement('a');
  heroCta.className =
    'inline-block bg-white text-slate-800 font-semibold text-lg px-8 py-4 rounded-full shadow-lg hover:bg-blue-50 hover:shadow-xl transition-all cursor-pointer';
  heroCta.textContent = 'Prohlédnout hotely';
  heroCta.addEventListener('click', () => {
    document.getElementById('hotels-section')?.scrollIntoView({ behavior: 'smooth' });
  });

  heroContent.appendChild(heroTitle);
  heroContent.appendChild(heroSubtitle);
  heroContent.appendChild(heroCta);
  hero.appendChild(heroOverlay);
  hero.appendChild(heroContent);
  container.appendChild(hero);

  // ═══════════════════════════════════════════════
  // Section 2: About / Features
  // ═══════════════════════════════════════════════
  const about = document.createElement('section');
  about.className = 'bg-white py-24 px-6';

  const aboutInner = document.createElement('div');
  aboutInner.className = 'max-w-5xl mx-auto text-center';

  const aboutTitle = document.createElement('h2');
  aboutTitle.className = 'text-3xl md:text-4xl font-bold text-slate-800 mb-6';
  aboutTitle.textContent = 'Proč si vybrat Algone?';

  const aboutDesc = document.createElement('p');
  aboutDesc.className = 'text-lg text-slate-500 max-w-2xl mx-auto mb-16 leading-relaxed';
  aboutDesc.textContent =
    'Nabízíme jednoduchý a přehledný způsob, jak najít a zarezervovat ubytování přesně podle vašich představ.';

  aboutInner.appendChild(aboutTitle);
  aboutInner.appendChild(aboutDesc);

  // Feature cards
  const features = [
    {
      icon: '🔍',
      title: 'Snadné vyhledávání',
      text: 'Procházejte naši nabídku hotelů a filtrujte podle lokality, ceny nebo hodnocení.',
    },
    {
      icon: '⚡',
      title: 'Rychlá rezervace',
      text: 'Zarezervujte si pokoj během pár kliknutí — bez zbytečných komplikací.',
    },
    {
      icon: '🛡️',
      title: 'Bezpečná platba',
      text: 'Vaše údaje jsou u nás v bezpečí. Platba probíhá přes zabezpečenou bránu.',
    },
  ];

  const featureGrid = document.createElement('div');
  featureGrid.className = 'grid md:grid-cols-3 gap-10';

  features.forEach((f) => {
    const card = document.createElement('div');
    card.className = 'bg-slate-50 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow';

    const icon = document.createElement('div');
    icon.className = 'text-4xl mb-4';
    icon.textContent = f.icon;

    const title = document.createElement('h3');
    title.className = 'text-xl font-semibold text-slate-800 mb-3';
    title.textContent = f.title;

    const text = document.createElement('p');
    text.className = 'text-slate-500 leading-relaxed';
    text.textContent = f.text;

    card.appendChild(icon);
    card.appendChild(title);
    card.appendChild(text);
    featureGrid.appendChild(card);
  });

  aboutInner.appendChild(featureGrid);
  about.appendChild(aboutInner);
  container.appendChild(about);

  // ═══════════════════════════════════════════════
  // Section 3: Hotel List
  // ═══════════════════════════════════════════════
  const hotelsSection = document.createElement('section');
  hotelsSection.id = 'hotels-section';
  hotelsSection.className = 'bg-slate-100 py-24 px-6';

  const hotelsInner = document.createElement('div');
  hotelsInner.className = 'max-w-5xl mx-auto';

  const hotelsTitle = document.createElement('h2');
  hotelsTitle.className = 'text-3xl md:text-4xl font-bold text-slate-800 text-center mb-4';
  hotelsTitle.textContent = 'Naše hotely';

  const hotelsSubtitle = document.createElement('p');
  hotelsSubtitle.className = 'text-lg text-slate-500 text-center mb-14 max-w-2xl mx-auto';
  hotelsSubtitle.textContent = 'Vyberte si z naší nabídky a začněte plánovat svůj další výlet.';

  hotelsInner.appendChild(hotelsTitle);
  hotelsInner.appendChild(hotelsSubtitle);

  const grid = document.createElement('div');
  grid.className = 'grid md:grid-cols-2 lg:grid-cols-3 gap-8';

  hotels.forEach((hotel) => {
    const card = document.createElement('div');
    card.className =
      'bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer';
    card.addEventListener('click', () => handlers.onHotelClick(hotel.id));

    // Card image placeholder
    const imgWrap = document.createElement('div');
    imgWrap.className = 'h-44 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center';

    const imgIcon = document.createElement('span');
    imgIcon.className = 'text-5xl opacity-60';
    imgIcon.textContent = '🏨';
    imgWrap.appendChild(imgIcon);

    const body = document.createElement('div');
    body.className = 'p-6';

    const name = document.createElement('h3');
    name.className = 'text-lg font-semibold text-slate-800 mb-1';
    name.textContent = hotel.name;

    const city = document.createElement('p');
    city.className = 'text-sm text-slate-400 mb-3';
    city.textContent = `${hotel.city}, ${hotel.country}`;

    body.appendChild(name);
    body.appendChild(city);

    if (hotel.description) {
      const desc = document.createElement('p');
      desc.className = 'text-sm text-slate-500 leading-relaxed';
      desc.textContent = hotel.description;
      body.appendChild(desc);
    }

    card.appendChild(imgWrap);
    card.appendChild(body);
    grid.appendChild(card);
  });

  hotelsInner.appendChild(grid);
  hotelsSection.appendChild(hotelsInner);
  container.appendChild(hotelsSection);

  // ═══════════════════════════════════════════════
  // Footer
  // ═══════════════════════════════════════════════
  const footer = document.createElement('footer');
  footer.className = 'bg-slate-800 text-slate-400 text-center text-sm py-8';
  footer.textContent = '\u00A9 2026 Algone Reservations. Všechna práva vyhrazena.';

  container.appendChild(footer);

  return container;
}
