import React, { PureComponent } from 'react';
import { Row, Col, Typography } from 'antd';
import CurvedLineChart from '@/components/Charts/CurvedLineChart';
import MultipleLineChart from '@/components/Charts/MultipleLineChart';

const { Title } = Typography;

const dataSource = {
    xAxisName: 'timestamp',
};

class MonitoringDetails extends PureComponent {
    render() {
        const {
            ecs,
            network,
            ram,
            storage,
            totalRAM,
            totalDisk,
            errorMessage,
        } = this.props;
        const ecsData = {
            ...dataSource,
            yAxisName: 'percent',
            data: ecs,
        };
        const networkData = {
            ...dataSource,
            y1AxisName: 'value',
            title1: 'Download',
            title2: 'Upload',
            data: network,
        };
        const ramData = {
            ...dataSource,
            yAxisName: 'MB',
            data: ram,
        };
        const storageData = {
            ...dataSource,
            yAxisName: 'value',
            data: storage.map(obj => {
                return {
                    ...obj,
                    value: (obj.value / totalDisk) * 100,
                };
            }),
        };
        return (
            <React.Fragment>
                <Row gutter={12}>
                    <Col span={12}>
                        <Title level={3}>CPU</Title>
                        <CurvedLineChart
                            dataSource={ecsData}
                            width={600}
                            title="CPU"
                            error={errorMessage}
                        />
                    </Col>
                    <Col span={12}>
                        <Title level={3}>Network</Title>
                        <MultipleLineChart
                            dataSource={networkData}
                            width={600}
                            title="NETWORK"
                            maxY={100}
                            unit="kbps"
                            error={errorMessage}
                        />
                    </Col>
                </Row>
                <Row gutter={12}>
                    <Col span={12}>
                        <Title level={3}>RAM</Title>
                        <CurvedLineChart
                            dataSource={ramData}
                            width={600}
                            title="RAM"
                            total={totalRAM}
                            maxY={100}
                            error={errorMessage}
                        />
                    </Col>
                    <Col span={12}>
                        <Title level={3}>Storage</Title>
                        <CurvedLineChart
                            dataSource={storageData}
                            width={600}
                            title="STORAGE"
                            total={totalDisk}
                            error={errorMessage}
                        />
                    </Col>
                </Row>
            </React.Fragment>
        );
    }
}

export default MonitoringDetails;
