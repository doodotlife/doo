"use strict"

let index = {}

$(document).ready(function() {
    let today = new Date();
    let month = today.getMonth() + 1;
    $('#dateEntry').prop("max", today.getFullYear() + '-' + month + '-' + today.getDate());
});
