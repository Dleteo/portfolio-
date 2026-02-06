const btn = document.getElementById('button');
const navMenu = document.querySelector('.nav_menu');
const header = document.querySelector('header');
const sectionAll = document.querySelectorAll('section[id]');
const langSwitch = document.querySelector('.lang_switch');
const textsToChange = document.querySelectorAll('[data-section]');
const goTopContainer = document.querySelector('.go-top-container');
const goTopButton = document.querySelector('.go-top-button');
const loader = document.querySelector('.container--loader');
const splitHeroImage = document.querySelector('.split-hero__image');
const splitHeroLeft = document.querySelector('.split-hero__img--left');
const splitHeroRight = document.querySelector('.split-hero__img--right');

/* ===== Loader ===== */
window.addEventListener('load', () => {
    if (!loader) return;
    loader.style.opacity = 0;
    loader.style.visibility = 'hidden';
});

/*===== Botón Menú =====*/
const toggleMenu = () => {
    if (!btn || !navMenu) return;
    const isActive = btn.classList.contains('active');
    btn.classList.toggle('active');
    btn.classList.toggle('not-active');
    navMenu.classList.toggle('active');
    navMenu.classList.toggle('not-active');
    btn.setAttribute('aria-expanded', String(!isActive));
};

if (btn) {
    btn.addEventListener('click', toggleMenu);
}

/*===== Cambio de idioma =====*/
const setActiveLanguageButton = (language) => {
    if (!langSwitch) return;
    const buttons = langSwitch.querySelectorAll('.lang_switch__btn');
    buttons.forEach((btn) => {
        btn.classList.toggle('is-active', btn.dataset.language === language);
    });
};

const changeLanguage = async (language) => {
    try {
        const requestJson = await fetch(`./languages/${language}.json`);
        if (!requestJson.ok) return;
        const texts = await requestJson.json();

        for (const textToChange of textsToChange) {
            const section = textToChange.dataset.section;
            const value = textToChange.dataset.value;
            if (texts[section] && texts[section][value] !== undefined) {
                textToChange.innerHTML = texts[section][value];
            }
        }

        const normalized = language === 'en' ? 'en' : 'es';
        document.documentElement.lang = normalized;
        setActiveLanguageButton(normalized);
    } catch (error) {
        console.warn('No se pudo cargar el idioma:', error);
    }
};

if (langSwitch) {
    langSwitch.addEventListener('click', (e) => {
        const item = e.target.closest('.lang_switch__btn');
        if (!item) return;
        changeLanguage(item.dataset.language);
    });
}

/*===== Scroll y navegación activa =====*/
const handleScroll = () => {
    const scrollY = window.pageYOffset;

    if (header) {
        header.classList.toggle('abajo', scrollY > 0);
    }

    sectionAll.forEach((current) => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 100;
        const sectionId = current.getAttribute('id');
        const navLink = document.querySelector(`nav a[href*="${sectionId}"]`);

        if (!navLink) return;

        if (scrollY > sectionTop && scrollY < sectionTop + sectionHeight) {
            navLink.classList.add('active');
        } else {
            navLink.classList.remove('active');
        }
    });

    if (goTopContainer) {
        if (document.documentElement.scrollTop > 100) {
            goTopContainer.classList.add('show');
        } else {
            goTopContainer.classList.remove('show');
        }
    }
};

let isTicking = false;
const onScrollOptimized = () => {
    if (isTicking) return;
    isTicking = true;
    window.requestAnimationFrame(() => {
        handleScroll();
        isTicking = false;
    });
};

window.addEventListener('scroll', onScrollOptimized);
handleScroll();

if (goTopButton) {
    goTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

if (splitHeroImage && splitHeroLeft && splitHeroRight) {
    const clearSplitState = () => {
        splitHeroImage.classList.remove('show-left', 'show-right');
    };

    splitHeroLeft.addEventListener('mouseenter', () => {
        splitHeroImage.classList.add('show-left');
        splitHeroImage.classList.remove('show-right');
    });

    splitHeroRight.addEventListener('mouseenter', () => {
        splitHeroImage.classList.add('show-right');
        splitHeroImage.classList.remove('show-left');
    });

    splitHeroImage.addEventListener('mouseleave', clearSplitState);
}

const navLinks = document.querySelectorAll('.nav_menu a[href^="#"]');
navLinks.forEach((link) => {
    link.addEventListener('click', () => {
        if (navMenu && navMenu.classList.contains('active')) {
            toggleMenu();
        }
    });
});
