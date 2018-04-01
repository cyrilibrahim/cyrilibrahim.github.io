
(function (L, d3) {
  "use strict";

  var map = L.map('map');


  /***** Chargement des données *****/
  d3.queue()
    .defer(d3.csv, "./data/listing_montreal_2016.csv")
    .awaitAll(function (error, results) {
      if (error || results.length !== 1) {
        throw error;
      }
      var listing_2016 = results[0];

      createLatLngPoints(listing_2016);

      /***** Prétraitement des données *****/
      //convertNumbers(data);
      //var sources = createSources(data);

      /***** Initialisation de la carte *****/
      initTileLayer(L, map);
      var mapSvg = initSvgLayer(map,  $("#map"));

      // Add necessary point to the heatmap
      var heatMapData = getHeatMap(listing_2016);

      //addListingToMap(mapSvg, listing_2016, map);
      console.log(heatMapData);
      var heatLayer = L.heatLayer(heatMapData, {maxZoom: 5, radius: 6,blur: 8,gradient : {0.4: 'white', 0.65: '#0013BD', 1: '#FF5A5F'}});
      map.addLayer(heatLayer);

    })

})(L, d3);
