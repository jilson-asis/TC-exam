if(navigator.userAgent.match(/IEMobile\/10\.0/)){
    var msViewportStyle = document.createElement("style");

    msViewportStyle.appendChild(
        document.createTextNode(
            "@-ms-viewport{width:auto!important}"
        )
    );

    document.getElementsByTagName("head")[0].appendChild(msViewportStyle);
}

var fsClient;
var upload = [];

$(window).load(function(){
    $("body").click(function(e){
        if(!$(e.target).closest("#case-info div.line div.block div.select input").length && !$(e.target).closest("#case-info div.line div.block div.select i").length && !$(e.target).closest("#case-info div.line div.block div.select ul").length){
            $("#case-info div.line div.block div.select ul").removeAttr("style");
        }
    });

    fsClient = filestack.init("ACURxPQQTwCwLZKevYKOWz");

    $("#case-header-contact div.block div.upload-button").click(function(){
        openPicker();
    });

    $("#case-info div.line div.block div.submit").click(function(){
        var _this = $(this);

        if(!_this.hasClass("disabled")){
            _this.addClass("disabled");

            $(".attention").removeClass("attention");
            $("#case-info div.line div.block div.message").empty().removeAttr("style");

            var type_services_needed = [];

            $("#case-info div.line div.block div.services div.checkbox.active").each(function(){
                type_services_needed.push($(this).find("span").text());
            });

            var care_options = [];

            $("#case-info div.line div.block div.options div.checkbox.active").each(function(){
                care_options.push($(this).find("span").text());
            });

            var days_per_week = [];

            $("#case-info div.line div.block div.days div.checkbox.active").each(function(){
                days_per_week.push($(this).find("span").text());
            });

            var special_conditions = [];

            $("#case-info div.line div.block div.conditions div.checkbox.active").each(function(){
                special_conditions.push($(this).find("span").text());
            });

            var time_of_day = "";

            if($("#case-info div.line div.block div.assessment i.am.active").length){
                time_of_day = "am";
            }

            if($("#case-info div.line div.block div.assessment i.pm.active").length){
                time_of_day = "pm";
            }

            $.ajax("lib/save.php", {
                type: "POST",
                data: {
                    case_id: $("input[name=case_id]").val(),
                    doctors_order: upload,
                    contact_person_name: $("input[name=contact_person_name]").val(),
                    patient_name: $("input[name=patient_name]").val(),
                    relationship: $("input[name=relationship]").val(),
                    age: $("input[name=age]").val(),
                    zip_code: $("input[name=zip_code]").val(),
                    address: $("input[name=address]").val(),
                    contact_phone: $("input[name=contact_phone]").val(),
                    email: $("input[name=email]").val(),
                    service_needed: $("input[name=service_needed]").val(),
                    about_services_needed: $("textarea[name=about_services_needed]").val(),
                    type_services_needed: type_services_needed,
                    care_options: care_options,
                    number_of_hours_per_day: $("input[name=number_of_hours_per_day]").val(),
                    days_per_week: days_per_week,
                    special_conditions: special_conditions,
                    preferred_gender: $("input[name=preferred_gender]").val(),
                    language: $("input[name=language]").val(),
                    starting_date: $("input[name=starting_date]").val(),
                    payment_method: $("input[name=payment_method]").val(),
                    primary_insurance_type: $("input[name=primary_insurance_type]").val(),
                    primary_insurance_company_name: $("input[name=primary_insurance_company_name]").val(),
                    secondary_insurance_type: $("input[name=secondary_insurance_type]").val(),
                    secondary_insurance_company_name: $("input[name=secondary_insurance_company_name]").val(),
                    requested_price: $("input[name=requested_price]").val(),
                    initial_assessment_date: $("input[name=initial_assessment_date]").val(),
                    initial_assessment_time: $("input[name=initial_assessment_time]").val(),
                    time_of_day: time_of_day
                },
                success: function(data){
                    var json = $.parseJSON(data);

                    if(json.result){
                        if(parseInt($("input[name=case_id]").val())){
                            alert("The case was updated successfully.");
                        }else{
                            $("#form-background, #form-done").css("display", "block");
                        }
                    }else{
                        _this.removeClass("disabled");

                        for(var key in json.attention){
                            if(json.attention[key] == "contact_person_name"){
                                $("input[name=contact_person_name]").addClass("attention");
                            }

                            if(json.attention[key] == "zip_code_address"){
                                $("input[name=zip_code], input[name=address]").addClass("attention");
                            }

                            if(json.attention[key] == "contact_phone"){
                                $("input[name=contact_phone]").addClass("attention");
                            }

                            if(json.attention[key] == "email"){
                                $("input[name=email]").addClass("attention");
                            }

                            if(json.attention[key] == "service_needed"){
                                $("input[name=service_needed]").addClass("attention");
                            }

                            if(json.attention[key] == "type_services_needed"){
                                $("#case-info div.line div.block div.services").addClass("attention");
                            }

                            if(json.attention[key] == "number_of_hours_per_day"){
                                $("input[name=number_of_hours_per_day]").addClass("attention");
                            }

                            if(json.attention[key] == "days_per_week"){
                                $("#case-info div.line div.block div.days").addClass("attention");
                            }

                            if(json.attention[key] == "starting_date"){
                                $("input[name=starting_date]").addClass("attention");
                            }

                            if(json.attention[key] == "payment_method"){
                                $("input[name=payment_method]").addClass("attention");
                            }

                            if(json.attention[key] == "primary_insurance_type"){
                                $("input[name=primary_insurance_type]").addClass("attention");
                            }

                            if(json.attention[key] == "initial_assessment_date"){
                                $("input[name=initial_assessment_date]").addClass("attention");
                            }

                            if(json.attention[key] == "initial_assessment_time"){
                                $("input[name=initial_assessment_time]").addClass("attention");
                            }
                        }

                        for(var key in json.message){
                            $("#case-info div.line div.block div.message").append("<span>" + json.message[key] + "</span>");
                        }

                        $("#case-info div.line div.block div.message").css("display", "block");
                    }
                }
            });
        }
    });

    $("#case-info div.line div.block div.assessment i.am").click(function(){
        if(!$(this).hasClass("active")){
            $(this).addClass("active").next().removeClass("active");
        }
    });

    $("#case-info div.line div.block div.assessment i.pm").click(function(){
        if(!$(this).hasClass("active")){
            $(this).addClass("active").prev().removeClass("active");
        }
    });

    $("input[name=age]").bind({
        contextmenu: false,
        paste: false,
        keyup: function(){
            var input = $(this).val().match(/[0-9]+/g);

            if(input != null && parseInt($(this).val()) && parseInt($(this).val()) <= 130){
                $(this).val(input);
            }else{
                $(this).val("");
            }
        }
    });

    $("input[name=zip_code]").bind({
        contextmenu: false,
        paste: false,
        keyup: function(){
            var _this = $(this);
            var input = _this.val().match(/[0-9]+/g);

            if(input != null){
                _this.val(input);

                if(_this.val().length == 5){
                    (new google.maps.Geocoder()).geocode({"address": "USA " + _this.val()}, function(results, status){
                        if(status == google.maps.GeocoderStatus.OK){
                            var components = results[0].address_components;

                            var city, region, nbhood = "";

                            for(var key in components){
                                if(components[key].types[0] == "locality"){
                                    city = components[key].long_name;
                                }

                                if(components[key].types[0] == "administrative_area_level_1"){
                                    region = components[key].long_name;
                                }

                                if(components[key].types[0] == "neighborhood"){
                                    nbhood = components[key].long_name;
                                }
                            }

                            if(!city){
                                city = nbhood;
                            }

                            if(city && region){
                                $("input[name=address]").val(city + ", " + region + ", " + _this.val());
                            }
                        }
                    });
                }
            }else{
                _this.val("");

                $("input[name=address]").val("");
            }
        }
    });

    $("input[name=contact_phone]").bind({
        contextmenu: false,
        paste: false,
        keyup: function(){
            var input = $(this).val().replace("+1", "").match(/[0-9]+/g);

            if(input != null){
                var data = input.join("").split("");
            }else{
                var data = [];
            }

            var phone = "";

            for(var i = 0; i < data.length; i++){
                phone += (!i ? "+1 (" : "") + (i == 3 ? ") " : "") + (i == 6 ? "-" : "") + data[i];
            }

            $(this).val(phone);
        }
    });

    $("input[name=number_of_hours_per_day]").bind({
        contextmenu: false,
        paste: false,
        keyup: function(){
            var input = $(this).val().match(/[0-9]+/g);

            if(input != null && parseInt($(this).val()) && parseInt($(this).val()) <= 24){
                $(this).val(input);
            }else{
                $(this).val("");
            }
        }
    });

    $("input[name=requested_price]").bind({
        contextmenu: false,
        paste: false,
        keyup: function(){
            var input = $(this).val().match(/[0-9]+/g);

            if(input != null && parseInt($(this).val())){
                $(this).val(input);
            }else{
                $(this).val("");
            }
        }
    });

    $("input[name=starting_date], input[name=initial_assessment_date]").datepicker({
        dateFormat: "mm.dd.yy"
    });

    $("input[name=initial_assessment_time]").timepicker({
        showPeriodLabels: false,
        hours: {
            starts: 0,
            ends: 12
        }
    });

    $("#case-info div.line div.block div.checkbox").click(function(){
        if($(this).hasClass("active")){
            $(this).removeClass("active");
        }else{
            $(this).addClass("active");
        }
    });

    $("#case-info div.line div.block div.select").find("input, i").click(function(){
        $("#case-info div.line div.block div.select ul").removeAttr("style");

        $(this).parent().find("ul").css("display", "block");
    });

    $("#case-info div.line div.block div.select ul li").click(function(){
        $(this).parent().removeAttr("style").find("li").removeAttr("class");

        if($(this).text() == "= Relationship =" || $(this).text() == "= Choose here =" || $(this).text() == "= Primary Insurance =" || $(this).text() == "= Secondary Insurance ="){
            $(this).parents("div.select").find("input").val("");
        }else{
            $(this).addClass("active").parents("div.select").find("input").val($(this).text());
        }

        if($(this).parents("div.block").prev().hasClass("other")){
            if($(this).text() == "Other"){
                $("#case-info div.line div.block div.select.other, #case-info div.line div.block input.other").css("display", "inline");
                $("#case-info div.line div.block.other").addClass("top");
            }else{
                if(!$(this).parents("div.select").hasClass("other")){
                    $("#case-info div.line div.block div.select.other input").val("");
                    $("#case-info div.line div.block div.select.other ul li").removeAttr("class");
                    $("#case-info div.line div.block input.other").val("");

                    $("#case-info div.line div.block div.select.other, #case-info div.line div.block input.other").removeAttr("style");
                    $("#case-info div.line div.block.other").removeClass("top");
                }
            }
        }
    });

    $("#answer div.line div.block div.question strong").click(function(){
        var has = $("i[data-answer=" + $(this).attr("data-answer") + "]").hasClass("bottom");

        $("#answer div.line div.block div.answer").removeAttr("style");
        $("#answer div.line div.block i").removeClass("top").addClass("bottom");

        if(has){
            $("i[data-answer=" + $(this).attr("data-answer") + "]").removeClass("bottom").addClass("top");

            $("#answer div.line div.block div.answer." + $(this).attr("data-answer")).css("display", "block");
        }
    });

    $("#answer div.line div.block i").click(function(){
        var has = $(this).hasClass("bottom");

        $("#answer div.line div.block div.answer").removeAttr("style");
        $("#answer div.line div.block i").removeClass("top").addClass("bottom");

        if(has){
            $(this).removeClass("bottom").addClass("top");

            $("#answer div.line div.block div.answer." + $(this).attr("data-answer")).css("display", "block");
        }
    });

    $("#question input").keyup(function(){
        if($(this).val()){
            $(this).parent().addClass("active");
        }else{
            $(this).parent().removeAttr("class");
        }
    });

    $("#question i").click(function(){
        var _this = $(this);

        _this.parent().removeClass("active").addClass("send");

        $.ajax("lib/feedback.php", {
            type: "POST",
            data: {
                comment: $("#question input").val()
            },
            success: function(result){
                setTimeout(function(){
                    $("#question input").val("");

                    _this.parent().removeAttr("class");
                }, 2000);
            }
        });
    });

    $("#form-done-body i").click(function(){
        location = $("base").attr("href") + "?profile=dashboard";
    });
});

function openPicker(){
    fsClient.pick({
        fromSources: ["local_file_system", "imagesearch", "facebook", "instagram", "dropbox"],
        accept: ["image/*", ".pdf"],
        maxSize: 102400000,
        maxFiles: 10,
        minFiles: 1
    }).then(function(response){
        var files = response.filesUploaded;

        for(var key in files){
            upload.push(files[key].url);
        }
    });
}