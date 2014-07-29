//------------- Resources -----------------
// Fields of Study Mappings
var data;
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

var fields_of_study_formatted = [
        "Biological Sciences/Life Sciences",
        "Business Management and Administrative Services",
        "Dentistry",
        "Education",
        "Engineering",
        "Law - Total",
        "Medicine",
        "Mathematics",
        "Physical Sciences"];

var races_2006 = [
"American Indian or Alaska Native total",
"Asian or Pacific Islander total",
"Black non-Hispanic total",
"Hispanic total",
"Race/ethnicity unknown total",
"White non-Hispanic total",
];

var races_2008 = [
"American Indian or Alaska Native total - derived",
"Asian/Native Hawaiian/Other Pacific Islander total - derived",
"Black or African American/Black non-Hispanic total - derived", 
"Hispanic or Latino/Hispanic total - derived",
"Native Hawaiian or Other Pacific Islander total - new",
"Race/ethnicity unknown total",
"White/White non-Hispanic total - derived"
];

var races_2010 = [
"American Indian or Alaska Native total",
"Asian total",
"Black or African American total",
"Hispanic total",
"Native Hawaiian or Other Pacific Islander total",
"Race/ethnicity unknown total",
"White total"
];

var races_2012 = [
"American Indian or Alaska Native total",
"Asian total",
"Black or African American total",
"Hispanic total",
"Native Hawaiian or Other Pacific Islander total",
"Race/ethnicity unknown total",
"White total"
];

var race_values = {2006 : races_2006, 2008 : races_2008, 2010 : races_2010, 2012 : races_2012};

// 

//------------------------------------------------------------

// Get trend data 
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
                plot_data.push(total)     
        });     

        formatted_name = field.split("-")[0]

        all_plots = {
            name : formatted_name,
            data : plot_data
                
        };

        return all_plots; 
}
// Get data for gender breakdown chart
function create_gender_series(year, data) {
      men_series = [];
      women_series = [];
      $.each(fields_of_study_totals, function (index, field){
         try {
              male_total = data[year]['Fields of Study'][field]['Total men'];
              female_total = data[year]['Fields of Study'][field]['Total women'];
         }
         catch(err){
              male_total = 'n/a';
              female_total = 'n/a';
         }
         men_series.push(male_total);
         women_series.push(female_total);

      });

      gender_plots = [{ name: "Men", data: men_series, color: "#4682B4"},
                      { name: "Women", data: women_series, color: "#BA55D3"}];
      return gender_plots;
       
} 

function create_gr_series(year, field, data){
  var men_series = [];
  var women_series = [];
  var race_index = race_values[year];
  $.each(race_index, function(index, race){
          // For automation of pulling in race categories. Strip the word total at the end
          race_base = race.split("total")[0];
          //get totals by race for each gender
            try{
                  men_total = data[year]["Fields of Study"][field][race_base + "men"];
                  women_total = data[year]["Fields of Study"][field][race_base + "women"];
             }
             catch(err)
             {
              men_total = '0';
              women_total = '0';
             }
             

            men_series.push(men_total);
            women_series.push(women_total); 
        });
        var plot_data = [{name :"Women", data: women_series, color: "#BA55D3"},{name: "Men", data: men_series, color: "#4682B4"}];
        return plot_data;
}

//----------------------------------------------------------

// Generate Charts using HighCharts Library

function create_trend_chart(series){
    $(function () {
        $('#trend_chart').highcharts({
            title: {
                text: 'Harvard Enrollment Statistics',
                x: -20 //center
            },
            subtitle: {
                text: 'Total Enrollments by Field of Study',
                x: -20
            },
            xAxis: {
                title :  {text: 'Fields of Study'},
                categories: ['2006', '2008', '2010','2012']
            },
            yAxis: {
                title: {text: 'Total Enrollment'},
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                valueSuffix: ' Students'
            },
            legend: {
                title: {text: 'Legend (Click to legend value to filter)'},
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0,
                backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor || '#FFFFFF'),
                shadow: true

            },
            credits: {
                enabled: false
            },
            series: series
        });
    });
    
}

// Generate Gender Breakdown chart

function create_gender_chart(series, year){
  //Define html dropdown to display years as UI feature
  

  $(function () {
        $('#gender_chart').highcharts({
            chart: {
                type: 'bar'
            },
            title: {
                text: 'Field of Study Breakdown by Gender'
            },
            subtitle: {
                text: 'Total Enrollment by Gender for the year ' + year,
            },
            xAxis: {
                categories: fields_of_study_formatted ,
                title: {
                    text: "Fields of Study"
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Enrollment (total students)',
                    align: 'high'
                },
                labels: {
                    overflow: 'justify'
                }
            },
            tooltip: {
                valueSuffix: ' students'
            },
            plotOptions: {
                bar: {
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            legend: {
                title: {text: 'Legend (Click to legend value to filter) <br>'},
                align: 'right',
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0,
                backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor || '#FFFFFF'),
                shadow: true
            },
            credits: {
                enabled: false
            },
            series: series
        });
    });
}


//-----------------------------------------------------------

// Create Gender/Race Breakdown Charts
function create_gr_chart(field, year, series){
  
  race_unformatted = race_values[year];
  race_formatted = [];
  $.each(race_unformatted, function(index, race){
      race_formatted.push(race.split("total")[0]);
  })  

  $(function () {
        $('#race_gender_chart').highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: 'Breakdown of Race and Gender by Field of Study'
            },
            subtitle: {
                text: field + " Enrollments in " + year,
            },
            xAxis: {
                categories: race_formatted,
                 title: {
                    text: "Race / Ethnicity"
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: "% Male / Female"
                }
            },
            tooltip: {
                pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
                shared: true
            },
            credits: {
                enabled: false
            },
            legend: {
                title: {text: 'Legend (Click to legend value to filter)'},
                align: 'right',
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0,
                backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor || '#FFFFFF'),
                shadow: true
            },
            plotOptions: {
                column: {
                    stacking: 'percent'
                }
            },
                series: series
        });
    });

}

//-----------------------------------------------------



//Load Data using d3.json 
d3.json("data.json", function(error, json) {
  data = json;
  // 1. Generate Chart data
    //a. Generate plot points for General Trends graph
      var years = ['2006', '2008', '2010', '2012'];
      var trend_data = [];
      $.each(fields_of_study_totals, function(index,field){
              trend_data.push(create_trend_plots(years,field));
          }); 
      //b. Generate plot points for Gender Graph
            default_year = '2012' // default year, user can select another year with UI dropdown
            gender_series = create_gender_series(default_year, data);
      //c. Generate plots points for Gender/Race Graph
          default_field = fields_of_study_totals[0]; //Take first item in list of fields and set as default
          gr_series = create_gr_series(default_year, default_field, data);
  // 2. Create Charts
    //a. Create General Trend Chart
      create_trend_chart(trend_data);
    //b. Create Gender Break Down Chart 
      create_gender_chart(gender_series, default_year);
    //c. Create Gender/Race Break Down Chart
      create_gr_chart(default_field, default_year, gr_series);
});


//Interactiviy Effects
//Listen for year selections on the gender chart
$( "#gender_year" )
  .change(function () {

    var selected_year =" ";
    $( "#gender_year option:selected" ).each(function() {
      selected_year = $( this ).val();
      //1. Create a new series of gender data for selected year
        gender_series = create_gender_series(selected_year, data);
      //2. Redraw new chart
        create_gender_chart(gender_series, selected_year);
    });
  })
  .change()

// Listen for years selections on the Gender/Race chart
  $( "#gr_year" )
  .change(function () {
    var selected_field = " ";
    $( "#gr_year option:selected" ).each(function() {
      selected_year = $( this ).val();
      selected_field = $("#gr_study").val();

      gr_series = create_gr_series(selected_year, selected_field, data);
      create_gr_chart(selected_field, selected_year, gr_series);
      
    });
  })
  .change()
  
// Listen for field of study selections on the Gender/Race chart
  $( "#gr_study" )
  .change(function () {
    var selected_field = " ";
    $( "#gr_study option:selected" ).each(function() {
      selected_field = $( this ).val();
      selected_year = $("#gr_year").val();

      gr_series = create_gr_series(selected_year, selected_field, data);
      create_gr_chart(selected_field, selected_year, gr_series);
      
    });
  })
  .change()

  
