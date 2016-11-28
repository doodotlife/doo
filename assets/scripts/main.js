$(document).ready(function() {

    $("#titleEntry").on("click", function() {
        $("#addTable").addClass("expandUp");
        $("#titleEntry").prop("placeholder", "Title");
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
        $("#addTable").removeClass("expandUp");
        $("#addTable").hide();
        // $("input").val('');
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
