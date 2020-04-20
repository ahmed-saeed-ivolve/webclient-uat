import {
    Drawer,
    Form,
    Button,
    Col,
    Row,
    Input,
    Select,
    DatePicker,
    Icon,
    Slider,
    InputNumber,
    Upload,
    Radio,
    message,
    Typography,
} from 'antd';
import router from 'umi/router';
import ReactDOM from 'react-dom';
import { connect } from 'dva';
import { getPageQuery } from '@/utils/utils';

const { Option } = Select;

const marks = {
    1: '1',
    16: '16',
    32: '32',
    48: '48',
    64: '64',
};

class AddInterface extends React.Component {
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
                values['router'] = getPageQuery().router_id;

                this.props.dispatch({
                    type: 'router/addInterface',
                    payload: values,
                });
            }
        });
    };

    componentDidUpdate(prevProps) {}

    onClose = () => {
        this.props.whenCloseCalled(false);
    };

    onChange1 = value => {
        this.setState({
            inputValue: value,
        });
    };

    onChange2 = value => {
        this.setState({
            inputValueRAM: value,
        });
    };

    handlePort(value) {
        this.setState({ choice: value });
    }

    handleSource(value) {
        this.setState({ choice2: value });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const IPExpression = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

        const filteredPorts = this.props.router.portList.filter(
            item => item.device_id === getPageQuery().router_id
        );
        const portsSubnets = filteredPorts.map(
            items => items.fixed_ips[0].subnet_id
        );
        const remainingSubnets = this.props.vpclist.subnetList.filter(
            items => !portsSubnets.includes(items.id)
        );

        return (
            <div
                style={{
                    marginBottom: `0`,
                    backgroundColor: `#fff`,
                    padding: `34px`,
                }}
            >
                <Form
                    onSubmit={this.handleSubmit}
                    layout="vertical"
                    hideRequiredMark
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Typography.Title
                                level={4}
                                style={{
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
                                {getFieldDecorator('subnet_id', {
                                    rules: [
                                        {
                                            required: true,
                                            message: 'Please select subnet',
                                        },
                                    ],
                                })(
                                    <Select
                                        size="large"
                                        placeholder="Select Subnet"
                                    >
                                        {remainingSubnets.map(items => (
                                            <Option value={items.id}>
                                                {items.name} -> {items.cidr}
                                            </Option>
                                        ))}
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Typography.Title
                                level={4}
                                style={{
                                    fontSize: ` 1.2em`,

                                    fontFamily: 'Open Sans',
                                    fontWeight: 600,
                                    color: `#2b7797`,
                                }}
                            >
                                Fixed IP
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
                                        {
                                            required: true,
                                            message: 'Please enter IP address',
                                        },
                                    ],
                                })(
                                    <Input
                                        size="default"
                                        style={{ width: '500px' }}
                                    />
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item>
                        <Button
                            loading={this.props.creatingInterface}
                            style={{ width: '100%', height: '45px' }}
                            type="primary"
                            htmlType="submit"
                        >
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}

export default connect(state => {
    return {
        vpclist: state.vpc,
        router: state.router,
        creatingInterface: state.loading.effects['router/addInterface'],
    };
})(Form.create()(AddInterface));
