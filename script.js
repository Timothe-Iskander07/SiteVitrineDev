// Utilitaires DOM légers
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

// Année dynamique dans le footer
document.addEventListener('DOMContentLoaded', () => {
	const yearEl = $('#year');
	if (yearEl) yearEl.textContent = new Date().getFullYear();
});

// Thème sombre / clair
const root = document.documentElement;
const themeToggle = $('.theme-toggle');

const getPreferredTheme = () => {
	const stored = localStorage.getItem('theme');
	if (stored === 'dark' || stored === 'light') return stored;
	if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
		return 'dark';
	}
	return 'light';
};

const applyTheme = (theme) => {
	const isDark = theme === 'dark';
	root.classList.toggle('dark', isDark);
	if (themeToggle) {
		themeToggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
		themeToggle.setAttribute('aria-label', isDark ? 'Activer le mode clair' : 'Activer le mode sombre');
		themeToggle.textContent = isDark ? '☀️' : '🌙';
	}
};

// Initialisation du thème
applyTheme(getPreferredTheme());

if (themeToggle) {
	themeToggle.addEventListener('click', () => {
		const newTheme = root.classList.contains('dark') ? 'light' : 'dark';
		localStorage.setItem('theme', newTheme);
		applyTheme(newTheme);
	});
}

// Menu mobile
const toggle = $('.nav-toggle');
const menu = $('#nav-menu');
if (toggle && menu) {
	toggle.addEventListener('click', () => {
		const open = menu.classList.toggle('open');
		toggle.setAttribute('aria-expanded', String(open));
	});
}

// Défilement fluide + fermeture du menu mobile
$$('.nav-menu a').forEach(a => {
	a.addEventListener('click', e => {
		const href = a.getAttribute('href');
		if (href && href.startsWith('#')) {
			e.preventDefault();
			menu && menu.classList.remove('open');
			toggle && toggle.setAttribute('aria-expanded', 'false');
			document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	});
});

// Révélation au scroll (IntersectionObserver) pour les sections
const revealEls = $$('.reveal');
if (revealEls.length && 'IntersectionObserver' in window) {
	const io = new IntersectionObserver(entries => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				entry.target.classList.add('visible');
				io.unobserve(entry.target);
			}
		});
	}, { threshold: 0.15 });
	revealEls.forEach(el => io.observe(el));
} else {
	// Fallback: tout afficher sans animation
	revealEls.forEach(el => el.classList.add('visible'));
}

