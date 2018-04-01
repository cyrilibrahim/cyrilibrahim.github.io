
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

      var heatLayer = L.heatLayer(heatMapData, {maxZoom: 5, radius: 5.8,blur: 7.6,minOpacity:0.6, gradient : {0.0: 'white', 0.95: '#FF5A5F' , 1:'#BD0202'}});
      map.addLayer(heatLayer);

    })

})(L, d3);
