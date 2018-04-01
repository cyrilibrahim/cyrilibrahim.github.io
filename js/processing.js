"use strict";



/**
 * Convertit chacun des nombres provenant du fichier CSV en type "number".
 *
 * @param data      Données provenant du fichier CSV.
 */
function convertNumbers(data) {
  // TODO: Convertir les propriétés "id" et "votes" en type "number" pour chacun des éléments de la liste.
  data = data.map(function(e) { 
    e["id"] = parseInt(e["id"]);
    e["votes"] = parseInt(e["votes"]);
    return e;
  });
}



/* Create LatLng object for each Latitude and Longitude point */ 
function createLatLngPoints(data){
  data.forEach(function(d, i) {
      d.LatLng = new L.LatLng(d.latitude, d.longitude);
      if(Math.random() < 1){
        d.visible_zoom_14 = false;
      }else{
        d.visible_zoom_14 = true;
      }
  });
  console.log(data);
}
