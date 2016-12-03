"use strict"

$(document).ready(function() {
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

    $(".deleteComment").on("click", function() {
        if (confirm("Are you sure you want to delete this comment?")){
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
        }
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
            success: function(res) {
                location.reload();
            }
        });
    });

});
