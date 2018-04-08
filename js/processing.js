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

  function parseCalendarDate(data){
    var format = d3.time.format("%Y-%m-%d");
    data = data.map(function(e) { 
      e["key"] = format.parse(e["key"]);
      return e;
    });
  }

  function mergeReviews(listing, reviews){

    var merged_listing = {};

    var format = d3.time.format("%Y-%m-%d");

    var reviews_by_id = d3.nest()
    .key(function(d) { return d.listing_id; })
    .rollup(function(v) { return v.map(function(e){return e.date = format.parse(e.date);});})
    .entries(reviews);

    reviews_by_id.forEach(function(d){
      merged_listing[d.key] = {}
      merged_listing[d.key].values = d.values
    });

    listing.forEach(function(d){
      if(d.id in merged_listing){
        merged_listing[d.id].lat = d.latitude;
        merged_listing[d.id].lon = d.longitude;
      }
    });

    var merged_as_array = [];

    for (var key in merged_listing) {
        if(merged_listing[key].lat != null){
          var new_obj = {};
          new_obj.LatLng = new L.LatLng(merged_listing[key].lat, merged_listing[key].lon);
          new_obj.reviews = merged_listing[key].values;
          new_obj.id = key;
          new_obj.count = 0;
          merged_as_array.push(new_obj);
        }
    }

    return merged_as_array;
  }

  function filterColumns(data){
    
  }

  function getPriceBySuburb(data){

  }

