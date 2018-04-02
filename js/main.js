


  var map = L.map('map');
  var startDate = new Date("2009-01-01");
  var endDate = new Date("2016-04-01");
  var secondsInDay = 60 * 60 * 24;
  var date_interpolator = d3.interpolateDate(startDate, endDate);

  var nb_step_animation = 600;
  var listing_data;
  var heatLayer;

  var mapAnimatedOnce = false;

  var data_ready = false;
  /***** Chargement des données *****/
  var queue = d3.queue()
    .defer(d3.csv, "./data/listings.csv")
    .awaitAll(function (error, results) {
      if (error || results.length !== 1) {
        throw error;
      }
      var listing_2016 = results[0];


      /***** Prétraitement des données *****/
      createLatLngPoints(listing_2016);
      parseDate(listing_2016);
      //convertNumbers(data);
      listing_data = listing_2016;
      //var sources = createSources(data);

      /***** Initialisation de la carte *****/
      initTileLayer(L, map);
      var mapSvg = initSvgLayer(map,  $("#map"));

      /**** Traite et ajoute les points necessaires à la HeatMap ***/
      var heatMapData = getHeatMap(listing_2016);
      heatLayer = L.heatLayer(heatMapData, {maxZoom: 5, radius: 6.8,blur: 8.6,minOpacity:0.6, gradient : {0.0: 'white', 0.95: '#FF5A5F' , 1:'#BD0202'}});
      map.addLayer(heatLayer);

      /********  Création du slider pour la map *********/
      
      // Création du slider
      var slider = d3.select('#map_slider').call(d3.slider()
        .axis(true).min(startDate).max(endDate).step(secondsInDay)
        .on("slide", function(evt, value) {
          slideMapUpdate(listing_2016, heatLayer ,value);
        })
      );
      // Initialise à la première date
      slideMapUpdate(listing_2016, heatLayer ,startDate);


      //}

    }) 
    /********* ANIMATE FUNCTION WHEN SCROLLING *******/

    // Animate timeline map
    // including: slider, heatMap
    function animateMap(){
      if(!mapAnimatedOnce){
        var time = 1;
        var step = 1 / nb_step_animation;
        var t = 0;
        var interval = setInterval(function() { 
           if (time <= nb_step_animation) { 
              time++;
              t += step;
              slideMapUpdate(listing_data, heatLayer ,date_interpolator(t));
              $("#handle-one").css('left', t*100+"%");
           }
           else { 
              clearInterval(interval);
           }
        }, 25);
        mapAnimatedOnce = true;
      }
    }


