// settings
const client = filestack.init("ACURxPQQTwCwLZKevYKOWz");
const STOP_RECEIVING_CLIENT_SUBMIT_ENDPONT = 'assets/profile_data.json';
const STOP_RECEIVING_CLIENT_GET_ENDPONT = 'assets/receive_false.json';
const ADVANCED_SETTINGS_SUBMIT_ENDPOINT = 'assets/profile_data.json';
const ADVANCED_SETTINGS_GET_ENDPOINT = 'assets/sample_data.json';
const PROFILE_SUBMIT_ENDPOINT = 'assets/profile_data.json';
const PROFILE_GET_ENDPOINT = 'assets/profile_data.json';

// open form
$('#advanced-settings-open-button').click(function() {
    $(this).addClass('d-none');
    $('#advanced-form').removeClass('d-none');
});

// Filestack
function uploadImage() {
    const previewUpload = $('#previewUpload');

    client.pick({
        accept: 'image/*'
    }).then(function(result) {

        if (result.filesUploaded.length === 0) {
            $('#initUpload').val("Upload Failed, please try again");
            $('#userPhoto').val(""); // to make sure it's empty
            previewUpload.attr("src", "");
            previewUpload.addClass("d-none");
        } else {
            previewUpload.attr("src", result.filesUploaded[0].url);
            previewUpload.removeClass("d-none");

            $('#userPhoto').val(result.filesUploaded[0].url);
        }
    });
}

$('#initUpload').click(function(){
    uploadImage();
});

// validation
var currentStep = 0; // assumes close

$('.form-step').click(function(e) {
    var stepNumber = parseInt($(this).attr('data-form-step'));

    // at beginning always open step 1
    if (currentStep === 0 && stepNumber !== 1) {
        e.preventDefault();
        e.stopPropagation();
        $('a[data-form-step=1]').click();
        return;
    }

    // you can go back and close the accordion
    if (stepNumber <= currentStep) {
        currentStep = stepNumber === currentStep ? 0 : stepNumber;
        return;
    }

    // if trying to skip next step, no validation required
    if (stepNumber - 1 !== currentStep) {
        e.preventDefault();
        e.stopPropagation();

        return;
    }

    if (stepNumber > 1 && validateStep(stepNumber - 1) === false) {
        e.preventDefault();
        e.stopPropagation();
        return;
    }

    currentStep = stepNumber;

    if (currentStep === 6 && $('#givePermission')[0].checked === true) {
        $('.advanced-settings-submit-button').removeAttr('disabled');
    }
});

$('#givePermission').change(function() {
    if ($(this)[0].checked === true) {
        $('.advanced-settings-submit-button').removeAttr('disabled');
    } else {
        $('.advanced-settings-submit-button').attr('disabled', 'disabled');
    }
});

function validateStep(step) {
    var stepForm = $('#advanced-setting-' + step);
    var isStepValid = true;

    stepForm.find('.form-control').each(function() {
        isStepValid = !($(this)[0].checkValidity() === false || isStepValid === false);
    });

    // manual validation for group checkboxes
    stepForm.find('.check-box-field-required').each(function() {
        var checkedCount = $(this).find('input[type=checkbox]:checked').length;
        if (checkedCount === 0) {
            $(this).find('.invalid-feedback').addClass('d-block');
        }
        isStepValid = !(checkedCount=== 0 || isStepValid === false);
    });

    if (isStepValid === false) {
        stepForm.addClass('was-validated');
    }

    return isStepValid;
}

// on-click validation for checkboxes
$('.check-box-field-required').each(function() {
    $(this).find('input[type=checkbox]').change(function() {
        validateRequiredCheckboxField($(this));
    });
});

function validateRequiredCheckboxField(checkbox) {
    var checkboxField = checkbox.closest('.check-box-field-required');
    var checkedCount = checkboxField.find('input[type=checkbox]:checked').length;

    if (checkedCount === 0) {
        checkboxField.find('input[type=checkbox]').attr('required', 'required');
        checkboxField.find('.invalid-feedback').addClass('d-block');
        checkboxField.addClass('was-validated');
    } else {
        checkboxField.find('input[type=checkbox]').removeAttr('required');
        checkboxField.find('.invalid-feedback').removeClass('d-block');
        checkboxField.removeClass('was-validated');
    }
}

// validation --end

$('.working-hour-radio').change(function() {
    if ($(this).val() === 'other') {
        $('#otherWorkingHours').attr('required', 'required').removeAttr('disabled');
        $('.working-hour-radio').removeAttr('required');
    } else {
        $('#otherWorkingHours').removeAttr('required').attr('disabled', 'disabled');
        $('.working-hour-radio').attr('required', 'required');
    }
});

// form submission
function getFormData($form){
    var unindexed_array = $form.serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function(n, i){
        if (n['name'].indexOf('[]') !== -1) {
            if (typeof indexed_array[n['name']] === "undefined") {
                indexed_array[n['name']] = [];
            }
            indexed_array[n['name']].push(n['value']);
        } else {
            indexed_array[n['name']] = n['value'];
        }
    });

    return indexed_array;
}

function submitAdvancedSettings() {
    var formValues = getFormData($('#advanced-settings-form'));

    // PLEASE DELETE THIS CODE AFTER INTEGRATION
    console.log(formValues);
    console.log(JSON.stringify(formValues));

    $.ajax({
        url: ADVANCED_SETTINGS_SUBMIT_ENDPOINT,
        type: "POST",
        data: formValues,
        success: function(response) {
            $('#successSubmit')
                .removeClass('alert-danger')
                .addClass('alert-success')
                .html('Thanks for updating the information.')
                .removeClass('d-none');
        },
        error: function(error) {
            $('#successSubmit')
                .addClass('alert-danger')
                .removeClass('alert-success')
                .html('Failed to save profile, please contact the administrator.')
                .removeClass('d-none');
        }
    });
}

$('#advanced-settings-form').submit(function(e) {
    e.preventDefault();
    if ($(this)[0].checkValidity() === false) {
        event.stopPropagation();
    } else {
        submitAdvancedSettings();
    }
});

$('#profile-settings-form').submit(function(e) {
    e.preventDefault();
    if ($(this)[0].checkValidity() === false) {
        event.stopPropagation();
    } else {
        var formValues = getFormData($(this));

        // PLEASE DELETE THIS CODE AFTER INTEGRATION
        console.log(formValues);
        console.log(JSON.stringify(formValues));
        $.ajax({
            url: PROFILE_SUBMIT_ENDPOINT,
            type: "POST",
            data: formValues,
            success: function(response) {
                $('#successSubmitProfile')
                    .removeClass('alert-danger')
                    .addClass('alert-success')
                    .html('Thanks for updating the information.')
                    .removeClass('d-none');
            },
            error: function(error) {
                $('#successSubmitProfile')
                    .addClass('alert-danger')
                    .removeClass('alert-success')
                    .html('Failed to save profile, please contact the administrator.')
                    .removeClass('d-none');
            }
        });
    }
});

// -----

// ----- google api auto complete
var componentForm = {
    street_number: 'short_name',
    route: 'long_name',
    locality: 'long_name',
    administrative_area_level_1: 'long_name',
    country: 'long_name',
    postal_code: 'short_name'
};

function initAutocomplete() {
    $('.auto-complete').each(function() {
        var autocomplete = new google.maps.places.Autocomplete(
            ($(this)[0]),
            {types: ['geocode']}
        );
        autocomplete.name = $(this).attr('name');

        autocomplete.addListener('place_changed', function() {
            var place = this.getPlace();

            // fill other inputs if empty
            var placeLength = place.address_components.length;
            for (var i = 0; i < placeLength; i++) {
                var placeData = place.address_components[i];
                var addressType = placeData.types[0];
                var autoCompleteInput = $('.auto-complete.' + placeData.types[0]);

                if ((autoCompleteInput.length !== 0 && autoCompleteInput.val() === '') || autoCompleteInput.attr('name') === this.name) {
                    autoCompleteInput.val(placeData[componentForm[addressType]]);
                }
            }
        });
    });
}

// pre-fill form if data is present

$(document).ready(function() {
    // fetch receiving client status
    $.ajax({
        url: STOP_RECEIVING_CLIENT_GET_ENDPONT,
        type: 'GET',
        success: function(data) {
            if (data.receive === false) {
                $('#stop-receiving-clients-button')
                    .html('<i class="fas fa-play"></i> Start Receiving Clients')
                    .addClass('green');
            }
        }
    });

    // fetch profile data
    $.ajax({
        url: PROFILE_GET_ENDPOINT,
        type: 'GET',
        success: function(data) {
            var form = $('#profile-settings-form');

            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    var datum = data[key];

                    form.find('input[name=' + key + ']').val(datum);
                }
            }
        }
    });

    // TEST CODE
    if (getParameterByName('prefill') !== 'true') {
        return false;
    }

    // fetch advanced settings data
    $.ajax({
        url: ADVANCED_SETTINGS_GET_ENDPOINT,
        type: 'GET',
        success: function(data) {
            var form = $('#advanced-form');

            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    var datum = data[key];

                    if (key === 'user_photo') {
                        $('#previewUpload').attr('src', datum).removeClass("d-none");
                        $('#userPhoto').val(datum);
                    } else if (typeof datum === 'object') {
                        for (var i = 0; datum.length > i ; i++) {
                            // form.find('input[name="' + key + '"][value="' + datum[i] + '"]').prop('checked', true);
                            form.find('input[name="' + key + '"][value="' + datum[i] + '"]').click();
                        }
                    } else {
                        var input = form.find('input[name=' + key + ']');

                        if (input.length === 0) {
                            // then it's textarea
                            form.find('textarea[name=' + key + ']').val(datum);
                        } else {
                            if (input.attr('type') === 'radio') {
                                input.click();
                            } else if (input.attr('type') === 'checkbox') {
                                input.prop('checked', true);
                            } else {
                                form.find('input[name=' + key + ']').val(datum);
                            }
                        }
                    }
                }
            }
        }
    });
});

// only test codes, not needed on prod

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// source: https://www.truecare24.com/wp-content/themes/jupiter/landing-page/tc24-jobs/dist/scripts-debug.js?v=6412:229
$("#cellphone").on({
    contextmenu: false,
    paste: false,
    keyup: function () {


        var input = $(this).val().replace("+1", "").match(/[0-9]+/g);

        if (input !== null) {
            var data = input.join("").split("");
        } else {
            var data = [];
        }

        var phone = "";

        for(var i = 0; i < data.length; i++){
            phone += (!i ? "+1 (" : "") + (i === 3 ? ") " : "") + (i === 6 ? "-" : "") + data[i];
        }

        $(this).val(phone);
    }
});

$('#stop-receiving-clients-button').click(function() {
    // send stop on API

    $.ajax({
        url: STOP_RECEIVING_CLIENT_SUBMIT_ENDPONT,
        type: 'POST',
        data: {},
        success: function(response) {
            var status = response.receive === true ? 'Started' : 'Stopped';

            $('#stopReceiveMessage')
                .removeClass('alert-danger')
                .addClass('alert-success')
                .html(status + ' receiving client.')
                .removeClass('d-none');
        },
        error: function(error) {
            console.log(error);
            $('#stopReceiveMessage')
                .addClass('alert-danger')
                .removeClass('alert-success')
                .html('Error has occurred, please contact the administrator.')
                .removeClass('d-none');
        }
    });
});

