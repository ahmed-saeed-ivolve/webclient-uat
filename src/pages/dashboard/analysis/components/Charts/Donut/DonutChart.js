import autoHeight from '../autoHeight';

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
    Shape,
    Facet,
    Util,
} from 'bizcharts';
import DataSet from '@antv/data-set';

class DonutChart extends React.Component {
    render() {
        const { DataView } = DataSet;
        const { data, subTitle, height, maxVal } = this.props;
        const dv = new DataView();
        dv.source(data).transform({
            type: 'percent',
            field: 'y',
            dimension: 'x',
            as: 'percent',
        });
        const cols = {
            percent: {
                formatter: val => {
                    val = val * maxVal;
                    return `${val}`;
                },
            },
        };
        return (
            <div>
                <Chart
                    height={height}
                    data={dv}
                    scale={cols}
                    forceFit
                    padding="auto"
                >
                    <Coord type={'theta'} radius={0.75} />
                    <Axis name="percent" />
                    <Tooltip
                        showTitle={false}
                        itemTpl='<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
                    />
                    <Geom
                        type="intervalStack"
                        position="percent"
                        color="x"
                        tooltip={[
                            'x*percent',
                            (x, percent) => {
                                percent = percent * maxVal;
                                const xAxisLabel = String(x);
                                const name = `${xAxisLabel[0].toUpperCase()}${xAxisLabel.slice(
                                    1
                                )}`;
                                return {
                                    name,
                                    value: Math.round(percent),
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
                            textStyle={{
                                fontSize: '14',
                            }}
                            formatter={(val, x) => {
                                const name = x.point.x;
                                return `${name[0].toUpperCase()}${name.slice(
                                    1
                                )}: ${Math.round(val)}`;
                            }}
                        />
                    </Geom>
                </Chart>
            </div>
        );
    }
}

export default DonutChart;
