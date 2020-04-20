import React, { PureComponent } from 'react';
import { Row, Col, Card, Statistic, Icon, Spin } from 'antd';
import { Link } from 'umi';
import { Bar } from '../dashboard/analysis/components/Charts/index';
import BasicHistogram from './components/BasicHistogramChart';
import { connect } from 'dva';

import styles from './Dashboard.less';
import { transform } from './utils';
import moment from 'moment';

@connect(({ global, loading }) => {
    return {
        isLoadingData:
            loading.effects['global/fetchCurrentTotalSpend'] ||
            loading.effects['global/fetchSpends'],
        global: { ...global },
    };
})
export default class SpendByService extends PureComponent {
    componentDidMount() {
        const { dispatch } = this.props;

        dispatch({
            type: 'global/fetchCurrentTotalSpend',
        });
        dispatch({
            type: 'global/fetchSpends',
            payload: { num_months: 6 },
        });
    }

    componentDidUpdate() {}

    render() {
        if (this.props.isLoadingData) {
            return (
                <div style={{ textAlign: 'center', marginTop: `150px` }}>
                    <Spin
                        indicator={
                            <Icon
                                type="loading"
                                style={{ fontSize: 34 }}
                                spin
                            />
                        }
                    />
                </div>
            );
        }

        const spends = this.props.global.spends;

        const mu = moment;
        let dataSource = [];
        dataSource = spends.map(item => {
            let { summary } = item;

            const month = moment(summary[0]?.begin).format('MMM YYYY');
            const rate = summary[0]?.rate;
            return { Month: month, Cost: rate };
        });

        return (
            <>
                <div style={{ padding: '34px', marginBottom: `24px` }}>
                    <Row type={'flex'} span={24} gutter={20}>
                        <Col xxl={6} xl={6} lg={6} md={6} sm={6} xs={6}>
                            <div className={styles['card']}>
                                <Card
                                    type="inner"
                                    title="Account Balance"
                                    extra={''}
                                    style={{ width: '100%' }}
                                >
                                    <Statistic
                                        valueStyle={{ fontSize: '1.15em' }}
                                        style={{ marginBottom: '40px' }}
                                        title=""
                                        value={`${parseFloat(0).toFixed(
                                            2
                                        )} SAR`}
                                    />
                                </Card>
                            </div>
                            <div className={styles['card']}>
                                <Card
                                    type="inner"
                                    title={'Month-to-Date Bill '}
                                    extra={moment().format('MMM YY')}
                                    style={{ width: '100%' }}
                                >
                                    <Statistic
                                        valueStyle={{ fontSize: '1.15em' }}
                                        style={{ marginBottom: '40px' }}
                                        title=""
                                        value={`${parseFloat(
                                            this.props.global.totalCurrentSpend
                                        ).toFixed(2)} SAR`}
                                    />
                                </Card>
                            </div>
                        </Col>
                        <Col xxl={18} xl={18} lg={18} md={18} sm={18} xs={18}>
                            <div className={styles['card']}>
                                <Card
                                    type="inner"
                                    title="Spend History"
                                    extra={''}
                                    style={{ width: '100%' }}
                                >
                                    <Row type={'flex'} span={24}>
                                        <Col
                                            xxl={4}
                                            xl={4}
                                            lg={4}
                                            md={4}
                                            sm={4}
                                            xs={4}
                                        >
                                            <Statistic
                                                valueStyle={{
                                                    fontSize: '1.15em',
                                                    marginBottom: '20px',
                                                }}
                                                title="Current Month"
                                                value={new Date()
                                                    .toLocaleString('default', {
                                                        month: 'long',
                                                    })
                                                    .toString()
                                                    .concat(
                                                        ' ' +
                                                            new Date().getFullYear()
                                                    )}
                                            />
                                            <Statistic
                                                valueStyle={{
                                                    fontSize: '1.15em',
                                                }}
                                                style={{ marginBottom: '40px' }}
                                                title="Current Total"
                                                value={`${parseFloat(
                                                    this.props.global
                                                        .totalCurrentSpend
                                                ).toFixed(2)} SAR`}
                                            />
                                        </Col>
                                        <Col
                                            xxl={20}
                                            xl={20}
                                            lg={20}
                                            md={20}
                                            sm={20}
                                            xs={20}
                                        >
                                            <BasicHistogram
                                                dataSource={dataSource}
                                            />
                                        </Col>
                                    </Row>
                                </Card>
                            </div>
                        </Col>
                    </Row>
                </div>
            </>
        );
    }
}
