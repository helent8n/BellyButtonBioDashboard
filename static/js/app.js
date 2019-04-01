function buildMetadata(sample) {

  // using d3.json to fetch the metadata for a sample == @app.route("/metadata/<sample>")
  // http://learnjsdata.com/read_data.html
  var url = `/metadata/${sample}`;

  d3.json(url).then(function(sampleMetadata){
    console.log(sampleMetadata);
  // use d3 to select the panel with id of `#sample-metadata`
  var panel = d3.select("#sample-metadata");

  // Use `.html("") to clear any existing metadata
  panel.html("");
  
// using `Object.entries` to add each key and value pair to the panel
// using d3 to append new tags for each key-value in the metadata.
// looping over object with keys and values https://www.bram.us/2016/11/24/es6es2015-looping-over-an-object-with-keys-and-values/ 
  for (const [key,value] of Object.entries(sampleMetadata)) {
    panel.append('h6').text(`${key}, ${value}`)
  }
})
}

function buildCharts(sample) {

  // using d3.json to fetch the sample data for plots == @app.route("/samples/<sample>")
  var url = `/samples/${sample}`;

  d3.json(url).then(function(sampleData){
    console.log(sampleData);

  //console.log(sampleData.otu_ids.slice(0,10));
  //console.log(sampleData.otu_labels.slice(0,10));
  //console.log(sampleData.sample_values.slice(0,10));
  
  //display top 10 samples using slice
  var otu_ids = sampleData.otu_ids.slice(0,10); 
  var otu_labels = sampleData.otu_labels.slice(0,10);
  var sample_values = sampleData.sample_values.slice(0,10);
    
    
  // pie chart
    var pieData = [{
      values: sample_values,
      labels: otu_ids,
      hovertext: otu_labels,
      hoverinfo: 'hovertext',
      type: 'pie'
    }];

    var pieLayout = {
      height: 450,
      width: 500
    };

    Plotly.plot('pie', pieData, pieLayout); 


  //bubble chart
  var xvalues = sampleData.otu_ids;
  var yvalues = sampleData.sample_values;
  var mtext = sampleData.otu_labels;
  var msize = sampleData.sample_values;
  var mcolor = sampleData.otu_ids;


  var bubbleData = [{
      x: xvalues,
      y: yvalues,
      text: mtext,
      mode: 'markers',
      marker: {
        size: msize,
        color: mcolor
      }
    }];      

  var bubbleLayout = {
      margin: { t: 0 },
      hovermode: 'closest',
      xaxis: {title: 'OTU ID'},
    };

    Plotly.plot('bubble', bubbleData, bubbleLayout);
    
  });

}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
