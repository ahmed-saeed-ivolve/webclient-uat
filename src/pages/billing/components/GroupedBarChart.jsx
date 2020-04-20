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

const monthsNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const x = [
  {
    summary: [
      {
        tenant_id: 'ALL',
        begin: '2019-09-01T00:00:00+00:00',
        res_type: 'instance',
        rate: '110.0',
        end: '2019-09-30T00:00:00+00:00',
      },
      {
        tenant_id: 'ALL',
        begin: '2019-09-01T00:00:00+00:00',
        res_type: 'ip.floating',
        rate: '16.0',
        end: '2019-09-30T00:00:00+00:00',
      },
      {
        tenant_id: 'ALL',
        begin: '2019-09-01T00:00:00+00:00',
        res_type: 'volume.size',
        rate: '7.0',
        end: '2019-09-30T00:00:00+00:00',
      },
    ],
  },
];

class Groupedcolumn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.transform = this.transform.bind(this);
  }
  transform(data) {
    x.reduce((acc, summary) => {
      const services = summary.length;
      const month = summary[0].begin.summary.map(service => {
        return {
          name: service.res_type,
        };
      });
    }, []);
  }

  render() {
    let data = [
      {
        name: 'volume.size',
        'Mar.': 39.3,
        'Apr.': 81.4,
        May: 47,
        'Jun.': 20.3,
        'Jul.': 24,
        'Aug.': 35.6,
      },
      {
        name: 'image.size',
        'Mar.': 34.5,
        'Apr.': 99.7,
        May: 52.6,
        'Jun.': 35.5,
        'Jul.': 37.4,
        'Aug.': 42.4,
      },
      {
        name: 'instance',
        'Mar.': 39.3,
        'Apr.': 81.4,
        May: 47,
        'Jun.': 20.3,
        'Jul.': 24,
        'Aug.': 35.6,
      },
      {
        name: 'floating.ip',
        'Mar.': 34.5,
        'Apr.': 99.7,
        May: 52.6,
        'Jun.': 35.5,
        'Jul.': 37.4,
        'Aug.': 42.4,
      },
    ];
    data = this.props.dataSource;

    const ds = new DataSet();
    const dv = ds.createView().source(data);
    let months = Object.keys(data[0]);
    months = months.filter(key => key !== 'name');

    months.sort(function(a, b) {
      return monthsNames.indexOf(a) - monthsNames.indexOf(b);
    });

    dv.transform({
      type: 'fold',

      fields: months,

      key: 'month',

      value: 'cost',
    });
    return (
      <div>
        <Chart height={300} data={dv} forceFit>
          <Axis name="month" />
          <Axis name="cost" />
          <Legend />
          <Tooltip
            crosshairs={{
              type: 'y',
            }}
          />
          <Geom
            type="interval"
            position="month*cost"
            color={'name'}
            adjust={[
              {
                type: 'dodge',
                marginRatio: 1 / 32,
              },
            ]}
          />
        </Chart>
      </div>
    );
  }
}
export default Groupedcolumn;
