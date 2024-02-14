/**
 * @copyright Ayush Agarwal
 */

'use strict';
const toggleTheme = function () {
  const /** {string} */ currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  const /** {string} */ newTheme = currentTheme === 'light' ? 'dark' : 'light';

  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}
const /** {string | null} */ storedTheme = localStorage.getItem('theme');
const /** {Boolean} */ systemThemeIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const /** {string} */ initialTheme = storedTheme ?? (systemThemeIsDark ? 'dark' : 'light');
document.documentElement.setAttribute('data-theme', initialTheme);
window.addEventListener('DOMContentLoaded', function () {
  const /** {HTMLElement} */ $themeBtn = document.querySelector('[data-theme-btn]');
  if ($themeBtn) $themeBtn.addEventListener('click', toggleTheme);
});