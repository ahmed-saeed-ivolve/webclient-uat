import React from "react";
import {
  G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  Util
} from "bizcharts";

export default class BasicColumnChart extends React.Component {
  render() {
    const dataSource=this.props.dataSource;
    let max=0,min=0;
    if(dataSource.length){
      max=Math.max.apply(null,dataSource.map(function(o){return o.sales}));
      min=Math.min.apply(null,dataSource.map(function(o){return o.sales}));
    }
    const difference=max-min;
    const interval=difference/100;
    
    const cols = {
      Cost: {
        tickInterval: 10000
      }
    };
    return (
      <div>
        <Chart height={250} data={dataSource} scale={cols} forceFit>
          <Axis name="Month" />
          <Axis name="Cost" />
          <Tooltip
            crosshairs={{
              type: "y"
            }}
          />
          <Geom type="interval" position="Month*Cost" />
        </Chart>
      </div>
    );
  }
}