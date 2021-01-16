/* Includes */
import $ from "jquery";
import '../../node_modules/jquery-parallax.js/parallax.js';

/* Webpack */
import '../sass/style.scss';
// import '../template.html';
import '../img/hero.jpg';
import '../img/profile.jpg';

const $document = $(document),
			$window = $(window),
			navHeight = 70;

$window.on('load', function() {
	$('#load').fadeOut();

	const $root = $('html, body'),
				$main = $('#main'),
				$contact = $('#contact'),
				$about = $('#about'),
				$skills = $('#skills'),
				$experience = $('#experience'),
				$header = $('header'),
				$navMenu = $('ol#nav-menu'),
				$navButton = $('#nav-button'),
				keyboardUserCssClass = 'keyboard-user';

	addNavAriaAttr();
	styleNavBar();
	markActiveNavItem();

	const lazyloads = document.querySelectorAll('.lazyload');
	lazyloads.forEach(el => {
		lazyloadObserver.observe(el)
	})

	$window.on("scroll touchmove", function() {
		styleNavBar();
		markActiveNavItem();
	});

	let timeout;
	$window.resize(function() {
		timeout = setTimeout(function() {
			addNavAriaAttr();
			markActiveNavItem();
			clearTimeout(timeout);
		}, 100);
	});

	$('img.parallax-slider').attr('role', 'presentation');

	$('nav a').on('click touchstart', function(event) {
		event.stopPropagation();
		event.preventDefault();

		if (isMobile()) {
			$navMenu.slideUp();
			$navButton.attr('aria-expanded', 'false');
		}

		const href = $(this).attr('href');
		$root.animate({
			scrollTop: $(href).offset().top - navHeight
		}, 500);
	});

	$navButton.on('click touchstart', function(event) {
		event.stopPropagation();
		event.preventDefault();

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

	$header.on('click touchend', function(event) {
		event.stopPropagation();
		event.preventDefault();

		$root.animate(
			{scrollTop: $main.offset().top + parseInt($main.css('padding-top')) - navHeight},
			1000);
	});

	$document
	.keydown(function(event) {
		if (event.key === 'Tab') {
			setIsKeyboardUser(true);
		}
	})
	.on('click touchstart', function(event) {
		event.stopPropagation();

		if (isMobile() && !$(event.target).closest('nav').length) {
			$navMenu.slideUp();
			$navButton.attr('aria-expanded', 'false');
		}

		// Pressing ENTER on buttons triggers a click event with coordinates at (0, 0)
		setIsKeyboardUser(!event.screenX && !event.screenY);
	})
	.mousedown(function() {
		setIsKeyboardUser(false);
	});

	setInterval(function() {
		const $overlay = $('.site-wrap > .overlay-2');
		let overlayOpacity = $overlay.css('opacity');
		$overlay.css('opacity', overlayOpacity === '1' ? '0' : '1');
	}, 3000);

	function addNavAriaAttr() {
		if (isMobile()) {
			$navMenu.attr('aria-labelledby', 'nav-button');
		} else {
			$navMenu.removeAttr('aria-labelledby');
		}
	}

	function markActiveNavItem() {
		const documentTop = $document.scrollTop(),
					contactTop = $contact.offset().top - navHeight,
					aboutTop = $about.offset().top - navHeight,
					skillsTop = $skills.offset().top - navHeight,
					experienceTop = $experience.offset().top - navHeight,
					isMobileSize = isMobile();

		if ((!isMobileSize && documentTop < aboutTop) || (isMobileSize && documentTop < contactTop)) {
			addNavItemActiveClass('home');
		} else if (isMobileSize && documentTop < aboutTop) {
			addNavItemActiveClass('contact');
		} else if (documentTop < skillsTop) {
			addNavItemActiveClass('about');
		} else if (documentTop < experienceTop) {
			addNavItemActiveClass('skills');
		} else {
			addNavItemActiveClass('experience');
		}
	}

	function setIsKeyboardUser(isKeyboard) {
		isKeyboard ?
			$('body:not(.keyboard-user)').addClass(keyboardUserCssClass)
			:
			$('body.keyboard-user').removeClass(keyboardUserCssClass);
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

const addLazyLoad = (element) => {
		if (!$(element).hasClass('loaded')) {
			if ($(element).is('.skill__bar-fill')) {
				$(element).css('width', `${$(element).data('value')}%`);
			}

			$(element).addClass('loaded');
		}
	}

const lazyloadObserverOptions = {
	rootMargin: `${navHeight}px 0px 0px 0px`,
	threshold: 0.33,
}

const lazyloadObserver = new IntersectionObserver(function(entries, self) {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			addLazyLoad($(entry.target));

			self.unobserve(entry.target);
		}
	})
}, lazyloadObserverOptions)

function addNavItemActiveClass(section) {
	$(`nav a.active:not([href="#${section}"])`).removeClass('active');
	$(`nav a[href="#${section}"]:not(.active)`).addClass('active');
}

function isMobile() {
	return $window.width() < 768;
}