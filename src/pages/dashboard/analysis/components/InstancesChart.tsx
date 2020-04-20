import { RadioChangeEvent } from 'antd/es/radio';
import React from 'react';
import { VisitDataType } from '../data.d';
import DonutChart from './Charts/Donut/DonutChart';

const InstancesChart = ({
    salesPieData,
    maxVal,
}: {
    loading: boolean;
    dropdownGroup: React.ReactNode;
    salesPieData: VisitDataType[];
    maxVal: Number;
    handleChangeSalesType?: (e: RadioChangeEvent) => void;
}) => {
    return (
        <div>
            <DonutChart
                subTitle="Instances"
                data={salesPieData}
                height={300}
                lineWidth={0}
                maxVal={maxVal}
            />
        </div>
    );
};

export default InstancesChart;
