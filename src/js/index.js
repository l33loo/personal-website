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
          $navButton = $('#nav-button'),
          navHeight = 70;

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
            $navButton.attr('aria-expanded', 'false');
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

    let isShiftDown = false;
    $('nav li').last().on('keydown keyup', function(event) {
        const isEventKeydown = event.type === 'keydown';

        if (isMobile()) {
            // Make sure the menu doesn't close when Shift + Tab are down concurrently
            if (!isEventKeydown) {
                isShiftDown = false;
            } else if (event.key === 'Shift') {
                isShiftDown = true;
            } else if (event.key === 'Tab' && !isShiftDown && isEventKeydown) {
                $navMenu.slideUp();
                $navButton.attr('aria-expanded', 'false');
            }
        }
    });

    $navMenu.on('keydown', function(event) {
        if (isMobile() && event.key === 'Escape') {
            $navMenu.slideUp();
            $navButton.attr('aria-expanded', 'false').focus();
        }
    });

    $header.on('click touchend', function() {
        addNavItemActiveClass('about');
        $root.animate({
            scrollTop: $('#main').offset().top - navHeight
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
              contactTop = Math.floor($contact.offset().top - topOffset),
              aboutTop = Math.floor($about.offset().top - topOffset),
              skillsTop = Math.floor($skills.offset().top - topOffset),
              experienceTop = Math.floor($experience.offset().top - topOffset);

        if ((!isMobile() && documentTop < aboutTop) || (isMobile() && documentTop < contactTop)) {
            addNavItemActiveClass('home');
        } else if (isMobile() && documentTop < aboutTop) {
            addNavItemActiveClass('contact');
        } else if (documentTop < skillsTop) {
            addNavItemActiveClass('about');
        } else if (documentTop < experienceTop) {
            addNavItemActiveClass('skills');
        } else {
            addNavItemActiveClass('experience');
        }
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
        const windowViewTop = $document.scrollTop() + (isMobile() ? 0 : navHeight),
              windowViewBottom = windowViewTop + $window.height(),
              elementOffsetTop = $(element).offset().top,
              yTranslate = $(element).is('.lazyload-text') ? 30 : 0,
              elementTop = elementOffsetTop + parseInt($(element).css('paddingTop')) + yTranslate,
              elementBottom = elementOffsetTop + $(element).height() + yTranslate;

        return elementTop > windowViewTop && elementTop < windowViewBottom ||
               elementBottom > windowViewTop && elementBottom < windowViewBottom;
    }

    function getTopOffset() {
        return navHeight + parseInt($('section#about').css('marginTop'));
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
    $(`nav a.active:not([href="#${section}"])`).removeClass('active');
}

function isMobile() {
    return $window.width() < 768;
}