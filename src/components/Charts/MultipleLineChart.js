import React from 'react';
import ErrorComponent from './errorMessageComponent';
import { Chart, Geom, Axis, Tooltip, Label, Legend } from 'bizcharts';

// eslint-disable-next-line react/prefer-stateless-function
class MultipleLineChart extends React.Component {
    render() {
        const { width, height, dataSource, maxY, error } = this.props;
        const {
            data,
            xAxisName,
            y1AxisName,
            y2AxisName,
            title1,
            title2,
        } = dataSource;
        const cols = {
            type: 'line',
            timestamp: {
                range: [0, 1],
                alias: 'Timeline',
            },
            [y1AxisName]: {
                alias: `${title1} / ${title2}`,
                min: 0,
                max: maxY,
            },
            [y2AxisName]: {
                alias: title2,
                min: 0,
                max: maxY,
            },
        };
        const unit = this.props.unit || '%';
        return (
            <div>
                {error && <ErrorComponent error={error} />}
                <Chart height={height || 400} data={data} scale={cols} forceFit>
                    <Legend />
                    <Axis
                        name={xAxisName}
                        title={{
                            textStyle: {
                                fontSize: '14',
                                textAlign: 'center',
                                fill: '#999',
                                fontWeight: 'bold',
                            },
                        }}
                    />
                    <Axis
                        name={y1AxisName}
                        title={{
                            offset: 60,
                            textStyle: {
                                fontSize: '14',
                                textAlign: 'center',
                                fill: '#999',
                                fontWeight: 'bold',
                            },
                        }}
                        label={{
                            autoRotate: false,
                            formatter: val => `${val} ${unit}`,
                        }}
                    />
                    <Tooltip
                        crosshairs={{
                            type: 'y',
                        }}
                    />
                    <Geom
                        type="line"
                        position={`timestamp*${y1AxisName}`}
                        tooltip={[
                            `timestamp*${y1AxisName}`,
                            (time, val) => {
                                if (
                                    val &&
                                    !isNaN(val) &&
                                    !Number.isInteger(val)
                                ) {
                                    return {
                                        value: val.toFixed(2),
                                    };
                                }
                                return {
                                    value: val,
                                };
                            },
                        ]}
                        size={2}
                        color="type"
                        shape="smooth"
                    />
                </Chart>
            </div>
        );
    }
}

export default MultipleLineChart;
