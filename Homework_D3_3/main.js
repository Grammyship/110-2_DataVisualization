// set up the canvas

// scatterplot attributes
const scatterLeft = 0, scatterTop = 0;
const scatterTotalWidth = 500, scatterTotalHeight = 400;
const scatterMargin = {LEFT: 100, TOP:10, RIGHT: 30, BOTTOM: 30 },
      scatterWidth = scatterTotalWidth - scatterMargin.LEFT - scatterMargin.RIGHT,
	  scatterHeight = scatterTotalHeight - scatterMargin.TOP - scatterMargin.BOTTOM;


// line Chart attributes
const lineLeft = 0, lineTop = 400;
const lineTotalWidth = 600, lineTotalHeight = 100;
const lineMargin = {LEFT: 100, TOP:10, RIGHT: 30, BOTTOM: 10 },
      lineWidth = lineTotalWidth - lineMargin.LEFT - lineMargin.RIGHT,
	  lineHeight = lineTotalHeight - lineMargin.TOP - lineMargin.BOTTOM; 


// bar Chart attributes
const barLeft = 0, barTop = 550;
const barTotalWidth = 1000, barTotalHeight = 150;
const barMargin = {LEFT: 100, TOP:30, RIGHT: 30, BOTTOM: 40 },
      barWidth = barTotalWidth - barMargin.LEFT - barMargin.RIGHT,
	  barHeight = barTotalHeight - barMargin.TOP - barMargin.BOTTOM; 


// map attributes
const mapLeft = 500-200, mapTop = 0-150;
const mapTotalWidth = 1000, mapTotalHeight = 800;
const mapMargin = {LEFT: 10, TOP:10, RIGHT: 10, BOTTOM: 10 },
      mapWidth = mapTotalWidth - mapMargin.LEFT - mapMargin.RIGHT,
	  mapHeight = mapTotalHeight - mapMargin.TOP - mapMargin.BOTTOM; 




let svg = d3.select("#chart-area").append("svg")
			  .attr("width", 2000)
			  .attr("height", 2000)



// highPollution.csv
path_highPollution = "highPollution.csv";
d3.csv(path_highPollution).then(data => {

	/*****************************************
	*	Practice1: JavaScript Data Process	 *
	*****************************************/

	// convert all data to numbers
	data.forEach(function(d){
		d.day = Number(d.day);
		d.hour = Number(d.hour);
		d.year = Number(d.year);
		d.month = Number(d.month);
		d.weekday = Number(d.weekday);
		d.gps_lat = Number(d.gps_lat);
		d.gps_lon = Number(d.gps_lon);

		// d.value: remove square brackets of the value string
		//			and calculate the average
		let arr = d.value.substr(1,d.value.length-2).split(',');
		for( let i = 0; i < arr.length; ++i ){
			arr[i] = Number(arr[i]);
		}
		d.value = arr;

		d.umapX = Number(d.umapX);
		d.umapY = Number(d.umapY);
	});

	// console.log(data);






	/*****************************
	*	Practice2: Scatterplot	 *
	*****************************/

	// x/y-axis
	var maxX = d3.max(data, function(d){return d.umapX}),
		minX = d3.min(data, function(d){return d.umapX});
	var maxY = d3.max(data, function(d){return d.umapY}),
		minY = d3.min(data, function(d){return d.umapY});

	// console.log("x:" + [minX,maxX]);
	// console.log("y:" + [minY,maxY]);

	var scatterScaleX = d3.scaleLinear()
				   .domain([minX,maxX])
				   .range([0,scatterWidth]), 
		scatterScaleY = d3.scaleLinear()
				   .domain([minY,maxY])
				   .range([0,scatterHeight]);



	// color
	var maxValue = d3.max(data, function(d){return d3.mean(d.value)});
	var minValue = d3.min(data, function(d){return d3.mean(d.value)});
	
	//console.log("maxValue:"+ maxValue );

	var interRed = d3.scaleLinear().domain([minValue,maxValue]).range([0.0,1.0]);



	// create space for scatterplot
	let scatter = svg.append("g")
				   	 .attr("id", "scatterplot")
				   	 .attr("transform", `translate(${scatterLeft+scatterMargin.LEFT}, ${scatterTop+scatterMargin.TOP})`);



	// points
	let circles = d3.select("#scatterplot")
					.selectAll("circle")
					.data(data);

	circles.enter()
		   .append("circle")
		   .attr("cx", function(d){
				return scatterScaleX(d.umapX);
			})
			.attr("cy", function(d){
				return scatterHeight-scatterScaleY(d.umapY);
			})
			.attr("r", 2)
			.attr("fill", function(d){
				return d3.interpolateReds(interRed(d3.mean(d.value)));
			});



	// axes
	var scatterXAxis = d3.scaleLinear().range([0,scatterWidth]),
		scatterYAxis = d3.scaleLinear().range([0,scatterHeight]);
	var scatterAxisB = d3.axisBottom(scatterXAxis).tickFormat(' ');
	var	scatterAxisL = d3.axisLeft(scatterYAxis).tickFormat(' ');

	scatter.append("g")
		   .call(scatterAxisL)
		   .append('g')
	 	   .attr("transform", `translate(0,${scatterHeight})`)
	 	   .call(scatterAxisB);






	/****************************
	*	Practice3: Line Chart	*
	****************************/

	// scale the line data
	var lineScaleX = d3.scaleLinear()
					   .domain([-3,3])
					   .range([0,lineWidth]),
		lineScaleY = d3.scaleLinear()
					   .domain([d3.min(data,function(d){return d3.min(d.value);}),d3.max(data,function(d){return d3.max(d.value);})])
					   .range([0,lineHeight]);


	// create space for line Chart
	let lineChart = svg.append("g")
		   			   .attr("id", "lineChart")
		   			   .attr("transform", `translate(${lineLeft+lineMargin.LEFT}, ${lineTop+lineMargin.TOP})`);

	// labels
	lineChart.append("text")
			.attr("x", lineWidth/2)
			.attr("y", lineHeight+40)
			.attr("font-size", "14px")
			.attr("text-anchor", "middle")
			.text("Local Time(hour)")
	lineChart.append("text")
			.attr("x", -(lineHeight/2))
			.attr("y", -50)
			.attr("font-size", "14px")
			.attr("text-anchor", "middle")
			.attr("transform","rotate(-90)")
			.text("PM 2.5");



	// make pathData
	data.forEach( function(d){
		d.lineData = []
		for( let i = 0; i < d.value.length; ++i )
		{
			d.lineData.push([lineScaleX(i-3),lineHeight-lineScaleY(d.value[i])]);
		}
		d.lineData = d3.line()(d.lineData);
		//console.log(d.lineData);
	});


	// draw the graph
	let lines = d3.select("#lineChart")
					.selectAll("path")
					.data(data)
					.enter()
					.append("path")
					.attr("d", function(d){return d.lineData;})
					.attr("fill", "none")
					.attr("stroke", "black")
					.attr("opacity", 0.1);


	// axes
	var lineXAxis = d3.scaleLinear().domain([-3,3]).range([0,lineWidth]);
		lineYAxis = d3.scaleLinear()
					  .domain([d3.min(data,function(d){return d3.min(d.value);}),d3.max(data,function(d){return d3.max(d.value);})])
					  .range([lineHeight,0]);
	var lineAxisB = d3.axisBottom(lineXAxis).tickValues([-3,-2,-1,0,1,2,3]);
	var	lineAxisL = d3.axisLeft(lineYAxis).ticks(10);

	lineChart.append("g")
			 .call(lineAxisL)
		 	 .append('g')
	 	 	 .attr("transform", `translate(0,${lineHeight})`)
	 	 	 .call(lineAxisB)





	/***************************
	*	Practice4: Bar Chart   *
	***************************/


	// mark the min/max day/hour
	var maxDay = d3.max(data, function(d){return d.day}),	// 24
		minDay = d3.min(data, function(d){return d.day});	// 18
	var maxHour = d3.max(data, function(d){return d.hour}),	// 23
		minHour = d3.min(data, function(d){return d.hour});	// 0

	//console.log("Day:"+[minDay,maxDay]);
	//console.log("Hour:"+[minHour,maxHour]);


	// bar Chart Data
	var barData = []

	// initialize
	for( let i = minDay; i <= maxDay; ++i )	// 7 days
	{
		for( let j = minHour; j <= maxHour; ++j )	// 24 hours
		{
			barData[(i-minDay)*(maxHour-minHour+1) + (j-minHour)] = 0;
		}
	}

	// take the data
	data.forEach( function(d){
		barData[(d.day-minDay)*(maxHour-minHour+1) + d.hour-minHour ] += 1;
	});

	// remove 0's of the data
	var head = barData.length, tail = 0;
	for( let i = 0; i < barData.length; ++i )
	{
		if( barData[i] != 0 && head == barData.length )
		{
			head = i;
		}
		if( barData[barData.length-i-1] != 0 && tail == 0 )
		{
			tail = barData.length-i-1;
		}

	}

	barData = barData.slice(head,tail);
	//console.log(barData);



	// create space for line Chart
	let barChart = svg.append("g")
		   			   .attr("id", "barChart")
		   			   .attr("transform", `translate(${barLeft+barMargin.LEFT}, ${barTop+barMargin.TOP})`);
	// labels
	barChart.append("text")
			.attr("x", barWidth/2)
			.attr("y", barHeight+50)
			.attr("font-size", "14px")
			.attr("text-anchor", "middle")
			.text("Time")
	barChart.append("text")
			.attr("x", -(barHeight/2))
			.attr("y", -50)
			.attr("font-size", "14px")
			.attr("text-anchor", "middle")
			.attr("transform","rotate(-90)")
			.text("Number of Devices");

	// axes' attribute
	var barXAxis = d3.scaleLinear().domain([0,barData.length]).range([0,barWidth]);
		barYAxis = d3.scaleLinear()
					  .domain([d3.min(barData),d3.max(barData)])
					  .range([barHeight,0]);
	var barAxisB = d3.axisBottom(barXAxis).ticks(tail-head).tickFormat(function(d,i){
												if( i % 2 == 0 )
												{
													return (parseInt((i+head+1)/24)+18)+"-"+((i+head+1) % 24);
												}
											});
	var	barAxisL = d3.axisLeft(barYAxis).ticks(6);

	// draw the axes
	barChart.append("g")
			 .call(barAxisL)
		 	 .append('g')
			 .attr("class","barX")
	 	 	 .attr("transform", `translate(0,${barHeight})`)
	 	 	 .call(barAxisB)
			 .selectAll("text")
			 .attr("dx", "-15")
			 .attr("dy", "5")
			 .attr("transform", "rotate(-60)");


	// color
	var interBuGn = d3.scaleLinear().domain([0,23]).range([0.0,1.0]);
	

	// draw the graph
	let bars = d3.select("#barChart")
					.selectAll("rect")
					.data(barData);
	bars.enter().append("rect")
		.attr("x", function(d,i){return barXAxis(i)})
		.attr("y", function(d,i){return barYAxis(barData[i])})
		.attr("width", barWidth/(tail-head))
		.attr("height", function(d,i){return barHeight-barYAxis(barData[i])})
		.attr("fill", function(d,i){return d3.interpolateBuGn(interBuGn((i+head)%24))})
		.attr("stroke", "black")
		.attr("stroke-width", "1px");






	/*****************************************
	*	Practice5: Map and Customized Mark   *
	*****************************************/

    // create space for Map
	let mapTaiwan = svg.append("g")
						.attr("id", "mapTaiwan")
						.attr("transform", `translate(${mapLeft+mapMargin.LEFT}, ${mapTop+mapMargin.TOP})`)

	let mapMarks = svg.append("g")
					  .attr("id", "mapMarks")
					  .attr("transform", `translate(${mapLeft+mapMargin.LEFT}, ${mapTop+mapMargin.TOP})`)

	var width = 1000,
		height = 800;

	d3.json("taiwan.json").then(drawTaiwan);

	function drawTaiwan(taiwan)
	{

		var projection = d3.geoEquirectangular()
							.fitExtent([[0,0], [width, height]], taiwan);

		var geoGenerator = d3.geoPath().projection(projection);

		var paths = d3.select("#mapTaiwan")
						.selectAll('path')
						.data(taiwan.features)
						.enter()
						.append('path')
						.attr("stroke", "black")
						.attr("fill", "white")
						.attr("d",geoGenerator)

	}


	var lineScaleX = d3.scaleLinear()
					   .domain([0,0])
					   .range([0,width]),
		lineScaleY = d3.scaleLinear()
					   .domain([0,0])
					   .range([width,height]);



/*
	var site = "M0,0 C50,40 50,70 20,100 L0,85 L-20,100 C-50,70 -50,40 0,0";
	var symbols = d3.select("#mapMarks")
					.selectAll("path")
					.data(data)
					.enter()
					.append("path")
					.attr("d", site)
					.attr("stroke", "black")
					.attr("fill","red")
					.attr("cx", function(d){ return projection([d.gps_lon, d.gps_lat])[0];})
					.attr("cy", function(d){ return projection([d.gps_lon, d.gps_lat])[1];})
*/
}).catch( function(err) {
	console.log(err);
});