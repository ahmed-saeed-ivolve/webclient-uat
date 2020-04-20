import React, { Component } from 'react';
import { Typography, Row, Col, Collapse, Spin, Icon } from 'antd';
import EcsUsage from './EcsUsage';
import EvsUsage from './EvsUsage';
import NetworkUsage from './NetworkUsaage';

import download from '@/utils/download';
import { getUsageReportFileName } from './utils';

const { Panel } = Collapse;
const { Title } = Typography;

export default class UsageReport extends Component {
    render() {
        const { usageReport } = this.props;

        const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

        const extraContentEcs = () => (
            <Typography style={{ fontSize: '15px', fontFamily: 'sans-serif' }}>
                {' '}
                Total Usage: 56 hours{' '}
            </Typography>
        );

        const extraContentEvs = () => (
            <Typography style={{ fontSize: '15px', fontFamily: 'sans-serif' }}>
                {' '}
                Total Usage: 10 hours{' '}
            </Typography>
        );

        const extraContentNetwork = () => (
            <Typography style={{ fontSize: '15px', fontFamily: 'sans-serif' }}>
                {' '}
                Total Usage: 40 hours{' '}
            </Typography>
        );

        return (
            <React.Fragment>
                <Row style={{ marginTop: '20px' }}>
                    <Collapse defaultActiveKey={['1']}>
                        <Panel
                            header={
                                <span
                                    style={{
                                        fontSize: '16px',
                                        fontFamily: 'sans-serif',
                                    }}
                                >
                                    Elastic Compute Service
                                </span>
                            }
                            key="1"
                            style={{ padding: '10px' }}
                        >
                            <EcsUsage ecs={usageReport} />
                        </Panel>
                    </Collapse>
                </Row>
            </React.Fragment>
        );
    }
}
