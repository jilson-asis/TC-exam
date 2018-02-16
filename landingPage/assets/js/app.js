$(document).ready(function() {
    var stickyNavTop = $('.page-header').offset().top;

    var stickyNav = function(){
        var scrollTop = $(window).scrollTop();

        if (scrollTop > stickyNavTop) {
            $('.page-header').addClass('sticky');
        } else {
            $('.page-header').removeClass('sticky');
        }
    };

    stickyNav();
    $(window).scroll(function() {
        stickyNav();
    });

    // click nav action

    $('.navbar-toggler').click(function(e) {
        if ($(this).attr('aria-expanded') === 'true') {
            $(this).closest('.page-header').removeClass('mobile-open');
            $(this).find('.sticky-hide').removeAttr('style');
            $(this).find('.sticky-show').removeAttr('style');
            $(this).find('.mobile-menu-close').removeAttr('style');

            $('.menu-tc-logo').removeAttr('style');
        } else {
            $(this).closest('.page-header').addClass('mobile-open');
            $(this).find('.sticky-hide').css('display', 'none');
            $(this).find('.sticky-show').css('display', 'none');
            $(this).find('.mobile-menu-close').css('display', 'block');


            $('.menu-tc-logo.sticky-hide').css('display', 'none');
            $('.menu-tc-logo.sticky-show').css('display', 'none');
            $('.menu-tc-logo.mobile-menu-logo').css('display', 'block');
        }
    });

    // if we resize window, hide mobile menu
    $(window).resize(function() {
        var button = $('.navbar-toggler');
        if (button.attr('aria-expanded') === 'true') {
            button.click();
        }
    });

    // scroll trigger
    $('.clickable').click(function() {
        var target = $(this).attr('data-target');
        var top = $(target).offset().top - 60;
        $('html, body').animate({
            scrollTop: top
        }, 500);
    });
});