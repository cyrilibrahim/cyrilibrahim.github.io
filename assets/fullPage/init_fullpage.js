

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
				//console.log(queue);
				//queue.animateMap();
				console.log(listing_data);
      			animateMap();
			}
		}

	});
});
