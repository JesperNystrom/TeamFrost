var health;



function ajax() {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            health = JSON.parse(xmlHttp.responseText);

            console.log(health)
        }
    }
    xmlHttp.open("GET", "/getHealth", true); // true for asynchronous
    xmlHttp.send(null);


};

window.onload = function() {ajax()};