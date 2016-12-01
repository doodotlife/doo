"use strict"

let setting = {}

$(document).ready(function() {
    let today = new Date();
    let month = today.getMonth() + 1;
    let date = today.getDate();
    if (date < 10) {
        var dateString = '0'+ date.toString();
    }else {
        var dateString = date.toString();
    }
    $('#birthday').prop("max", today.getFullYear() + '-' + month + '-' + dateString);
});
