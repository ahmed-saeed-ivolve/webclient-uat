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
    InputNumber,
    Typography,
} from 'antd';
import ReactDOM from 'react-dom';
import { connect } from 'dva';

const { Option } = Select;

class CreateRouter extends React.Component {
    onClose = () => {
        this.props.whenCloseCalled(false);
    };

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { keys, names } = values;

                if (!values.network_id) {
                    values.network_id = '';
                }

                values['is_admin_state_up'] = true;

                values['external_gateway_info'] = {
                    network_id: values['network_id'],
                    enable_snat: values['enable_snat'] === 'up' ? true : false,
                };

                delete values['network_id'];
                delete values['enable_snat'];

                this.props.dispatch({
                    type: 'router/create',
                    payload: values,
                });
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;

        const externalNetwork = this.props.vpcList.list.filter(
            items => items.is_router_external === true
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
                        <Col span={24}>
                            <Typography.Title
                                level={4}
                                style={{
                                    fontSize: ` 1.2em`,

                                    fontFamily: 'Open Sans',
                                    fontWeight: 600,
                                    color: `#2b7797`,
                                }}
                            >
                                Name
                            </Typography.Title>
                            <Typography.Paragraph
                                style={{
                                    color: `#747373`,
                                    fontSize: `1.1em`,
                                    marginBottom: `0.3em`,
                                }}
                            />

                            <Form.Item>
                                {getFieldDecorator('name', {
                                    rules: [
                                        {
                                            message:
                                                'Please enter correct router name',
                                            pattern: /^[a-zA-Z]+([._-]?[a-zA-Z0-9]+)*$/,
                                        },
                                        {
                                            required: true,
                                            message: 'Please enter router name',
                                        },
                                    ],
                                })(
                                    <Input
                                        style={{ width: '600px' }}
                                        placeholder="Please enter router name"
                                    />
                                )}
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={24}>
                            <Typography.Title
                                level={4}
                                style={{
                                    fontSize: ` 1.2em`,

                                    fontFamily: 'Open Sans',
                                    fontWeight: 600,
                                    color: `#2b7797`,
                                }}
                            >
                                SNAT
                            </Typography.Title>
                            <Typography.Paragraph
                                style={{
                                    color: `#747373`,
                                    fontSize: `1.1em`,
                                    marginBottom: `0.3em`,
                                }}
                            />

                            <Form.Item>
                                {getFieldDecorator('enable_snat', {
                                    initialValue: 'up',
                                })(
                                    <Select
                                        style={{ width: '600px' }}
                                        placeholder="Select admin state"
                                    >
                                        <Option value="up">Yes</Option>
                                        <Option value="down">No</Option>
                                    </Select>
                                )}
                            </Form.Item>

                            <Typography.Title
                                level={4}
                                style={{
                                    fontSize: ` 1.2em`,

                                    fontFamily: 'Open Sans',
                                    fontWeight: 600,
                                    color: `#2b7797`,
                                }}
                            >
                                External Network
                            </Typography.Title>
                            <Typography.Paragraph
                                style={{
                                    color: `#747373`,
                                    fontSize: `1.1em`,
                                    marginBottom: `0.3em`,
                                }}
                            />

                            <Form.Item>
                                {getFieldDecorator(
                                    'network_id',
                                    {}
                                )(
                                    <Select
                                        style={{ width: '600px' }}
                                        placeholder="Choose an External Network"
                                    >
                                        {externalNetwork.map(items => (
                                            <Option value={items.id}>
                                                {items.name}
                                            </Option>
                                        ))}
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item>
                        <Button
                            loading={this.props.creatingRouter}
                            style={{ width: '25%', height: '45px' }}
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
        vpcList: state.vpc,
        creatingRouter: state.loading.effects['router/create'],
    };
})(Form.create()(CreateRouter));
