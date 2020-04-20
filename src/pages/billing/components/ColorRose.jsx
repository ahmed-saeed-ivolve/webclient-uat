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

class ColorRose extends React.PureComponent {
  render() {
    var total= 0.0;
    for(var i=0 ; i<this.props.data.length;i++){
        total = total+ parseFloat(this.props.data[i].rate);
    }
    let data =[];
    if(this.props.data.length)
    data = this.props.data.map(item => {
        return {service : item.res_type, total_cost:item.rate}
    })
    
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
    return (
      <div>
        <Chart height={window.innerHeight} data={data} padding="auto" forceFit>
          <Coord type="polar" />
          <Tooltip />
          <Legend
            position="right"
            offsetY={-window.innerHeight / 2 + 180}
            offsetX={-160}
          />
          <Geom
            type="interval"
            color="service"
            position="service*total_cost"
            style={{
              lineWidth: 1,
              stroke: "#fff"
            }}
          />
        </Chart>
      </div>
    );
  }
}

export default ColorRose;