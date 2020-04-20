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

class CreateKeypair extends React.Component {
    handleSubmit = e => {
        e.preventDefault();

        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { keys, names } = values;

                this.props.dispatch({
                    type: 'keypair/create',
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
                    padding:
                        this.props?.componentPath !== null ? `0px` : `34px`,
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
                                        width: 480,
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
                                                required: true,
                                                message:
                                                    'Please enter keypair name',
                                            },
                                        ],
                                    })(
                                        <Input
                                            style={{ width: '600px' }}
                                            placeholder="Please enter keypair name"
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
                                    }}
                                >
                                    Public Key
                                </Typography.Title>
                                <Typography.Paragraph
                                    style={{
                                        color: `#747373`,
                                        fontSize: `1.1em`,
                                        marginBottom: `0.3em`,
                                    }}
                                >
                                    If you're willing to use an existing public
                                    key, paste it here
                                </Typography.Paragraph>
                                <Form.Item>
                                    {getFieldDecorator('public_key', {
                                        rules: [{ required: false }],
                                    })(
                                        <Input.TextArea
                                            rows={4}
                                            style={{ width: '600px' }}
                                            placeholder="Please enter keypair public key"
                                        />
                                    )}
                                </Form.Item>
                            </Row>

                            <Form.Item>
                                <Button
                                    loading={this.props.creatingKeyPair}
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

export default connect(({ keypair, loading, drawer }) => {
    return {
        componentPath: drawer.componentPath,
        keypairList: { ...keypair },
        creatingKeyPair: loading.effects['keypair/create'],
    };
})(Form.create()(CreateKeypair));
