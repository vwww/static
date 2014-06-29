series = null;
function addData() {
	// Data info
	var startTime = (new Date($('#startDate').val())).getTime();
	var maxTime = startTime + parseFloat($('#terms').val()) * 3.156e+10;
	var startValue = parseFloat($('#principal').val());
	var interest = 1 + parseFloat($('#interest').val()) / 100;
	var valueIncrement = 0.01;
	var timeIncrement = 1800000; // 30 minutes // 1 * 8.64e+7; // 1 day
	// Generate
	var lastTime = startTime;
	var lastValue = startValue;
	var data = [[startTime, startValue]];
	while (lastTime < maxTime) {
		lastTime += Math.max(timeIncrement, Math.log(1 + valueIncrement / lastValue) * 3.156e+10 / Math.log(interest));
		if(lastTime > maxTime)
			lastTime = maxTime;
		lastValue = startValue * Math.pow(interest, (lastTime - startTime) / 3.156e+10);
		data.push([lastTime, lastValue]);
	}
	series.setData(data);
}

function plotData() {
	addData();
	//return false;
}

$(function() {
// create the chart
$('#container').highcharts('StockChart', {

	title: {
		text: 'Compound Interest Graph'
	},

	yAxis: {
		type: 'logarithmic'
	},

	rangeSelector : {
		buttons : [{
			type : 'hour',
			count : 1,
			text : '1h'
		}, {
			type : 'day',
			count : 1,
			text : '1d'
		}, {
			type : 'week',
			count : 1,
			text : '1w'
		}, {
			type : 'week',
			count : 2,
			text : '2w'
		}, {
			type : 'month',
			count : 1,
			text : '1m'
		}, {
			type : 'month',
			count : 3,
			text : '3m'
		}, {
			type : 'month',
			count : 6,
			text : '6m'
		}, {
			type : 'ytd',
			text : 'YTD'
		}, {
			type : 'year',
			count : 1,
			text : '1y'
		}, {
			type : 'all',
			text : 'All'
		}],
		selected : 9,
		inputEnabled : false
	},

	series : [
	{
		name : 'Value',
		type : 'area',
		tooltip: {
			valueDecimals: 2
		},
		fillColor : {
			linearGradient : {
				x1: 0,
				y1: 0,
				x2: 0,
				y2: 1
			},
			stops : [
				[0, Highcharts.getOptions().colors[0]],
				[1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
			]
		},
		threshold: null
	},
	{
		type : 'flags',
		onSeries : 'dataseries',
		shape : 'circlepin',
		width : 16,
		data : [{
			x : (new Date()).getTime(),
			title : '!',
			text : 'Now'
		}]
	}
	]
}, function(chart) {
	series = chart.series[0];
	addData();
	window.setInterval(function(){
		/*chart.series[1].addPoint({
			x : (new Date()).getTime(),
			title : '!',
			text : 'Now'
		}, true, chart.series[1].data.length >= 1);*/
		chart.series[1].data[0].update({x : (new Date()).getTime()});
	}, 1000);
});

});