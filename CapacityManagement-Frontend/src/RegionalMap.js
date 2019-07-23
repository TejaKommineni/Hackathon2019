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
import azureLocations from './AzureLocations.json';
import PropTypes from 'prop-types';
am4core.useTheme(am4themes_animated);


class RegionalMap extends React.Component {

 static propTypes = {
        region: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);
  }
  
  componentDidMount() {

    let chart = am4core.create("chartdiv", am4maps.MapChart);

    this.initialize(chart);

    this.setState({
        chart: chart
    }); 
  }

  initialize(chart)
  {
    //this.renderWorldMap(chart)
    //this.overlayMap(chart, am4geodata_usaLow);
    //this.overlayMap(chart, am4geodata_australiaLow);
    //this.overlayMap(chart, am4geodata_indiaLow);
    //this.overlayMap(chart, am4geodata_canadaLow);
    //this.getAllRegions();
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
        polygonTemplate.fill = chart.colors.getIndex(0);
        polygonTemplate.nonScalingStroke = true;
        
        // Hover state
        let hs = polygonTemplate.states.create("hover");
        hs.properties.fill = am4core.color("#367B25");
        worldSeries.exclude = ["AQ"];
    
        polygonTemplate.events.on("hit", function (event) {
          console.log(chart.zoomLevel);
          console.log(chart.zoomGeoPoint);
        })

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
    this.renderGeoLocations(chart);
    this.renderGeoPairLines(chart);
    this.zoomToSelectedRegions(chart);
    this.applyHeatLegend(chart);
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
    console.log(this.state.liveRegions);
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

  render() {
    const {region} = this.props;
    if(region === ""){
        return (
        <div id="chartdiv" style={{ paddingLeft: 0, paddingRight: 0, height: "100%" }}></div>

        );
    }
    else{

        return (
            <div id="chartdiv" style={{ paddingLeft: 0, paddingRight: 0, height: "100%" }}>region is {region}</div>
    
            );
    }
  }


}


export default RegionalMap;