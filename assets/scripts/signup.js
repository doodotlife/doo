"use strict"
let signup = {}

signup.validatePassword = function() {
    console.log("validating password");
    if ($("#password").val() != $("#rePassword").val()) {
        document.getElementById("rePassword").setCustomValidity("Passwords Don't Match");
    } else {
        document.getElementById("rePassword").setCustomValidity('');
    }
};

signup.errorHandler = function(error) {

};

$(document).ready(function() {
    // Stuff to do as soon as the DOM is ready
    let today = new Date();
    let month = today.getMonth()+1;
    let date = today.getDate();
    if (month < 10) {
        var dateString = '0'+ date.toString();
    }else {
        var dateString = date.toString();
    }
    if (date < 10) {
        var dateString = '0'+ date.toString();
    }else {
        var dateString = date.toString();
    }
    $("#birthday").prop("max", today.getFullYear() + '-' + month + '-' + dateString);
    $("#password").on("change", signup.validatePassword);
    $("#rePassword").on("keyup", signup.validatePassword);
});
