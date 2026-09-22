// Header shadow on scroll (también pasa la hamburguesa a navy cuando el header queda claro)
const header = document.getElementById('header');
const headerHamburger = document.getElementById('hamburger');
if (header) {
  const onScroll = () => {
    const isScrolled = window.scrollY > 12;
    header.classList.toggle('scrolled', isScrolled);
    if (headerHamburger) headerHamburger.classList.toggle('scrolled', isScrolled);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

// Mobile nav
const hamburger = document.getElementById('hamburger');
const mobNav = document.getElementById('mobNav');
const mobOverlay = document.getElementById('mobOverlay');

function closeMobNav() {
  hamburger.classList.remove('open');
  mobNav.classList.remove('open');
  mobOverlay.classList.remove('open');
  document.body.style.overflow = '';
}
function openMobNav() {
  hamburger.classList.add('open');
  mobNav.classList.add('open');
  mobOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
if (hamburger) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.contains('open') ? closeMobNav() : openMobNav();
  });
  mobOverlay.addEventListener('click', closeMobNav);
  mobNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobNav));
}

// Reveal on scroll
const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
if ('IntersectionObserver' in window && reveals.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  reveals.forEach(el => io.observe(el));
} else {
  reveals.forEach(el => el.classList.add('is-visible'));
}

// Formulario de contacto -> área y subárea se completan una a la otra + mensaje de WhatsApp prellenado
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  const AREA_JURIDICA = 'Área Jurídica';
  const AREA_CONTABLE = 'Área Contable y Tributaria';

  const subareasPorArea = {
    [AREA_JURIDICA]: [
      'Accidentes de tránsito y reclamos por daños',
      'Derecho laboral',
      'Accidentes y enfermedades laborales (ART)',
      'Derecho civil y comercial',
      'Contratos',
      'Reclamos e indemnizaciones',
      'Asesoramiento y representación judicial',
      'Derecho tributario',
      'Asesoramiento a empresas y particulares',
      'Derecho Penal'
    ],
    [AREA_CONTABLE]: [
      'Asesoramiento impositivo',
      'Liquidación de impuestos',
      'Regularización de situaciones ante ARCA',
      'Planificación tributaria',
      'Liquidaciones laborales',
      'Asesoramiento contable para empresas y emprendimientos'
    ]
  };

  // mapa inverso: subárea -> a qué área pertenece
  const areaDeSubarea = {};
  Object.keys(subareasPorArea).forEach(area => {
    subareasPorArea[area].forEach(sub => { areaDeSubarea[sub] = area; });
  });

  const areaSelect = contactForm.area;
  const subareaSelect = contactForm.subarea;

  function optionsHTML(list) {
    return list.map(o => `<option value="${o}">${o}</option>`).join('');
  }

  function mostrarTodasLasSubareas(seleccionar) {
    subareaSelect.innerHTML =
      `<optgroup label="${AREA_JURIDICA}">${optionsHTML(subareasPorArea[AREA_JURIDICA])}</optgroup>` +
      `<optgroup label="${AREA_CONTABLE}">${optionsHTML(subareasPorArea[AREA_CONTABLE])}</optgroup>`;
    if (seleccionar) subareaSelect.value = seleccionar;
  }

  function filtrarSubareasPorArea(area) {
    subareaSelect.innerHTML = optionsHTML(subareasPorArea[area] || []);
  }

  // Estado inicial: todas las subáreas disponibles, sin filtrar por área
  mostrarTodasLasSubareas();

  // Si elegís primero el Área de interés -> se filtran las subáreas de esa área
  areaSelect.addEventListener('change', () => {
    if (areaSelect.value === AREA_JURIDICA || areaSelect.value === AREA_CONTABLE) {
      filtrarSubareasPorArea(areaSelect.value);
    } else {
      mostrarTodasLasSubareas();
    }
  });

  // Si elegís primero la subárea -> se completa sola el Área de interés de arriba
  subareaSelect.addEventListener('change', () => {
    const areaCorrespondiente = areaDeSubarea[subareaSelect.value];
    if (areaCorrespondiente) areaSelect.value = areaCorrespondiente;
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = contactForm.nombre.value.trim();
    const telefono = contactForm.telefono.value.trim();
    const area = areaSelect.value;
    const subarea = subareaSelect.value;
    const mensaje = contactForm.mensaje.value.trim();

    let texto = `Hola, mi nombre es ${nombre}.`;
    if (telefono) texto += ` Mi teléfono de contacto es ${telefono}.`;
    texto += ` Quiero consultar sobre: ${area}`;
    if (subarea && subarea !== area) texto += ` — ${subarea}`;
    texto += `.`;
    texto += ` ${mensaje}`;

    const url = `https://wa.me/5492664644422?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank', 'noopener');
  });
}

// FAB visibility (hidden until scrolled, hidden again over the footer)
const fabWrap = document.getElementById('fabWrap');
const footerEl = document.querySelector('footer');
if (fabWrap) {
  const updateFab = () => {
    const pastHero = window.scrollY > 400;
    let overFooter = false;
    if (footerEl) {
      const rect = footerEl.getBoundingClientRect();
      overFooter = rect.top < window.innerHeight;
    }
    fabWrap.classList.toggle('visible', pastHero && !overFooter);
  };
  updateFab();
  window.addEventListener('scroll', updateFab, { passive: true });
  window.addEventListener('resize', updateFab);
}
