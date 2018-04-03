(function(d3, localization) {

var minListing = 50;

var margin = {top: 20, right: 20, bottom: 100, left: 50},
width = $("#price_by_neighborhood_chart_container").width() - margin.left - margin.right,
height = $("#price_by_neighborhood_chart_container").height() - margin.top - margin.bottom;

var svg_line_chart = d3.select("#price_by_neighborhood_chart_container").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var svg_line_chart_legend = d3.select("#price_by_neighborhood_legend_container").append("svg")
    .attr("width", $("#price_by_neighborhood_legend_container").width())
    .attr("height", $("#price_by_neighborhood_legend_container").height())
  .append("g")

var g_line_chart = svg_line_chart.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var parseMonth = d3.time.format("%Y-%m").parse;

var x_line_chart = d3.time.scale()
    .rangeRound([0, width]);

var y_line_chart = d3.scale.linear()
    .rangeRound([height, 0]);

var xAxis = d3.svg.axis().scale(x_line_chart).orient("bottom").tickFormat(localization.getFormattedDate);
var yAxis = d3.svg.axis().scale(y_line_chart).orient("left");

var neighborhood_color = d3.scale.category20();

var line_neighborhood = d3.svg.line()
.interpolate("basis")
.x(function(d) { return x_line_chart(d.date); })
.y(function(d) { return y_line_chart(d.price); });


d3.json("./data/price_by_neighborhood.json", function(error, data) {
  
  if (error) {
    throw error;
  }

  data = filterDataMinListing(data, minListing);
  domainColorNeighborhood(neighborhood_color, data);
  parseDateNeighborhood(parseMonth, data);
  sortByDateNeighborhood(data);

  domainX(x_line_chart,data);
  domainY(y_line_chart, data);

  createContextLineChart(g_line_chart, data, line_neighborhood, neighborhood_color);

  // Axes focus
  g_line_chart.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  g_line_chart.append("g")
    .attr("class", "y axis")
    .call(yAxis);

  // Legend
  legend(svg_line_chart_legend, data, neighborhood_color);

});


function domainColorNeighborhood(color, data){
  
  var quartiers = data.map(function(e){
    return e.quartier;
  });
  color.domain(quartiers);
}
function parseDateNeighborhood(format, data) {

  data.forEach(function(e){
    e.values.map(function(d){
      d.date = format(d.date);
    });
  });
}

function filterDataMinListing(data, minListing){
  return data.filter(function(d){return d.nb_annonces > minListing;});
}

function sortByDateNeighborhood(data){
  data.forEach(function(e){
    e.values = e.values.sort(sortByDateAscending);
  });
}


function domainX(x, data) {
  var dates = [];
  data.forEach(function(element){
    element.values.forEach(function(d){
      dates.push(d["date"]);
    });
  });
  
  x.domain([d3.min(dates),d3.max(dates)]);
}

function domainY(y, data) {
  var prices = [];
  data.forEach(function(element){
    element.values.forEach(function(d){
      prices.push(d["price"]);
    });
  });
  y.domain([d3.min(prices),d3.max(prices)]);
  //y.domain([0,300]);

}

/**
 * Crée le graphique contexte.
 *
 * @param g         Le groupe SVG dans lequel le graphique doit être dessiné.
 * @param sources   Les données à utiliser.
 * @param line      La fonction permettant de dessiner les lignes du graphique.
 * @param color     L'échelle de couleurs ayant une couleur associée à un nom de rue.
 */
function createContextLineChart(g, sources, line, color) {
  // TODO: Dessiner le graphique contexte dans le groupe "g".
  var neighborhood = g.selectAll(".neighborhood")
      .data(sources)
      .enter().append("g")
        .attr("class", "neighborhood");


  neighborhood.append("path")
      .attr("class", "line line_neighborhood")
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d) { return color(d.quartier); })
      .style("stroke-width", function(d){return 0.008 * d.nb_annonces})
      .style("opacity", 0.8);
}


function legend(svg, sources, color, width) {
  // TODO: Créer la légende accompagnant le graphique.
  

  legend = svg.append("g")
    .attr("class","legend")
    .attr("transform","translate(50,30)")
    .style("font-size","20px")

   var circles = legend.selectAll('circle')
    .data(sources)
    .enter()
  .append("circle")
      .attr("cx", 30)
      .attr("cy", function(d, i){ return i *  35;})
      .attr("r", 14)
      .attr("activated", "true")
      .style("fill", function(d) { 
         return color(d.quartier);
     })
    .style("stroke", "black")
    .style("stroke-width", 0.5);
    
   circles.on("click", function(d, i){
    displayLine(i, color);
   });

  legend.selectAll('text')
  .data(sources)
  .enter()
    .append("text")
      .attr("x", 30 + 30)
      .attr("y", function(d, i){ return i *  35 + 8;})
      .text(function(d) { return d.quartier;});

}

function displayLine(element, color) {
  // TODO: Compléter le code pour faire afficher ou disparaître une ligne en fonction de l'élément cliqué.
  var circle = d3.select("g.legend").selectAll("circle")
    .filter(function (d, i) { return i === element;});

  var line = d3.selectAll(".line_neighborhood")
    .filter(function (d, i) { return i === element;});


  /*var line = d3.selectAll(".line")
    .filter(function (d, i) { return i%10 === element;});*/
  
  if(circle.attr("activated") == "true"){
    circle.style("fill", "white");
    circle.attr("activated","false");
    line.style("opacity", 0);

  }else{

    circle.style("fill", function(d){return color(d.quartier);});
    circle.attr("activated","true");
    line.style("opacity", 0.8);
  }


}

function sortByDateAscending(a, b) {
    // Dates will be cast to numbers automagically:
    return a.date - b.date;
}

})(d3, localization);