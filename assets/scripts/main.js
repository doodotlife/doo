"use strict"

// http://jsfiddle.net/Mottie/xcqpF/1/light/
function rgb2hex(rgb) {
    rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return (rgb && rgb.length === 4) ? "#" +
        ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
}

// https://24ways.org/2010/calculating-color-contrast/
let getContrastYIQ = function(hexcolor) {
    hexcolor = rgb2hex(hexcolor);
    console.log(hexcolor);
    var r = parseInt(hexcolor.substr(1, 2), 16);
    var g = parseInt(hexcolor.substr(3, 2), 16);
    var b = parseInt(hexcolor.substr(5, 2), 16);
    var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    console.log("yiq: " + yiq);
    if (yiq >= 128) {
        console.log("black");
        return "black";
    } else {
        console.log("white");
        return "white";
    }
}

let resHandler = function(status, s) {

    if (status == "Success") {
        $("#message").text(s);
        // $("#handlerIcon").src = "images/success.svg";
        $("#resHandler").removeClass("error");
        $("#resHandler").addClass("success");
        $("#resHandler").show().delay(3000).fadeOut();
    } else {
        $("#message").text(s);
        // $("#handlerIcon").src = "images/warning.svg";
        $("#resHandler").removeClass("success");
        $("#resHandler").addClass("error");
        $("#resHandler").show().delay(3000).fadeOut();
    }
};

$(document).ready(function() {

    if (("standalone" in window.navigator) && window.navigator.standalone) {
        // For iOS Apps
        $('a').on('click', function(e) {
            e.preventDefault();
            var new_location = $(this).attr('href');
            if (new_location != undefined && new_location.substr(0, 1) != '#' && $(this).attr('data-method') == undefined) {
                window.location = new_location;
            }
        });
    };

    $('#right').css("color", getContrastYIQ($("body").css("background-color")));
    // $('.cls-1').css("color", getContrastYIQ($("body").css("background-color")));
    // $(".cls-1").style.fill="red";
    $("#logo").attr('style', "fill:"+ getContrastYIQ($("body").css("background-color")));
    // $("#logo").attr('style', "fill: red");
    $('.headingText').css("color", getContrastYIQ($("body").css("background-color")));

    // $(".commentBar").hide();
    $("#titleEntry").on("click", function() {
        $("#timeRow").hide();
        // $("#addTable").addClass("expandUp");
        $("#titleEntry").prop("placeholder", "Title");
        $("#feeds").css("margin-top", "230px");
        $("#addTable").show();
        $("#addTable").css({
            "height": "170",
            "padding": "20 20"
        });
        $('html').one('click', function() {
            $("#titleEntry").prop("placeholder", "New Event");
            $("#feeds").css("margin-top", "10px");
            $("#addTable").css({
                "height": "0px"
            });
            $("#addTable").hide();
            $("#addTable").css({
                "padding": "0 20"
            });
        });
        event.stopPropagation();
    });

    $("#addTable").on("click", function() {
        event.stopPropagation();
    });

    $("label[for=typeD]").on("click", function() {
        $("#addTable").css({
            "height": "212",
            "padding": "20 20"
        });
        $("#feeds").css("margin-top", "272px");
        $("#timeRow").show();
    });

    $("label[for=typeA]").on("click", function() {
        $("#timeRow").hide();
        $("#addTable").css({
            "height": "170",
            "padding": "20 20"
        });
        $("#feeds").css("margin-top", "230px");
        $("#timeRow").find("input").val("00:00");
    });

    $(".deleteEvent").on("click", function() {
        let id = this.closest(".event").id;
        if (confirm("Are you sure you want to delete this Event?")) {
            $.ajax({
                url: '/event',
                type: 'delete',
                dataType: 'text',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify({
                    event: id,
                }),
                success: function(res) {
                    console.log(res);
                    resHandler(res, res);
                    if (res == "Success") {
                        $("#" + id).removeClass("event");
                        $("#" + id).css("padding", "20");
                        $("#" + id).html("<p style='color:black'>Deleted</p>")
                        $("#" + id).delay(3000).fadeOut();
                    }
                }
            });
        }
    });
    $(".deleteUser").on("click", function() {
        let id = this.closest(".user").id;
        if (confirm("Are you sure you want to delete this user?")) {
            $.ajax({
                url: '/account',
                type: 'delete',
                dataType: 'text',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify({
                    id: id,
                }),
                success: function(res) {
                    console.log(res);
                    resHandler(res, res);
                    if (res == "Success") {
                        $("#" + id).removeClass("user");
                        $("#" + id).css("padding", "20");
                        $("#" + id).html("<p style='color:black'>Deleted</p>")
                        $("#" + id).delay(3000).fadeOut();
                    }
                }
            });
        }
    });
    // $(".moreComment").on("click", function() {
    //     let id = this.closest(".event").id;
    //     $.ajax({
    //         url: '/event',
    //         type: 'get',
    //         dataType: "text",
    //         contentType: "text",
    //         data: "event=" + id,
    //     });
    // });

    // $("#newEvent").submit(function(e) {
    //     e.preventDefault();
    //
    //     let newEvent = {};
    //     newEvent.title = $("#titleEntry").val();
    //     newEvent.time = $("#timeEntry").val();
    //     newEvent.type = $("input[name=type]:checked").val();
    //     newEvent.private = $("input[name=private]:checked").val();
    //     let newReq = {};
    //     newReq.user = "583907353f48805ef162143a";
    //     newReq.event = newEvent;
    //     $.post('/event', newReq);
    //     // location.reload(false);
    // });

    $("#cancelAdd").on("click", function() {

        $("#titleEntry").prop("placeholder", "New Event");
        $("#feeds").css("margin-top", "10px");
        $("#addTable").css({
            "height": "0px",
            "padding": "0 20"
        });
    });

    $(".doPlus1").on("click", function(e) {
        e.preventDefault();
        let id = this.closest(".event").id;
        $.ajax({
            url: "/plusone",
            type: "POST",
            dataType: "text",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                event: id
            }),
            success: function(res) {
                console.log(res);
                let value = parseInt(res);


                if (value > 0) {
                    $("#" + id).find(".plus1ButtonText").html(value);
                    $("#" + id).find(".doPlus1").addClass("liked");
                } else {
                    $("#" + id).find(".plus1ButtonText").html(0 - value);
                    $("#" + id).find(".doPlus1").removeClass("liked");
                }
            }

        });
    })

    // $(".eventBody").on("click", function(e) {
    //     let id = this.closest(".event").id;
    //     $.ajax({
    //         url: "/event?event=" + id,
    //         type: "GET",
    //         dataType: "html",
    //         // contentType: "application/json; charset=utf-8",
    //         // data:comment,
    //         success: function(res) {
    //             $(document.body).html(res);
    //         }
    //     });
    //     // $.get("/event?event=" + id);
    //     //  window.reload("/event?event=" + id);
    // });

    $(".eventBody").hover(function(e) {
        let id = this.closest(".event").id;
        $("#" + id).css("padding", "30 20 30 20");
        // $.get("/event?event=" + id);
        //  window.reload("/event?event=" + id);
    }, function(e) {
        let id = this.closest(".event").id;
        $("#" + id).css("padding", "20 20 0 20");
    });

    // $(".getEvent").on("click", function(e) {
    //     let id = this.closest(".event").id;
    //     $.ajax({
    //         url: "/event?event=" + id,
    //         type: "GET",
    //         dataType: "html",
    //         // contentType: "application/json; charset=utf-8",
    //         // data:comment,
    //         success: function(res) {
    //             $(document.body).html(res);
    //         }
    //     });
    //     // $.get("/event?event=" + id);
    //     //  window.reload("/event?event=" + id);
    // });

    $(".follow").on("click", function(e) {
        e.preventDefault();
        let username = this.closest(".user").id;
        $.ajax({
            url: "/follow",
            type: "post",
            dataType: "text",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                following: username
            }),
            success: function(res) {
                console.log(res);
                resHandler(res, res);
                $("#" + username ).find(".follow").hide();
                $("#" + username ).find(".unfollow").show();
            }
        });
    });

    $(".unfollow").on("click", function(e){
        e.preventDefault();
        console.log("unfollow");
        let username = this.closest(".user").id;
        $.ajax({
            url: "/unfollow",
            type: "post",
            dataType: "text",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                following: username
            }),
            success: function(res) {
                console.log(res);
                resHandler(res, res);
                $("#" + username ).find(".unfollow").hide();
                $("#" + username ).find(".follow").show();
            }
        });
    });

    $(".showFollowers").on("click", function(event) {
        $(".events").hide();
        $(".followers").show();
    })

    $(".showEvents").on("click", function(event) {
        $(".followers").hide();
        $(".events").show();
    })

    $('#color').on("change", function(event) {
        $("body").css("background-color", $('#color').val());
        let YIQ = getContrastYIQ($("body").css("background-color"))
        $('#right').css("color", YIQ);
        $("#logo").attr('style', "fill:"+ YIQ);
        $('.headingText').css("color", YIQ);
    });

    $(".back").on("click", function() {
        window.history.back();
    });

    $("#addButton").on("click", function() {
        $("#newEvent").submit();
    });
});
