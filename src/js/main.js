import Flickity from 'flickity';
import VanillaScrollspy from 'vanillajs-scrollspy';

import { makeCollectionToMarkupFromTmpl } from '@app/js/utils';
import { fetchTestimonials } from '@app/js/testimonials';

import '@app/css/main.scss';

/**
 * Init Carousel
 *
 * @param {HTMLElement} carouselEl - element for attach Flickity
 *
 * @returns {Flickity} - Flickity instance
 */
function carouselInit(carouselEl) {
  const data = Flickity.data(carouselEl);

  if (data) {
    data.destroy();
  }

  return new Flickity(carouselEl, {
    prevNextButtons: false,
    wrapAround: true,
    groupCells: 1,
    autoPlay: true,
    pauseAutoPlayOnHover: true,
  });
}

/**
 * Init ScrollSpy
 *
 * @param {HTMLElement} navbarEl - element for attach Scrollspy
 *
 * @returns {VanillaScrollspy} - VanillaScrollspy instance
 */
function scrollspyInit(navbarEl) {
  const scrollSpy = new VanillaScrollspy(navbarEl);

  scrollSpy.init();

  return scrollSpy;
}

function navbarToggleInit() {
  const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

  if ($navbarBurgers.length > 0) {
    $navbarBurgers.forEach((el) => {
      el.addEventListener('click', () => {
        const { target } = el.dataset;
        const $target = document.getElementById(target);

        el.classList.toggle('is-active');
        $target.classList.toggle('is-active');
      });
    });
  }
}

function handleDOMContentLoaded() {
  const navbarEl = document.querySelector('.primary-navbar__start');
  const carousel = document.querySelector('.testimonial__carousel');
  const tmpl = document.getElementById('testimonial__tmpl').innerHTML;

  scrollspyInit(navbarEl);
  navbarToggleInit();

  const flickity = carouselInit(carousel);

  fetchTestimonials()
    .then(makeCollectionToMarkupFromTmpl(tmpl))
    .then((markup) => {
      flickity.destroy();

      carousel.innerHTML = markup;

      return carousel;
    })
    .then(carouselInit);
}

document.addEventListener('DOMContentLoaded', handleDOMContentLoaded);
