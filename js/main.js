
  
  d3.queue()
    .defer(d3.json, "./data/price_by_neighborhood.json")
    .awaitAll(function (error, results) {
      if (error) {
        console.log(error);
        throw error;
      }

      var price_by_neighborhood = results[0];
    })



