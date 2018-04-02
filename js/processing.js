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
    });
  }


  function parseDate(data) {
    var format = d3.time.format("%Y-%m-%d");
    data = data.map(function(e) { 
      e["host_since"] = format.parse(e["host_since"]);
      return e;
    });
  }


  function filterColumns(data){
    
  }

