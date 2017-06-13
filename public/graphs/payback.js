var dataset;
var productPrice;
var paybackYears;
document.getElementById('drop').onchange = function(){
    var value = document.getElementById('drop').options[document.getElementById('drop').selectedIndex].value;
    deleteGraph();
    getInvestCosts(value);
    console.log("change");

}

var listProds = '';
function getAllProds() {
  $.ajax({
    type: "GET",
    url: "/api/graph/graph/allProducts",
    contentType: "application/json",
    success: function(d){
      //console.log(JSON.parse(d));
      var data = JSON.parse(d);
      $.each(data, function(key, value){
      if(value.EngModel != null) {
        listProds += '<option value=' + value.ProdNo + '>' + value.ProdEngName + ' ' + value.EngModel + '</option>';
      }
      else {
        listProds += '<option value=' + value.ProdNo + '>' + value.ProdEngName + '</option>';
      }
      });
      $("#drop").append(listProds);
      $('#drop option[value=selectedProd]').prop('selected', true);
      var value = document.getElementById('drop').options[document.getElementById('drop').selectedIndex].value;
      getInvestCosts(value);
      
      

    }
  });
};

function getInvestCosts(id) {
  var myId = {prodId : id};
  $.ajax({
    type: "GET",
    url: "/api/graph/graph/investCosts",
    contentType: "application/json",
    datatype: "json",
    data: JSON.stringify(myId),
    success: function(d){
      console.log(JSON.parse(d));
      dataset = JSON.parse(d);
      getRetailPrice(id);

    }
  });
};

function getRetailPrice(id) {
  var myId = {prodId : id};
  $.ajax({
    type: "GET",
    url: "/api/graph/graph/retailPrice",
    contentType: "application/json",
    datatype: "json",
    data: JSON.stringify(myId),
    success: function(d){
      console.log(JSON.parse(d));
      productPrice = JSON.parse(d);
      getInvestmentPaybackPeriod(id);

    }
  });
};

function getInvestmentPaybackPeriod(id) {
  var myId = {prodId : id};
  $.ajax({
    type: "GET",
    url: "/api/graph/graph/investmentPayback",
    contentType: "application/json",
    datatype: "json",
    data: JSON.stringify(myId),
    success: function(d){
      console.log(JSON.parse(d));
      paybackYears = JSON.parse(d);
      init();

    }
  });
};



getAllProds();

function deleteGraphAndInit() {
  document.getElementById("xAxis").remove();
  document.getElementById("yAxis").remove();
     document.getElementById("investLine").remove();
     document.getElementById("productLine").remove();
     init();
}

function deleteGraph() {
  document.getElementById("xAxis").remove();
  document.getElementById("yAxis").remove();

     document.getElementById("investLine").remove();
     document.getElementById("productLine").remove();
}


function init() {
var numProd = document.getElementById("numForm").value;

var investmentDataSet = new Array();

    for(i = 0; i < dataset.length;i++) {
     investmentDataSet.push(dataset[i]);
    }

var sumInvest = 0;
for(i = 0; i < investmentDataSet.length; i++) {

   sumInvest += investmentDataSet[i].CostYear*paybackYears[0].Cost;
}
var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 60},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var y = d3.scaleLinear()
    .domain([0, sumInvest*10])
    .rangeRound([height, 0]);



var investLine = d3.line()
    .x(function (d) {return d.x;})
    .y(function (d) {return d.y;});

var productLine = d3.line()
    .x(function (d) {return d.x;})
    .y(function (d) {return d.y;});
var x = d3.scaleLinear()
    .domain([0,12])
    .rangeRound([0, width]);

    var productRange = new Array();
    var investRange = new Array();
for(i = 0; i <= 12; i++) {
        var set = new Object();
        set.x = x(i);
        set.y = y(productPrice[0].PriceRetail*numProd*i);
        console.log(i);
        console.log(productPrice[0].PriceRetail*numProd*i);
        console.log(set);
        productRange.push(set);
        var set = new Object();
        set.x = x(i);
        set.y = y(sumInvest);
        
        investRange.push(set);
    }


  console.log("downhere");
  g.append("g")
      .attr("id", "xAxis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
    .append("text")
      .attr("fill", "#000")
      .attr("x", width)
      .attr("dy", "-0.71em")
      .attr("text-anchor", "end")
      .text("Months");

  g.append("g")
      .call(d3.axisLeft(y))
      .attr("id", "yAxis")
    .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Money (Baht)");

  g.append("path")
      .attr("id", "investLine")
      .datum(investRange)
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr("d", investLine);

    g.append("path")
      .attr("id", "productLine")
      .datum(productRange)
      .attr("fill", "none")
      .attr("stroke", "green")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr("d", productLine);

      console.log("submit");
}