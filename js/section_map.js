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
	var feature = g.selectAll("circle")
		.data(data)
		.enter().append("circle")
		.style("stroke", "black")  
		.style("opacity", .6) 
		.style("fill-opacity", 1)
		.style("fill", "red")
		.attr("r", 2);  
	
	map.on("viewreset", update);
	update();

	function update() {


		feature.attr("transform", 
		function(d) { 
			return "translate("+ 
				map.latLngToLayerPoint(d.LatLng).x +","+ 
				map.latLngToLayerPoint(d.LatLng).y +")";
			}
		)

	}

	update();

}
