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

//Save highscore when you die or clear boss
$.ajax({
    type: "POST",
    data: {
        score: score
    },
    url: "/setHighscore" //which is mapped to its partner function on our controller class
});

//Save state after clearing a map
$.ajax({
    type: "POST",
    data: {
        score: score,
        coins: coins,
        health: health,
        map: map,
        potions: potions
    },
    url: "/saveStateAfterClearingMap" //which is mapped to its partner function on our controller class
});

//Save state after purchase from store
$.ajax({
    type: "POST",
    data: {
        //Add outfit: outfit, later
        coins: coins,
        weapon: weapon,
        potions: potions
    },
    url: "/saveStateAfterPurchase" //which is mapped to its partner function on our controller class
});

//Get all player data
$.ajax({
    type: "GET",
    url: "/getPlayerStats", //which is mapped to its partner function on our controller class
    success: function (result) {
        coins = ["coins"];
        health = result["health"];
        score = ["score"];
        map = result["map"];
        potions = ["potions"];
        weapon = ["weapon"];
    }
});