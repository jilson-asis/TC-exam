$(document).ready(function() {
    const ZIP_REDIRECT_URL = 'https://www.truecare24.com/get-started/?go=home';
    const ZIP_VERIFY_URL = 'https://www.truecare24.com/webapi/v1/providers/zeroTouchNearest/{lat}/{lng}/05141/Doctor/VT';
    var zipButtonClicked;

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

    $('.zip-code-input').keyup(function() {
        // force int values only
        $(this).val($(this).val().replace(/\D/g, ''));

        $(this).closest('.zip-code-button').removeAttr('data-url');

        var val = $(this).val();

        if (val === '') {
            return false;
        }

        var inputChanged = $(this);

        if (val.length === 5) {
            (new google.maps.Geocoder()).geocode({"address": "USA " + val}, function (results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    var components = results[0].address_components;

                    var city, state, region, nbhood = "", lat, lng;

                    lat = results[0].geometry.location.lat();
                    lng = results[0].geometry.location.lng();

                    for (var key in components) {
                        if (components[key].types[0] === "locality") {
                            city = components[key].long_name;
                        }

                        if (components[key].types[0] === "administrative_area_level_1") {
                            state = components[key].short_name;
                            region = components[key].long_name;
                        }

                        if (components[key].types[0] === "neighborhood") {
                            nbhood = components[key].long_name;
                        }
                    }

                    if (!city) {
                        city = nbhood;
                    }

                    var data = {
                        state: state,
                        address: city + ", " + region,
                        zip: val,
                        lat: lat,
                        lng: lng
                    };

                    if (city && state && region && lat && lng) {
                        // saves data to session
                        $.ajax("/wp-content/themes/jupiter/landing-page/lib/to-session.php", {
                            type: "POST",
                            data: data
                        });
                    } else {
                        inputChanged.siblings('.zip-code-message').css("display", "block").addClass("error").html("Please enter valid 5 digits US ZIP code");
                        inputChanged.addClass('mb-1');
                        inputChanged.siblings('button').addClass('mt-1');

                        // Uncomment after releasing
                        // return false;
                    }

                    // verify on TC API
                    var url = ZIP_VERIFY_URL.replace('{lat}', lat).replace('{lng}', lng);

                    $.ajax({
                        method: 'GET',
                        url: url,
                        success: function (response) {
                            if (typeof response.result !== 'undefined' && response.result.length > 0) {
                                inputChanged.siblings('.zip-code-message').css("display", "block").addClass("error").html(
                                    "<i class=\"fas fa-check icon-green\"></i> We service " + city + " " + region
                                );

                                inputChanged.siblings('.zip-code-button').attr('data-url', ZIP_REDIRECT_URL);
                                inputChanged.addClass('mb-1');
                                inputChanged.siblings('button').addClass('mt-1');
                            } else {
                                inputChanged.siblings('.zip-code-message').css("display", "block").addClass("error").html(
                                    "<i class=\"fas fa-times icon-red\"></i> Sorry, we don't service " + city + " " + region
                                );
                                inputChanged.addClass('mb-1');
                                inputChanged.siblings('button').addClass('mt-1');
                            }
                        }
                    });
                } else {
                    inputChanged.siblings('.zip-code-message').css("display", "block").addClass("error").html("Please enter valid 5 digits US ZIP code");
                    inputChanged.addClass('mb-1');
                    inputChanged.siblings('button').addClass('mt-1');
                }
            });
        }
    });

    $('.zip-code-button').click(function() {
        zipButtonClicked = $(this);

        if ($(this).attr('data-url') !== '' && $(this).attr('data-url') !== 'undefined' && typeof $(this).attr('data-url') !== 'undefined') {
            $('#dangerQuestion').modal('show');
        } else {
            $(this).siblings('.zip-code-message').css("display", "block").addClass("error").html("Please enter valid 5 digits US ZIP code");
            $(this).siblings('input').addClass('mb-1');
            $(this).addClass('mt-1');
        }
    });

    $('#dangerButtonYes').click(function() {
        $('#dangerQuestion').modal('hide');
        $('#dangerYes').modal('show');
    });

    $('#dangerButtonNo').click(function() {
        var zipCodeButton = zipButtonClicked;

        if (zipCodeButton.attr('data-url') !== '' && zipCodeButton.attr('data-url') !== 'undefined' && typeof zipCodeButton.attr('data-url') !== 'undefined') {
            window.location = zipCodeButton.attr('data-url');
        } else {
            $('#dangerQuestion').modal('hide');
            $('#dangerNoSorry').modal('show');
        }
    });
});
