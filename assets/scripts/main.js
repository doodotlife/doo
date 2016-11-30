showCommentBar = function(e) {
    let id = e.closest(".event").id;
    $("#" + id).children(".commentBar").css("height", "60");
    e.on("click", hideCommentBar(this));
}


$(document).ready(function() {
    // $(".commentBar").hide();
    $("#titleEntry").on("click", function() {
        // $("#addTable").addClass("expandUp");
        $("#titleEntry").prop("placeholder", "Title");
        $("#feeds").css("margin-top", "250px");
        $("#addTable").css({
            "height": "225px",
            "padding": "20 20"
        });
        $('html').one('click', function() {
            $("#titleEntry").prop("placeholder", "New Event");
            $("#feeds").css("margin-top", "10px");
            $("#addTable").css({
                "height": "0px",
                "padding": "0 20"
            });
        });
        event.stopPropagation();
    });

    $("#addTable").on("click", function() {
        event.stopPropagation();
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

    $(".moreComment").on("click", function() {
        let id = this.closest(".event").id;
        $.ajax({
            url: '/event',
            type: 'get',
            dataType: "text",
            contentType: "text",
            data: "event=" + id,
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
            dataType: "text",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(comment),
            // data:comment,
            success: function(res) {

                $("#" + id).find(".commentButtonText").html(res + " Comments");
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
            data: JSON.stringify({event:id}),
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

    $(".getEvent").on("click", function(e) {
        let id = this.closest(".event").id;
        $.ajax({
            url: "/event?event=" + id,
            type: "GET",
            dataType: "html",
            // contentType: "application/json; charset=utf-8",
            // data:comment,
            success: function(res) {
                location.reload();
            }
        });
        // $.get("/event?event=" + id);
        //  window.reload("/event?event=" + id);
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
