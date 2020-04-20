import React from 'react';
import ErrorComponent from './errorMessageComponent';
import { Chart, Geom, Axis, Tooltip, Label, Legend } from 'bizcharts';

class CurvedLineChart extends React.Component {
    formatValue(val) {
        let value = val;
        if (val && !isNaN(val)) {
            value = Number(val).toFixed(2);
        }
        return value;
    }
    render() {
        const {
            width,
            height,
            dataSource,
            title,
            maxY,
            total,
            error,
        } = this.props;
        const { data, xAxisName, yAxisName } = dataSource;
        const cols = {
            type: 'time',
            timestamp: {
                range: [1, 0],
                alias: 'Timeline',
            },
            [yAxisName]: {
                alias: title,
                min: 0,
                max: 100,
            },
        };
        const unit = this.props.unit || '%';
        return (
            <div>
                {error && <ErrorComponent error={error} />}
                <Chart height={height || 400} data={data} scale={cols} forceFit>
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
                        label={{ formatter: val => `${val}` }}
                    />
                    <Axis
                        name={yAxisName}
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
                            formatter: val => {
                                return `${val} ${unit}`;
                            },
                        }}
                    />
                    <Tooltip
                        crosshairs={{
                            type: 'y',
                        }}
                    />
                    <Geom
                        type="area"
                        opacity={0.2}
                        color={[
                            [yAxisName],
                            val => {
                                if (val > 75) return '#EC7063';
                                return '#3498DB';
                            },
                        ]}
                        animate={{
                            update: {
                                easing: 'easeElasticOut',
                            },
                        }}
                        tooltip={[
                            `timestamp*${yAxisName}`,
                            (time, val) => {
                                const value = this.formatValue(val);
                                return {
                                    value: `${value} ${unit}`,
                                };
                            },
                        ]}
                        position={`timestamp*${yAxisName}`}
                        size={2}
                    ></Geom>
                </Chart>
            </div>
        );
    }
}

export default CurvedLineChart;
