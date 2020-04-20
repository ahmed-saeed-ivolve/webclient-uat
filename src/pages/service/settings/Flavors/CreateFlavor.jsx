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

class CreateFlavor extends React.Component {
    handleSubmit = e => {
        e.preventDefault();

        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { keys, names } = values;

                this.props.dispatch({
                    type: 'flavor/create',
                    payload: {
                        flavor: values,
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
                                Operating System
                            </Typography.Title>
                            <Typography.Paragraph
                                style={{
                                    color: `#747373`,
                                    fontSize: `1.1em`,
                                    marginBottom: `0.3em`,
                                }}
                            ></Typography.Paragraph>
                            <Form.Item>
                                {getFieldDecorator('os_name', {
                                    rules: [
                                        {
                                            required: true,
                                            message:
                                                'Please enter valid operating system',
                                        },
                                    ],
                                })(
                                    <Input
                                        style={{ width: '600px' }}
                                        placeholder="Please enter operating system"
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
                                Flavor Name
                            </Typography.Title>
                            <Typography.Paragraph
                                style={{
                                    color: `#747373`,
                                    fontSize: `1.1em`,
                                    marginBottom: `0.3em`,
                                }}
                            ></Typography.Paragraph>
                            <Form.Item>
                                {getFieldDecorator('name', {
                                    rules: [
                                        {
                                            required: true,
                                            message:
                                                'Please enter valid flavor name',
                                        },
                                    ],
                                })(
                                    <Input
                                        style={{ width: '600px' }}
                                        placeholder="Please enter flavor name"
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
                                Flavor mode
                            </Typography.Title>
                            <Typography.Paragraph
                                style={{
                                    color: `#747373`,
                                    fontSize: `1.1em`,
                                    marginBottom: `0.3em`,
                                }}
                            ></Typography.Paragraph>
                            <Form.Item>
                                {getFieldDecorator('mod', {
                                    rules: [
                                        {
                                            required: true,
                                            message:
                                                'Please enter valid flavor mode',
                                        },
                                    ],
                                })(
                                    <Input
                                        style={{ width: '600px' }}
                                        placeholder="Please enter flavor mode"
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
                                Flavor type
                            </Typography.Title>
                            <Typography.Paragraph
                                style={{
                                    color: `#747373`,
                                    fontSize: `1.1em`,
                                    marginBottom: `0.3em`,
                                }}
                            ></Typography.Paragraph>
                            <Form.Item>
                                {getFieldDecorator('com', {
                                    rules: [
                                        {
                                            required: true,
                                            message:
                                                'Please enter valid flavor type',
                                        },
                                    ],
                                })(
                                    <Input
                                        style={{ width: '600px' }}
                                        placeholder="Please enter flavor type"
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
                                Flavor price
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
                                                'Please enter valid flavor price',
                                        },
                                    ],
                                })(
                                    <Input
                                        style={{ width: '600px' }}
                                        placeholder="Please enter flavors price"
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
                                RAM
                            </Typography.Title>
                            <Typography.Paragraph
                                style={{
                                    color: `#747373`,
                                    fontSize: `1.1em`,
                                    marginBottom: `0.3em`,
                                }}
                            ></Typography.Paragraph>
                            <Form.Item>
                                {getFieldDecorator('ram', {
                                    rules: [
                                        {
                                            required: true,
                                            pattern: /^-?[0-9]*([0-9]*)?$/,
                                            message:
                                                'Please enter valid flavor RAM',
                                        },
                                    ],
                                })(
                                    <Input
                                        style={{ width: '600px' }}
                                        placeholder="Please enter flavor RAM"
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
                                Disk
                            </Typography.Title>
                            <Typography.Paragraph
                                style={{
                                    color: `#747373`,
                                    fontSize: `1.1em`,
                                    marginBottom: `0.3em`,
                                }}
                            ></Typography.Paragraph>
                            <Form.Item>
                                {getFieldDecorator('disk', {
                                    rules: [
                                        {
                                            required: true,
                                            pattern: /^-?[0-9]*([0-9]*)?$/,
                                            message:
                                                'Please enter valid flavor disk size',
                                        },
                                    ],
                                })(
                                    <Input
                                        style={{ width: '600px' }}
                                        placeholder="Please enter flavor disk"
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
                                Vcpus
                            </Typography.Title>
                            <Typography.Paragraph
                                style={{
                                    color: `#747373`,
                                    fontSize: `1.1em`,
                                    marginBottom: `0.3em`,
                                }}
                            ></Typography.Paragraph>
                            <Form.Item>
                                {getFieldDecorator('vcpus', {
                                    rules: [
                                        {
                                            required: true,
                                            pattern: /^-?[0-9]*([0-9]*)?$/,
                                            message:
                                                'Please enter valid flavor vcpus',
                                        },
                                    ],
                                })(
                                    <Input
                                        style={{ width: '600px' }}
                                        placeholder="Please enter flavor vcpus"
                                    />
                                )}
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item>
                        <Button
                            loading={this.props.creatingFlavor}
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
        creatingFlavor: state.loading.effects['flavor/create'],
    };
})(Form.create()(CreateFlavor));
