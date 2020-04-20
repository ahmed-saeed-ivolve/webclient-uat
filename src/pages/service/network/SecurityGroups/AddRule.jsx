import {
    Form,
    Button,
    Col,
    Row,
    Input,
    Select,
    Typography,
    Tooltip,
} from 'antd';
import { connect } from 'dva';
import '@/components/Footer/index.css';
const { Option } = Select;

class AddRule extends React.Component {
    state = {
        inputValue: 1,
        inputValueRAM: 1,
        uploadResponse: {},
        choice: '',
        choice2: 'cidr',
    };

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { keys, names } = values;
                values['security_group_id'] = this.props.sgid;
                delete values['source'];
                delete values['openport'];

                if (
                    typeof values['port'] === 'undefined' ||
                    values['port'] === ''
                ) {
                    delete values['port'];

                    if (Object.keys(values.hasOwnProperty('port_range_max'))) {
                        delete values['port_range_max'];
                        delete values['port_range_min'];
                    }
                } else {
                    let splitValue = values['port'].split('-');
                    if (splitValue.length > 1) {
                        values['port_range_max'] = splitValue[1];
                        values['port_range_min'] = splitValue[0];
                    } else {
                        values['port_range_max'] = values['port'];
                        values['port_range_min'] = values['port'];
                    }
                }

                this.props.dispatch({
                    type: 'securitygroup/addRule',
                    payload: values,
                });

                this.props.dispatch({
                    type: 'securitygroup/update',
                    payload: {
                        force: true,
                    },
                });
            }
        });
    };

    componentDidUpdate(prevProps) {
        if (
            prevProps.updateSecurityGroupRule &&
            !this.props.updateSecurityGroupRule
        ) {
            this.props.form.resetFields();
            this.setState({ choice2: 'cidr' });
        }
    }

    onClose = () => {
        this.props.whenCloseCalled(false);
    };

    handlePort(value) {
        this.setState({ choice: value });
    }

    handleSource(value) {
        this.setState({ choice2: value });
    }

    render() {
        const openPortToolTip =
            '1. If left blank, open port is set by default  2. Enter in the given range(1-65536) (eg : 4678)  3. Enter ports separated by dash in given range(1-65535) (eg 1-4567) ';
        const { getFieldDecorator } = this.props.form;

        return (
            <div>
                <Form
                    onSubmit={this.handleSubmit}
                    layout="vertical"
                    hideRequiredMark
                >
                    <Row type={'flex'} gutter={10} align="bottom">
                        <Col lg={4}>
                            <Typography.Title
                                level={4}
                                style={{
                                    fontSize: ` 0.8em`,

                                    fontFamily: 'Open Sans',
                                    fontWeight: 400,
                                    color: `#2b7797`,
                                    float: 'left',
                                }}
                            >
                                Rule
                            </Typography.Title>

                            <Form.Item>
                                {getFieldDecorator('protocol', {
                                    initialValue: 'TCP',
                                })(
                                    <Select size="default">
                                        <Option value="tcp"> TCP</Option>
                                        <Option value="udp"> UDP</Option>
                                        <Option value="icmp"> ICMP</Option>
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>
                        <Col lg={4}>
                            <Typography.Title
                                level={4}
                                style={{
                                    fontSize: ` 0.8em`,
                                    float: 'left',
                                    fontFamily: 'Open Sans',
                                    fontWeight: 400,
                                    color: `#2b7797`,
                                }}
                            >
                                Direction
                            </Typography.Title>

                            <Form.Item>
                                {getFieldDecorator('direction', {
                                    initialValue: 'Ingress',
                                })(
                                    <Select size="default">
                                        <Option value="ingress">Ingress</Option>
                                        <Option value="egress">Egress</Option>
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>

                        <Col lg={4}>
                            <Typography.Title
                                style={{
                                    display: 'inline-block',
                                    fontSize: ` 0.8em`,
                                    fontFamily: 'Open Sans',
                                    fontWeight: 400,
                                    color: `#2b7797`,
                                    marginTop: '2px',
                                    float: 'left',
                                }}
                            >
                                Open Port
                            </Typography.Title>

                            <a
                                rel="tooltip"
                                title="Open Port Range (1 - 65535)
1. For all port - leave this blank
2. For single port write only one port (eg : 62)
3. For defining a range of ports write (eg : 62-89)"
                            >
                                <Form.Item>
                                    {getFieldDecorator('port', {
                                        rules: [
                                            {
                                                pattern: /^([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])(-([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5]))?$/,
                                                message: 'Invalid Port',
                                            },
                                        ],
                                    })(<Input />)}
                                </Form.Item>
                            </a>
                        </Col>

                        <Col lg={4}>
                            <Typography.Title
                                level={4}
                                style={{
                                    fontSize: ` 0.8em`,

                                    fontFamily: 'Open Sans',
                                    fontWeight: 400,
                                    color: `#2b7797`,
                                    float: 'left',
                                }}
                            >
                                Source
                            </Typography.Title>

                            <Form.Item>
                                {getFieldDecorator('source', {
                                    initialValue: 'cidr',
                                })(
                                    <Select
                                        size="default"
                                        onSelect={value =>
                                            this.handleSource(value)
                                        }
                                    >
                                        <Option value="cidr">CIDR</Option>
                                        <Option value="securitygroup">
                                            Security Group
                                        </Option>
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>
                        {this.state.choice2 === 'cidr' ? (
                            <Col lg={4} style={{ float: 'left' }}>
                                <Typography.Title
                                    level={4}
                                    style={{
                                        fontSize: ` 0.8em`,

                                        fontFamily: 'Open Sans',
                                        fontWeight: 400,
                                        color: `#2b7797`,
                                        float: 'left',
                                    }}
                                >
                                    CIDR
                                </Typography.Title>

                                <Form.Item>
                                    {getFieldDecorator('remote_ip_prefix', {
                                        rules: [
                                            {
                                                message: 'Invalid CIDR ',
                                                pattern: /^([0-9]{1,3}\.){3}[0-9]{1,3}(\/([0-9]|[1-2][0-9]|3[0-2]))?$/,
                                            },
                                        ],
                                    })(
                                        <Input
                                            size="default"
                                            placeholder="192.168.1.0/24"
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                        ) : null}

                        {this.state.choice2 === 'securitygroup' ? (
                            <Col lg={4}>
                                <Typography.Title
                                    level={4}
                                    style={{
                                        fontSize: ` 0.8em`,

                                        fontFamily: 'Open Sans',
                                        fontWeight: 400,
                                        color: `#2b7797`,
                                        float: 'left',
                                    }}
                                >
                                    Security Groups
                                </Typography.Title>

                                <Form.Item>
                                    {getFieldDecorator('remote_group_id', {
                                        rules: [
                                            {
                                                required: true,
                                                message: 'Choose Group',
                                            },
                                        ],
                                    })(
                                        <Select
                                            size="default"
                                            placeholder="Choose Security Group"
                                        >
                                            {this.props.securitygroupList.list.map(
                                                items => (
                                                    <Option value={items.id}>
                                                        {items.name}
                                                    </Option>
                                                )
                                            )}
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                        ) : null}
                        {this.state.choice2 === 'securitygroup' ? (
                            <Col lg={4}>
                                <Typography.Title
                                    level={4}
                                    style={{
                                        fontSize: ` 0.8em`,

                                        fontFamily: 'Open Sans',
                                        fontWeight: 400,
                                        color: `#2b7797`,
                                        float: 'left',
                                    }}
                                >
                                    Ether Type
                                </Typography.Title>

                                <Form.Item style={{ width: '100px' }}>
                                    {getFieldDecorator('ethertype')(
                                        <Select
                                            size="default"
                                            onSelect={value => 'ipv4'}
                                        >
                                            <Option value="ipv4">IPV4</Option>
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                        ) : null}
                    </Row>

                    <Row gutter={10}>
                        <Col lg={3}>
                            <Form.Item>
                                <Button
                                    loading={this.props.creatingRule}
                                    style={{ width: `100%` }}
                                    type="primary"
                                    htmlType="submit"
                                >
                                    Submit
                                </Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </div>
        );
    }
}

export default connect(state => {
    return {
        securitygroupList: state.securitygroup,
        creatingRule: state.loading.effects['securitygroup/addRule'],
        updateSecurityGroupRule: state.loading.effects['securitygroup/update'],
    };
})(Form.create()(AddRule));
