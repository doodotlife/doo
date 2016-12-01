"use strict"

let setting = {}

$(document).ready(function() {
    let today = new Date();
    let month = today.getMonth() + 1;
    $('#birthday').prop("max", today.getFullYear() + '-' + month + '-' + today.getDate());
});
