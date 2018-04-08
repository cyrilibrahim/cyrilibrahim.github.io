


  var map_announces = L.map('map_announces');
  var map_reviews = L.map('map_reviews');

  var startDate = new Date("2009-01-01");
  var endDate = new Date("2016-04-01");
  var secondsInDay = 60 * 60 * 24;
  var intervalReviewsAnimation = 60 * 24 * 10;
  console.log(intervalReviewsAnimation);
  var date_interpolator = d3.interpolateDate(startDate, endDate);

  var nb_step_animation = 500;
  var nb_step_animation_reviews = 500;
  var step_interval_reviews = 50;
  var mapAnnouncesAnimatedOnce = false;
  var mapReviewsAnimatedOnce = false;


  var cfg_map_announces = {
    // radius should be small ONLY if scaleRadius is true (or small radius is intended)
    // if scaleRadius is false it will be the constant radius used in pixels
    "radius": 8,
    "maxOpacity": 0.7, 
    // scales the radius based on map zoom
    "scaleRadius": false, 
    // if set to false the heatmap uses the global maximum for colorization
    // if activated: uses the data maximum within the current map boundaries 
    //   (there will always be a red spot with useLocalExtremas true)
    "useLocalExtrema": false,
    // which field name in your data represents the latitude - default "lat"
    latField: 'lat',
    // which field name in your data represents the longitude - default "lng"
    lngField: 'lng',
    // which field name in your data represents the data value - default "value"
    valueField: 'count',
    blur: .75,
    gradient: {
      // enter n keys between 0 and 1 here
      // for gradient color customization
      '.5': 'rgb(255, 90, 95)',
      '.8': 'red',
      '.95': 'rgb(176, 0, 5)',
      '1': 'blue'
    }
  };

  var cfg_map_reviews = {
    // radius should be small ONLY if scaleRadius is true (or small radius is intended)
    // if scaleRadius is false it will be the constant radius used in pixels
    "radius": 5,
    "maxOpacity": 0.9, 
    // scales the radius based on map zoom
    "scaleRadius": false, 
    // if set to false the heatmap uses the global maximum for colorization
    // if activated: uses the data maximum within the current map boundaries 
    //   (there will always be a red spot with useLocalExtremas true)
    "useLocalExtrema": false,
    // which field name in your data represents the latitude - default "lat"
    latField: 'lat',
    // which field name in your data represents the longitude - default "lng"
    lngField: 'lng',
    // which field name in your data represents the data value - default "value"
    valueField: 'count',
    blur: .75,
    gradient: {
      // enter n keys between 0 and 1 here
      // for gradient color customization
      '.5': 'orange',
      '.8': 'yellow',
      '.95': 'white'
    }
  };

  var heatmapLayerAnnounces = new HeatmapOverlay(cfg_map_announces);
  var heatmapLayerReviews = new HeatmapOverlay(cfg_map_reviews);

  /* Data */
  var listing_data;
  var merged_reviews;
  var price_by_suburb;

  /***** Chargement des données *****/
  d3.queue()
    .defer(d3.csv, "./data/listings.csv")
    .defer(d3.csv, "./data/review_1.csv")
    .defer(d3.csv, "./data/review_2.csv")
    .awaitAll(function (error, results) {
      if (error || results.length !== 3) {
        throw error;
      }
      var listing_2016 = results[0];
      var review_1 = results[1];
      var review_2 = results[2];


      /***** Prétraitement des données *****/
      createLatLngPoints(listing_2016);
      parseDate(listing_2016);
      merged_reviews = mergeReviews(listing_2016, review_1.concat(review_2));

      //convertNumbers(data);
      listing_data = listing_2016;
      price_by_suburb = getPriceBySuburb(listing_data);
      //var sources = createSources(data);

      /***** Initialisation de la carte *****/
      initTileLayer(L, map_announces, 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png');
      initTileLayer(L, map_reviews, 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_nolabels/{z}/{x}/{y}.png');

      
      var mapSvg = initSvgLayer(map_announces,  $("#map_announces"));
      var mapSvg2 = initSvgLayer(map_reviews,  $("#map_reviews"));

      /**** Traite et ajoute les points necessaires à la HeatMap ***/
      var heatMapData = getHeatMap(listing_2016);
      var heatMapReviewsData = getHeatMap(merged_reviews);


      map_announces.addLayer(heatmapLayerAnnounces);
      map_reviews.addLayer(heatmapLayerReviews);

      heatmapLayerAnnounces.setData(heatMapData);
      heatmapLayerReviews.setData(heatMapReviewsData);

      /********  Création du slider pour la map *********/
      
      // Création des slider
      var slider = d3.select('#map_slider').call(d3.slider()
        .axis(true).min(startDate).max(endDate).step(secondsInDay)
        .on("slide", function(evt, value) {
          slideMapUpdate(listing_2016, heatmapLayerAnnounces ,new Date(value));
        })
      );

      var slider_reviews = d3.select('#map_slider_reviews').call(d3.slider()
        .axis(true).min(startDate).max(endDate).step(secondsInDay)
        .on("slide", function(evt, value) {
          slideMapReviewsUpdate(merged_reviews, heatmapLayerReviews ,new Date(value));
        })
      );

      // Initialise à la première date
      slideMapUpdate(listing_2016, heatmapLayerAnnounces ,startDate);
      slideMapReviewsUpdate(merged_reviews, heatmapLayerReviews ,startDate);

      $("#handle-one").attr('data-content',2009);

      loadSectionFilter();
      //}

    }) 

/********* ANIMATE FUNCTION WHEN SCROLLING *******/

// Animate timeline map
// including: slider, heatMap
function animateMap(){
  if(!mapAnnouncesAnimatedOnce){
    var time = 1;
    var step = 1 / nb_step_animation;
    var t = 0;
    var interval = setInterval(function() { 
       if (time <= nb_step_animation) { 
          time++;
          t += step;
          slideMapUpdate(listing_data, heatmapLayerAnnounces ,date_interpolator(t));
          $("#handle-one").css('left', t*100 +"%");
       }
       else { 
          clearInterval(interval);
       }
    }, 60);
    mapAnnouncesAnimatedOnce = true;
  }
}

// Animate timeline map
// including: slider, heatMap
function animateMapReviews(){
  if(!mapReviewsAnimatedOnce){
    var time = 1;
    var step = 1 / nb_step_animation_reviews;
    var t = 0;
    var interval = setInterval(function() { 
       if (time <= nb_step_animation_reviews) { 
          time++;
          t += step;
          slideMapReviewsUpdate(merged_reviews, heatmapLayerReviews ,date_interpolator(t));
          $("#map_slider_reviews #handle-one").css('left', t*100 +"%");
       }
       else { 
          clearInterval(interval);
       }
    }, step_interval_reviews);
    mapReviewsAnimatedOnce = true;
  }
}


/* Init map background */
function initTileLayer(L, map, url) {
	mapLink = 
	    '<a href="http://basemaps.cartocdn.com/">BaseMaps</a>';
	L.tileLayer(
	    url, {
	    attribution: '&copy; ' + mapLink + ' Contributors',
	    minZoom: 12,
	    maxZoom: 12
	    }).addTo(map);

	map.setView([45.51475,-73.67225], 12);
	map.dragging.disable();

	/* Initialize the SVG layer */
	map._initPathRoot();

}

function initSvgLayer(map, div_container) {
  // TODO: Créer l'élément SVG en vous basant sur l'exemple fourni. Assurez-vous de créer un élément "g" dans l'élément SVG.
  
	var svg = d3.select(map.getPanes().overlayPane).append("svg"),
	g = svg.append("g");

	svg .attr("width", div_container.width() + "px")
	.attr("height",div_container.height() + "px");

	return g;

}


function getHeatMap(data){
	var points =  data.map( function(d){var e = d.LatLng; e.count = 1; return e});
  var dict_return = {};
  dict_return.data  = points;
  dict_return.max = 8;
  //dict_return[max] = 8;
  return dict_return;
}
function getHeatMapWithIntensity(data){
  var points =  data.map( function(d){var e = d.LatLng; e.count = d.intensity * 8; return e});
  var dict_return = {};
  dict_return.data  = points;
  dict_return.max = 8;
  //dict_return[max] = 8;
  return dict_return;
}



function slideMapUpdate(data, heatMap, date){
  
	var nb_announces = 0;
	var nb_apartments = 0;
	var other = 0;
	var nb_room = 0;
	var filtered_listing = data.filter( function(d) {
		var filter = d.host_since < date;
		if(filter){
			if(d.room_type == "Private room"){
	  			nb_room += 1;
			}else if(d.room_type == "Entire home/apt"){
	  			nb_apartments += 1;
	  		}else if(d.room_type == "Shared room"){
	  			other +=1;
	  		}
	  		nb_announces +=1;
	  	}
		return filter;
	});
	$("#map_nb_announces").text(nb_announces);
	$("#map_nb_room").text(nb_room);
	$("#map_nb_appartment").text(nb_apartments);
	$("#map_nb_other").text(other);
  $("#handle-one").attr('data-content',date.getFullYear());

	heatMapData = getHeatMap(filtered_listing);
	heatMap.setData(heatMapData);
}

function slideMapReviewsUpdate(data, heatMap, date){

  var filtered_listing = data.filter( function(d) {
    var min_dist_date_review = 1000000000000; 
    d.reviews.forEach(function(e){
      if(Math.abs((e - date)) < min_dist_date_review){
        min_dist_date_review = Math.abs((e - date));
      }
    });
    d.intensity = min_dist_date_review / 4500000000;
    //console.log(min_dist_date_review);
    return d.intensity < 1;
  });
  $("#map_slider_reviews #handle-one").attr('data-content',date.getFullYear());

  //console.log(filtered_listing);
  //console.log(filtered_listing);
  heatMapReviewsData = getHeatMapWithIntensity(filtered_listing);
  //console.log(getHeatMap(filtered_listing));
  heatMap.setData(heatMapReviewsData);
}




function interpolate(a, b, t){
	return (a*t) + b * (1-t);
}

function toDateTime(secs) {
    var t = new Date(1970, 0, 1); // Epoch
    t.setSeconds(secs);
    return t;
}
