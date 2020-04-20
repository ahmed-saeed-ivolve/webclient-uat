import React, { PureComponent } from 'react';
import StepsForm from '@/components/StepForms';
import First from './components/IntanceCreateSteps/First';
import Second from './components/IntanceCreateSteps/Second';
import Third from './components/IntanceCreateSteps/Third';
import Fourth from './components/IntanceCreateSteps/Fourth';
import Fifth from './components/IntanceCreateSteps/Fifth';
import { Row, Col, Typography, Form, Spin, Icon, Progress } from 'antd';
import { connect } from 'dva';
import PricingStrip from './components/PricingStrip';
const antIcon = <Icon type="loading" style={{ fontSize: 34 }} spin />;

class CreateECS extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            precentCompleted: 0,
            forms: [
                {
                    Content: First,
                    number: 'First',
                    stepData: {
                        title: 'Details',
                    },
                },
                {
                    Content: Second,
                    number: 'Second',
                    stepData: {
                        title: 'Source',
                    },
                },
                {
                    Content: Third,
                    number: 'Third',
                    stepData: {
                        title: 'Networking',
                    },
                },
                {
                    Content: Fourth,
                    number: 'Fourth',
                    stepData: {
                        title: 'Security',
                    },
                },
                {
                    Content: Fifth,
                    number: 'Fifth',
                    stepData: {
                        title: 'Metadata',
                    },
                },
            ],
        };
    }

    componentWillUnmount() {
        this.props.dispatch({
            type: 'createECS/resetFormsData',
        });

        this.props.dispatch({
            type: 'price/clearPricingFlavor',
        });

        this.props.dispatch({
            type: 'price/clearPricingVolume',
        });
    }
    componentDidMount() {
        const { dispatch } = this.props;

        dispatch({
            type: 'flavor/update',
        });

        dispatch({
            type: 'global/fetchAvailabilityZone',
        });
        dispatch({
            type: 'global/fetchDbmsMetadata',
        });

        dispatch({
            type: 'global/fetchRegions',
        });

        dispatch({
            type: 'vpc/update',
            payload: { method: 'Network.networks' },
        });

        dispatch({
            type: 'ims/fetchList',
        });

        dispatch({
            type: 'keypair/update',
            payload: { method: 'Compute.list_keypairs' },
        });

        dispatch({
            type: 'ecs/update',
            payload: { method: 'Compute.list' },
        });

        dispatch({
            type: 'stats/fetchQuotasInstances',
        });

        dispatch({
            type: 'securitygroup/update',
            payload: {
                force: true,
            },
        });

        dispatch({
            type: 'floatingip/update',
            payload: { method: 'Network.ips' },
        });

        dispatch({
            type: 'evs/volumeTypes',
        });

        dispatch({
            type: 'global/pricingValidation',
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.precentCompleted !== 100) {
            const value = this.showLoadingProgress.bind(this)(
                this.props.fetchingDependencies
            );
            this.setState(state => {
                return {
                    ...state,
                    precentCompleted: value,
                };
            });
        }
    }

    showLoadingProgress(argument) {
        const valueArray = Object.values(argument);
        const steps = valueArray.length;
        const success = valueArray.filter(value => !value).length;
        return Math.ceil((success / steps) * 100);
    }

    render() {
        if (this.state.precentCompleted !== 100) {
            return (
                <div style={{ textAlign: 'center', marginTop: `150px` }}>
                    <Progress
                        type="circle"
                        percent={this.state.precentCompleted}
                    />
                </div>
            );
        }
        return (
            <div
                style={{
                    marginBottom: `0`,
                    backgroundColor: `#fff`,
                    padding: this.props.type !== 'modal' ? `34px` : `0px`,
                    overflow: 'scroll',
                    overflowX: 'hidden',
                    overflowY: 'auto',
                    height: window.screen.height - 350,
                }}
            >
                <Row>
                    <Col xs={{ span: 24 }} s={{ span: 24 }}>
                        <div style={{ padding: `34px`, background: `#fff` }}>
                            <StepsForm
                                helperData={{
                                    global: { ...this.props.global },
                                    evs: { ...this.props.evs },
                                    ims: [...this.props.ims.list],
                                    flavor: [...this.props.flavor?.list],
                                    vpc: [...this.props.vpc?.list],
                                    floatingip: [
                                        ...this.props.floatingip?.list,
                                    ],
                                    keypair: [...this.props.keypair?.list],
                                    securitygroup: [
                                        ...this.props.securitygroup?.list,
                                    ],
                                    availabilityZones: [
                                        ...this.props.global.availabilityZones,
                                    ],
                                    dbmsMetadata: {
                                        ...this.props.global.dbmsMetadata,
                                    },
                                    ecs: [...this.props.ecs?.list],
                                    quotaInstances: {
                                        ...this.props?.stats?.quotaInstances,
                                    },
                                }}
                                steps={this.state.forms}
                            />
                        </div>
                    </Col>
                </Row>
                <PricingStrip />
            </div>
        );
    }
}
export default connect(
    ({
        global,
        loading,
        ims,
        flavor,
        vpc,
        floatingip,
        keypair,
        securitygroup,
        evs,
        price,
        ecs,
        stats,
    }) => ({
        ims,
        flavor,
        vpc,
        floatingip,
        keypair,
        securitygroup,
        global,
        evs,
        price,
        ecs,
        stats,
        fetchingDependencies: {
            'Fetching Flavors': loading.effects['flavor/update'],
            'Fetching Availability Zone':
                loading.effects['global/fetchAvailabilityZone'],
            'Fetching DbmsMetadata':
                loading.effects['global/fetchDbmsMetadata'],
            'Fetching Regions': loading.effects['global/fetchRegions'],
            'Fetching Networks': loading.effects['vpc/update'],
            'Fetching Images': loading.effects['ims/fetchList'],
            'Fetching Keypairs': loading.effects['keypair/update'],
            'Fetching Security Groups': loading.effects['securitygroup/update'],
            'Fetching Elastic Ips': loading.effects['floatingip/update'],
            'Fetching Volume Types': loading.effects['evs/volumeTypes'],
        },
    })
)(CreateECS);
