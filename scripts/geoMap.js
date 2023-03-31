var w = 850;
var h = 530;

var projection = d3
  .geoEquirectangular()
  .scale([130])
  .center([0, 20])
  .translate([w / 2, h / 2]);

var path = d3.geoPath().projection(projection);

// return the filename
function filename(energySelection, componentSelection) {
  var energyType = [
    "Total Primary Energy",
    "Total Electricity",
    "Renewable Electricity",
    "Renewable Biofuels",
    "Petroleum",
    "Coal",
    "Energy-related Co2 Emissions",
  ];
  var componentType = ["Production", "Consumption", "Generation", "Emissions"];

  var filename;

  energyTypeSelected = energySelection;
  componentSelected = componentSelection;

  for (var i = 0; i < energyType.length; i++) {
    switch (energySelection) {
      case "Total Primary Energy":
        if (componentSelection == "Production") {
          filename = "data/total_primary_energy_production.csv";
        } else {
          filename = "data/total_primary_energy_consumption.csv";
        }
        break;
      case "Total Electricity":
        if (componentSelection == "Generation") {
          filename = "data/total_electricity_generation.csv";
        } else {
          filename = "data/total_electricity_consumption.csv";
        }
        break;
      case "Renewable Electricity":
        if (componentSelection == "Generation") {
          filename = "data/renewable_electricity_generation.csv";
        } else {
          filename = "data/renewable_electricity_consumption.csv";
        }
        break;
      case "Renewable Biofuels":
        if (componentSelection == "Production") {
          filename = "data/renewable_biofuel_production.csv";
        } else {
          filename = "data/renewable_biofuel_consumption.csv";
        }
        break;
      case "Petroleum":
        if (componentSelection == "Production") {
          filename = "data/petroleum_production.csv";
        } else {
          filename = "data/petroleum_consumption.csv";
        }
        break;

      case "Coal":
        if (componentSelection == "Production") {
          filename = "data/coal_production.csv";
        } else {
          filename = "data/coal_consumption.csv";
        }
        break;
      case "Energy-related Co2 Emissions":
        filename = "data/co2_emissions_per_capita.csv";
        break;
      default: //nothing
    }
    return filename;
  }
}

// return colors set
function colorSet(energySelection) {
  var energyType = [
    "Total Primary Energy",
    "Total Electricity",
    "Renewable Electricity",
    "Renewable Biofuels",
    "Petroleum",
    "Coal",
    "Energy-related Co2 Emissions",
  ];

  var colors;

  energyTypeSelected = energySelection;

  for (var i = 0; i < energyType.length; i++) {
    switch (energySelection) {
      case "Total Primary Energy":
        colors = ["#ffffcc", "#c2e699", "#78c679", "#31a354", "#006837"];
        break;
      case "Total Electricity":
        colors = ["#f1eef6", "#bdc9e1", "#74a9cf", "#2b8cbe", "#045a8d"];
        break;
      case "Renewable Electricity":
        colors = ["#edf8e9", "#bae4b3", "#74c476", "#31a354", "#006d2c"];
        break;
      case "Renewable Biofuels":
        colors = ["#ffffcc", "#a1dab4", "#41b6c4", "#2c7fb8", "#253494"];
        break;
      case "Petroleum":
        colors = ["#ffffb2", "#fecc5c", "#fd8d3c", "#f03b20", "#bd0026"];
        break;
      case "Coal":
        colors = ["#f7f7f7", "#cccccc", "#969696", "#636363", "#252525"];
        break;
      case "Energy-related Co2 Emissions":
        colors = ["#f1eef6", "#d7b5d8", "#df65b0", "#dd1c77", "#980043"];
        break;
      default: //nothing
    }
    return colors;
  }
}

// function to update map
function updateChoro(filename, year, colors) {
  d3.selectAll("path")
    // .exit()
    .remove();

  d3.selectAll(".pan")
    // .exit()
    .remove();

  d3.selectAll("g.legendEntry").remove();

  var color = d3.scaleQuantize().range(colors);

  var svg = d3
    .select("#main2")
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    .append("g");

  var values = [];

  //Define what to do when panning or zooming
  var zooming = function (d) {
    var offset = [d3.event.transform.x, d3.event.transform.y];

    //Calculate new scale
    var newScale = d3.event.transform.k * 550;

    //Update projection with new offset and scale
    projection.translate(offset).scale(newScale);

    //Update all paths and circles
    svg.selectAll("path").attr("d", path);

    svg
      .selectAll("circle")
      .attr("cx", function (d) {
        return projection([d.lon, d.lat])[0];
      })
      .attr("cy", function (d) {
        return projection([d.lon, d.lat])[1];
      });
  };

  // define the zoom behavior
  var zoom = d3.zoom().scaleExtent([0.2, 0.8]).on("zoom", zooming);

  //The center of the world, roughly
  var center = projection([0, 0]);

  d3.csv(filename, function (data) {
    // set the domain for color scale is the data of 2012
    // ignore every null value
    data.forEach(function (d) {
      if (d[2012] != "--" && d[2012] != "NA") {
        values.push(d[2012]);
      }
    });

    var min = d3.min(values);
    var max = d3.max(values);
    console.log(min);
    console.log(max);
    color.domain([min, max]);

    // mouse over effect
    let mouseOver = function (d) {
      // d3.selectAll(".Country")
      //   .transition()
      //   .duration(200)
      //   .style("opacity", .5)
      d3.select(this)
        .transition()
        .duration(200)
        .style("opacity", 1)
        .style("stroke", "black");
    };

    // mouse leave effect
    let mouseLeave = function (d) {
      d3.selectAll(".Country").transition().duration(200).style("opacity", 1);
      d3.select(this).transition().duration(200).style("stroke", "transparent");
    };

    // Load in GeoJSON data
    d3.json("scripts/worldGeo.json", function (json) {
      // merge the ag.data and GeoJSON
      // loop through once for each ag. data value
      for (var i = 0; i < data.length; i++) {
        // grab state name
        var dataCountry = data[i]["Locality"];

        // grab data value, convert from string to float
        var dataValue = parseFloat(data[i][year]);

        // find corresponding state inside the GeoJSON
        for (var j = 0; j < json.features.length; j++) {
          var jsonCountry = json.features[j].properties.name;

          if (dataCountry == jsonCountry) {
            // copy data value into json
            json.features[j].properties.value = dataValue;

            break;
          }
        }
      }

      // d3.select("g")
      //   .selectAll("path")
      //   .exit()
      //   .transition()
      //   .duration(500)
      //   .remove();

      // bind data and create on path per GeoJSON feature
      var map = svg
        .append("g")
        .attr("id", "map")
        .call(zoom)
        .call(
          zoom.transform,
          d3.zoomIdentity //Then apply the initial transform
            .translate(w / 2 + 90, h / 2 + 40)
            .scale(0.25)
            .translate(-center[0], -center[1])
        )
        .selectAll("path")
        .data(json.features);

      //Create a new, invisible background rect to catch zoom events
      map
        .append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", w)
        .attr("height", h)
        .attr("opacity", 0);

      map
        .enter()
        .append("path")
        .attr("d", path)
        .style("fill", function (d) {
          // get data value
          var value = d.properties.value;

          if (value) {
            // if value exists
            return color(value);
          } else {
            // if value is undefined
            return "#ccc";
          }
        })
        .style("stroke", "transparent")
        .attr("class", function (d) {
          return "Country";
        })
        .on("mouseover", mouseOver)
        .on("mouseout", mouseLeave)
        .on("click", function (d) {
          console.log(d.properties.name);
          document.getElementById("countryName").innerHTML = d.properties.name;
          var selection = document.getElementById("selectionWidget");
          selection.options[selection.selectedIndex].value = d.properties.name;
        });
    });
    // panning the map
    var north = svg.append("g").attr("class", "pan").attr("id", "north");

    north
      .append("rect")
      .attr("x", w / 2 - 15)
      .attr("y", 0)
      .attr("width", 30)
      .attr("height", 30)
      .attr("fill", "gray");

    north
      .append("text")
      .attr("x", w / 2)
      .attr("y", 20)
      .html("&uarr;");

    //South
    var south = svg.append("g").attr("class", "pan").attr("id", "south");

    south
      .append("rect")
      .attr("x", w / 2 - 15)
      .attr("y", h - 30)
      .attr("width", 30)
      .attr("height", 30);

    south
      .append("text")
      .attr("x", w / 2)
      .attr("y", h - 10)
      .html("&darr;");

    //West
    var west = svg.append("g").attr("class", "pan").attr("id", "west");

    west
      .append("rect")
      .attr("x", 0)
      .attr("y", h / 2 - 19)
      .attr("width", 30)
      .attr("height", 30);

    west
      .append("text")
      .attr("x", 15)
      .attr("y", h / 2)
      .html("&larr;");

    //East
    var east = svg.append("g").attr("class", "pan").attr("id", "east");

    east
      .append("rect")
      .attr("x", w - 30)
      .attr("y", h / 2 - 19)
      .attr("width", 30)
      .attr("height", 30);

    east
      .append("text")
      .attr("x", w - 15)
      .attr("y", h / 2)
      .html("&rarr;");

    svg.selectAll(".pan").on("click", function () {
      //Get current translation offset
      var offset = projection.translate();

      //Set how much to move on each click
      var moveAmount = 50;

      //Which way are we headed?
      var direction = d3.select(this).attr("id");

      //Modify the offset, depending on the direction
      switch (direction) {
        case "north":
          offset[1] += moveAmount; //Increase y offset
          break;
        case "south":
          offset[1] -= moveAmount; //Decrease y offset
          break;
        case "west":
          offset[0] += moveAmount; //Increase x offset
          break;
        case "east":
          offset[0] -= moveAmount; //Decrease x offset
          break;
        default:
          break;
      }

      //Update projection with new offset
      projection.translate(offset);

      //Update all paths and circles
      svg.selectAll("path").transition().attr("d", path);
    });

    //  color legend
    var legend = svg
      .selectAll("g.legendEntry")
      .data(color.range())
      .enter()
      .append("g")
      .attr("class", "legendEntry");

    legend
      .append("rect")
      .attr("y", h - 30)
      .attr("x", function (d, i) {
        return i * 65 + 510;
      })
      .attr("width", 65)
      .attr("height", 10)
      .style("stroke", "black")
      .style("stroke-width", 1)
      .style("fill", function (d) {
        return d;
      });
    //the data objects are the fill colors

    legend
      .append("text")
      .attr("y", h - 10)
      .attr("x", function (d, i) {
        return i * 65 + 500;
      })
      .attr("dy", "0.5em") //place text one line *below* the x,y point
      .text(function (d, i) {
        var extent = color.invertExtent(d);
        //extent will be a two-element array, format it however you want:
        var format = d3.format("0.1f");
        return format(+extent[0]);
      });
  });
}

function init2() {
  var chosenfile = "data/total_primary_energy_production.csv";
  var colors = ["#ffffcc", "#c2e699", "#78c679", "#31a354", "#006837"];
  var year = 2012;

  // draw map on window load
  updateChoro(chosenfile, year, colors);

  // update map after changing the energy type
  d3.selectAll("#energyTypeList").on("change", function (d) {
    var selection = document.getElementById("energyTypeList");
    var energySelection = selection.options[selection.selectedIndex].value;
    var choice = document.getElementById("componentWidget");
    var componentSelection = choice.options[choice.selectedIndex].value;

    chosenfile = filename(energySelection, componentSelection);
    colors = colorSet(energySelection);
    updateChoro(chosenfile, year, colors);
  });

  // update map after changing the component
  d3.select("#componentWidget").on("change", function (d) {
    var selection = document.getElementById("energyTypeList");
    var energySelection = selection.options[selection.selectedIndex].value;
    var choice = document.getElementById("componentWidget");
    var componentSelection = choice.options[choice.selectedIndex].value;

    chosenfile = filename(energySelection, componentSelection);
    colors = colorSet(energySelection);
    updateChoro(chosenfile, year, colors);
  });

  // updating year with the slider
  d3.select("#myRange").on("change", function (d) {
    year = this.value;
    updateChoro(chosenfile, year, colors);
  });
}

// window.onload = init2;
window.addEventListener("load", init2);
