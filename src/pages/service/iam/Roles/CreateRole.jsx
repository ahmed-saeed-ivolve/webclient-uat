import {
    Drawer,
    Form,
    Button,
    Col,
    Row,
    Input,
    Select,
    Icon,
    Typography,
} from 'antd';
import ReactDOM from 'react-dom';
import React from 'react';
import { Label } from 'bizcharts';
import { connect } from 'dva';

const { Option } = Select;

class CreateRole extends React.Component {
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { keys, names } = values;

                this.props.dispatch({
                    type: 'roles/create',
                    payload: values,
                });
            }
        });
    };

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;

        getFieldDecorator('keys', { initialValue: [] });
        const keys = getFieldValue('keys');

        return (
            <div
                style={{
                    marginBottom: `0`,
                    backgroundColor: `#fff`,
                    padding: `34px`,
                }}
            >
                <Form hideRequiredMark onSubmit={this.handleSubmit}>
                    <Row style={{ paddingTop: '10px' }} gutter={16}>
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
                            ></Typography.Paragraph>
                            <Form.Item>
                                {getFieldDecorator('name', {
                                    rules: [
                                        {
                                            message:
                                                'Please enter correct role name',
                                            pattern: /^[a-zA-Z]+([-_.]?[a-zA-Z0-9]+)*$/,
                                        },
                                        {
                                            required: true,
                                            message: 'Please enter role name',
                                        },
                                    ],
                                })(
                                    <Input
                                        style={{ width: '600px' }}
                                        placeholder="Please enter role name"
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
                                {getFieldDecorator('description', {
                                    rules: [{}],
                                })(
                                    <Input.TextArea
                                        style={{ width: '600px' }}
                                        rows={4}
                                    />
                                )}
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item>
                        <Button
                            loading={this.props.creatingRole}
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
        roles: state.roles,
        creatingRole: state.loading.effects['roles/create'],
    };
})(Form.create()(CreateRole));
