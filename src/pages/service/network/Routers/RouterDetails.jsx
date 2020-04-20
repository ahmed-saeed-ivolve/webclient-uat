import React from 'react';
import {
    Tabs,
    Button,
    Icon,
    Row,
    Col,
    Typography,
    Select,
    Input,
    Table,
    Form,
    Popconfirm,
} from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import CreateRouter from './CreateRouter';
import AddInterface from './AddInterface';

Icon.setTwoToneColor('#4c98bf');

const { TabPane } = Tabs;
const operations = <div></div>;
const operations2 = (
    <Button>
        <Icon type="stop" />
    </Button>
);

@Form.create()
class RouterDetails extends React.Component {
    state = {
        addRule: 1,

        columns: [
            {
                title: 'Fixed IPs',
                dataIndex: 'fixedips',
                key: 'fixedips',
                width: 150,
                render: text => <a href="javascript:;">{text}</a>,
            },
            {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
                width: 150,
            },

            {
                title: 'Admin State',
                dataIndex: 'admin_state',
                key: 'admin_state',
                width: 150,
                render: text =>
                    text === true ? (
                        <Typography> Up </Typography>
                    ) : (
                        <Typography> Down </Typography>
                    ),
            },

            {
                title: 'Actions',
                dataIndex: 'actions',
                key: 'actions',
                width: 150,
            },
        ],
    };

    handleAddInterface = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { keys, names } = values;
                values['router'] = this.props.routerid;
                let subnet_network = values.subnet_network.split('|');
                values['network_id'] = subnet_network[1];
                values['subnet_id'] = subnet_network[0];
                delete values.subnet_network;
                if (values.fixed_ip === '' || !values.fixed_ip) {
                    delete values.fixed_ip;
                }
                this.props.dispatch({
                    type: 'router/addInterface',
                    payload: values,
                });
            }
        });
    };

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                var payload = {};
                const { keys, names } = values;

                if (typeof values.floatingip === 'undefined') {
                    const floatingIP = this.props.floatingIPList.list.filter(
                        item => item.uuid === this.props.floatingIpId
                    );
                    payload = {
                        address: floatingIP[0].floating_ip_address,
                        uuid: this.props.ecsuuid,
                        action: 'detach',
                    };
                } else {
                    payload = {
                        floating_ip_id: values.floatingip[1],
                        address: values.floatingip[0],
                        uuid: values.floatingip[3],
                        action: values.floatingip[4],
                    };
                }

                this.props.dispatch({
                    type: 'floatingip/attachdetach',
                    payload: payload,
                });
            }
        });
    };

    deleteInterface(e, value) {
        const payload = {
            router: this.props.routerid,
            port_id: value,
        };

        this.props.dispatch({
            type: 'router/deleteInterface',
            payload: payload,
        });
    }

    createNewItem(addRule) {
        this.setState(state => ({
            ...state,
            addRule,
        }));
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const IPExpression = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

        const filteredPorts = this.props.ports.filter(
            item => item.device_id === this.props.routerid
        );
        const portsSubnets = filteredPorts.map(
            items => items.fixed_ips[0].subnet_id
        );
        const remainingSubnets = this.props.vpclist?.subnetList.filter(
            items => !portsSubnets.includes(items.id)
        );

        const data = filteredPorts.map(listItem => {
            return {
                key: listItem['id'],
                id: listItem['id'],
                fixedips:
                    listItem['fixed_ips'].length === 0
                        ? '-'
                        : listItem['fixed_ips'][0]['ip_address'],
                status: listItem['status'],
                admin_state: listItem['is_admin_state_up'],
                actions: (
                    <>
                        <Popconfirm
                            title="Are you sure delete this task?"
                            onConfirm={() =>
                                this.deleteInterface(this, listItem['id'])
                            }
                            onCancel={e => e.stopPropagation()}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button
                                type="danger"
                                onClick={e => e.stopPropagation()}
                                size="small"
                                loading={this.props.loadingdeletingInterface}
                                style={{
                                    marginRight: `20px`,
                                    height: `36px`,
                                    width: `86px`,
                                    fontFamily: `Open Sans`,
                                    fontWeight: `600`,
                                }}
                            >
                                Delete
                            </Button>
                        </Popconfirm>
                    </>
                ),
            };
        });

        return (
            <Tabs type="card" tabBarExtraContent={operations}>
                <TabPane tab="Interfaces" key="2">
                    <div style={{ marginBottom: `20px`, textAlign: `right` }}>
                        {this.state.addRule === 1 ? (
                            <div>
                                <Button
                                    style={{ float: 'right' }}
                                    icon="redo"
                                    onClick={() => {
                                        this.props.dispatch({
                                            type: 'router/fetchPort',
                                            payload: {
                                                method: 'Network.ports',
                                                force: true,
                                            },
                                        });
                                    }}
                                >
                                    Refresh
                                </Button>
                                <Button
                                    type="primary"
                                    style={{
                                        marginRight: `20px`,
                                        fontFamily: `Open Sans`,
                                        fontWeight: `600`,
                                    }}
                                    onClick={() => this.createNewItem(2)}
                                >
                                    Add Interface
                                </Button>
                            </div>
                        ) : (
                            <Form
                                onSubmit={this.handleAddInterface}
                                layout="vertical"
                                hideRequiredMark
                            >
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Typography.Title
                                            level={4}
                                            style={{
                                                float: 'left',
                                                fontSize: ` 1.2em`,

                                                fontFamily: 'Open Sans',
                                                fontWeight: 600,
                                                color: `#2b7797`,
                                            }}
                                        >
                                            Subnet
                                        </Typography.Title>
                                        <Typography.Paragraph
                                            style={{
                                                color: `#747373`,
                                                fontSize: `1.1em`,
                                                marginBottom: `0.3em`,
                                            }}
                                        ></Typography.Paragraph>

                                        <Form.Item>
                                            {getFieldDecorator(
                                                'subnet_network',
                                                {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message:
                                                                'Please select subnet',
                                                        },
                                                    ],
                                                }
                                            )(
                                                <Select
                                                    size="medium"
                                                    placeholder="Select Subnet"
                                                >
                                                    {remainingSubnets?.map(
                                                        items => (
                                                            <Option
                                                                disabled={
                                                                    items.gateway_ip ===
                                                                    null
                                                                }
                                                                value={`${items.id}|${items.network_id}`}
                                                            >
                                                                {items.name} ->{' '}
                                                                {items.cidr}
                                                            </Option>
                                                        )
                                                    )}
                                                </Select>
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Typography.Title
                                            level={4}
                                            style={{
                                                float: 'left',
                                                fontSize: ` 1.2em`,

                                                fontFamily: 'Open Sans',
                                                fontWeight: 600,
                                                color: `#2b7797`,
                                            }}
                                        >
                                            IP Address (Optional)
                                        </Typography.Title>
                                        <Typography.Paragraph
                                            style={{
                                                color: `#747373`,
                                                fontSize: `1.1em`,
                                                marginBottom: `0.3em`,
                                            }}
                                        ></Typography.Paragraph>

                                        <Form.Item>
                                            {getFieldDecorator('fixed_ip', {
                                                rules: [
                                                    {
                                                        message:
                                                            'Please enter correct IP address',
                                                        pattern: IPExpression,
                                                    },
                                                ],
                                            })(<Input size="medium" />)}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Form.Item>
                                    <Button
                                        loading={
                                            this.props.loadingdcreatingInterface
                                        }
                                        style={{
                                            float: 'left',
                                            height: '30px',
                                        }}
                                        type="primary"
                                        htmlType="submit"
                                    >
                                        Submit
                                    </Button>
                                    <Button
                                        style={{
                                            float: 'left',
                                            height: '30px',
                                            marginLeft: `20px`,
                                        }}
                                        onClick={() =>
                                            this.setState({ addRule: 1 })
                                        }
                                    >
                                        Cancel
                                    </Button>
                                </Form.Item>
                            </Form>
                        )}
                    </div>
                    <Table
                        size="small"
                        loading={this.props.loadingPorts}
                        {...this.state}
                        columns={this.state.columns}
                        dataSource={data}
                        pagination={false}
                    />
                </TabPane>
            </Tabs>
        );
    }
}

export default connect(state => {
    return {
        vpclist: state.vpc,
    };
})(RouterDetails);
