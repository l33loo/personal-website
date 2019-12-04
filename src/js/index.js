/* Includes */
import $ from "jquery";
import '../../node_modules/jquery-parallax.js/parallax.js';

/* Webpack */
import '../sass/style.scss';
// import '../template.html';
import '../img/hero.jpg';
import '../img/profile.jpg';

const $document = $(document),
      $window = $(window);

$window.on('load', function() {
    $('#load').fadeOut();

    const $root = $('html, body'),
          $contact = $('#contact'),
          $about = $('#about'),
          $skills = $('#skills'),
          $experience = $('#experience'),
          $header = $('header'),
          $nav = $('nav'),
          $navMenu = $('ol#nav-menu'),
          $navButton = $('#nav-button');

    addNavAriaAttr();
    styleNavBar();
    markActiveNavItem();
    addLazyLoad('lazyload');

    $window.on("scroll touchmove", function() {
        styleNavBar();
        markActiveNavItem();
        addLazyLoad('lazyload');
    });

    let timeout;
    $window.resize(function() {
        timeout = setTimeout(function() {
            addNavAriaAttr();
            clearTimeout(timeout);
        }, 100);
    });

    $('nav a').click(function(event) {
        event.preventDefault();

        if (isMobile()) {
            $navMenu.slideUp();
        }

        const href = $(this).attr('href');
        $root.animate({
            scrollTop: $(href).offset().top - getTopOffset()
        }, 500);
    });

    $navButton.on('click', function() {
        if ($navMenu.is(':hidden')) {
            $navMenu.slideDown();
            $(this).attr('aria-expanded', 'true');
        } else {
            $navMenu.slideUp();
            $(this).attr('aria-expanded', 'false');
        }
    });

    $header.click(function() {
        addNavItemActiveClass('about');
        $root.animate({
            scrollTop: $('#main').offset().top - $('ol.nav').height()
        }, 1000);
    });

    $document.on('click touchstart', function(event) {
        if (isMobile() && !$(event.target).closest('nav').length) {
            $navMenu.slideUp();
            $navButton.attr('aria-expanded', 'false');
        }
    });

    setInterval(function() {
        const $overlay = $('.site-wrap > .overlay-2');
        let overlayOpacity = $overlay.css('opacity');
        $overlay.css('opacity', overlayOpacity === '1' ? '0' : '1');
    }, 3000);

    /* Add the transition here instead of in the SCSS file to let the parallax
       plugin do its magin first. Otherwise the image loads below the nav and
       the scrolling gets choppy. */
    $header.css('transition', 'margin .5s');

    function addNavAriaAttr() {
        if (isMobile()) {
            $navMenu.attr('aria-labelledby', 'nav-button');
        } else {
            $navMenu.removeAttr('aria-labelledby');
        }
    }

    function markActiveNavItem() {
        const topOffset = getTopOffset(),
              documentTop = $document.scrollTop(),
              contactTop = $contact.offset().top - topOffset,
              aboutTop = $about.offset().top - topOffset,
              skillsTop = $skills.offset().top - topOffset,
              experienceTop = $experience.offset().top - topOffset;

        if (documentTop < aboutTop) {
            addNavItemActiveClass('home');
        } else if (documentTop < skillsTop) {
            addNavItemActiveClass('about');
        } else if (documentTop < experienceTop) {
            addNavItemActiveClass('skills');
        } else if (!isMobile() || (isMobile() && documentTop < contactTop)) {
            addNavItemActiveClass('experience');
        } else if (isMobile()) {
            addNavItemActiveClass('contact');
        }
    }

    function getTopOffset() {
        return 70 + parseInt($('section#about').css('marginTop'));
    }
});

// Functions
function styleNavBar() {
    if ($document.scrollTop() === 0) {
        $('nav:not(.fixed)').removeClass('scrolling').addClass('fixed');
    } else {
        $('nav:not(.scrolling)').removeClass('fixed').addClass('scrolling');
    }
}

function addNavItemActiveClass(section) {
    $(`nav a[href="#${section}"]:not(.active)`).addClass('active');
    $(`nav a.active:not([href="#${section}"]`).removeClass('active');
}

function addLazyLoad(className) {
    $(`.${className}:not(.loaded)`).each(function(index, element) {
        if (isScrolledIntoView(element)) {

            if ($(element).is('.skill__bar-fill')) {
                $(element).css('width', `${$(element).data('value')}%`);
            }

            $(element).addClass('loaded');
        }
    });
}

function isScrolledIntoView(element) {
    const windowViewTop = $document.scrollTop() + (isMobile() ? 0 : 70 /* Nav height */),
          windowViewBottom = windowViewTop + $window.height(),
          elementOffsetTop = $(element).offset().top,
          yTranslate = $(element).is('.lazyload-text') ? 30 : 0,
          elementTop = elementOffsetTop + parseInt($(element).css('paddingTop')) + yTranslate,
          elementBottom = elementOffsetTop + $(element).height() + yTranslate;

    return elementTop > windowViewTop && elementTop < windowViewBottom ||
           elementBottom > windowViewTop && elementBottom < windowViewBottom;
}

function isMobile() {
    return $window.width() < 768;
}