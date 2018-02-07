// settings
const client = filestack.init("ACURxPQQTwCwLZKevYKOWz");
const API_SUBMIT_ENDPOINT = 'sample/api';
const API_GET_ENDPOINT = 'assets/sample_data.json';

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
            $('#uploadButtonDiv').addClass("d-none");
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
        url: API_SUBMIT_ENDPOINT,
        type: "POST",
        data: formValues,
        success: function(response) {
            $('#successSubmit').removeAttr('d-none');
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
    $.ajax({
        url: API_GET_ENDPOINT,
        type: 'GET',
        success: function(data) {
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    var datum = data[key];

                    if (typeof datum === 'object') {
                        for (var i = 0; datum.length > i ; i++) {
                            $('input[name="' + key + '"][value="' + datum[i] + '"]').prop('checked', true);
                        }
                    } else {
                        var input = $('input[name=' + key + ']');

                        if (input.length === 0) {
                            // then it's textarea
                            $('textarea[name=' + key + ']').val(datum);
                        } else {
                            if (input.attr('type') === 'radio') {
                                input.click();
                            } else if (input.attr('type') === 'checkbox') {
                                input.prop('checked', true);
                            } else {
                                $('input[name=' + key + ']').val(datum);
                            }
                        }
                    }
                }
            }
        }
    });
});