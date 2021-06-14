function init() {
console.log("init")
    // Creating our initial map object
    var myMap = L.map("mapid", {
        center: [54.5260, -15.2551],
        zoom: 2
    });

    // Adding a tile layer (map background)
    L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/light-v10",
        accessToken: API_KEY
    }).addTo(myMap);

    // Grab data with d3
    d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson', function (data) {
    
       
        console.log('data!!!!', data)
    
        // Loop through the cities array and create one marker for each city object
        for (var i = 0; i < data.features.length; i++) {

            // Conditionals for countries points
            var color = "";
            if (data.features[i].geometry.coordinates[2] > 200) {
                color = "yellow";
            }
            else if (data.features[i].geometry.coordinates[2] > 75) {
                color = "blue";
            }
            else if (data.features[i].geometry.coordinates[2] > 25) {
                color = "green";
            }
            else {
                color = "red";
            }
                        
            // Add circles to map
            L.circle([data.features[i].geometry.coordinates[0],data.features[i].geometry.coordinates[1]] , {
                fillOpacity: 1,
                
                fillColor: color,
                // Adjust radius
                radius: data.features[i].properties.mag * 50000
            }).bindPopup("<h1>" + data.features[i].properties.title + "</h1> <hr> <h3>" + data.features[i].properties.mag + " " + data.features[i].properties.type + "</h3>").addTo(myMap);
        };
          
        
    })

    //adding legend
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0,25,75,200],
            labels = ['#CB2B3E','#2AAD27','#2A81CB','#FFD326'];

    //loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + labels[i]  + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

    return div;
};

legend.addTo(myMap);

};

window.addEventListener('DOMContentLoaded', init);