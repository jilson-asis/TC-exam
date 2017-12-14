(function() {
    'use strict';

    window.addEventListener('load', function() {
        var form = document.getElementById('app-form');
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            if (form.checkValidity() === false) {
                event.stopPropagation();
            } else {
                submitAppForm();
            }
            form.classList.add('was-validated');
        }, false);
    }, false);
})();

function getFormData($form){
    var unindexed_array = $form.serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function(n, i){
        indexed_array[n['name']] = n['value'];
    });

    return indexed_array;
}

function submitAppForm() {
    var formValues = getFormData($('#app-form'));

    axios.post('assets/response.json', formValues)
    .then(function (response) {
        console.log(response);
    })
    .catch(function (error) {
        console.log(error);
    });

    // verify phone number, using only mocked data
    // axios.post('https://api.authy.com/protected/json/phones/verification/start', {
    axios.post('assets/twilio_start.json', {
        api_key: 'XXXXX',
        via: 'sms',
        phone_number: formValues.phone,
        country_code: '99'
    })
    .then(function (response) {
        console.log(response);
    })
    .catch(function (error) {
        console.log(error);
    });

    $('#confirm-number-value').html(formValues.phone);
    $('#confirmNumber').modal('show');
}

$('#confirmNumber').click(function(){
    $(this).modal('hide');
    $('#congratulations').modal('show');
});