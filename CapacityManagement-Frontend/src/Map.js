import React from "react";
import * as am4core from "@amcharts/amcharts4/core";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import * as am4maps from "@amcharts/amcharts4/maps";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";
import am4geodata_usaLow from "@amcharts/amcharts4-geodata/usaLow";
import am4geodata_australiaLow from "@amcharts/amcharts4-geodata/australiaLow";
import am4geodata_indiaLow from "@amcharts/amcharts4-geodata/indiaLow";
import am4geodata_canadaLow from "@amcharts/amcharts4-geodata/canadaLow";
import am4geodata_ukLow from "@amcharts/amcharts4-geodata/ukLow";
import am4geodata_brazilLow from "@amcharts/amcharts4-geodata/brazilLow";
import am4geodata_southAfricaLow from "@amcharts/amcharts4-geodata/southAfricaLow";
import am4geodata_chinaLow from "@amcharts/amcharts4-geodata/chinaLow";
import am4geodata_franceLow from "@amcharts/amcharts4-geodata/franceLow";
import am4geodata_germanyLow from "@amcharts/amcharts4-geodata/germanyLow";
import am4geodata_japanLow from "@amcharts/amcharts4-geodata/japanLow";


import azureLocations from './AzureLocations.json';
am4core.useTheme(am4themes_animated);


class Map extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      liveRegions: [],
      chart: null
    };    
  }
  
  azureLocations = azureLocations;
  
  componentDidMount() {

    let chart = am4core.create("chartdiv", am4maps.MapChart);

    this.initialize(chart);

    this.setState({
        chart: chart
    }); 
  }

  componentDidUpdate(prevProps, prevState)
  {
    if(this.state.isLoaded)
      this.updateRenderedMap(this.state.chart);
  }

  componentWillUnmount() {
  
  }
  
  initialize(chart)
  {
    this.renderWorldMap(chart)
    /*this.overlayMap(chart, am4geodata_usaLow);
    this.overlayMap(chart, am4geodata_australiaLow);
    this.overlayMap(chart, am4geodata_indiaLow);
    this.overlayMap(chart, am4geodata_canadaLow);*/
    this.getAllRegions();
  }

  renderWorldMap(chart)
  {
        // Set map definition
        chart.geodata = am4geodata_worldLow;
    
        // Set projection
        chart.projection = new am4maps.projections.Miller();
        
        // Series for World map
        let worldSeries = chart.series.push(new am4maps.MapPolygonSeries());
        worldSeries.useGeodata = true;
        
        var polygonTemplate = worldSeries.mapPolygons.template;
        polygonTemplate.tooltipText = "{name}";
        polygonTemplate.fill = am4core.color("#cadeec");
        polygonTemplate.nonScalingStroke = true;
        
        // Hover state
        let hs = polygonTemplate.states.create("hover");
        hs.properties.fill = am4core.color("#367B25");
        worldSeries.exclude = ["AQ"];
    
        polygonTemplate.events.on("hit", function (event) {
          console.log(chart.zoomLevel);
          console.log(chart.zoomGeoPoint);
        })
  }

  setZoomControl(chart)
  {
    // Set Zoom Control
    chart.zoomControl = new am4maps.ZoomControl();
    var homeButton = new am4core.Button();
    homeButton.events.on("hit", function(){
      chart.goHome();
    });

    homeButton.icon = new am4core.Sprite();
    homeButton.padding(7, 5, 7, 5);
    homeButton.width = 30;
    homeButton.icon.path = "M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8";
    homeButton.marginBottom = 10;
    homeButton.parent = chart.zoomControl;
    homeButton.insertBefore(chart.zoomControl.plusButton);
  }

  overlayMap(chart, geodata)
  {
    /**
     * We overlay the world map with regional/state/county maps.
     * It will use its own `geodata`
     */

    let overlaySeries = chart.series.push(new am4maps.MapPolygonSeries());
    overlaySeries.geodata = geodata;
    overlaySeries.useGeodata = true;
    var polygonTemplate = overlaySeries.mapPolygons.template;
    polygonTemplate.tooltipText = "{name}";
    polygonTemplate.fill = chart.colors.getIndex(0);
    polygonTemplate.nonScalingStroke = true;
  }

  updateRenderedMap(chart)
  {
    this.updateAzureLocations();
    this.applyHeatLegend(chart, am4geodata_usaLow);
    this.applyHeatLegend(chart, am4geodata_australiaLow);
    this.applyHeatLegend(chart, am4geodata_indiaLow);
    this.applyHeatLegend(chart, am4geodata_canadaLow);
    this.applyHeatLegend(chart, am4geodata_ukLow);
    this.applyHeatLegend(chart, am4geodata_brazilLow);
    this.applyHeatLegend(chart, am4geodata_southAfricaLow);
    this.applyHeatLegend(chart, am4geodata_chinaLow);
    this.applyHeatLegend(chart, am4geodata_franceLow);
    this.applyHeatLegend(chart, am4geodata_germanyLow);
    this.applyHeatLegend(chart, am4geodata_japanLow);
    this.addHeatLegend(chart);
    this.renderGeoLocations(chart);
    this.renderGeoPairLines(chart);
    this.zoomToSelectedRegions(chart);
    this.setZoomControl(chart);
  }

  updateAzureLocations()
  {
    for (var liveRegion of this.state.liveRegions)
    {
        let temp = this.azureLocations[liveRegion.GeoRegion];
        if(temp != undefined)
        {
          temp['ENUtilization'] = "ENUtilization : " + liveRegion.ENUtilization;
          temp['SellableCapacity'] = "SellableCapacity : " + liveRegion.SellableCapacity;
          this.azureLocations[liveRegion.GeoRegion] = temp;
        }
    }
  }

  renderGeoLocations(chart)
  {
    /*
      Adding markers
    */
    let imageSeries = chart.series.push(new am4maps.MapImageSeries());
    let imageSeriesTemplate = imageSeries.mapImages.template;
    let circle = imageSeriesTemplate.createChild(am4core.Circle);
    circle.radius = 5;
    circle.fill = am4core.color("#221177");
    circle.stroke = am4core.color("#FFFFFF");
    circle.strokeWidth = 1;
    circle.nonScaling = true;
    circle.tooltipText = "{region} \n {location} \n {ENUtilization} \n {SellableCapacity}";

    imageSeriesTemplate.propertyFields.latitude = "latitude";
    imageSeriesTemplate.propertyFields.longitude = "longitude";

    let imageSeriesData = [];
    console.log("Live Regions: ", this.state.liveRegions);
    for (var liveRegion of this.state.liveRegions)
    {
        imageSeriesData.push(this.azureLocations[liveRegion.GeoRegion]);
    }
    imageSeries.data = imageSeriesData;
    
  }

  renderGeoPairLines(chart)
  {
    var lineSeries = chart.series.push(new am4maps.MapArcSeries());
    let lineSeriesTemplate = lineSeries.mapLines.template;
    lineSeriesTemplate.shortestDistance = true;
    lineSeriesTemplate.line.strokeWidth = 1;
    lineSeriesTemplate.line.stroke = am4core.color("#2277AA");
    lineSeriesTemplate.line.strokeOpacity = 0.8;    
    lineSeriesTemplate.line.controlPointDistance = 0.5;

    let drawnRegions = [];
    let drawnLines = [];
    for (var liveRegion of this.state.liveRegions)
    { 
      let drawnLine = false;
      var i=0;
      for(; i<drawnRegions.length; i++)
      { 
        var temp = drawnRegions[i];
        if(temp.toString() === [liveRegion.GeoPairRegion, liveRegion.GeoRegion].toString())
        {
          drawnLine = true;
          break;
        }
      }
      if(liveRegion.GeoRegion in this.azureLocations &&  !drawnLine)
      {
        var line = lineSeries.mapLines.create();
        line.multiGeoLine = [[
          {"latitude" : this.azureLocations[liveRegion.GeoRegion].latitude,
          "longitude" : this.azureLocations[liveRegion.GeoRegion].longitude},
          {"latitude" : this.azureLocations[liveRegion.GeoPairRegion].latitude,
          "longitude" : this.azureLocations[liveRegion.GeoPairRegion].longitude}
        ]];
        this.drawArrow(line, "right");
        drawnRegions.push([liveRegion.GeoRegion, liveRegion.GeoPairRegion]); 
        drawnLines.push(line);
      }
      if(drawnLine)
      {
        var line = lineSeries.mapLines.create();
        line.multiGeoLine = [[
          {"latitude" : this.azureLocations[liveRegion.GeoPairRegion].latitude,
          "longitude" : this.azureLocations[liveRegion.GeoPairRegion].longitude},
          {"latitude" : this.azureLocations[liveRegion.GeoRegion].latitude,
          "longitude" : this.azureLocations[liveRegion.GeoRegion].longitude}
        ]];
        this.drawArrow(line, "left");
      }
    }
  }

  drawArrow(line, direction)
  {
    var bullet = line.lineObjects.create();    
    var arrow = bullet.createChild(am4core.Triangle);
    arrow.horizontalCenter = "middle";
    arrow.verticalCenter = "middle";
    arrow.stroke = am4core.color("#fff");
    arrow.opacity = 0.5;
    arrow.direction = direction;
    arrow.width = 8;
    arrow.height = 8;  
    if(direction == "right")       
        bullet.position = 0.2;
    else
        bullet.position = 0.8;
  }

  zoomToSelectedRegions(chart)
  {   
    if(this.props.isGeographical)
    {   
      if(this.props.geographyType === "Americas")
      {
        chart.zoomToGeoPoint({longitude: -96.700470, latitude:  40.820744}, 2.8, true);        
      }
      if(this.props.geographyType === "Asia Pacific")
      {
        chart.zoomToGeoPoint({longitude: 125.560310, latitude:  -8.556856}, 1.6, true);           
      }
      if(this.props.geographyType === "Europe")
      {
        chart.zoomToGeoPoint({longitude: 19.040236, latitude:   47.497913}, 2.7, true); 
      }
      if(this.props.geographyType === "Middle East And Africa")
      {
        chart.zoomToGeoPoint({longitude: 32.582520, latitude: 0.347596}, 2.3, true);
      }
      if(this.props.geographyType === "Azure Government")
      {      
        chart.zoomToGeoPoint({longitude: -96.700470, latitude:  40.820744}, 2.4, true);     
      }
    }
  }

  applyHeatLegend(chart, geodata)
  {
    console.log("geodata: ", geodata)
    var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
    polygonSeries.geodata = geodata;
    polygonSeries.useGeodata = true;
    var polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipText = "{name}";
    polygonTemplate.fill = am4core.color("#cadeec");
    let hs = polygonTemplate.states.create("hover");
    hs.properties.fill = am4core.color("#367B25");
    polygonSeries.heatRules.push({
      property: "fill",
      target: polygonSeries.mapPolygons.template,
      min: am4core.color("#F5DBCB"),
      max: am4core.color("#ED7B84")
    });
    
    var idValueMap = {};
    polygonSeries.data = [];
    for (var count in this.state.liveRegions) {
      var liveRegion = this.state.liveRegions[count];
      if(this.azureLocations[liveRegion.GeoRegion]) {
        var id = this.azureLocations[liveRegion.GeoRegion].country_code;
        if(idValueMap[id]) {
          idValueMap[id] = Math.max(idValueMap[id], liveRegion.ENUtilization);
        } else {
          idValueMap[id] = liveRegion.ENUtilization;
        }
      }   
    }
    for(var key in idValueMap) {
      var temp = {};
      temp.id = key;
      temp.value = idValueMap[key];
      polygonSeries.data.push(temp);
    }
    console.log("polygonSeries", polygonSeries.data);
    
// life expectancy data
    /*for (var liveRegion of this.state.liveRegions)
    {
        let temp = this.azureLocations[liveRegion.GeoRegion];
        if(temp != undefined)
        {
          temp['ENUtilization'] = "ENUtilization : " + liveRegion.ENUtilization;
          temp['SellableCapacity'] = "SellableCapacity : " + liveRegion.SellableCapacity;
          this.azureLocations[liveRegion.GeoRegion] = temp;
        }
    }*/
  }

  addHeatLegend(chart)
  {
    var min = 1;
    var max = 0;
    for (var count in this.state.liveRegions) {
      var liveRegion = this.state.liveRegions[count];
      if(this.azureLocations[liveRegion.GeoRegion]) {
        min = Math.min(liveRegion.ENUtilization, min);
        max = Math.max(liveRegion.ENUtilization, max);
      }   
    }
    // add heat legend
    var heatLegend = chart.chartContainer.createChild(am4maps.HeatLegend);
    heatLegend.valign = "bottom";
    heatLegend.align = "left";
    heatLegend.width = am4core.percent(80);
    //heatLegend.series = polygonSeries;
    heatLegend.minValue = min;
    heatLegend.minColor = "#F5DBCB";
    heatLegend.maxValue = max;
    heatLegend.maxColor = "#ED7B84";
    heatLegend.orientation = "vertical";
    heatLegend.padding(20, 20, 20, 20);
    heatLegend.valueAxis.renderer.labels.template.fontSize = 10;
    heatLegend.valueAxis.renderer.minGridDistance = 40;

    var minRange = heatLegend.valueAxis.axisRanges.create();
    minRange.value = heatLegend.minValue;
    minRange.label.text = "0";
    var maxRange = heatLegend.valueAxis.axisRanges.create();
    maxRange.value = heatLegend.maxValue;
    maxRange.label.text = "1";

    function handleHover(mapPolygon) {
      if (!isNaN(mapPolygon.dataItem.value)) {
        heatLegend.valueAxis.showTooltipAt(mapPolygon.dataItem.value);
      } else {
        heatLegend.valueAxis.hideTooltip();
      }
    }
  }

  getAllRegions()
  {
    fetch("https://localhost:44313/api/region/all")
    .then(res => res.json())
    .then(
      (result) => {
        this.setState({
          isLoaded: true,
          liveRegions: JSON.parse(result.content)
        });
      },
      // Note: it's important to handle errors here
      // instead of a catch() block so that we don't swallow
      // exceptions from actual bugs in components.
      (error) => {
        this.setState({
          isLoaded: true,
          //error, 
          liveRegions: JSON.parse("[\r\n  {\r\n    \"GeoRegion\": \"australiac\",\r\n    \"GeoPairRegion\": \"australiac2\",\r\n    \"NumberOfPrimaryTenants\": 2,\r\n    \"ENUtilization\": 0.208483348233176,\r\n    \"SellableCapacity\": 644.94294564057\r\n  },\r\n  {\r\n    \"GeoRegion\": \"australiac2\",\r\n    \"GeoPairRegion\": \"australiac\",\r\n    \"NumberOfPrimaryTenants\": 2,\r\n    \"ENUtilization\": 0.0586621270155971,\r\n    \"SellableCapacity\": 493.289798403138\r\n  },\r\n  {\r\n    \"GeoRegion\": \"brazilsouth\",\r\n    \"GeoPairRegion\": \"ussouth\",\r\n    \"NumberOfPrimaryTenants\": 6,\r\n    \"ENUtilization\": 0.775476686102462,\r\n    \"SellableCapacity\": 3769.76232511305\r\n  },\r\n  {\r\n    \"GeoRegion\": \"canadacentral\",\r\n    \"GeoPairRegion\": \"canadaeast\",\r\n    \"NumberOfPrimaryTenants\": 4,\r\n    \"ENUtilization\": 0.943524117314294,\r\n    \"SellableCapacity\": 6793.80509998425\r\n  },\r\n  {\r\n    \"GeoRegion\": \"canadaeast\",\r\n    \"GeoPairRegion\": \"canadacentral\",\r\n    \"NumberOfPrimaryTenants\": 5,\r\n    \"ENUtilization\": 0.813267518612624,\r\n    \"SellableCapacity\": 2498.53923262245\r\n  },\r\n  {\r\n    \"GeoRegion\": \"chinae2\",\r\n    \"GeoPairRegion\": \"chinan2\",\r\n    \"NumberOfPrimaryTenants\": 2,\r\n    \"ENUtilization\": 0.566955499576575,\r\n    \"SellableCapacity\": 1724.68001584696\r\n  },\r\n  {\r\n    \"GeoRegion\": \"chinaeast\",\r\n    \"GeoPairRegion\": \"chinanorth\",\r\n    \"NumberOfPrimaryTenants\": 5,\r\n    \"ENUtilization\": 0.891916381884191,\r\n    \"SellableCapacity\": 945.051607694957\r\n  },\r\n  {\r\n    \"GeoRegion\": \"chinan2\",\r\n    \"GeoPairRegion\": \"chinae2\",\r\n    \"NumberOfPrimaryTenants\": 2,\r\n    \"ENUtilization\": 0.294359833491395,\r\n    \"SellableCapacity\": 1682.87665093896\r\n  },\r\n  {\r\n    \"GeoRegion\": \"chinanorth\",\r\n    \"GeoPairRegion\": \"chinaeast\",\r\n    \"NumberOfPrimaryTenants\": 4,\r\n    \"ENUtilization\": 0.691214354153298,\r\n    \"SellableCapacity\": 1654.85621606493\r\n  },\r\n  {\r\n    \"GeoRegion\": \"francec\",\r\n    \"GeoPairRegion\": \"frances\",\r\n    \"NumberOfPrimaryTenants\": 3,\r\n    \"ENUtilization\": 0.445165423570173,\r\n    \"SellableCapacity\": 2623.81100258523\r\n  },\r\n  {\r\n    \"GeoRegion\": \"frances\",\r\n    \"GeoPairRegion\": \"francec\",\r\n    \"NumberOfPrimaryTenants\": 2,\r\n    \"ENUtilization\": 0.059123451511421,\r\n    \"SellableCapacity\": 203.251442207814\r\n  },\r\n  {\r\n    \"GeoRegion\": \"germanycentral\",\r\n    \"GeoPairRegion\": \"germanynortheast\",\r\n    \"NumberOfPrimaryTenants\": 2,\r\n    \"ENUtilization\": 0.857563859109647,\r\n    \"SellableCapacity\": 614.826767759962\r\n  },\r\n  {\r\n    \"GeoRegion\": \"germanynortheast\",\r\n    \"GeoPairRegion\": \"germanycentral\",\r\n    \"NumberOfPrimaryTenants\": 2,\r\n    \"ENUtilization\": 0.0461923118297349,\r\n    \"SellableCapacity\": 848.895981805965\r\n  },\r\n  {\r\n    \"GeoRegion\": \"indiacentral\",\r\n    \"GeoPairRegion\": \"indiasouth\",\r\n    \"NumberOfPrimaryTenants\": 4,\r\n    \"ENUtilization\": 0.730136077068479,\r\n    \"SellableCapacity\": 2827.20058064175\r\n  },\r\n  {\r\n    \"GeoRegion\": \"indiasouth\",\r\n    \"GeoPairRegion\": \"indiawest\",\r\n    \"NumberOfPrimaryTenants\": 0,\r\n    \"ENUtilization\": 0.816637773662781,\r\n    \"SellableCapacity\": 2001.45559950469\r\n  },\r\n  {\r\n    \"GeoRegion\": \"indiawest\",\r\n    \"GeoPairRegion\": \"indiasouth\",\r\n    \"NumberOfPrimaryTenants\": 2,\r\n    \"ENUtilization\": 0.410628798247011,\r\n    \"SellableCapacity\": 934.506603978812\r\n  },\r\n  {\r\n    \"GeoRegion\": \"southafrican\",\r\n    \"GeoPairRegion\": \"southafricaw\",\r\n    \"NumberOfPrimaryTenants\": 2,\r\n    \"ENUtilization\": 0.134186046219755,\r\n    \"SellableCapacity\": 2672.50103570642\r\n  },\r\n  {\r\n    \"GeoRegion\": \"southafricaw\",\r\n    \"GeoPairRegion\": \"southafrican\",\r\n    \"NumberOfPrimaryTenants\": 2,\r\n    \"ENUtilization\": 0.0381876826280233,\r\n    \"SellableCapacity\": 206.325781740209\r\n  },\r\n  {\r\n    \"GeoRegion\": \"uaec\",\r\n    \"GeoPairRegion\": \"uaen\",\r\n    \"NumberOfPrimaryTenants\": 1,\r\n    \"ENUtilization\": 0.0141212514678577,\r\n    \"SellableCapacity\": 454.049986194211\r\n  },\r\n  {\r\n    \"GeoRegion\": \"uaen\",\r\n    \"GeoPairRegion\": \"uaec\",\r\n    \"NumberOfPrimaryTenants\": 1,\r\n    \"ENUtilization\": 0.027962622898678,\r\n    \"SellableCapacity\": 1543.68867709364\r\n  },\r\n  {\r\n    \"GeoRegion\": \"uknorth\",\r\n    \"GeoPairRegion\": \"uksouth2\",\r\n    \"NumberOfPrimaryTenants\": 1,\r\n    \"ENUtilization\": 0.0119724314972421,\r\n    \"SellableCapacity\": 7.82254374525901\r\n  },\r\n  {\r\n    \"GeoRegion\": \"uksouth2\",\r\n    \"GeoPairRegion\": \"uknorth\",\r\n    \"NumberOfPrimaryTenants\": 1,\r\n    \"ENUtilization\": 0.0135352148724654,\r\n    \"SellableCapacity\": 10.209162471288\r\n  },\r\n  {\r\n    \"GeoRegion\": \"usdodcentral\",\r\n    \"GeoPairRegion\": \"usdodeast\",\r\n    \"NumberOfPrimaryTenants\": 2,\r\n    \"ENUtilization\": 0.041278756160273,\r\n    \"SellableCapacity\": 1180.43159710423\r\n  },\r\n  {\r\n    \"GeoRegion\": \"usdodeast\",\r\n    \"GeoPairRegion\": \"usdodcentral\",\r\n    \"NumberOfPrimaryTenants\": 2,\r\n    \"ENUtilization\": 0.0861484673288668,\r\n    \"SellableCapacity\": 1390.90186367764\r\n  },\r\n  {\r\n    \"GeoRegion\": \"usgovcentral\",\r\n    \"GeoPairRegion\": \"usgoveast\",\r\n    \"NumberOfPrimaryTenants\": 2,\r\n    \"ENUtilization\": 0.011456262764907,\r\n    \"SellableCapacity\": 209.511329136319\r\n  },\r\n  {\r\n    \"GeoRegion\": \"usgoveast\",\r\n    \"GeoPairRegion\": \"usgovsc\",\r\n    \"NumberOfPrimaryTenants\": 4,\r\n    \"ENUtilization\": 0.542724737790691,\r\n    \"SellableCapacity\": 4260.69300819793\r\n  },\r\n  {\r\n    \"GeoRegion\": \"usgovsc\",\r\n    \"GeoPairRegion\": \"usgoveast\",\r\n    \"NumberOfPrimaryTenants\": 0,\r\n    \"ENUtilization\": 0.280627190035987,\r\n    \"SellableCapacity\": 1956.8749298145\r\n  },\r\n  {\r\n    \"GeoRegion\": \"usgovsw\",\r\n    \"GeoPairRegion\": \"usgovsc\",\r\n    \"NumberOfPrimaryTenants\": 2,\r\n    \"ENUtilization\": 0.284270976242665,\r\n    \"SellableCapacity\": 1939.77064261243\r\n  },\r\n  {\r\n    \"GeoRegion\": \"asiaeast\",\r\n    \"GeoPairRegion\": \"asiasoutheast\",\r\n    \"NumberOfPrimaryTenants\": 6,\r\n    \"ENUtilization\": 0.0302875685908995,\r\n    \"SellableCapacity\": 491.564276108871\r\n  },\r\n  {\r\n    \"GeoRegion\": \"uswestcentral\",\r\n    \"GeoPairRegion\": \"uswest2\",\r\n    \"NumberOfPrimaryTenants\": 4,\r\n    \"ENUtilization\": 0.716588784492345,\r\n    \"SellableCapacity\": 2671.81040389655\r\n  },\r\n  {\r\n    \"GeoRegion\": \"asiasoutheast\",\r\n    \"GeoPairRegion\": \"asiaeast\",\r\n    \"NumberOfPrimaryTenants\": 10,\r\n    \"ENUtilization\": 0.034108864206031,\r\n    \"SellableCapacity\": 2087.22254701645\r\n  },\r\n  {\r\n    \"GeoRegion\": \"australiaeast\",\r\n    \"GeoPairRegion\": \"australiasoutheast\",\r\n    \"NumberOfPrimaryTenants\": 8,\r\n    \"ENUtilization\": 0.0167604651927587,\r\n    \"SellableCapacity\": 363.010030916258\r\n  },\r\n  {\r\n    \"GeoRegion\": \"australiasoutheast\",\r\n    \"GeoPairRegion\": \"australiaeast\",\r\n    \"NumberOfPrimaryTenants\": 5,\r\n    \"ENUtilization\": 0.00212156206528699,\r\n    \"SellableCapacity\": 237.802885405986\r\n  },\r\n  {\r\n    \"GeoRegion\": \"europenorth\",\r\n    \"GeoPairRegion\": \"europewest\",\r\n    \"NumberOfPrimaryTenants\": 33,\r\n    \"ENUtilization\": 0.0204784087457139,\r\n    \"SellableCapacity\": 3792.83655503403\r\n  },\r\n  {\r\n    \"GeoRegion\": \"europewest\",\r\n    \"GeoPairRegion\": \"europenorth\",\r\n    \"NumberOfPrimaryTenants\": 41,\r\n    \"ENUtilization\": 0.0529731951020039,\r\n    \"SellableCapacity\": 3841.00328972\r\n  },\r\n  {\r\n    \"GeoRegion\": \"japaneast\",\r\n    \"GeoPairRegion\": \"japanwest\",\r\n    \"NumberOfPrimaryTenants\": 9,\r\n    \"ENUtilization\": 0.00969253403362828,\r\n    \"SellableCapacity\": 82.3035149407501\r\n  },\r\n  {\r\n    \"GeoRegion\": \"japanwest\",\r\n    \"GeoPairRegion\": \"japaneast\",\r\n    \"NumberOfPrimaryTenants\": 6,\r\n    \"ENUtilization\": 0.00123861572087686,\r\n    \"SellableCapacity\": 37.3169666191327\r\n  },\r\n  {\r\n    \"GeoRegion\": \"koreacentral\",\r\n    \"GeoPairRegion\": \"koreasouth\",\r\n    \"NumberOfPrimaryTenants\": 4,\r\n    \"ENUtilization\": 0.00679117617607222,\r\n    \"SellableCapacity\": 109.163925046689\r\n  },\r\n  {\r\n    \"GeoRegion\": \"koreasouth\",\r\n    \"GeoPairRegion\": \"koreacentral\",\r\n    \"NumberOfPrimaryTenants\": 2,\r\n    \"ENUtilization\": 0.00120590780653358,\r\n    \"SellableCapacity\": 0.909192357241401\r\n  },\r\n  {\r\n    \"GeoRegion\": \"uksouth\",\r\n    \"GeoPairRegion\": \"ukwest\",\r\n    \"NumberOfPrimaryTenants\": 11,\r\n    \"ENUtilization\": 0.00644543482613813,\r\n    \"SellableCapacity\": 644.478026330003\r\n  },\r\n  {\r\n    \"GeoRegion\": \"ukwest\",\r\n    \"GeoPairRegion\": \"uksouth\",\r\n    \"NumberOfPrimaryTenants\": 7,\r\n    \"ENUtilization\": 0.0262338574433504,\r\n    \"SellableCapacity\": 86.3514983164546\r\n  },\r\n  {\r\n    \"GeoRegion\": \"uscentral\",\r\n    \"GeoPairRegion\": \"useast2\",\r\n    \"NumberOfPrimaryTenants\": 34,\r\n    \"ENUtilization\": 0.0727404602267561,\r\n    \"SellableCapacity\": 1853.39635878111\r\n  },\r\n  {\r\n    \"GeoRegion\": \"useast\",\r\n    \"GeoPairRegion\": \"uswest\",\r\n    \"NumberOfPrimaryTenants\": 25,\r\n    \"ENUtilization\": 0.0525802008852354,\r\n    \"SellableCapacity\": 5135.53511614083\r\n  },\r\n  {\r\n    \"GeoRegion\": \"useast2\",\r\n    \"GeoPairRegion\": \"uscentral\",\r\n    \"NumberOfPrimaryTenants\": 26,\r\n    \"ENUtilization\": 0.295348621191383,\r\n    \"SellableCapacity\": 545.838852007845\r\n  },\r\n  {\r\n    \"GeoRegion\": \"usnorth\",\r\n    \"GeoPairRegion\": \"ussouth\",\r\n    \"NumberOfPrimaryTenants\": 12,\r\n    \"ENUtilization\": 0.00337434804663391,\r\n    \"SellableCapacity\": 341.657928715764\r\n  },\r\n  {\r\n    \"GeoRegion\": \"ussouth\",\r\n    \"GeoPairRegion\": \"usnorth\",\r\n    \"NumberOfPrimaryTenants\": 19,\r\n    \"ENUtilization\": 0.00402904962531911,\r\n    \"SellableCapacity\": 4251.11234609315\r\n  },\r\n  {\r\n    \"GeoRegion\": \"uswest\",\r\n    \"GeoPairRegion\": \"useast\",\r\n    \"NumberOfPrimaryTenants\": 21,\r\n    \"ENUtilization\": 0.0157692967989874,\r\n    \"SellableCapacity\": 5993.55428069778\r\n  },\r\n  {\r\n    \"GeoRegion\": \"uswest2\",\r\n    \"GeoPairRegion\": \"uswestcentral\",\r\n    \"NumberOfPrimaryTenants\": 7,\r\n    \"ENUtilization\": 0.254786900449981,\r\n    \"SellableCapacity\": 1605.33664601758\r\n  }\r\n]")
        });
      }
    )
  }

  render() {
    return (
      <div id="chartdiv" style={{ paddingLeft: 0, paddingRight: 0, height: "100%" }}></div>
    );
  }


}


export default Map;