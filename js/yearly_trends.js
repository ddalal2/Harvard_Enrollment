//------------- Resources -----------------
//Epoch seconds are Unix timestamps which rickshaw relies on for displaying years on the x axis
var epoch_times = {"2006":1136091600, "2008":1199163600, "2010" : 1262322000, "2012" : 1325394000}
var reverse_epoch = {1136091600 : "2006", 1199163600 : "2008", 1262322000 : "2010", 1325394000 : "2012"}
//Palette to create colors for each series
var palette = new Rickshaw.Color.Palette();

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

//Used for mapping categorial values for X axsis 
var field_map = {"Biological Sciences/Life Sciences - Total" : 1,
  "Business Management and Administrative Services - Total" : 2,
  "Dentistry - Total" : 3,
  "Education - Total" : 4,
  "Engineering - Total" : 5,
  "Law - Total" : 6,
  "Medicine - Total" : 7,
  "Mathematics - Total" : 8,
  "Physical Sciences - Total" : 9};

  var field_map_reverse = { 
              1 : "Bio/Life",
              2 : "Business",
              3 : "Dentistry",
              4: "Education",
              5: "Engineering - Total",
              6: "Law - Total",
              7: "Medicine - Total",
              8: "Mathematics - Total",
              9: "Physical Sciences - Total"};


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
function create_trend_plots(years, field) {
        
        plot_data = []
        $.each(years, function(index, year){
           try {
                total = data[year]['Fields of Study'][field]['Grand total']
           }
           catch(err) {
               total = "N/A"
           }     
           if(total != "N/A")
                plot_data.push({"x":epoch_times[year], "y":total})     
        });     

        formatted_name = field.split("-")[0]

        all_plots = {
                name: formatted_name,
                key : field,
                data: plot_data,
                color: palette.color()
        };

        return all_plots; 
}

function create_gender_series(year, data) {
      men_series = [];
      women_series = [];
      $.each(fields_of_study_totals, function (index, field){
         try {
              male_total = data[year]['Fields of Study'][field]['Total men'];
              female_total = data[year]['Fields of Study'][field]['Total women'];
         }
         catch(err){
              male_total = 0;
              female_total = 0;
         }
         men_series.push({"x": field_map[field] , "y": male_total});
         women_series.push({"x": field_map[field] , "y": female_total});

      });

      gender_plots = [{     name: "Men",
                            data: men_series,
                            color: "#336699" },
                        {   name: "Women",
                            data: women_series,
                            color: "#AA0078" }];
      return gender_plots;
       
}

//Create Graph
function create_trend_graph(series, data){
        var graph = new Rickshaw.Graph( {
                element: document.querySelector("#chart"),
                renderer: 'line',
                width: 600,
                height: 250,
                series: series 
        } );

        //create an X axis
        var x_axis = new Rickshaw.Graph.Axis.Time( { graph: graph } );

        //create a legend 
        var legend = new Rickshaw.Graph.Legend( {
                element: document.querySelector('#legend'),
                graph: graph
        } );

        //allow ability to filter by series
        var shelving = new Rickshaw.Graph.Behavior.Series.Toggle({
            graph: graph,
            legend: legend
        });

        //highlight selected series
        var highlighter = new Rickshaw.Graph.Behavior.Series.Highlight({
            graph: graph,
            legend: legend
        });

        var hoverDetail = new Rickshaw.Graph.HoverDetail( {
        graph: graph,
        formatter: function(series, x, y) {

               total = y;
               men = data[reverse_epoch[x]]["Fields of Study"][series.key]["Total men"]
               women = data[reverse_epoch[x]]["Fields of Study"][series.key]["Total women"]
               name = series.name.split("-")[0];
               var content = "<b>"+name + "</b><br>" + 
               "Total Enrollment: " + y + "<br>" +
               "Men: " + parseInt((men/total) * 100) + "%<br>" +
               "Women: " + parseInt((women/total) * 100) + "%<br>";
                return content
         }
        });
        var yAxis = new Rickshaw.Graph.Axis.Y({
            graph: graph
        });

        yAxis.render();
        graph.render();
}

// Create Gender Graph
function create_gender_graph(series){
   
    var data = series;

    var gender_graph = new Rickshaw.Graph( {
            element: document.querySelector("#gchart"),
            width: 800,
            height: 250,
            renderer : 'bar',
            stack: false,
            series: data
    } );

    var legend = new Rickshaw.Graph.Legend({
            graph: gender_graph,
            element: document.querySelector('#glegend')
            });

    var xAxis = new Rickshaw.Graph.Axis.X({
    graph: gender_graph,
    tickFormat: function(x) {return field_map_reverse[x]}
    });

    xAxis.render();

    var shelving = new Rickshaw.Graph.Behavior.Series.Toggle({
            graph: gender_graph,
            legend: legend
        });

    var highlighter = new Rickshaw.Graph.Behavior.Series.Highlight({
            graph: gender_graph,
            legend: legend
        });

    var hoverDetail = new Rickshaw.Graph.HoverDetail( {
                    graph: gender_graph
                } );

    gender_graph.render();


}
//Load Data using d3.json 
d3.json("data.json", function(error, json) {
  data = json;

  var years = ['2006', '2008', '2010', '2012'];

  var series = [];

  //Loop over each year and create the coordinate set to plot
  $.each(fields_of_study_totals, function(index,field){
        series.push(create_trend_plots(years,field));
  });

  //Set defalty year for gender graph to 2012. User can select another year on UI
  default_year = 2012
  gender_series = create_gender_series(default_year, data);
  
  
  //Generate Visualizations 
  create_trend_graph(series,data);           
  create_gender_graph(gender_series)  

});

