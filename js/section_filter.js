
var nb_review = $("#nb_review");
var current_max_mean_review = 10;
var selections_options = {};

var min_price = 10;
var max_price = 600;

var color_saturation = d3.interpolateLab("red","yellow", "green");


var tiles_filter = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
		maxZoom: 18,
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Points &copy 2012 LINZ'
	}),
	latlng = L.latLng(-37.82, 175.24);

var map_filter = L.map('map_filter', { layers: [tiles_filter]});

var markers;
markers = L.markerClusterGroup({
	/*
	iconCreateFunction: function(cluster) {
		var reviews = cluster.getAllChildMarkers().map(function(e){
			return e.options.reviews;
		});
		var size = (d3.mean(reviews)/current_max_mean_review) * 30;
		//var icon = L.divIcon({ iconSize: L.point(40, 40), html: '<span class="cluster_marker" style= "background-color : '+color_saturation(d3.mean(reviews)/ current_max_mean_review)+';"/>'});
		var icon = L.divIcon({ iconSize: L.point(size, size), html: '<span class="cluster_marker" />'});

		return icon;

	},*/
	showCoverageOnHover: false
});

map_filter.addLayer(markers);
	/*
map_filter.on('zoomstart', function(event){

	var max_review = 0;
	map_filter.eachLayer(function(layer){     //iterate over map rather than clusters
	 if (layer.getChildCount){         // if layer is markerCluster
	 	var reviews = layer.getAllChildMarkers().map(function(e){
			return e.options.reviews;
		}); 
	 	console.log(layer);
	 	if(d3.mean(reviews) > max_review){
	 		max_review = d3.mean(reviews);
	 	}
	  }else if("reviews" in layer.options){
	  	if(layer.options.reviews > max_review){
	  		max_review = layer.options.reviews;
	  	}
	  }
	});

	current_max_mean_review = max_review;
	console.log(current_max_mean_review);

});
	*/
map_filter.setView([45.51475,-73.67225], 12);

var bedIcon = L.icon({
iconUrl: 'img/icons/bed.svg',
iconSize: [30, 30], iconAnchor: [15, 15], popupAnchor: [-15, -15]
});

var homeIcon = L.icon({
iconUrl: 'img/icons/home.svg',
iconSize: [30, 30], iconAnchor: [15, 15], popupAnchor: [-15, -15]
});

function loadSectionFilter(){
	
	// Va automatiquement chercher la liste des choix possible et lie le filtre aux données à filtrer 
	// pour les filtres de types selections
	changeSelectOptions("#quartier_selection",findOptions("neighbourhood"), "neighbourhood");
	changeSelectOptions("#type_location_selection",findOptions("room_type"), "room_type");
	
	$("#price_slider").slider();

	$("#price_slider").on("slideStop", function(slideEvt) {
		[min_price, max_price] = slideEvt.value;
		$("#min_price").text(min_price);
		$("#max_price").text(max_price);
		updateFilteredData();
	});
	updateFilteredData();

}

function updateFilteredData(){
	var filtered_data = listing_data.filter(function(e){
		var condition = true;
		Object.keys(selections_options).forEach(function (key) {
			condition = condition && ((e[key] == selections_options[key] ) ||  selections_options[key] === "Tous");
		});
		var price_float = parseFloat(e.price.substring(1));
		condition = condition && price_float >= min_price && price_float <= max_price;

		return condition;
	});

	//console.log(filtered_data);

	var sum_reviews = 0;
	var sum_score = 0;
	var sum_price = 0;
	var sum_availability = 0;
	var scores = [];
	filtered_data.forEach(function(e){
		sum_reviews += parseFloat(e.number_of_reviews);
		sum_score += parseFloat(e.review_scores_rating);

		if(e.review_scores_rating != ""){
			scores.push(parseFloat(e.review_scores_rating));
		}

		sum_price += parseFloat(e.price.substring(1));
		sum_availability += parseFloat(e.availability_365);
	});

	var mean_reviews = sum_reviews / filtered_data.length;
	var mean_score = d3.mean(scores);
	var mean_price = sum_price / filtered_data.length;
	var mean_disponibility = sum_availability / filtered_data.length;

	if(filtered_data.length == 0){
		$("#nb_review").text("Aucune donnée");
		markers.clearLayers();
	}else{
		$("#nb_review").text(mean_reviews.toFixed(2));
		$("#nb_announces").text(filtered_data.length);
		$("#score").text(mean_score.toFixed(2));
		$("#disponibility_365").text(mean_disponibility.toFixed(2));
		$("#mean_price").text(mean_price.toFixed(2));

		updateMapMarkers(filtered_data);
	}
}

function changeSelectOptions(select_id,newOptions, key){
	var $el = $(select_id);
	$el.empty(); // remove old options
	newOptions.forEach(function(e) {
	  $el.append($("<option></option>")
	     .attr("value", e).text(e));
	});

	$el.append($("<option selected></option>")
	.attr("value", "Tous").text("Tous"));

	// initialise selection de quartier Quartier 
	$(select_id).change(function() {
	    var opt = $(this).find('option:selected');
	    selections_options[key] = opt.val();
	    updateFilteredData();
	});
	selections_options[key] = "Tous";
    
}

function findOptions(property){
	var options_list = []
	listing_data.forEach(function(e){
		if(!options_list.contains(e[property]) && e[property] != ""){
			options_list.push(e[property]);
		}
	});
	return options_list;
}



function updateMapMarkers(filtered_data){
	markers.clearLayers();
	filtered_data.forEach(function(e){

		var icon;

		if(e.room_type == "Entire home/apt"){
			icon = homeIcon;
		}else{
			icon = bedIcon;
		}
		//var icon = L.divIcon({ iconSize: L.point(100* (e.number_of_reviews/current_max_mean_review), 100*(e.number_of_reviews/current_max_mean_review)), html: '<span class="cluster_marker" />'});

		var host_since = (e.hasOwnProperty("host_since") && e.host_since != null) ? ("Hôte depuis &nbsp; " + e.host_since.getFullYear()+ "<br>"):"";
		var content = "<div>"+
				  		"Prix &nbsp; :"+e.price+ "<br>"+
				  		"Lien &nbsp; : <a href="+ e.listing_url+">"+e.listing_url + " </a> <br>"+
				  		"Nombre de reviews &nbsp; :" + e.number_of_reviews + "<br>"+
				  		"Disponibilité sur 365 jours &nbsp; : " + e.availability_365 + "<br>"+ 
				  		"Note moyenne  &nbsp; :" + e.review_scores_rating + "/ 100" + "<br>" + 
				  		"Nombre de lits &nbsp; "+ e.beds+ "<br>" + 
				  		host_since + 
				  		"Adresse &nbsp; :" + e.street + "<br>"
					  "</div>";
		var marker = L.marker(e.LatLng,{icon: icon, reviews: parseFloat(e.number_of_reviews)}).bindPopup(content);

		marker.on('mouseover',function() {
	  		marker.openPopup();
		});
		marker.on("mouseout", function(){
			//marker.closePopup();
		});
		markers.addLayer(marker);

	});

}

Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}