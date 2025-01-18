document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const root = document.documentElement;

    // Initialize theme from localStorage
    const currentTheme = localStorage.getItem('theme') || 'light';
    setTheme(currentTheme);

    // Toggle theme on button click
    themeToggle.addEventListener('click', () => {
        const newTheme = root.classList.contains('dark') ? 'light' : 'dark';
        setTheme(newTheme);
    });

    function setTheme(theme) {
        if (theme === 'dark') {
            root.classList.add('dark');
            themeIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" d="M12 3v3m0 12v3m9-9h-3m-12 0H3m15.364-7.364l-2.121 2.121m-9.9 9.9l-2.12 2.12m0-12.02l2.12 2.12m9.9 9.9l2.121 2.121"/>`; // Moon Icon
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            themeIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" d="M12 2a10 10 0 100 20 10 10 0 000-20z"/>`; // Sun Icon
            localStorage.setItem('theme', 'light');
        }
    }
});
