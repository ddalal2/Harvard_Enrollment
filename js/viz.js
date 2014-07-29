//------------- Resources -----------------
//Epoch seconds are Unix timestamps which rickshaw relies on for displaying years on the x axis
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

      gender_plots = [{ name: "Men", data: men_series},
                      { name: "Women", data: women_series}];
      return gender_plots;
       
} 

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
                categories: ['2006', '2008', '2010','2010']
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
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            series: series
        });
    });
    
}

// Generate Gender Breakdown chart

function create_gender_charts(series, year){
  console.log(series)
  $(function () {
        $('#gender_chart').highcharts({
            chart: {
                type: 'bar'
            },
            title: {
                text: 'Field of Study Breakdowns by Gender'
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
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'top',
                x: -30,
                y: 100,
                floating: true,
                borderWidth: 1,
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
  // 2. Create Charts
    //a. Create General Trend Chart
      create_trend_chart(trend_data);
    //b. Create Gender Break Down Chart 
      create_gender_charts(gender_series, default_year);
});

