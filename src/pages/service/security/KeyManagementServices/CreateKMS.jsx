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
    Typography,
} from 'antd';
import ReactDOM from 'react-dom';
import { connect } from 'dva';

let id = 0;

class CreateKMS extends React.Component {
    handleSubmit = e => {
        e.preventDefault();

        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { keys, names } = values;

                this.props.dispatch({
                    type: 'kms/create',
                    payload: values,
                });
            }
        });
    };
    componentDidUpdate() {}
    render() {
        const { getFieldDecorator } = this.props.form;

        return (
            <div
                style={{
                    marginBottom: `0`,
                    backgroundColor: `#fff`,
                    padding: `34px`,
                }}
            >
                <Row>
                    <Col>
                        <Form
                            onSubmit={this.handleSubmit}
                            layout="vertical"
                            hideRequiredMark
                        >
                            <Row>
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
                                ></Typography.Paragraph>
                                <Form.Item>
                                    {getFieldDecorator('name', {
                                        rules: [
                                            {
                                                message:
                                                    'Please enter correct key name',
                                                pattern: /^[a-zA-Z]+([-_.]?[a-zA-Z0-9]+)*$/,
                                            },
                                            {
                                                required: true,
                                                message: 'Please enter key name',
                                            },
                                        ],
                                    })(
                                        <Input
                                            style={{ width: '700px' }}
                                            placeholder="Please enter key name"
                                        />
                                    )}
                                </Form.Item>
                            </Row>
                            <Row>
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
                                    Description
                                </Typography.Title>
                                <Typography.Paragraph
                                    style={{
                                        color: `#747373`,
                                        fontSize: `1.1em`,
                                        marginBottom: `0.3em`,
                                    }}
                                ></Typography.Paragraph>
                                <Form.Item>
                                    {getFieldDecorator('public_key', {
                                        rules: [{ required: false }],
                                    })(
                                        <Input.TextArea
                                            style={{ width: '700px' }}
                                            rows={4}
                                        />
                                    )}
                                </Form.Item>
                            </Row>

                            <Form.Item>
                                <Button
                                    loading={this.props.creatingKMS}
                                    type="primary"
                                    htmlType="submit"
                                >
                                    Submit
                                </Button>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default connect(({ kms, loading }) => {
    return {
        creatingKMS: loading.effects['kms/create'],
    };
})(Form.create()(CreateKMS));
