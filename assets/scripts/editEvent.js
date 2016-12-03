"user strict"

$(document).ready(function() {
    $("label[for=typeD]").on("click", function() {
        $("#timeRow").show();
    });

    $("label[for=typeA]").on("click", function() {
        $("#timeRow").hide();
        $("#timeRow").find("input").val("00:00");
    });
});
