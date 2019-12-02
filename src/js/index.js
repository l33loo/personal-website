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

$document.ready(function() {
    const $root = $('html, body'),
          $about = $('#about'),
          $skills = $('#skills'),
          $experience = $('#experience'),
          $header = $('header');

    styleNavBar();
    markActiveNavItem();
    addLazyLoad('lazyload-text');

    $window.on("scroll touchmove", function() {
        styleNavBar();
        markActiveNavItem();
        addLazyLoad('lazyload-text');
    });

    $('nav a').click(function(event) {
        event.preventDefault();

        const href = $(this).attr('href');
        $root.animate({
            scrollTop: $(href).offset().top - getTopOffset()
        }, 500);
    });

    $header.click(function() {
        addNavItemActiveClass('about');
        $root.animate({
            scrollTop: $('#main').offset().top - $('ol.nav').height()
        }, 1000);
    });

    setInterval(function() {
        const $overlay = $('.site-wrap > .overlay-2');
        let overlayOpacity = $overlay.css('opacity');
        $overlay.css('opacity', overlayOpacity === '1' ? '0' : '1');
    }, 3000);

    function markActiveNavItem() {
        const topOffset = getTopOffset(),
              documentTop = $document.scrollTop(),
              aboutTop = $about.offset().top - topOffset,
              skillsTop = $skills.offset().top - topOffset,
              experienceTop = $experience.offset().top - topOffset;

        if (documentTop < aboutTop) {
            addNavItemActiveClass('home');
        } else if (documentTop < skillsTop) {
            addNavItemActiveClass('about');
        } else if (documentTop < experienceTop) {
            addNavItemActiveClass('skills');
        } else {
            addNavItemActiveClass('experience');
        }
    }

    function getTopOffset() {
        return $('ol.nav').height() + parseInt($('section#about').css('marginTop'));
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
            $(element).addClass('loaded');
        }
    });
}

function isScrolledIntoView(element, offsetVal) {
    const windowViewTop = $window.scrollTop(),
          windowViewBottom = windowViewTop + $window.height(),
          elementTop = $(element).offset().top,
          elementOffset = offsetVal ? offsetVal : parseInt($(element).css('paddingTop'));

    return elementTop >= windowViewTop && elementTop + elementOffset <= windowViewBottom;
}