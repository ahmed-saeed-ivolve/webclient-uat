import React from 'react';
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
  Util,
} from 'bizcharts';
import DataSet from '@antv/data-set';

class PieChart extends React.Component {
  render() {


    const { Html } = Guide;
    const { DataView } = DataSet;
   
    let data = [];
    let total=0;
   
    if (Array.isArray(this.props.data)) {
      total = this.props.data.reduce((acc, item) => {
        return acc + parseFloat(item.rate);
      }, 0);
      data = this.props.data.map(item => {
        return { item: item.res_type, count: parseFloat(((item.rate / total) * 100).toFixed(2)) };
      });
    }
   
   
   
   
    const html = `<div style=&quot;color:#8c8c8c;font-size:1em;text-align: center;width: 5em;&quot;>Cost<br><span style=&quot;color:#262626;font-size:1em&quot;>${total}</span><small>SAR</small></div>`;
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
    const dv = new DataView();
    if (Array.isArray(this.props.data))
      dv.source(data).transform({
        type: 'percent',
        field: 'count',
        dimension: 'item',
        as: 'percent',
      });
    const cols = {
      percent: {
        formatter: val => {
          val = val * 100 + '%';
          return val;
        },
      },
    };
   
   
   
    return (
      <div>
        <Chart height={300} data={dv} scale={cols} padding={[80, 100, 80, 80]} forceFit>
          <Coord type="theta" radius={0.75} innerRadius={0.6} />
          <Axis name="percent" />
          <Legend position="right" offsetY={-window.innerHeight / 2 + 120} offsetX={-100} />
          <Tooltip
            showTitle={false}
            itemTpl='<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
          />
          <Guide>
            <Html position={['50%', '50%']} html={html} alignX="middle" alignY="middle" />
          </Guide>
          <Geom
            type="intervalStack"
            position="percent"
            color="item"
            tooltip={[
              'item*percent',
              (item, percent) => {
                percent = percent * 100 + '%';
                return {
                  name: item,
                  value: percent,
                };
              },
            ]}
            style={{
              lineWidth: 1,
              stroke: '#fff',
            }}
          >
            <Label
              content="percent"
              formatter={(val, item) => {
                return item.point.item + ': ' + val;
              }}
            />
          </Geom>
        </Chart>
      </div>
    );
  }
}
export default PieChart;
