import React, { PureComponent } from 'react';
import {
    Collapse,
    Popconfirm,
    Icon,
    Row,
    Col,
    Spin,
    Divider,
    Descriptions,
    Badge,
    Card,
    Form,
    Select,
    Typography,
    Tag,
    Switch,
} from 'antd';
import { connect } from 'dva';
import { Empty, Button } from 'antd';
import moment from 'moment';
import { getPageQuery } from '@/utils/utils';
import FormRow from '@/pages/service/components/FormRow';
import CreateEVS from '@/pages/service/storage/ElasticVolumeServices/CreateEVS';
import SubnetCreation from '@/pages/service/network/VirtualPrivateCloud/components/SubnetCreation';
import { elementType } from 'prop-types';
import PortDetailPanel from './PortDetailPanel';

const { Panel } = Collapse;

const customPanelStyle = {
    background: '#f7f7f7',
    borderRadius: 4,
    marginBottom: 24,

    border: 0,
    overflow: 'hidden',
};

@connect(({ vpc, loading, router, securitygroup, appState }) => {
    return {
        router,
        appState,
        securitygroup,
        deletingPort: loading.effects['router/deletePort'],
    };
})
@Form.create()
class PortDetails extends PureComponent {
    constructor(props) {
        super(props);
        this.showCreateNewPort = this.showCreateNewPort.bind(this);

        this.state = {
            showAttachPortForm: false,
            showCreateNewPort: false,
            updatePortState: '',
            freezeCollapse: false,
        };
    }

    componentDidMount() {}

    showAttachPortForm() {
        this.props.dispatch({
            type: 'evs/update',
        });

        this.setState({ showAttachPortForm: true });
    }

    showCreateNewPort() {
        this.props.dispatch({
            type: 'drawer/showDrawer',
            payload: {
                componentPath:
                    'network/VirtualPrivateCloud/components/PortCreation',
                mountedData: {
                    id: this.props.currentNetwork.id,
                    subnets: this.props.currentNetwork.subnet_ids,
                    drawerName: 'Create New Port',
                },
            },
        });
    }

    confirm(port, event) {
        event.stopPropagation();
        this.props.dispatch({
            type: `router/deletePort`,
            payload: port.id,
        });
    }

    updatePort(value) {
        this.setState(state => {
            return {
                ...state,
                updatePortState: value,
            };
        });
    }

    onCancelUpdatePort() {
        this.onClose();
        this.setState(state => {
            return {
                ...state,
                updatePortState: '',
            };
        });
    }
    stopcollapse(key) {
        const newState = {};
        if (key) {
            newState.updatePortState = key;
        }
        if (!key) {
            newState.updatePortState = '';
        }
        this.setState(newState);
    }

    onClose = () => {
        var el = document.querySelector('.ant-collapse-item-active');
        el.children[0].click();
    };
    render() {
        const { dispatch, evs, currentNetwork, vpc, router } = this.props;

        const { subnet_ids } = currentNetwork
            ? currentNetwork
            : { subnet_ids: [] };

        let filteredPorts = this.props.router.portList
            .filter(items => items.network_id === currentNetwork.id)
            .map((port, index) => {
                return (
                    <Panel
                        style={{ padding: `0px` }}
                        disabled={this.props.detachingVolume}
                        header={
                            <>
                                <span style={{ color: `#7d7d7d` }}>
                                    {port?.name
                                        ? port.name
                                        : port?.fixed_ips.length > 0
                                        ? port.fixed_ips[0]['ip_address']
                                        : '-'}{' '}
                                </span>{' '}
                            </>
                        }
                        extra={
                            <>
                                <Popconfirm
                                    title="Are you sure?"
                                    onConfirm={this.confirm.bind(this, port)}
                                    okText="Yes"
                                    cancelText="No"
                                    onCancel={e => e.stopPropagation()}
                                >
                                    <Button
                                        type="danger"
                                        onClick={e => e.stopPropagation()}
                                        loading={this.props.router.loading.includes(
                                            port.id
                                        )}
                                    >
                                        Delete
                                    </Button>
                                </Popconfirm>

                                <Button
                                    type="primary"
                                    style={{ marginLeft: `10px` }}
                                    onClick={this.updatePort.bind(
                                        this,
                                        port.id
                                    )}
                                    disabled={
                                        this.state.updatePortState === port.id
                                    }
                                >
                                    Update Port
                                </Button>
                            </>
                        }
                        key={port.id}
                        style={customPanelStyle}
                    >
                        <div style={{ marginTop: `20px` }}>
                            <PortDetailPanel
                                port={port}
                                updatePortState={this.state.updatePortState}
                                onCancelUpdatePort={this.onCancelUpdatePort.bind(
                                    this
                                )}
                            />{' '}
                        </div>
                    </Panel>
                );
            });

        return (
            <div>
                <Row>
                    <div style={{ marginBottom: `24px` }}>
                        <Row
                            style={{
                                marginBottom: this.state.showAttachPortForm
                                    ? '30px'
                                    : '0px',
                            }}
                        >
                            <Col span={24}>
                                <Button
                                    type="primary"
                                    onClick={e => {
                                        e.preventDefault();
                                        this.showCreateNewPort();
                                    }}
                                >
                                    Create New
                                </Button>
                            </Col>
                        </Row>
                    </div>

                    <Col span={24}>
                        {Array.isArray(filteredPorts) &&
                            filteredPorts.length > 0 && (
                                <Collapse
                                    accordion
                                    onChange={this.stopcollapse.bind(this)}
                                    bordered={false}
                                    expandIcon={({ isActive }) => (
                                        <Icon
                                            type="caret-right"
                                            rotate={isActive ? 90 : 0}
                                        />
                                    )}
                                >
                                    {filteredPorts}
                                </Collapse>
                            )}
                    </Col>
                </Row>
            </div>
        );
    }
}

export default PortDetails;
