'use strict'
console.clear();

const EDUCATION_URL = 'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json';

const MAP_URL = 'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json';

const title = d3.select("header")
                .append("text")
                .attr("id", "title")
                .classed("title", true)
                .text("Educational Attainment in the United States");

const description = d3.select(".title")
                   .append("text")
                   .attr("id", "description")
                   .classed("description", true)
                   .text("Percentage of adults age 25 and older with a bachelor's degree or higher (2010 - 2014)")

const w = 1200;
const h = 700;
const margin = {
   top: 50,
   bottom: 80,
   left: 120,
   right: 40
};

const width = w - margin.left - margin.right;
const height = h - margin.top - margin.bottom;

const svg = d3.select("main").append("svg")
              .attr("id", "graphSVG")
              .attr("width", w)
              .attr("height", h);             

//d3.geo.path(): D3 Geo Path Data Generator helper class for generating SVG Path instructions from GeoJSON data.
//Can then pass this SVG Path instructions to the "d" attribute of the SVG path to display SVG Path on screen.
const path = d3.geoPath();

//Chart x-scale
//Use rangeRound() instead of range()-- values output by the scale will be rounded to the nearest whole number. 
//This gives shapes exact pixel values (avoids fuzzy edges).
const x = d3.scaleLinear() 
            .rangeRound([600, 860]);  

//d3-scale-chromatic module provides color schemes to be used with d3-scales 
const colorScale = d3.scaleThreshold()
                     .range(d3.schemeBuPu[9]);  //.domain is in plot()

const chart = svg.append("g")
                 .classed("chart", true)
                 .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const legendAxis = d3.axisBottom(x)        //.tickValues() is in plot
                     .tickFormat(d3.format(".0f"))  
                     .tickSize(15)
                     .tickPadding(10)
                     .tickSizeOuter(0);

const legendRectLocationY = 5;  
const legendRectHeight = 15;

//Initialize tooltip
//N.B. Use d3 tip version compatible w/d3 v.4
//https://cdnjs.cloudflare.com/ajax/libs/d3-tip/0.7.1/d3-tip.min.js
const tip = d3.tip()      
              .attr("class", "d3Tip")
              .attr("id", "tooltip")   //attr data-education for county on hover in plot() (on mouseover)
              .html(d => d)
              .direction("s")      
              .offset([22,0]);  //vertical tooltip offset

function plot(params) {
   let match;
   let minPercentBachelors = d3.min(params.dataEduc.map(d => d.bachelorsOrHigher));
   let maxPercentBachelors = d3.max(params.dataEduc.map(d => d.bachelorsOrHigher)); 

   x.domain([minPercentBachelors, maxPercentBachelors])
   colorScale.domain(d3.range(minPercentBachelors, maxPercentBachelors, (maxPercentBachelors - minPercentBachelors)/8));
      
   legendAxis.tickValues(colorScale.domain());
   
   //legend
   let legend = this.append("g")
                    .attr("id", "legend")
                    .classed("legend", true)
                    .attr("transform", "translate(" + (margin.right-40) + "," + legendRectLocationY + ")");
   
   legend.selectAll("rect")
   //Ref: https://stackoverflow.com/questions/48161257/understanding-invertextent-in-a-threshold-scale
   //invertExtent() returns the extent of values in the domain [x0, x1] for the corresponding value in 
   //the range, representing the inverse mapping from range to domain.
   //d = [color1, color2] => d[0], d[1] for each segment or "rect" in colorScale
   //For each "d" which is an array of 2 colors, use color.invertExtent(d) to get the corresponding 
   //min and max value (or extent of values) in the domain. 
   //Need conditional statements because first and last values of range can be undefined 
   //(e.g. [undefined, 0] and [1, undefined]
       .data(colorScale.range().map( d => {
          d = colorScale.invertExtent(d);  
          if (d[0] == null) d[0] = x.domain()[0];
          if (d[1] == null) d[1] = x.domain()[1];
          return d;
       }))
       .enter()
          .append("rect")
          .attr("height", legendRectHeight)
          .attr("x", d => x(d[0]))
          .attr("y", legendRectLocationY)                   
          .attr("width", d => x(d[1]) - x(d[0]))
          .attr("fill", d => colorScale(d[0]))  
   
   //legend text label
   legend.append("text")
       .attr("class", "legend-label")
       .attr("x", x.range()[0])   
       .attr("y", legendRectLocationY - 10)
       .attr("fill", "#000")
       .attr("text-anchor", "start")
       .text("Educational Attainment (%)")
   
   //legend axis
   legend.append("g")
         .classed ("legendAxis", true)
         .attr("transform", "translate(0," + legendRectLocationY + ")")      
         .call(params.axis);
   
   //Invoke tip in context of visualization (i.e. chart)
   this.call(tip)
   
   let counties = topojson.feature(params.dataMap, params.dataMap.objects.counties).features;
   
   //map counties
   this.append("g")
       .classed("counties", true)  
       .selectAll("path")
       .data(counties)
       .enter()
          .append("path")
          .classed("county", true)
          .attr("data-fips", d => d.id)  
          //Link 2 data sources via id (fips). filter() returns an array with a singular match (i.e. hence match[0])
          .attr("data-education", d => {
               match = params.dataEduc.filter(item => item.fips == d.id); 
               return match[0] ? match[0].bachelorsOrHigher : 0;  
          })
          .attr("fill", d => {
               match = params.dataEduc.filter(item => item.fips == d.id);
               return match[0] ? colorScale(match[0].bachelorsOrHigher) : colorScale(0);
          })
          .attr("d", path)  //d attribute displays data that has been converted to SVG path instructions by d3.geoPath() (variable path)
          .on("mouseover", function(d,i) {
               match = params.dataEduc.filter(item => item.fips == d.id);
               let matchHtml = `<p>${match[0].area_name}, ${match[0].state}:<span class="d3TipTextHilight">${match[0].bachelorsOrHigher}%</span></p>`;
               let html = match[0] ? matchHtml : 0;
      
               tip.attr("data-education", match[0] ? match[0].bachelorsOrHigher : 0);
          
               tip.show(html);
      
               d3.select(this).style("fill", "#7DFDFE")    //highlight county on hover
                              .classed("hover-county", true);                             
          })
          .on("mouseout", function(d,i) {
               tip.hide()  
              
               d3.select(this).style("fill", d => {
                  match = params.dataEduc.filter(item => item.fips == d.id);
                  return match[0] ? colorScale(match[0].bachelorsOrHigher) : colorScale(0);
               })
                 .classed("hover-county", false)
          })
         
    let states = topojson.feature(params.dataMap, params.dataMap.objects.states);
   
    //states boundaries
    this.append("path")
       .datum(states)
       .classed("states", true)
       .attr("d", path);    
}

//Use queue to handle asynchronous functions with callbacks
d3.queue()
  .defer(d3.json, MAP_URL)           //jsonMap
  .defer(d3.json, EDUCATION_URL)     //jsonEduc
  .await(ready);


function ready(error, jsonMap, jsonEduc) {
   if(error) throw error;
   
   plot.call(chart, {      
      //params to pass to plot()
      dataMap: jsonMap,
      dataEduc: jsonEduc,
      axis: legendAxis
   })
}  