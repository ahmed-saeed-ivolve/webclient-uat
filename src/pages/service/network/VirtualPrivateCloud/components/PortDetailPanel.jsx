import {
    Collapse,
    Icon,
    Row,
    Col,
    Spin,
    Divider,
    Descriptions,
    Badge,
    Card,
    Popconfirm,
    Form,
    Select,
    Typography,
    Tag,
    Input,
    Switch,
    Button,
    notification,
    Tooltip,
} from 'antd';
import ReactDOM from 'react-dom';
import moment from 'moment';
import React from 'react';
import { connect } from 'dva';
import FormRow from '@/pages/service/components/FormRow';

const { Option } = Select;

class PortDetailPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            is_port_security_enabled: props.port.is_port_security_enabled,
            attachSecurityGroupState: false,
            temporarySecurityGroups: [],
            methodType: '',
            detachID: '',
        };
    }

    componentDidMount() {
        const { dispatch } = this.props;
    }

    handleSubmit = e => {
        e.preventDefault();

        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { keys, names } = values;
                values['volume_id'] = this.props.mountedData.id;
                values['size'] = this.state.inputValue;
                this.props.dispatch({
                    type: 'evs/resize',
                    payload: values,
                });
            }
        });
    };

    switchChange(checked) {
        this.setState(state => {
            return {
                ...state,
                is_port_security_enabled: checked,
            };
        });
    }

    async onSave() {
        const { port } = this.props;
        if (
            !(
                port.is_port_security_enabled ===
                    this.state.is_port_security_enabled &&
                this.state.temporarySecurityGroups.length === 0
            )
        ) {
            let finalSecurityGroups = [
                ...port.security_group_ids,
                ...this.state.temporarySecurityGroups,
            ];
            this.setState(state => {
                return {
                    ...state,
                    temporarySecurityGroups: [],
                };
            });
            await this.props.dispatch({
                type: 'router/updatePort',
                payload: {
                    is_port_security_enabled: this.state
                        .is_port_security_enabled,
                    security_group_ids: finalSecurityGroups,
                    port: port.id,
                },
            });
            this.implementBothCancels();
        }
    }

    attachSecurityGroup() {
        this.setState(state => {
            return {
                ...state,
                attachSecurityGroupState: true,
            };
        });
    }

    cancelSecurityGroup() {
        this.setState(state => {
            return {
                ...state,
                attachSecurityGroupState: false,
                temporarySecurityGroups: [],
            };
        });
    }

    implementBothCancels() {
        this.cancelSecurityGroup();
        this.props.onCancelUpdatePort();
    }

    selectSecurityGroup(value) {
        if (this.props.port.security_group_ids.length > 0) {
        }
        this.setState(state => {
            return {
                ...state,
                temporarySecurityGroups: value,
            };
        });
    }

    async detachPort(value, type) {
        const { port, dispatch } = this.props;
        this.setState(state => {
            return {
                ...state,
                methodType: type,
                detachID: value,
            };
        });
        let detachedSecurityGroup = port.security_group_ids.filter(
            item => item !== value
        );

        await dispatch({
            type: 'router/updatePort',
            payload: {
                is_port_security_enabled: this.state.is_port_security_enabled,
                security_group_ids: detachedSecurityGroup,
                port: port.id,
            },
        });
        this.setState(state => {
            return {
                ...state,
                detachID: '',
                methodType: '',
            };
        });
    }

    render() {
        const { port, securitygroup, updatingPort } = this.props;
        let filteredSecurityGroups = securitygroup.list.filter(item =>
            port.security_group_ids.includes(item.id)
        );
        let checkSwitchState =
            port.security_group_ids.length > 0 ? true : false;

        return (
            <>
                <Descriptions column={2} colon={true}>
                    <Descriptions.Item label="ID">{port.id}</Descriptions.Item>
                    <Descriptions.Item label="IP">
                        {port?.fixed_ips.length > 0
                            ? port.fixed_ips[0]['ip_address']
                            : '-'}
                    </Descriptions.Item>
                    <Descriptions.Item label="MAC-Address">
                        {port.mac_address}
                    </Descriptions.Item>
                    <Descriptions.Item label="Attached To">
                        {port.device_owner}
                    </Descriptions.Item>
                    <Descriptions.Item label="Created At">
                        {moment(port?.created_at).fromNow()}
                    </Descriptions.Item>
                    <Descriptions.Item label="Updated At">
                        {moment(port?.updated_at).fromNow()}
                    </Descriptions.Item>
                    <Descriptions.Item label="Port Security">
                        <>
                            <Switch
                                checkedChildren="On"
                                unCheckedChildren="Off"
                                defaultChecked={
                                    this.state.is_port_security_enabled
                                }
                                onChange={this.switchChange.bind(this)}
                            />{' '}
                            <Tooltip title="Port Security can only be disable when no security group attach to this port">
                                <Icon type="question-circle" />
                            </Tooltip>
                        </>
                    </Descriptions.Item>
                </Descriptions>
                {this.state.is_port_security_enabled ? (
                    <div>
                        <Typography.Title
                            style={{
                                color: `rgba(89, 89, 89, 0.85)`,
                                fontWeight: ` 600`,
                                fontSize: `20px`,
                                lineHeight: `1.4`,
                                fontSize: `1.2em`,
                                marginTop: `23px`,
                                marginBottom: `15px`,
                            }}
                            level={4}
                        >
                            Security Groups
                        </Typography.Title>

                        <div style={{ display: `flex` }}>
                            {filteredSecurityGroups.map(sg => (
                                <div
                                    style={{
                                        width: `300px`,
                                        background: `#fff`,
                                        marginRight: `10px`,
                                    }}
                                >
                                    <Card
                                        style={{
                                            boxSizing: `border-box`,
                                            padding: `0px`,
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: `flex`,
                                                alignItems: `center`,
                                            }}
                                        >
                                            <div style={{ flexGrow: `2` }}>
                                                <Typography.Title
                                                    style={{
                                                        fontSize: `1.1em`,
                                                        margin: 0,
                                                    }}
                                                >
                                                    {sg.name}
                                                </Typography.Title>
                                            </div>

                                            <div
                                                style={{
                                                    selfAlign: `flex-end`,
                                                }}
                                            >
                                                <Button
                                                    disabled={
                                                        this.props
                                                            .updatingPort &&
                                                        this.state
                                                            .methodType !==
                                                            'detach'
                                                    }
                                                    loading={
                                                        this.props
                                                            .updatingPort &&
                                                        this.state.detachID ===
                                                            sg.id
                                                    }
                                                    disabled={
                                                        port.id !==
                                                        this.props
                                                            .updatePortState
                                                    }
                                                    type="danger"
                                                    onClick={this.detachPort.bind(
                                                        this,
                                                        sg.id,
                                                        'detach'
                                                    )}
                                                >
                                                    Detach
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            ))}

                            {port.id === this.props.updatePortState ? (
                                <>
                                    {this.state.attachSecurityGroupState ? (
                                        <>
                                            <div
                                                style={{
                                                    width: `300px`,
                                                    marginRight: `10px`,
                                                }}
                                            >
                                                <Card
                                                    bodyStyle={{
                                                        background: `#fff`,
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            display: `flex`,
                                                            alignItems: `center`,
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                flexGrow: `2`,
                                                            }}
                                                        >
                                                            <Select
                                                                placeholder="Select Security Groups"
                                                                defaultValue={
                                                                    this.state
                                                                        .temporarySecurityGroups
                                                                }
                                                                mode="multiple"
                                                                style={{
                                                                    width: 150,
                                                                }}
                                                                onChange={this.selectSecurityGroup.bind(
                                                                    this
                                                                )}
                                                            >
                                                                {securitygroup.list.map(
                                                                    item => (
                                                                        <Option
                                                                            disabled={port.security_group_ids.includes(
                                                                                item.id
                                                                            )}
                                                                            value={
                                                                                item.id
                                                                            }
                                                                        >
                                                                            {
                                                                                item.name
                                                                            }
                                                                        </Option>
                                                                    )
                                                                )}
                                                            </Select>
                                                        </div>

                                                        <div
                                                            style={{
                                                                selfAlign: `flex-end`,
                                                            }}
                                                        >
                                                            <Button
                                                                disabled={
                                                                    updatingPort &&
                                                                    this.state
                                                                        .methodType !==
                                                                        'detach'
                                                                }
                                                                onClick={this.cancelSecurityGroup.bind(
                                                                    this
                                                                )}
                                                            >
                                                                Cancel
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </Card>
                                            </div>
                                        </>
                                    ) : (
                                        <div
                                            style={{
                                                width: `300px`,
                                                marginRight: `10px`,
                                            }}
                                        >
                                            <Button
                                                style={{
                                                    padding: '20px',
                                                    width: '100%',
                                                    height: '100%',
                                                    backgroundColor: '#F7F7F7',
                                                    border:
                                                        '2px dashed #d9d9d9',
                                                }}
                                                type="link"
                                                onClick={this.attachSecurityGroup.bind(
                                                    this
                                                )}
                                            >
                                                <Icon
                                                    style={{
                                                        fontSize: '2.4em',
                                                        color: '#d9d9d9',
                                                    }}
                                                    type="plus"
                                                />
                                            </Button>
                                        </div>
                                    )}
                                </>
                            ) : null}
                        </div>
                    </div>
                ) : null}
                {port.id === this.props.updatePortState ? (
                    <div style={{ paddingTop: `12px` }}>
                        <Button
                            disabled={this.state.methodType === 'detach'}
                            loading={
                                this.props.updatingPort &&
                                this.state.methodType !== 'detach'
                            }
                            style={{ marginRight: `12px` }}
                            type="primary"
                            onClick={this.onSave.bind(this)}
                        >
                            Save
                        </Button>
                        <Button
                            disabled={this.props.updatingPort}
                            onClick={this.implementBothCancels.bind(this)}
                        >
                            Cancel
                        </Button>
                    </div>
                ) : null}
            </>
        );
    }
}

export default connect(state => {
    return {
        router: state.router,
        securitygroup: state.securitygroup,
        updatingPort: state.loading.effects['router/updatePort'],
    };
})(PortDetailPanel);
