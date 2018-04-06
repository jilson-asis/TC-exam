const PERFORMANCE_API_ENDPOINT = 'https://www.truecare24.com/webapi/v1/account/zeroTouchProviderMetrics';
const PERFORMANCE_PHP_ENDPOINT = 'lib/message.php';

function calculateGraphBorder(obj, animateTime, animateSpeed) {
    animateTime = animateTime || 5; // ms
    animateSpeed = animateSpeed || 250; // ms
    var animate = animateTime !== animateSpeed;

    var percent = parseFloat(round(obj.attr('data-percent') * (animateTime / animateSpeed), 2));
    var degrees = 360 * (percent / 100);

    var colors = {
        'below_average' : {
            'solid': '#FF2F4F',
            'faded': '#ffc0cb'
        },
        'average' : {
            'solid': '#F5BD23',
            'faded': '#fcebbd'
        },
        'above_average' : {
            'solid': '#1DD384',
            'faded': '#bcf1da'
        }
    };

    var colorsSelected = percent > 50 ? colors['above_average'] : (percent > 25 ? colors['average'] : colors['below_average']);
    obj.css('background', colorsSelected['solid']);
    obj.find('.percent').html(percent + '%');

    applyGraphPercent(obj, degrees, colorsSelected);

    if (animate === true) {
        setTimeout(function() {calculateGraphBorder(obj, animateTime + 5, animateSpeed)}, 5);
    }
}

function applyGraphPercent(obj, degrees, colorsSelected) {
    if (degrees <= 180){
        obj.css(
            'background-image',
            'linear-gradient(' + (90 + degrees) + 'deg, transparent 50%, ' + colorsSelected['faded'] + ' 50%),linear-gradient(90deg, ' + colorsSelected['faded'] + ' 50%, transparent 50%)'
        );
    } else if (degrees < 360) {
        obj.css(
            'background-image',
            'linear-gradient(' + (degrees - 90) + 'deg, transparent 50%, ' + colorsSelected['solid'] + ' 50%),linear-gradient(90deg, ' + colorsSelected['faded'] + ' 50%, transparent 50%)'
        );
    } else {
        obj.css('background-image', 'none');
    }
}

jQuery_latest('#askQuestion').click(function() {
    jQuery_latest(this).addClass('d-none');
    jQuery_latest('#feedbackDiv').removeClass('d-none');

    var btn = jQuery_latest('#performanceModal .btn-got-it');
    btn.html('Send feedback');
    btn.removeAttr('data-dismiss');
    btn.click(function(event) {
        event.preventDefault();

        // do something

        jQuery_latest('#performanceModal').modal('hide');
    });
});

jQuery_latest(document).ready(function() {
    // show by default
    jQuery_latest('#performanceModal').modal('show');

    jQuery_latest('[data-toggle="tooltip"]').tooltip();

    var provider_id = jQuery_latest('#providerId').val();
    var partnership = jQuery_latest('#providerPartnership').val();

    jQuery_latest.ajax({
        url: PERFORMANCE_PHP_ENDPOINT + '?api_url=' + PERFORMANCE_API_ENDPOINT + '/' + provider_id + '/' + partnership,
        method: 'GET',
        success: function(data) {
            var performance = {
                '.performance-received': {
                    'data': data.numberOfContacted,
                    'percent': 0
                },
                '.performance-accepted': {
                    'data': data.numberOfConfirmed,
                    'percent': 0
                },
                '.performance-talked': {
                    'data': data.numberOfTalkedProviderReported + data.numberOfTalked,
                    'percent': 0
                },
                '.performance-initial-assessment': {
                    'data': data.numberOfIa,
                    'percent': 0
                },
                '.performance-contract-signed': {
                    'data': data.numberOfCs,
                    'percent': 0
                },
                '.performance-cancelled': {
                    'data': data.numberOfCancel,
                    'percent': 0
                },
                '.performance-legitimate': {
                    'data': data.numberOfConfirmed,
                    'percent': 0
                },
                '.performance-hours': {
                    'data': data.hours,
                    'percent': 100
                },
                '.performance-responsive-clients': {
                    'data': data.numberOfResponsiveCase,
                    'percent': 0
                },
                'average_total': data.averagePercentage
            };

            var imgRatings = {
                'above_average': 'assets/img/Above%20average@2x.svg',
                'average': 'assets/img/Average@2x.svg',
                'below_average': 'assets/img/Below%20average@2x.svg'
            };
            var imgRating = performance['average_total'] > 50 ? imgRatings['above_average'] : (performance['average_total'] > 25 ? imgRatings['average'] : imgRatings['below_average']);
            jQuery_latest('#performanceRating').attr('src', imgRating);

            // avoid division by zero
            if (data.numberOfAvailable > 0) {
                performance['.performance-received']['percent'] = round(performance['.performance-received']['data'] / data.numberOfAvailable, 2) * 100;
            }

            if (data.numberOfContacted > 0) {
                performance['.performance-accepted']['percent'] = round(performance['.performance-accepted']['data'] / data.numberOfContacted, 2) * 100;
                performance['.performance-accepted']['percent'] = round(performance['.performance-accepted']['data'] / data.numberOfContacted, 2) * 100;
            }

            if (data.numberOfConfirmed > 0) {
                performance['.performance-initial-assessment']['percent'] = round(performance['.performance-initial-assessment']['data'] / data.numberOfConfirmed, 2) * 100;
                performance['.performance-contract-signed']['percent'] = round(performance['.performance-contract-signed']['data'] / data.numberOfConfirmed, 2) * 100;
                performance['.performance-cancelled']['percent'] = round(performance['.performance-cancelled']['data'] / data.numberOfConfirmed, 2) * 100;
                performance['.performance-legitimate']['percent'] = round(performance['.performance-legitimate']['data'] / data.numberOfConfirmed, 2) * 100;
                performance['.performance-responsive-clients']['percent'] = round(performance['.performance-responsive-clients']['data'] / data.numberOfConfirmed, 2) * 100;
            }

            for (var className in performance) {
                if (performance.hasOwnProperty(className)) {
                    jQuery_latest(className).attr('data-percent', parseFloat(performance[className]['percent']));
                    jQuery_latest(className).find('.count').html(performance[className]['data']);
                }
            }

            jQuery_latest('.graph-border').each(function(event) {
                calculateGraphBorder(jQuery_latest(this));
            });
        }
    });
});

// call calculate border so it's not empty
jQuery_latest('.graph-border').each(function(event) {
    calculateGraphBorder(jQuery_latest(this));
});

// rounding function recommended by Mozilla.org
function round(number, precision) {
    var shift = function (number, precision, reverseShift) {
        if (reverseShift) {
            precision = -precision;
        }
        numArray = ("" + number).split("e");
        return +(numArray[0] + "e" + (numArray[1] ? (+numArray[1] + precision) : precision));
    };
    return shift(Math.round(shift(number, precision, false)), precision, true);
}