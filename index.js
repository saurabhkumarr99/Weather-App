$(document).ready(function () {

    $('#show_weather').click(show_weather);
});

var collection = Backbone.Collection.extend();
var cities = new collection([]);
var city_model = Backbone.Model.extend();

function show_weather() {
    var city = document.getElementById("city").value;
    fetch_weather(city);
}

function fetch_weather(city){
    var url = "https://api.weatherapi.com/v1/current.json?key=9670802591684e9f88e63255220510&q=" + city + "&aqi=no";
    fetch(url).then((response) => response.json())
        .then((data) => {
            sessionStorage.setItem("myData", JSON.stringify(data));
        });
    myData = sessionStorage.getItem("myData");
    destructure(myData);
}

function destructure(myData) {

    let data = JSON.parse(myData);
    let { location, current } = data;
    document.getElementById("container1_1").style.display = "block";
    document.getElementById("container1_1").innerHTML = `Last Updated : ${current.last_updated}  <br>
    City : ${location.name} <br> State : ${location.region} <br> Country : ${location.country} <br>
    Temperature : ${current.temp_c}  <br> Weather :${current.condition.text} <br> Humidity :${current.humidity}<br>`;

    let btn = document.createElement("button");
    btn.className = "button";
    btn.innerHTML = "Add City"
    btn.setAttribute("onclick", "add_city()");
    document.getElementById("container1_1").appendChild(btn);

}


function add_city() {
    let myData = sessionStorage.getItem("myData");
    let data = JSON.parse(myData);

    document.getElementById("container2").style.display = "block";

    var city = new city_model();
    city.set({
        "Last_Updated": data.current.last_updated,
        "Country": data.location.country,
        "State": data.location.region,
        "City": data.location.name,
        "Weather": data.current.condition.text,
        "Humidity": data.current.humidity,
        "Temperature": data.current.temp_c,
        "wind": data.current.wind_kph,
    });
    cities.add(city);
    Create_view();

}


var view = Backbone.View.extend({
    render: function () {
        display(this.collection);
    }
});

function Create_view() {

    var cities_view = new view({
        collection: cities,
    });

    cities_view.render();

}

function display(cities_collection) {
    document.getElementById("tbody").innerHTML = "";

    cities_collection.forEach(function (ct, index) {
        document.getElementById("time").innerHTML="Last Updated : "+ct.get("Last_Updated");
        var tr = document.createElement("tr");

        var td1 = document.createElement("td");
        td1.innerHTML = index + 1;
        tr.appendChild(td1);

        var td2 = document.createElement("td");
        td2.innerHTML = ct.get("Country");
        tr.appendChild(td2);

        var td3 = document.createElement("td");
        td3.innerHTML = ct.get("State");
        tr.appendChild(td3);

        var td4 = document.createElement("td");
        td4.innerHTML = ct.get("City");
        tr.appendChild(td4);

        var td5 = document.createElement("td");
        td5.innerHTML = ct.get("Temperature");
        tr.appendChild(td5);

        var td6 = document.createElement("td");
        td6.innerHTML = ct.get("wind");
        tr.appendChild(td6);

        var td7 = document.createElement("td");
        td7.innerHTML = ct.get("Weather");
        tr.appendChild(td7);

        var td8 = document.createElement("td");
        td8.innerHTML = ct.get("Humidity");
        tr.appendChild(td8);

        var button2 = document.createElement("button");
        button2.innerHTML = ("Delete");
        button2.setAttribute("onclick", "dlt(" + index + ")");
        button2.style.backgroundColor = "#c64343";
        tr.appendChild(button2);

        document.getElementById("tbody").appendChild(tr);
    });
}

function dlt(id) {
    cities.remove(cities.at(id));
    display(cities);
}
