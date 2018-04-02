/* Init map background */
function initTileLayer(L, map) {

	mapLink = 
	    '<a href="http://basemaps.cartocdn.com/">BaseMaps</a>';
	L.tileLayer(
	    'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
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

