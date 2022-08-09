var labelList = ["Total Primary Energy Production (quadrillion BTU)",
				"Total Primary Energy Consumption (quadrillion BTU)",
				"Total Electricity Generation (billion Kilowatt-hours)",
				"Total Electricity Consumption (billion Kilowatt-hours)",
				"Renewable Electricity Generation (billion Kilowatt-hours)",
				"Renewable Electricity consumption (billion Kilowatt-hours)",
				"Renewable Biofuel Production  (thousand barrels per day)",
				"Renewable Biofuel Consumption  (thousand barrels per day)",
				"Petroleum Production (thousand barrels per day)",
				"Petroleum Consumption (thousand barrels per day)",
				"Coal Production (million short tons)",
				"Coal Consumption (million short tons)",
				"CO2 Emissions per Capita (metric tons per capita)"];
				
//have containers for various energy types and component views
var energyType = ["Total Primary Energy", "Total Electricity", "Renewable Electricity", 
      "Renewable Biofuels", "Petroleum", "Coal", "Energy-related Co2 Emissions"];
var componentType = ["Production", "Consumption", "Generation", "Emissions"];

var countryName;
	function giveMeEnergy(energy, component)
	{				
		switch(energy)
		{
			case 'Total Primary Energy': if(component == 'Production')
											return labelList[0];
										else
											return labelList[1];
										break;

			case 'Total Electricity': if(component == 'Generation')
											return labelList[2];
										else
											return labelList[3];
										break;

			case 'Renewable Electricity': if(component == 'Generation')
											return labelList[4];
										else
											return labelList[5];
										break;

			case 'Renewable Biofuels': if(component == 'Production')
											return labelList[6];
										else
											return labelList[7];
										break;

			case 'Petroleum': if(component == 'Production')
											return labelList[8];
										else
											return labelList[9];
										break;	

			case 'Coal': if(component == 'Production')
											return labelList[10];
										else
											return labelList[11];
										break;

			case 'Energy-related Co2 Emissions': if(component == 'Emissions')
											return labelList[12];
										break;		
		}		
	}	

  function dropDownMenus() {
    d3.select('#componentWidget').selectAll('option').remove();
		
		var i, tabcontent, tablinks;
		tabcontent = document.getElementsByClassName("tabcontent");
		for (i = 0; i < tabcontent.length; i++) {
			tabcontent[i].style.display = "none";
		}
		tablinks = document.getElementsByClassName("tablinks");
		for (i = 0; i < tablinks.length; i++) {
			tablinks[i].className = tablinks[i].className.replace(" active", "");
		}
		document.getElementById("first").style.display = "block";
		event.currentTarget.className += " active";
		
		
		
		//Initialize energy type list widget
		d3.select('#energyTypeList').selectAll('option').data(energyType).enter().append('option')
			.html(function(d) { return d; })
			.attr('value', function(d) { return d; })
		
		//Initialize component list widget
		d3.select('#componentWidget').append('option')
			.attr('value', componentType[0])
			.html(componentType[0]);
		d3.select('#componentWidget').append('option')
			.attr('value', componentType[1])
			.html(componentType[1]);
			
		//If the energy type is chosen, check for the components under it and update the component widget accordingly
		d3.select("#energyTypeList")
			.on('change', function() {
				var selection = document.getElementById('energyTypeList');
				var energySelection = selection.options[selection.selectedIndex].value;
				
				if(energySelection == 'Total Electricity' || energySelection == 'Renewable Electricity')
				{
					d3.select('#componentWidget').selectAll('option').remove();
					d3.select('#componentWidget').append('option')
						.attr('value', componentType[2])
						.html(componentType[2]);
					d3.select('#componentWidget').append('option')
						.attr('value', componentType[1])
						.html(componentType[1]);
				}
				else if(energySelection == 'Energy-related Co2 Emissions')
				{
					d3.select('#componentWidget').selectAll('option').remove();
					d3.select('#componentWidget').append('option')
						.attr('value', componentType[3])
						.html(componentType[3]);				
				}
				//for all other cases change back to default component types
				else
				{
					d3.select('#componentWidget').selectAll('option').remove();
					d3.select('#componentWidget').append('option')
						.attr('value', componentType[0])
						.html(componentType[0]);
					d3.select('#componentWidget').append('option')
						.attr('value', componentType[1])
						.html(componentType[1]);
				}
			});
  }

  function getFileName() {
    var listOfLocalities = [];
		var localities = {};
		var localityName;

		var energyTypeSelected;
		var componentSelected;

    var filename;
    var selection = document.getElementById('energyTypeList');
    var energySelection = selection.options[selection.selectedIndex].value;
    var choice = document.getElementById('componentWidget');
    var componentSelection = choice.options[choice.selectedIndex].value;
    
    energyTypeSelected = energySelection;
    componentSelected = componentSelection;
    
    console.log("energySelection: "+energySelection);
    console.log("componentSelection: "+componentSelection);

    for(var i=0; i < energyType.length; i++)
    {
      switch(energySelection)
      {
        case 'Total Primary Energy':	
                        if(componentSelection == 'Production')
                        {
                          filename="data/total_primary_energy_production.csv";
                        }
                        else
                        {
                          filename="data/total_primary_energy_consumption.csv";
                        }
                        break;
        case 'Total Electricity':
                        if(componentSelection == 'Generation')
                        {
                          filename="data/total_electricity_generation.csv";
                        }
                        else
                        {
                          filename="data/total_electricity_consumption.csv";
                        }
                        break;
        case 'Renewable Electricity':
                        if(componentSelection == 'Generation')
                        {
                          filename="data/renewable_electricity_generation.csv";
                        }
                        else
                        {
                          filename="data/renewable_electricity_consumption.csv";
                        }
                        break;
        case 'Renewable Biofuels':
                        if(componentSelection == 'Production')
                        {
                          filename="data/renewable_biofuel_production.csv";
                        }
                        else
                        {
                          filename="data/renewable_biofuel_consumption.csv";
                        }
                        break;
        case 'Petroleum':
                        if(componentSelection == 'Production')
                        {
                          filename="data/petroleum_production.csv";
                        }
                        else
                        {
                          filename="data/petroleum_consumption.csv";
                        }
                        break;
        case 'Coal':
                        if(componentSelection == 'Production')
                        {
                          filename="data/coal_production.csv";
                        }
                        else
                        {
                          filename="data/coal_consumption.csv";
                        }
                        break;
        case 'Energy-related Co2 Emissions':
                        filename="data/co2_emissions_per_capita.csv";
                        break;
        default: //nothing
      }
      console.log("filename:  "+filename);
    }

    if (filename != "") {
      Papa.parse(filename, {
				
        download: true,
        header: true,
        dynamicTyping: true,
        complete: function(results) 
        {
          // loop through all the rows in file
          for (var row=0; row < results.data.length; row++)
          {
            var record = results.data[row];
            
            // make an object to store data for the current locality
            var locality = {
              name: record.Locality,
              energyProduction: []
            }

            // loop through all years, from 1980 to 2012
            for (var year=1980; year<=2012; year++) 
            {
              var value = record[year];
              if(isNaN(value))
              {
                value = 0;	
                //console.log("the value is NaN: "+value);
              }
              
              // deal with missing data points
              if (value === '--') {
                value = 0;
              }
              else if (value === 'NA') {
                value = 0;
              }
              else if (value === '(s)') {
                value = 0;
              }
              else if (value === 'W') {
                value = 0;
              }

              // add record of current energy production
              locality.energyProduction.push( value );
            }

            // add the current locality to an index
            localities[locality.name] = locality;
            listOfLocalities.push( locality.name );
          }

          // populate selection list
          d3.select('#selectionWidget').selectAll('option').data(listOfLocalities).enter().append('option')
            .html(function(d) { return d; })
            .attr('value', function(d) { return d; })

          //populate compare widget list	
          d3.select('#compareWidget').selectAll('option').data(listOfLocalities).enter().append('option')
            .html(function(d) { return d; })
            .attr('value', function(d) { return d; })
            
          // figure out the newly selected locality
          var selection = document.getElementById('selectionWidget');
          localityName = selection.options[selection.selectedIndex].value;
          console.log("localityName: "+localityName);

        }
        // return localities;
      });
      console.log(localities);
    }
    return null;
  }

  function drawBarChart(localities) {
      // chart size 
			var chartWidth = 420;
			var chartHeight = 250;

			// figure out the width of individual bars
			var barWidth = chartWidth / (2012-1980);


    var energyLabel = giveMeEnergy("Total Primary Energy", "Production");  
    
    d3.select("#label1")
    .html("United States" + " " +energyLabel);

    // get energy production for USA
    var energyProductionUSA = localities["United States"].energyProduction;

    // figure out maximum energy production
    var maxProduction = d3.max(energyProductionUSA);
    
    // create a y scale - since the range has arguments interchanged, it returns -scale
    var yScale = d3.scaleLinear()
    .domain([0, maxProduction])
    .range([chartHeight , 0]);

    var group = d3.select("#main1").append("g")
      .attr("transform", "translate(130, 100)");

    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
      return "<strong>Value:</strong> <span style='color:red'>" + d + "</span>";
    })
      
    group.call(tip);
    
      //the rectangle will be drawn from upper-left corner - co-ordinate system starts at the upper-left	screen
      
      group.selectAll("rect").data(energyProductionUSA).enter().append('rect')
      .attr("class", "bar")
      .attr("x", function(d, i) { return i*barWidth })
      .attr("y", function(d, i) { 
        return yScale(d);
      })
      .attr("width", barWidth)
      .attr("height", function(d) { 
        return chartHeight - yScale(d); 
      })
      .style("stroke", "white")
      .style("fill", "#90EE90")
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);

  

  }

  function init() {
    dropDownMenus();
    localities = getFileName();
    console.log(localities);

    dictionary = {}
    dictionary["United States"] = {name: "US", data: [50, 10, 20, 40]};
    dictionary["China"] = {name: "China", data: [50, 10, 20, 40]};
    console.log(dictionary);
    console.log(dictionary["United States"]);
    // figure out the newly selected locality
    // var selection = document.getElementById('selectionWidget');
    // localityName = selection.options[selection.selectedIndex].value;
    
    // console.log(localityName);
    console.log(Object.keys(localities)[0])
    console.log(localities["China"]);
    var chosenfile = "data/total_primary_energy_production.csv";
    drawBarChart(localities);

  }

  window.onload = init;