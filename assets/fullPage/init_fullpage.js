

$(document).ready(function() {

	$('#fullpage').fullpage({
		sectionsColor : ["#FF5A5F"], 
		navigation:true,
		afterLoad: function(anchorLink, index){
			var loadedSection = $(this);
			if(index == 1){

			}
			//using index
			if(index == 2){
      			//animateMap();
			}
			else if(index == 3){
      			animateMapReviews();
			}
		}

	});
});
