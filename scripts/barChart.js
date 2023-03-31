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

	function firstTabFunc()
	{
		console.log(" F: firstTabFunc: ENTER");
		
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
		
		var listOfLocalities = [];
		var localities = {};
		var localityName;

		var energyTypeSelected;
		var componentSelected;
		
		//have containers for various energy types and component views
		var energyType = ["Total Primary Energy", "Total Electricity", "Renewable Electricity", 
							"Renewable Biofuels", "Petroleum", "Coal", "Energy-related Co2 Emissions"];
		var componentType = ["Production", "Consumption", "Generation", "Emissions"];
		
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
			
		console.log("O: Widget loading complete");
		
		//default display a bar chart
		boot('drawBarChart');
			
		function drawChart()
		{
			var chartStyle = document.getElementById('barStyle0').checked;
			if(chartStyle)
			{
				console.log("Drawing bar charts");
				boot('drawBarChart');
			}
			else
			{
				console.log("Drawing line charts");
				boot('drawLineChart');
			}
		}
		firstTabFunc.drawChart = drawChart;
		
		function boot(chartType)
		{
			console.log("O: boot() ENTER --");
			d3.select("#main1").selectAll('g').remove();
							
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
			
			if(filename != '')
			{
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
							localities[ locality.name] = locality;
							listOfLocalities.push( locality.name );
						}

						//populate compare widget list	
						d3.select('#compareWidget').selectAll('option').data(listOfLocalities).enter().append('option')
							.html(function(d) { return d; })
							.attr('value', function(d) { return d; })
							
						// figure out the newly selected locality
						var selection = document.getElementById('selectionWidget');
						// localityName = selection.options[selection.selectedIndex].value;
						localityName = document.getElementById("countryName").textContent;
						console.log("localityName: "+localityName);
						
						if(chartType == 'drawBarChart')
						{
							drawBarChart();
						}
						else
						{
							drawLineChart();
						}
					}
				});
			}
			console.log("O: boot() EXIT --");
		}
		
		function drawBarChart()
		{
			console.log("O: drawBarChart() ENTER --");
			// get energy production for USA
			var energyProductionUSA = localities[localityName].energyProduction;

			// figure out maximum energy production
			var maxProduction = d3.max(energyProductionUSA);

			// chart size 
			var chartWidth = 420;
			var chartHeight = 250;
			
			// figure out the width of individual bars
			var barWidth = chartWidth / (2012-1980);

			// create a y scale - since the range has arguments interchanged, it returns -scale
			var yScale = d3.scaleLinear()
				.domain([0, maxProduction])
				.range([chartHeight , 0]);

			var energyLabel = giveMeEnergy(energyTypeSelected, componentSelected);
			
			d3.select("#label1")
				.html(localityName + " " +energyLabel);
  
			var group = d3.select("#main1").append("g")
				.attr("transform", "translate(130, 100)");

			var tip = d3.tip()
				.attr('class', 'd3-tip')
				.offset([-12, 0])
				.html(function(d) {
				return "<strong>Value:</strong> <span style='color:#dc2f02'>" + d + "</span>";
			})
			  
			group.call(tip);

			// a linear scale for colors
			var colors = d3.scaleLinear()
										.domain([d3.min(energyProductionUSA), d3.max(energyProductionUSA)])
										.range(["#99e2b4", "#054a29"]);

			// the rectangle will be drawn from upper-left corner - co-ordinate system starts at the upper-left	screen
			var myChart = 
			group.selectAll("rect").data(energyProductionUSA).enter().append('rect')
				.attr("class", "bar")
				.attr("x", function(d, i) { return i*barWidth })
				.attr("y", function(d, i) { 
					return chartHeight;
				})
				.attr("height", function(d) { 
					return 0; 
				})
				.attr("width", barWidth)
				.style("stroke", "white")
				// .style("fill", "#90EE90")
				.attr("fill", function(d) {
					return colors(d)
				})
				.on('mouseover', tip.show)
				.on('mouseout', tip.hide);
			
			// bar chart transition
			myChart.transition()
						.attr("y", function(d, i) { 
							return yScale(d);
						})
						.attr("height", function(d) { 
							return chartHeight - yScale(d); 
						})
						.delay(function(d, i) {
							return i*20;
						})
						.duration(1000)
						.ease(d3.easeCubicOut);


			// create x axis
			var timeScale = d3.scaleTime()
				.domain([new Date(1980, 0, 0), new Date(2012, 0, 1)])
				.range([barWidth/2 , chartWidth + barWidth/2])

			var xAxis = d3.axisBottom()
				.scale(timeScale);

			group.append("g")
				.attr('class', 'axis')
				.attr('transform', 'translate(0,' + chartHeight + ')')
				.call(xAxis);
				
			// create y axis
			var yAxis = d3.axisLeft()
				.scale(yScale);

			group.append("g")
				.attr('class', 'axis')
				.attr('transform', 'translate(-2,0)')
				.call(yAxis);
			
			group.append("text")
				.attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
				.style("stroke", "grey")
				.attr("transform", "translate("+ (-50) +","+(chartHeight/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
				.text(energyTypeSelected);

			group.append("text")
				.attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
				.attr("transform", "translate("+ (chartWidth/2) +","+(chartHeight + 40)+")")  // centre below axis
				.style("stroke", "grey")
				.text("Time");				

			console.log("O: drawBarChart() EXIT --");
		}

		function drawLineChart()
		{
			console.log("O: drawLineChart() ENTER --");
			// get energy production for USA
			var energyProductionUSA = localities[localityName].energyProduction;

			// figure out maximum energy production
			var maxProduction = d3.max(energyProductionUSA);

			// chart size 
			var chartWidth = 420;
			var chartHeight = 250;

			// figure out the width of individual bars
			var barWidth = chartWidth / (2012-1980);

			// create a y scale - since the range has arguments interchanged, it returns -scale
			var yScale = d3.scaleLinear()
				.domain([0, maxProduction])
				.range([chartHeight, 0]);

			var energyLabel = giveMeEnergy(energyTypeSelected, componentSelected);
			
			d3.select("#label1")
				.html(localityName + " " +energyLabel);

			var group = d3.select("#main1").append("g")
				.attr("transform", "translate(130, 100)");
			
			
			var tip = d3.tip()
				.attr('class', 'd3-tip')
				.offset([-10, 0])
				.html(function(d) {
				return "<strong>Value:</strong> <span style='color:green'>" + d + "</span>";
			})
			  
			group.call(tip);
			
			//add a line
			var line = d3.line()
						.x(function(d, i) { return i*barWidth })
						.y(function(d, i) { return yScale(d)})
			
			// create x axis
			var timeScale = d3.scaleTime()
				.domain([new Date(1980, 0, 0), new Date(2012, 0, 0)])
				.range([barWidth/2 , chartWidth + barWidth/2])

			var xAxis = d3.axisBottom()
				.scale(timeScale);
				
			group.append("g")
				.attr('class', 'axis')
				.attr('transform', 'translate(0,' + chartHeight + ')')
				.call(xAxis);
				
			// create y axis
			var yAxis = d3.axisLeft()
				.scale(yScale);

			group.append("g")
				.attr('class', 'axis')
				.attr('transform', 'translate(-2,0)')
				.call(yAxis);
				
			var color = d3.scaleOrdinal(d3.schemeCategory10);
			
			var path = 
			group.append("path")
				.attr("class", "line")
				.attr("d", line(energyProductionUSA))
				.attr("stroke", "blue")
				.attr("fill", "none")
				.style("stroke", function(d) { return color(d); })
			
			// get length of the path
			const pathLength = path.node().getTotalLength();
			const transitionPath = d3
													.transition()
													.ease(d3.easeSin)
													.duration(2500);
			
			// setting path transition
			path.attr("stroke-dashoffset", pathLength)
					.attr("stroke-dasharray", pathLength)
					.transition(transitionPath)
					.attr("stroke-dashoffset", 0);

			var myLineChart = 
			group.selectAll('circle').data(energyProductionUSA).enter().append('circle')
				  .attr("r", 3.5)
				  .attr("cx", function(d, i) { return i*barWidth })
				  .attr("cy", function(d, i) { return yScale(d)})
					.attr("fill", "none")
					.on('mouseover', tip.show)
					.on('mouseout', tip.hide);
			
			// transition for points
			myLineChart.transition()
					.attr("fill", "skyblue")
					.attr("stroke", "black")	
					.delay(function(d, i) {
								return i*70;
							})
					.duration(2500);


			group.append("text")
				.attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
				.style("stroke", "grey")
				.attr("transform", "translate("+ (-40) +","+(chartHeight/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
				.text(energyTypeSelected);

			group.append("text")
				.attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
				.attr("transform", "translate("+ (chartWidth/2) +","+(chartHeight + 40)+")")  // centre below axis
				.style("stroke", "grey")
				.text("Time");	
				
			console.log("O: drawLineChart() EXIT --");
		}
		console.log(" F: firstTabFunc: EXIT");

	// 	d3.selectAll('#energyTypeList').on("change", function(d) {
	// 		drawChart();
  // })
	}	

window.onload = firstTabFunc;
