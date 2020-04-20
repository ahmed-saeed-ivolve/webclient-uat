import {
    Drawer,
    Form,
    Button,
    Col,
    Row,
    Input,
    InputNumber,
    Select,
    DatePicker,
    Icon,
    Radio,
    Typography,
    Progress,
} from 'antd';
import ReactDOM from 'react-dom';
import { connect } from 'dva';

const { Option } = Select;

class CreateEvsPricing extends React.Component {
    handleSubmit = e => {
        e.preventDefault();

        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { keys, names } = values;

                this.props.dispatch({
                    type: 'evs/createPricingVolume',
                    payload: {
                        volume: values,
                    },
                });
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
        };

        return (
            <div
                style={{
                    marginBottom: `0`,
                    backgroundColor: `#fff`,
                    padding: `34px`,
                }}
            >
                <Form
                    onSubmit={e => this.handleSubmit(e)}
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
                                    // marginBottom: `1em`
                                }}
                            >
                                Evs type
                            </Typography.Title>
                            <Typography.Paragraph
                                style={{
                                    color: `#747373`,
                                    fontSize: `1.1em`,
                                    marginBottom: `0.3em`,
                                }}
                            ></Typography.Paragraph>
                            <Form.Item>
                                {getFieldDecorator('evstype', {
                                    rules: [
                                        {
                                            required: true,
                                            message:
                                                'Please enter valid evs type',
                                        },
                                    ],
                                })(
                                    <Input
                                        style={{ width: '600px' }}
                                        placeholder="Please enter evs type"
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
                                    // marginBottom: `1em`
                                }}
                            >
                                Evs Description
                            </Typography.Title>
                            <Typography.Paragraph
                                style={{
                                    color: `#747373`,
                                    fontSize: `1.1em`,
                                    marginBottom: `0.3em`,
                                }}
                            ></Typography.Paragraph>
                            <Form.Item>
                                {getFieldDecorator('description', {
                                    rules: [
                                        {
                                            required: true,
                                            message:
                                                'Please enter evs description',
                                        },
                                    ],
                                })(
                                    <Input
                                        style={{ width: '600px' }}
                                        placeholder="Please enter evs description"
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
                                    // marginBottom: `1em`
                                }}
                            >
                                Evs price
                            </Typography.Title>
                            <Typography.Paragraph
                                style={{
                                    color: `#747373`,
                                    fontSize: `1.1em`,
                                    marginBottom: `0.3em`,
                                }}
                            ></Typography.Paragraph>
                            <Form.Item>
                                {getFieldDecorator('price', {
                                    rules: [
                                        {
                                            required: true,
                                            pattern: '[-+]?[0-9]*.?[0-9]+',
                                            message:
                                                'Please enter valid evs price',
                                        },
                                    ],
                                })(
                                    <Input
                                        style={{ width: '600px' }}
                                        placeholder="Please enter evs price"
                                    />
                                )}
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item>
                        <Button
                            loading={this.props.createPricingVolume}
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
        createPricingVolume: state.loading.effects['evs/createPricingVolume'],
    };
})(Form.create()(CreateEvsPricing));
