import React from 'react';
import {
    Tabs,
    Button,
    Icon,
    Form,
    Row,
    Col,
    Select,
    Input,
    Typography,
    Table,
    Descriptions,
    Badge,
    Divider,
    Menu,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { getPageQuery } from '@/utils/utils';
import { routerRedux } from 'dva/router';
import { symbol } from 'prop-types';
import { Skeleton } from 'antd';
import VolumeDetails from './components/VolumesDetails';
import Console from './components/Console';
import ConsoleExtraActions from './components/ConsoleExtraActions';
import FloatingIPDetails from './components/FloatingIPDetails';
import SecurityGroupDetails from './components/SecurityGroupDetails';
// Incomplete Feature Hidden
import MonitoringDetailsContainer from './components/MonitoringDetailsContainer';
import InstanceNetworkDetails from './components/InstanceNetworkDetails';
import Summary from './components/Summary';
import { convertToLowerCase } from '../../../../utils/utils';

const { SubMenu } = Menu;
const { TabPane } = Tabs;

const ecsComponentsDetails = {
    summary: Summary,
    volumes: VolumeDetails,
    console: Console,
    securitygroups: SecurityGroupDetails,
    networks: InstanceNetworkDetails,
    monitoring: MonitoringDetailsContainer,
    // "floating-ips": FloatingIPDetails
};

const ecsComponentsExtra = {
    console: ConsoleExtraActions,
};

const operations = (
    <div>
        <Button>
            <Icon type="caret-right" />
        </Button>{' '}
        <Button>
            <Icon type="pause" />
        </Button>{' '}
        <Button>
            <Icon type="stop" />
        </Button>
    </div>
);

const operations2 = <Icon type="stop" />;
const tabTitles = [
    'Summary',
    'Volumes',
    'Security Groups',
    'Networks',
    //'NICs'
    'Monitoring',
    'Console',
];

@Form.create()
class ECSDetails extends React.PureComponent {
    constructor(props) {
        super(props);
        this.changeDetailsTab = this.changeDetailsTab.bind(this);

        this.state = {
            choice: '',
            columns: [
                {
                    title: 'Volume Name',
                    dataIndex: 'volumename',
                    key: 'volumename',
                    width: 150,
                    render: text => <a href="javascript:;">{text}</a>,
                },
                {
                    title: 'Actions',
                    dataIndex: 'actions',
                    key: 'actions',
                    width: 150,
                },
            ],
        };
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields(
            ['floatingip', 'removeip'],
            (err, values) => {
                if (!err) {
                    var payload = {};
                    const { keys, names } = values;

                    if (Object.keys(values)[0] === 'removeip') {
                        delete values['removeip'];
                        values['floatingip'] = [];
                        values['floatingip'][1] = this.props.ecsid;
                        values['floatingip'][0] = this.props.floatingIp;

                        this.props.dispatch({
                            type: 'ecs/detach',
                            payload: values,
                        });
                    } else {
                        this.props.dispatch({
                            type: 'ecs/attach',
                            payload: values,
                        });
                    }
                }
            }
        );
    };

    handleVolumeAction(value) {
        this.setState({ choice: value });
    }

    handleVolumeSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields(['VolumeAttachment'], (err, values) => {
            if (!err) {
                const { keys, names } = values;
                values['server'] = this.props.ecsid;

                if (Object.keys(values)[0] === 'VolumeAttachment') {
                    values['VolumeAttachment'] = {
                        volumeId: values['VolumeAttachment'],
                    };
                    this.props.dispatch({
                        type: `ecs/attachVolume`,
                        payload: values,
                    });
                }
                if (Object.keys(values)[0] === 'detach') {
                    this.props.dispatch({
                        type: `ecs/detachVolume`,
                        payload: values,
                    });
                }
            }
        });
    };

    detachVolume(volumeID) {
        const values = [];
        values[0] = this.props.ecsid;
        values[1] = volumeID;

        this.props.dispatch({
            type: `ecs/detachVolume`,
            payload: values,
        });
    }

    selectVolumeAction() {
        <Select
            style={{ width: `250px` }}
            size="medium"
            onSelect={value => this.handleVolumeAction(value)}
        >
            <Option value="attach">Attach Volume</Option>
            <Option value="detach">Detach Volume</Option>
        </Select>;
    }

    componentDidMount() {
        const { dispatch } = this.props;

        const id = getPageQuery()?.instance_id;

        if (id) {
            dispatch({
                type: 'ecs/showCurrentInstance',
                payload: {
                    id,
                },
            });
        } else {
            routerRedux.replace('/service/compute/elastic-cloud-services');
        }
    }

    componentWillUnmount() {
        this.props.dispatch({
            type: 'ecs/removeCurrentShowInstance',
        });
    }

    changeDetailsTab(clickedTab) {
        const { dispatch } = this.props;
        const { key } = clickedTab;
        const { instance_id } = this.props.location.query;
        dispatch(
            routerRedux.push(
                `/service/compute/elastic-cloud-services/show-instance?tab=${key}&instance_id=${instance_id}`
            )
        );
    }

    render() {
        const currentTabValue = getPageQuery()?.tab || 'summary';
        const CurrentTabComponent = ecsComponentsDetails[currentTabValue];
        const ExtraActions = ecsComponentsExtra[currentTabValue];
        return (
            <div
                style={{ height: `100%`, display: `flex`, flexFlow: `column` }}
            >
                <div style={{ position: `sticky`, top: `0`, zIndex: '1' }}>
                    <Row>
                        <Col span={19}>
                            <Menu
                                style={{ padding: `0px 34px`, border: 0 }}
                                onClick={this.changeDetailsTab}
                                selectedKeys={[currentTabValue]}
                                mode="horizontal"
                            >
                                {tabTitles.map(tabTitle => {
                                    return (
                                        <Menu.Item
                                            key={convertToLowerCase(tabTitle)}
                                        >
                                            <Icon type="appstore" />
                                            {tabTitle}
                                        </Menu.Item>
                                    );
                                })}
                            </Menu>
                        </Col>
                        <Col span={5}>
                            <Row type="flex" justify="end">
                                <Col>
                                    {ecsComponentsExtra[currentTabValue] ? (
                                        <ExtraActions />
                                    ) : null}
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </div>

                <div
                    style={{
                        padding:
                            currentTabValue === 'console' &&
                            this.props.currentInstance
                                ? '0px'
                                : `34px`,
                        height: `100%`,
                        borderTop: `1px solid #e5e5e5`,
                    }}
                >
                    {this.props.currentInstance ? (
                        ecsComponentsDetails[currentTabValue] ? (
                            <CurrentTabComponent
                                appState={this.props.appState}
                                currentInstance={this.props.currentInstance}
                                dispatch={this.props.dispatch}
                            />
                        ) : null
                    ) : (
                        <Skeleton active />
                    )}
                </div>
            </div>
        );
    }
}

export default connect(state => {
    return {
        fetchingCurrentInstance:
            state.loading.effects['ecs/showCurrentInstance'],
        currentInstance: state.ecs.selectedInstance,
        appState: state,
    };
})(ECSDetails);
