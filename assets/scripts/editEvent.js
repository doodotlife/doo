"user strict"

$(document).ready(function() {
    $(".timeRow").hide();
    $(".timeRow").find("input").val("00:00");
    $("label[for=typeD]").on("click", function() {
        $(".timeRow").show();
    });

    $("label[for=typeA]").on("click", function() {
        $(".timeRow").hide();
        $(".timeRow").find("input").val("00:00");
    });

    $("#editDate").on("click", function() {
        $(".dateHintRow").show();
    }, function() {
        $(".dateHintRow").hide();
    });
});
