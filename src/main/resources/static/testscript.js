var health;

$( document ).ready(function() {
    $.ajax({
        type: "GET",
        url: "/getHealth", //which is mapped to its partner function on our controller class
        success: function (result) {
            health=result; //to update the result on the web page
            console.log(health);
        }
    });
});

$("#button").on("click", function (e) {
    var stringHealth = $("#newHealth").val();
    health =  parseInt(stringHealth);

    $.ajax({
        type: "POST",
        data: {
            health: health
        },
        url: "/setNewHealth" //which is mapped to its partner function on our controller class
    });

});