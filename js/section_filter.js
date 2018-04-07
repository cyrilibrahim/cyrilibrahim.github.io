
var nb_review = $("#nb_review");

var selections_options = {};




function loadSectionFilter(){
	
	// Va automatiquement chercher la liste des choix possible et lie le filtre aux données à filtrer 
	// pour les filtres de types selections
	changeSelectOptions("#quartier_selection",findOptions("neighbourhood"), "neighbourhood");
	changeSelectOptions("#type_location_selection",findOptions("room_type"), "room_type");
	
	$("#price_slider").slider({});

	updateFilteredData();

}

function updateFilteredData(){
	var filtered_data = listing_data.filter(function(e){
		var condition = true;
		Object.keys(selections_options).forEach(function (key) {
			condition = condition && ((e[key] == selections_options[key] ) ||  selections_options[key] === "Tous");
		});
		return condition;
	});

	var sum_reviews = 0;
	filtered_data.forEach(function(e){
		sum_reviews += parseFloat(e.number_of_reviews);
	});
	var mean_reviews = sum_reviews / filtered_data.length;
	if(filtered_data.length == 0){
		$("#nb_review").text("Aucune donnée");
	}else{
		$("#nb_review").text(mean_reviews.toFixed(2));
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

Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}