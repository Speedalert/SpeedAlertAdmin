var lat = 0;
var lng = 0;

function initMap() {

  const location = { lat: lat, lng: lng };
  const map = new google.maps.Map(document.getElementById("map"), {zoom:20, center: location,});
  const marker = new google.maps.Marker({position: location, map: map, icon: 'img/taxi.png'});

}

function initMaps(lati, longi) {

  var x = Number(lati);
  var y = Number(longi);
  const location = { lat: x, lng: y };
  const geocoder = new google.maps.Geocoder();
  const info = new google.maps.InfoWindow();
  const map = new google.maps.Map(document.getElementById("map"), {zoom:20, center: location,});
  geocode(geocoder, map, info, location);

}

function geocode(geocoder, map, info, latlng){

  geocoder
  .geocode({ location: latlng })
  .then((response) => {
    if(response.results[0]){

      const marker = new google.maps.Marker({position: latlng, map: map, icon: 'img/taxi.png'});
      info.setContent(response.results[0].formatted_address);
      info.open(map, marker);
    }
    else {
      console.log("On geocode: No results found!");
    }
  })
  .catch((e) => console.log("Geocoder failed due to: " + e));
}

document.getElementById('dataTable').onclick = function(event){

  let dataTr = event.target.parentNode;
  let location = dataTr.querySelectorAll("td")[4].innerText;
  var array = location.split(" ,");
  initMaps(array[0], array[1]);
  
}