"use strict"

$(document).ready(function() {
    // Stuff to do as soon as the DOM is ready
    $('#loginButton').click(function(e) {
        e.preventDefault;
        let body = {};
        body.username = $("input[name=username]").val();
        body.password = $("input[name=password]").val();
        console.log(body);

        $.ajax({
            url: '/login',
            type: 'POST',
            dataType: "text",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(body),
            success: function(res) {
                if (res == 'Login failed') {
                    $("#hint").text("Username or password invalid. Please try again");
                    $("#hint").show();
                } else {
                    window.location.replace("/")
                }
            },
        });
    });

    $('#signUpButton').click(function(e) {
        e.preventDefault;
        $.ajax({
            url: '/signup',
            type: 'GET'
        });
        // $.get("/signup");
    });
});
