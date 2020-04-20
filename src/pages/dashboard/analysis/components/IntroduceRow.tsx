import { Col, Icon, Row, Tooltip, Typography, Divider } from 'antd';
import { Link } from 'umi';
import { FormattedMessage } from 'umi-plugin-react/locale';
import React from 'react';
import { ChartCard, Field } from './Charts';
import { connect } from 'dva';
const DonutChart = React.lazy(() => import('./Charts/Donut/DonutChart'));
import subnet from './../../../../../public/subnet.png';
import styles from '../style.less';

const CONTENT_HEIGHT = 300;

const IntroduceRow = ({
    loading,
    state,
}: {
    loading: boolean;
    data: {};
    fetchingVolumes: boolean;
    evs: any;
    state: any;
    dispatch: any;
}) => {
    const { stats } = state;
    const { building, active, paused, stop, error, shelved_offloaded } = stats;
    return (
        <div>
            <Row
                gutter={10}
                type="flex"
                style={{
                    marginTop: '0px',
                    marginBottom: '10px',
                    paddingBottom: '20px',
                }}
            >
                <Col span={12}>
                    <ChartCard
                        bordered={false}
                        action={
                            <Tooltip
                                title={
                                    <FormattedMessage
                                        id="dashboard-analysis.analysis.introduce"
                                        defaultMessage="Introduce"
                                    />
                                }
                            ></Tooltip>
                        }
                        loading={typeof active === 'undefined' ? true : false}
                        footer={
                            <Field
                                label={
                                    <Link to="/service/compute/elastic-cloud-services">
                                        {' '}
                                        <FormattedMessage
                                            id="dashboard-analysis.analysis.view-total-instances-details"
                                            defaultMessage="View All Instances"
                                        />
                                    </Link>
                                }
                            />
                        }
                        contentHeight={CONTENT_HEIGHT}
                    >
                        <Row>
                            <Col span={6}>
                                <div
                                    style={{
                                        marginTop: '50%',
                                        textAlign: 'center',
                                        borderRight: '2px solid #EFEFEF',
                                    }}
                                >
                                    <Typography style={{ fontSize: '16px' }}>
                                        Instances
                                    </Typography>

                                    <Typography
                                        style={{
                                            fontSize: '55px',
                                            fontWeight: 'bolder',
                                        }}
                                    >
                                        {typeof stats.instancesCount !==
                                        'undefined'
                                            ? stats.instancesCount
                                            : '-'}
                                    </Typography>
                                </div>
                            </Col>

                            <Col span={16}>
                                {stats.instancesCount === 0 && (
                                    <div className={styles.noChartWrapper}>
                                        No Instance Found.
                                    </div>
                                )}
                                {stats.instancesCount !== 0 && (
                                    <DonutChart
                                        subTitle="Instances"
                                        data={[
                                            {
                                                x: 'building ',
                                                y:
                                                    typeof building !==
                                                    'undefined'
                                                        ? building
                                                        : '-',
                                            },
                                            {
                                                x: 'active ',
                                                y:
                                                    typeof active !==
                                                    'undefined'
                                                        ? active
                                                        : '-',
                                            },
                                            {
                                                x: 'pause ',
                                                y:
                                                    typeof paused !==
                                                    'undefined'
                                                        ? paused
                                                        : '-',
                                            },
                                            {
                                                x: 'stop',
                                                y:
                                                    typeof stop !== 'undefined'
                                                        ? stop
                                                        : '-',
                                            },
                                            {
                                                x: 'Shelved Offloaded',
                                                y:
                                                    typeof shelved_offloaded !==
                                                    'undefined'
                                                        ? shelved_offloaded
                                                        : '-',
                                            },
                                            {
                                                x: 'error ',
                                                y:
                                                    typeof error !== 'undefined'
                                                        ? error
                                                        : '-',
                                            },
                                        ]}
                                        height={300}
                                        lineWidth={0}
                                        maxVal={stats.instancesCount}
                                    />
                                )}
                            </Col>
                        </Row>
                    </ChartCard>
                </Col>

                <Col span={12}>
                    <ChartCard
                        style={{ padding: '5x' }}
                        loading={
                            typeof stats.vmerror === 'undefined' ? true : false
                        }
                        action={
                            <Tooltip
                                title={
                                    <FormattedMessage
                                        id="dashboard-analysis.analysis.introduce"
                                        defaultMessage="Introduce"
                                    />
                                }
                            ></Tooltip>
                        }
                        footer={
                            <Field
                                label={
                                    <Link to="/service/storage/elastic-volume-services">
                                        {' '}
                                        <FormattedMessage
                                            id="dashboard-analysis.analysis.view-total-volumes-details"
                                            defaultMessage="View All Volumes"
                                        />
                                    </Link>
                                }
                            />
                        }
                        contentHeight={CONTENT_HEIGHT}
                    >
                        <Row>
                            <Col span={6}>
                                <div
                                    style={{
                                        marginTop: '50%',
                                        textAlign: 'center',
                                        borderRight: '2px solid #EFEFEF',
                                    }}
                                >
                                    <Typography style={{ fontSize: '16px' }}>
                                        Volumes
                                    </Typography>

                                    <Typography
                                        style={{
                                            fontSize: '55px',
                                            fontWeight: 'bolder',
                                        }}
                                    >
                                        {typeof stats.volumes === 'undefined'
                                            ? '-'
                                            : stats.volumes}
                                    </Typography>
                                </div>
                            </Col>

                            <Col span={16}>
                                {stats.volumes === 0 && (
                                    <div className={styles.noChartWrapper}>
                                        No Volume Found.
                                    </div>
                                )}
                                {stats.volumes && (
                                    <DonutChart
                                        maxVal={stats.volumes}
                                        height={300}
                                        lineWidth={0}
                                        data={[
                                            {
                                                x: 'available ',
                                                y:
                                                    typeof stats.available ===
                                                    'undefined'
                                                        ? '-'
                                                        : stats.available,
                                            },
                                            {
                                                x: 'In Use',
                                                y:
                                                    typeof stats.inuse ===
                                                    'undefined'
                                                        ? '-'
                                                        : stats.inuse,
                                            },
                                            {
                                                x: 'error',
                                                y:
                                                    typeof stats.vmerror ===
                                                    'undefined'
                                                        ? '-'
                                                        : stats.vmerror,
                                            },
                                            {
                                                x: 'Volume Creating',
                                                y:
                                                    typeof stats.volume_creating ===
                                                    'undefined'
                                                        ? '-'
                                                        : stats.volume_creating,
                                            },
                                        ]}
                                    />
                                )}
                            </Col>
                        </Row>
                    </ChartCard>
                </Col>
            </Row>

            <SecondRow data={stats}/>
            <ThirdRow data={stats} />
        </div>
    );
};

class SecondRow extends React.Component {
    render() {
        const { data } = this.props;
        return (
            <Row gutter={10} style={{ paddingBottom: '10px' }}>
                <Col span={8}>
                    <ChartCard
                        bordered={false}
                        loading={
                            typeof data.networks === 'undefined' ? true : false
                        }
                        footer={
                            <Field
                                label={
                                    <Link to="/service/network/networks">
                                        {' '}
                                        <FormattedMessage
                                            id="dashboard-analysis.analysis.view-total-networks-details"
                                            defaultMessage="View All Networks"
                                        />
                                    </Link>
                                }
                            />
                        }
                    >
                        <Row>
                            <Col
                                lg={12}
                                style={{ borderRight: '2px solid #EFEFEF' }}
                            >
                                <Typography
                                    style={{
                                        fontSize: '16px',
                                        textAlign: 'center',
                                    }}
                                >
                                    Networks
                                </Typography>

                                <Typography
                                    style={{
                                        fontSize: '56px',
                                        fontWeight: 'bolder',
                                        textAlign: 'center',
                                        paddingTop: '0px',
                                    }}
                                >
                                    {typeof data.networks === 'undefined'
                                        ? '-'
                                        : data.networks}
                                </Typography>
                            </Col>

                            <Col lg={10} push={2}>
                                <div className={styles.iconWrapper}>
                                    <Icon
                                        type="cluster"
                                        style={{
                                            fontSize: '60px',
                                            color: '#71c0fb',
                                        }}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </ChartCard>
                </Col>

                <Col span={8}>
                    <ChartCard
                        loading={
                            typeof data.snapshots === 'undefined' ? true : false
                        }
                        bordered={false}
                        footer={
                            <Field
                                label={
                                    <Link to="/service/storage/snapshots">
                                        {' '}
                                        <FormattedMessage
                                            id="dashboard-analysis.analysis.view-total-snapshots-details"
                                            defaultMessage="View All Snapshots"
                                        />
                                    </Link>
                                }
                            />
                        }
                    >
                        <Row>
                            <Col
                                lg={12}
                                style={{ borderRight: '2px solid #EFEFEF' }}
                            >
                                <Typography
                                    style={{
                                        fontSize: '16px',
                                        textAlign: 'center',
                                    }}
                                >
                                    Snapshots
                                </Typography>

                                <Typography
                                    style={{
                                        fontSize: '56px',
                                        fontWeight: 'bolder',
                                        textAlign: 'center',
                                        paddingTop: '0px',
                                    }}
                                >
                                    {typeof data.snapshots === 'undefined'
                                        ? '-'
                                        : data.snapshots}
                                </Typography>
                            </Col>

                            <Col lg={10} push={2}>
                                <div className={styles.iconWrapper}>
                                    <Icon
                                        type="database"
                                        style={{
                                            fontSize: '60px',
                                            color: '#71c0fb',
                                        }}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </ChartCard>
                </Col>

                <Col span={8}>
                    <ChartCard
                        loading={
                            typeof data.securitygroups === 'undefined'
                                ? true
                                : false
                        }
                        footer={
                            <Field
                                label={
                                    <Link to="/service/network/security-groups">
                                        {' '}
                                        <FormattedMessage
                                            id="dashboard-analysis.analysis.view-total-security_groups-details"
                                            defaultMessage="View All Security Groups"
                                        />
                                    </Link>
                                }
                            />
                        }
                    >
                        <Row>
                            <Col
                                lg={12}
                                style={{ borderRight: '2px solid #EFEFEF' }}
                            >
                                <Typography
                                    style={{
                                        fontSize: '16px',
                                        textAlign: 'center',
                                    }}
                                >
                                    Security Groups
                                </Typography>

                                <Typography
                                    style={{
                                        fontSize: '56px',
                                        fontWeight: 'bolder',
                                        textAlign: 'center',
                                        paddingTop: '0px',
                                    }}
                                >
                                    {typeof data.securitygroups === 'undefined'
                                        ? '-'
                                        : data.securitygroups}
                                </Typography>
                            </Col>

                            <Col lg={10} push={2}>
                                <div className={styles.iconWrapper}>
                                    <Icon
                                        type="usergroup-add"
                                        style={{
                                            fontSize: '60px',
                                            color: '#71c0fb',
                                        }}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </ChartCard>
                </Col>
            </Row>
        );
    }
}

class ThirdRow extends React.Component {
    render() {
        const { data } = this.props;
        return (
            <Row style={{ paddingTop: '20px' }} gutter={10}>
                <Col span={8}>
                    <ChartCard
                        loading={
                            typeof data.keypairs === 'undefined' ? true : false
                        }
                        footer={
                            <Field
                                label={
                                    <Link to="/service/compute/keypairs">
                                        {' '}
                                        <FormattedMessage
                                            id="dashboard-analysis.analysis.view-total-keypairs-details"
                                            defaultMessage="View All Keypairs"
                                        />
                                    </Link>
                                }
                            />
                        }
                    >
                        <Row>
                            <Col
                                lg={12}
                                style={{ borderRight: '2px solid #EFEFEF' }}
                            >
                                <Typography
                                    style={{
                                        fontSize: '16px',
                                        textAlign: 'center',
                                    }}
                                >
                                    Keypairs
                                </Typography>

                                <Typography
                                    style={{
                                        fontSize: '56px',
                                        fontWeight: 'bolder',
                                        textAlign: 'center',
                                        paddingTop: '0px',
                                    }}
                                >
                                    {typeof data.keypairs === 'undefined'
                                        ? '-'
                                        : data.keypairs}
                                </Typography>
                            </Col>

                            <Col lg={10} push={2}>
                                <div className={styles.iconWrapper}>
                                    <Icon
                                        type="key"
                                        style={{
                                            fontSize: '60px',
                                            color: '#71c0fb',
                                        }}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </ChartCard>
                </Col>

                <Col span={8}>
                    <ChartCard
                        loading={
                            typeof data.routersCount === 'undefined'
                                ? true
                                : false
                        }
                        footer={
                            <Field
                                label={
                                    <Link to="/service/network/routers">
                                        {' '}
                                        <FormattedMessage
                                            id="dashboard-analysis.analysis.view-total-routers-details"
                                            defaultMessage="View All Routers"
                                        />
                                    </Link>
                                }
                            />
                        }
                    >
                        <Row>
                            <Col
                                lg={12}
                                style={{ borderRight: '2px solid #EFEFEF' }}
                            >
                                <Typography
                                    style={{
                                        fontSize: '16',
                                        textAlign: 'center',
                                    }}
                                >
                                    Routers
                                </Typography>

                                <Typography
                                    style={{
                                        fontSize: '56px',
                                        fontWeight: 'bolder',
                                        textAlign: 'center',
                                        paddingTop: '10px',
                                    }}
                                >
                                    {typeof data.routersCount === 'undefined'
                                        ? '-'
                                        : data.routersCount}
                                </Typography>
                            </Col>

                            <Col lg={10} push={2}>
                                <div className={styles.iconWrapper}>
                                <Icon
                                        type="global"
                                        style={{
                                            fontSize: '60px',
                                            color: '#71c0fb',
                                        }}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </ChartCard>
                </Col>

                <Col span={8}>
                    <ChartCard
                        loading={
                            typeof data.subnetsCount === 'undefined'
                                ? true
                                : false
                        }
                    >
                        <Row>
                            <Col
                                lg={12}
                                style={{ borderRight: '2px solid #EFEFEF' }}
                            >
                                <Typography
                                    style={{
                                        fontSize: '16px',
                                        textAlign: 'center',
                                    }}
                                >
                                    Subnets
                                </Typography>

                                <Typography
                                    style={{
                                        fontSize: '56px',
                                        fontWeight: 'bolder',
                                        textAlign: 'center',
                                        paddingTop: '10px',
                                    }}
                                >
                                    {typeof data.subnetsCount === 'undefined'
                                        ? '-'
                                        : data.subnetsCount}
                                </Typography>
                            </Col>

                            <Col lg={10} push={2}>
                                <div className={styles.iconWrapper}>
                                    <img
                                        src={subnet}
                                        style={{ height: '55px' }}
                                    ></img>
                                </div>
                            </Col>
                        </Row>
                        <Divider />
                    </ChartCard>
                </Col>
            </Row>
        );
    }
}

export default connect(state => {
    return {
        state,
    };
})(IntroduceRow);
