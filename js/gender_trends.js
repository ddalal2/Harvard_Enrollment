//------------- Resources -----------------
//Palette to create colors for each series
var gender_palette = new Rickshaw.Color.Palette();

var fields_of_study_totals = [
        "Biological Sciences/Life Sciences - Total",
        "Business Management and Administrative Services - Total",
        "Dentistry - Total",
        "Education - Total",
        "Engineering - Total",
        "Law - Total",
        "Medicine - Total",
                "Mathematics - Total",
"Physical Sciences - Total"];
 var fields_of_study = [
        "Biological Sciences/Life Sciences - Graduate",
        "Biological Sciences/Life Sciences - Total",
        "Biological Sciences/Life Sciences - Undergraduate",
        "Business Management and Administrative Services - Total",
        "Dentistry - Total",
        "Education - Total",
        "Engineering - Graduate",
        "Engineering - Total",
        "Engineering - Undergraduate",
        "Law - Total",
        "Mathematics - Graduate",
        "Mathematics - Total",
        "Mathematics - Undergraduate",
        "Medicine - Total",
        "Physical Sciences - Graduate",
        "Physical Sciences - Total",
        "Physical Sciences - Undergraduate"]

//-------Functions------------
//Create Rickshaw Series - used for plotting valueson time series



//Load Data using d3.json 
d3.json("data.json", function(error, json) {
  data = json;

  var years = ['2006', '2008', '2010', '2012'];

  var series = []
  //Loop over each year and create the coordinate set to plot
  $.each(fields_of_study_totals, function(index,field){
        series.push(create_series(years,field));
  });
  var data2 = [ { x: 0, y: 40 }, { x: 1, y: 49 }, { x: 2, y: 17 }, { x: 3, y: 42 } ];

var graph2 = new Rickshaw.Graph( {
        element: document.querySelector("#gchart"),
        width: 580,
        height: 250,
        series: [ {
                color: 'steelblue',
                data: data2
        } ]
} );

graph2.render();
           


});

