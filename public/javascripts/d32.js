$(function() {
 
var data = [{
  values: [27, 73],
  labels: ['Conservative', 'Liberal'],
  type: 'pie'
}];

var layout = {
  height: 400,
  width: 800
};

Plotly.newPlot('vis2', data, layout);

});