


  var map = L.map('map');
  var startDate = new Date("2009-01-01");
  var endDate = new Date("2016-04-01");
  var secondsInDay = 60 * 60 * 24;
  var date_interpolator = d3.interpolateDate(startDate, endDate);

  var nb_step_animation = 10;
  var heatLayer;

  /* Data */
  var listing_data;
  var price_by_suburb;

  var mapAnimatedOnce = false;

  var data_ready = false;
  /***** Chargement des données *****/
  d3.queue()
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
      price_by_suburb = getPriceBySuburb(listing_data);
      //var sources = createSources(data);

      /***** Initialisation de la carte *****/
      initTileLayer(L, map);
      var mapSvg = initSvgLayer(map,  $("#map"));

      /**** Traite et ajoute les points necessaires à la HeatMap ***/
      var heatMapData = getHeatMap(listing_2016);
      heatLayer = L.heatLayer(heatMapData, {maxZoom: 12, radius: 7.8, gradient : { 0.0: 'white', 0.8: '#FF5A5F',0.9:'red'}});
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

      loadSectionFilter();
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
          $("#handle-one").after().css('content', "test");
          console.log($("#handle-one"));

       }
       else { 
          clearInterval(interval);
       }
    }, 20);
    mapAnimatedOnce = true;
  }
}

/* Init map background */
function initTileLayer(L, map) {

	mapLink = 
	    '<a href="http://basemaps.cartocdn.com/">BaseMaps</a>';
	L.tileLayer(
	    'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
	    attribution: '&copy; ' + mapLink + ' Contributors',
	    minZoom: 12,
	    maxZoom: 14
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

function addListingToMap(g, data, map){
	console.log(data.length);
	var feature = g.selectAll("circle")
		.data(data)
		.enter().append("circle")
		.style("stroke", "black")  
		.style("opacity", .6) 
		.style("fill-opacity", 1)
		.style("fill", "red")
		.attr("r", 2)
		.attr("visibility", function(d){if(d.visible_zoom_14 == true){return ""}else{return "hidden";}});  
	//map.on("viewreset", update);
	//update();

	function update() {

		feature.attr("transform", 
		function(d) {
			return "translate("+ 
				map.latLngToLayerPoint(d.LatLng).x +","+ 
				map.latLngToLayerPoint(d.LatLng).y +")";
		});
	}

	update();

}

function getHeatMap(data){
	return data.map( d => d.LatLng);
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

	heatMapData = getHeatMap(filtered_listing);
	heatMap.setLatLngs(heatMapData);

}




function interpolate(a, b, t){
	return (a*t) + b * (1-t);
}

