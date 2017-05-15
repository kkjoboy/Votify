$(function() {
    // Graph margin settings
    var margin = {
        top: 10,
        right: 10,
        bottom: 10,
        left: 80
    };

    // SVG width and height
    var width = 900;
    var height = 500;

    // Graph width and height - accounting for margins
    var drawWidth = 500;
    var drawHeight = 380;

    /************************************** Create chart wrappers ***************************************/
    // Create a variable `svg` in which you store a selection of the element with id `viz`
    // Set the width and height to your `width` and `height` variables
    var svg = d3.select("#vis1")
                .append("svg")
                .attr('width', width)
                .attr('height', height);
    // Append a `g` element to your svg in which you'll draw your bars. Store the element in a variable called `g`, and
    // Transform the g using `margin.left` and `margin.top`
   var g = svg.append('g')
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .attr('width', drawWidth)
            .attr('height', drawHeight);

    // Load data in using d3's csv function.
    d3.csv('data/RollCallData.csv', function(error, data) {
        /************************************** Data prep ***************************************/

        // You'll need to *aggregate* the data such that, for each device-app combo, you have the *count* of the number of occurances
        // Lots of ways to do it, but here's a slick d3 approach: 
        // http://www.d3noob.org/2014/02/grouping-and-summing-data-using-d3nest.html
        /************************************** Defining scales and axes ***************************************/
       /* var data = d3.nest()
                    .key(function(d) { return d.dim_device_app_combo;})
                    .rollup(function(g) { 
                        return g.length;
                    }).entries(data);*/
        // Create an `xScale` for positioning the bars horizontally. Given the data type, `d3.scaleBand` is a good approach.
        var xScale = d3.scaleBand()
                        .range([0,drawWidth])
                        .padding(0.1);
        xScale.domain(data.map(function(d) {return d.Year; }));
        // Using `d3.axisBottom`, create an `xAxis` object that holds can be later rendered in a `g` element
        // Make sure to set the scale as your `xScale`
        var xAxis = d3.axisBottom()
                        .scale(xScale);

        // Create a variable that stores the maximum count using `d3.max`, and multiply this valu by 1.1
        // to create some breathing room in the top of the graph.
        var max = d3.max(function (data){
            +d.Attend;
        })*1.1;
        var min = d3.min(function (data){
            +d.Attend;
        })*1.1;

        // Create a `yScale` for drawing the heights of the bars. Given the data type, `d3.scaleLinear` is a good approach.
        var yScale = d3.scaleLinear()
                        .range([drawHeight, 0]);

        yScale.domain([0, d3.max(data, function(d) { 
            return d.Attend; })]);

        var yAxis = d3.axisLeft(yScale);
        // Using `d3.axisLeft`, create a `yAxis` object that holds can be later rendered in a `g` element
        // Make sure to set the scale as your `yScale`



        /************************************** Rendering Axes and Axis Labels ***************************************/

        // Create an `xAxisLabel` by appending a `g` element to your `svg` variable and give it a class called 'axis'.
        // Transform the `g` element so that it will be properly positioned (need to shift x and y position)
        // Finally, use the `.call` method to render your `xAxis` in your `xAxisLabel`        
        var xLabel = svg.append("g")
                        .attr('transform', 'translate(' + (margin.left) + ',' + (drawHeight + margin.top) + ')')
                        .attr('class', 'axis')
                        .call(xAxis);                
        // To rotate the text elements, select all of the `text` elements in your `xAxisLabel and rotate them 45 degrees        
        // This may help: https://bl.ocks.org/mbostock/4403522
        xLabel.selectAll("text")
                .attr("y", 0)
                .attr("x", -5)
                .attr("transform", "rotate(-45)")
                .attr('class', 'title')
                .style("text-anchor", "end");

        // Create a text element to label your x-axis by appending a text element to your `svg` 
        // You'll need to use the `transform` property to position it below the chart
        // Set its class to 'axis-label', and set the text to "Device-App Combinations"
       var xText = svg.append("text")
            .attr('transform', 'translate(' + (margin.left + drawWidth)/2 + ',' + (drawHeight + margin.top + 90) + ')')
            .attr('class', 'axis-label')
            .text('Year');

        // Using the same pattern as your x-axis, append another g element and create a y-axis for your graph
        var yLabel = svg.append("g")
                        .attr('transform', 'translate(' + margin.left + ',' + (margin.top) + ')')
                        .attr('class', 'axis')
                        .call(yAxis);

        // Using the same pattern as your x-axis, append a text element to label your y axis
        // Set its class to 'axis-label', and set the text to "Count"
        var yText = svg.append('text')
                       .attr('transform', 'translate(' + (margin.left - 40) + ',' + ((margin.top+80) + drawHeight / 2) + ') rotate(-90)')
                        .attr('class', 'axis-label')
                        .text('Average Roll Call Attendance');

        /************************************** Drawing Data ***************************************/

        // Select all elements with the class 'bar' in your `g` element. Then, conduct a data-join
        // with your parsedData array to append 'rect' elements with `he class set as 'bar'
        var bars = g.selectAll('bar').data(data);
        
        // Determine which elements are new to the screen (`enter`), and for each element, 
        // Append a `rect` element, setting the `x`, `y`, `width`, and `height` attributes using your data and scales

        var myMouseOver = function() {
				var bar = d3.select(this);
				bar.style('fill', 'red' );
		}
        var myMouseOff = function() {
				var bar = d3.select(this);
				bar.style('fill', '#468966' );
		}

        bars.enter().append('rect')
            .merge(bars)
            .attr('class','bar')
            .attr('fill','#468966')
            .attr('x', function(d){
                return xScale(d.Year);
            })
            .attr('y', function(d) { 
                return yScale(d.Attend); 
            })
            .attr("width", xScale.bandwidth())
            .attr("height", function(d) { 
                return drawHeight - yScale(d.Attend);
            })
            .attr('title', function(d){
                return xScale(d.Attend);
            })
            .on("mouseover", myMouseOver)
            .on("mouseout", myMouseOff);
            
        bars.exit()
            .remove();

    });
});