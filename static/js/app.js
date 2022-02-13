function getstartup() {

  
  var selector = d3.select('#selDataset');

  d3.json("data/samples.json").then(function(samplesData){
      var names = samplesData.names;

      selector.selectAll('option')
          .data(names)
          .enter()
          .append('option')
          .attr('value', d => d)
          .text(d => d);

   
      var starter = names[0];

    
      buildPlots(starter);
      demographics(starter);

  }).catch(error => console.log(error));
}


function optionChanged(newID){
  buildPlots(newID);
  demographics(newID);
}


function buildPlots(id) {
  
  d3.json("data/samples.json").then(function(samplesData){
    
      var filtered = samplesData.samples.filter(sample => sample.id == id);
      var result = filtered[0];
    
      Data = [];
      for (i=0; i<result.sample_values.length; i++){
          Data.push({
              id: `OTU ${result.otu_ids[i]}`,
              value: result.sample_values[i],
              label: result.otu_labels[i]
          });
      }
    
      var Sorted = Data.sort(function sortFunction(a,b){
          return b.value - a.value;
      }).slice(0,10);
    
      var reversed = Sorted.sort(function sortFunction(a,b){
          return a.value - b.value;
      })
    
      var colors = ['#aba11b', '#ba7016', '#ad2f39', '#850c54', '#7d069c', '#273eb0', '#00bcf2', '#00b294', '#009e49', '#bad80a']
      var traceBar = {
          type: "bar",
          orientation: 'h',
          x: reversed.map(row=> row.value),
          y: reversed.map(row => row.id),
          text: reversed.map(row => row.label),
          mode: 'markers',
          marker: {
              color: colors
          }
        };
      
      var Bardata = [traceBar];
        
      var Barlayout = {
          title: `<span style='font-size:1em; color:#0800f2'><b>Top 10 Bacteria Cultures Found ${id}<b></span>`,
          xaxis: {autorange: true, title: 'Sample Values'},
          yaxis: {autorange: true},
          width: 500,
          height: 500
        };
      
    
      Plotly.newPlot("bar", Bardata, Barlayout);

    
      var traceBubble = {
          x: result.otu_ids,
          y: result.sample_values,
          mode: 'markers',
          marker: {
              size: result.sample_values,
              color: result.otu_ids,
              colorscale: 'Jet'
          },
          text: result.otu_labels
      };

      var Bubbledata = [traceBubble]

      var Bubblelayout = {
          title: `<span style='font-size:1em; color:#00bcf2'><b>Bacteria Cultures Per Sample ${id}<b></span>`,
          xaxis: {title:'OTU ID'},
          yaxis: {title: 'Sample Values'},
          width: window.width
      };

     
      Plotly.newPlot('bubble', Bubbledata, Bubblelayout);

  }).catch(error => console.log(error));
}


function proper(str){
  return str.toLowerCase().split(' ').map(letter => {
      return (letter.charAt(0).toUpperCase() + letter.slice(1));
  }).join(' ');
}


function demographics(id) {

  d3.json('data/samples.json').then(function(samplesData){
      var filtered = samplesData.metadata.filter(sample => sample.id == id);
      
      var selection = d3.select('#sample-metadata');

    
      selection.html('');

    
      Object.entries(filtered[0]).forEach(([k,v]) => {
          
          selection.append('h5')
              .text(`${proper(k)}: ${v}`);
      });

      
    
      var traceGauge = {
          type: 'indicator',
          mode: 'gauge+number',
          title: {
              text: `<span style='font-size:0.8em; color:#00bcf2'><b>Belly Button Washing Frequency<b><br>From Subject ${id}<br># of Scrubs</span>`
          },
          subtitle: {text: `# Scrubs per week`},
          domain: {
              x: [0,5],
              y: [0,1]
          },
          value: filtered[0].wfreq,
          gauge: {
              axis: {
                  range: [null, 9]
              },
              steps: [
                  {range: [0,2], color: '#6eb043'},
                  {range: [2,4], color: '#e3e320'},
                  {range: [4,6], color: '#15e6c3'},
                  {range: [6,8], color: '#b827ba'},
                  {range: [8,10], color: '#1a2f96'}   
              ],
              threshold: {
                  line: {color: 'red', width: 4},
                  thickness: 0.75,
                  value: 6
              }
          }
      };

      var Gaugedata = [traceGauge];

      var Gaugelayout = {
          width: 350,
          height: 350,
          margin: {t: 25, r:10, l:25, b:25}
      };

    
      Plotly.newPlot('gauge', Gaugedata, Gaugelayout);
  }).catch(error => console.log(error));
}

getstartup();