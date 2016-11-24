












$(document).ready(function() {

    $("#titleEntry").on("click", function() {
        $("#addTable").addClass("expandUp");
        $("#titleEntry").prop("placeholder", "Title");
    });

    $("#newEvent").submit( function(e) {
        e.preventDefault();

        let newEvent = {};
        newEvent.title = $("#titleEntry").val();
        newEvent.time = $("#timeEntry").val();
        newEvent.type = $("input[name=type]:checked").val();
        newEvent.private = $("input[name=private]:checked").val();
        let newReq = {};
        newReq.user = "5836a530597db1297c3894a2";
        newReq.event = newEvent;
        $.post('/event', newReq);
        // location.reload(false);
    });

    $("#cancelAdd").on("click", function() {
        $("#addTable").removeClass("expandUp");
        $("#addTable").hide();
        // $("input").val('');
    });
     // Stuff to do as soon as the DOM is ready
});
