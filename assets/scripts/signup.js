"use strict"
let signup = {}

signup.validatePassword = function() {
    if ($("#password").val() != $("#rePassword").val()) {
        $("#rePassword").setCustomValidity("Passwords Don't Match");
    } else {
        $("#rePassword").setCustomValidity('');
    }
};

signup.errorHandler = function(error) {

};

$(document).ready(function() {
    // Stuff to do as soon as the DOM is ready
    let today = new Date();
    let month = today.getMonth()+1;
    let date = today.getDate();
    if (date < 10) {
        var dateString = '0'+ date.toString();
    }else {
        var dateString = date.toString();
    }
    $("#birthday").prop("max", today.getFullYear() + '-' + month + '-' + dateString);

    // $('#newUser').submit(function(e) {
    //     let newUser = {};
    //     newUser.username = $("#username").val();
    //     newUser.password = $("#password").val();
    //     newUser.name = $("#name").val();
    //     newUser.birthday = $("#birthday").val();
    //     newUser.gender = $("input[name=gender]:checked").val();
    //     newUser.email = $("#email").val();
    //     // newUser.notification = $("#notification:checked").val();
    //     console.log(newUser);
    //     $.ajax({
    //         url: '/signup',
    //         type: 'POST',
    //         dataType: "text",
    //         contentType: "application/json; charset=utf-8",
    //         data: JSON.stringify(newUser),
    //         success: function(res) {
    //             window.location.replace("/");
    //         },
    //         error: function(error, data) {
    //             console.log(data);
    //             signup.errorHandler(data);
    //         }
    //     });
    // });
    $("#password").onchange = signup.validatePassword;
    $("#rePassword").onkeyup = signup.validatePassword;
});
