"use strict"

// http://jsfiddle.net/Mottie/xcqpF/1/light/
function rgb2hex(rgb){
 rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
 return (rgb && rgb.length === 4) ? "#" +
  ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
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
    $('#right').css("color", getContrastYIQ($("body").css("background-color")));
    $('.cls-1').css("color", getContrastYIQ($("body").css("background-color")));
    $('.headingText').css("color", getContrastYIQ($("body").css("background-color")));

    // $(".commentBar").hide();
    $("#titleEntry").on("click", function() {
        $("#timeRow").hide();
        // $("#addTable").addClass("expandUp");
        $("#titleEntry").prop("placeholder", "Title");
        $("#feeds").css("margin-top", "220px");
        $("#addTable").show();
        $("#addTable").css({
            "height": "160",
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
            "height": "202",
            "padding": "20 20"
        });
        $("#feeds").css("margin-top", "262px");
        $("#timeRow").show();
    });

    $("label[for=typeA]").on("click", function() {
        $("#timeRow").hide();
        $("#addTable").css({
            "height": "160",
            "padding": "20 20"
        });
        $("#feeds").css("margin-top", "220px");
        $("#timeRow").find("input").val("00:00");
    });

    $(".doComment").on("click", function(e) {
        let id = this.closest(".event").id;
        $("#" + id).children(".commentBar").css({
            "height": "60",
            "border-top": "1px solid #efefef"
        });
        $("#" + id).find(".doComment").addClass("closeComment");
        $("#" + id).find(".doComment").removeClass("doComment");
        // $("#" + id).children(".doComment").one('click', function() {
        //     console.log("one click");
        //     $("#" + id).children(".commentBar").css("height", "0");
        // });
    });

    $(".closeComment").on("click", function(e) {
        let id = this.closest(".event").id;
        $("#" + id).children(".commentBar").css({
            "height": "0",
            "border-top": "1px solid #FFFFFF"
        });
        $("#" + id).find(".closeComment").addClass("doComment");
        $("#" + id).find(".closeComment").removeClass("closeComment");
        // $("#" + id).children(".doComment").one('click', function() {
        //     console.log("one click");
        //     $("#" + id).children(".commentBar").css("height", "0");
        // });
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

    $(".deleteComment").on("click", function() {
        let commentID = this.closest(".comment").id;
        let eventID = this.closest(".event").id;
        $.ajax({
            url: '/comment',
            type: 'delete',
            dataType: 'text',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({
                comment: commentID,
                event: eventID
            }),
            success: function(res) {
                console.log(res);
                $('#' + commentID).remove();
            }
        });
    });

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

    $(".commentEntry").on("submit", function(e) {
        e.preventDefault();
        let comment = {};
        let id = this.closest(".event").id;
        console.log("commenting event id: " + id);
        comment.content = $("#" + id).find("input[name=content]").val()
        comment.event = id;
        $.ajax({
            url: "/comment",
            type: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(comment),
            // data:comment,
            success: function(res) {
                let newComment = $('<div>');
                newComment.id = res.comment._id;
                newComment.addClass("comment");
                newComment.addClass("animate-opacity");
                let owner = $('<span>');
                owner.addClass("commentOwner");
                let strong = $("<strong>");
                strong.html(res.comment.owner + ": ");
                owner.append(strong);
                newComment.append(owner);
                newComment.append(res.comment.content);
                let timestamp = $("<span>")
                timestamp.addClass("timestamp");
                let time = new Date(parseInt(res.comment._id.toString().substring(0, 8), 16) * 1000);
                timestamp.html("" + time.getFullYear() + "-" +
                    (time.getMonth() + 1) + "-" +
                    time.getDate() + " " +
                    time.getHours() + ":" +
                    time.getMinutes());
                newComment.append(timestamp);
                let deleteButton = $("<a class='deleteComment' role='button'><span class='buttonText'>Delete<span></a>");
                deleteButton.on("click", function() {
                    let eventID = this.closest(".event").id;
                    $.ajax({
                        url: '/comment',
                        type: 'delete',
                        dataType: 'text',
                        contentType: 'application/json; charset=utf-8',
                        data: JSON.stringify({
                            comment: newComment.id,
                            event: eventID
                        }),
                        success: function(res) {
                            console.log(res);
                            $('#' + newComment.id).remove();
                        }
                    });
                });
                newComment.append(deleteButton);
                //     <span class="commentOwner"><strong>{{comment.owner}}: </strong></span>{{comment.content}} {% if session.event_owner == session.username %}
                //     <span class="timestamp">
                //             {{comment.timestamp.getFullYear()}}-{{comment.timestamp.getMonth() + 1}}-{{comment.timestamp.getDate()}} {{comment.timestamp.getHours()}}:{{comment.timestamp.getMinutes()}}
                //         </span>
                //     <button class="deleteComment">Delete</button> {% elif comment.owner == session.username %}
                //     <button class="deleteComment">Delete</button> {% endif %}
                // </div>
                $("#comments").prepend(newComment);
                $("#" + id).find(".commentButtonText").html(res.count + " Comments");
                $("#" + id).find("input[name=content]").val("");
            }
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
        $('.cls-1').css("color", YIQ);
        $('.headingText').css("color", YIQ);
    });

    $(".back").on("click", function() {
        window.history.back();
    });
    // let events = $(".animate-opacity");
    // for (var i = 0; i < events.length; i++) {
    //     events[i].delay(i * 1000);
    // }

    // $(".topBar").on("scroll", function(e) {
    //
    //     if (this.scrollTop > 147) {
    //         $(".topBar").addClass("fix-search");
    //     } else {
    //         $(".topBar").removeClass("fix-search");
    //     }
    // });
    // $("button").click(function(){
    //     $("#div1").delay("slow").fadeIn();
    //     $("#div2").delay("fast").fadeIn();
    //     $("#div3").delay(800).fadeIn();
    //     $("#div4").delay(2000).fadeIn();
    //     $("#div5").delay(4000).fadeIn();
    //   });
    // $.post('/events');
    // Stuff to do as soon as the DOM is ready
});
