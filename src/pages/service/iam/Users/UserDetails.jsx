import React from 'react';
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
    Spin,
    Checkbox,
} from 'antd';
import validator from 'validator';

import ReactDOM from 'react-dom';
import { connect } from 'dva';

class UserDetails extends React.Component {
    constructor() {
        super();
        this.state = {
            confirmDirty: false,
        };
    }
    onClose = () => {
        this.props.whenCloseCalled(false);
    };

    email = e => {
        if (!validator.isEmail(e.target.value)) {
            return `${e.target.value} is not a valid email.`;
        }
    };

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log('values', values);
            if (!err) {
                const { keys, names } = values;

                this.props.dispatch({
                    type: 'users/create',
                    payload: values,
                });
            }
        });
    };

    handleConfirmBlur = e => {
        const { value } = e.target;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };

    ValidateEmail(mail) {
        if (
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
                myForm.emailAddr.value
            )
        ) {
            return true;
        }
        alert('You have entered an invalid email address!');
        return false;
    }

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
                <Form
                    onSubmit={this.handleSubmit}
                    layout="vertical"
                    hideRequiredMark
                >
                    <Row gutter={16}>
                        <Col span={9}>
                            <Typography.Title
                                level={4}
                                style={{
                                    fontSize: ` 1.2em`,

                                    fontFamily: 'Open Sans',
                                    fontWeight: 600,
                                    color: `#2b7797`,
                                }}
                            >
                                Username
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
                                                'Please enter correct user name',
                                            pattern: /^[a-zA-Z]+([ -_.]?[a-zA-Z0-9]+)*$/,
                                        },
                                        {
                                            required: true,
                                            message: 'Please enter user name',
                                        },
                                    ],
                                })(
                                    <Input placeholder="Please enter user name" />
                                )}
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={9}>
                            <Typography.Title
                                level={4}
                                style={{
                                    fontSize: ` 1.2em`,

                                    fontFamily: 'Open Sans',
                                    fontWeight: 600,
                                    color: `#2b7797`,
                                }}
                            >
                                Email
                            </Typography.Title>
                            <Typography.Paragraph
                                style={{
                                    color: `#747373`,
                                    fontSize: `1.1em`,
                                    marginBottom: `0.3em`,
                                }}
                            ></Typography.Paragraph>

                            <Form.Item>
                                {getFieldDecorator('email', {
                                    rules: [
                                        {
                                            required: true,
                                            message: 'Please enter email',
                                        },
                                        {
                                            type: 'email',
                                            message:
                                                'The input is not valid E-mail!',
                                        },
                                    ],
                                    onChange: e => this.email(e),
                                })(<Input placeholder="Please enter email" />)}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={9}>
                            <Checkbox
                                checked={this.state.checked}
                                disabled={this.state.disabled}
                                onChange={this.onChange}
                            >
                                Trial Account
                            </Checkbox>
                        </Col>
                    </Row>
                    <Button
                        style={{ marginTop: '30px' }}
                        loading={this.props.creatingUser}
                        type="primary"
                        htmlType="submit"
                    >
                        Update
                    </Button>
                </Form>
            </div>
        );
    }
}

export default connect(state => {
    return {
        usersList: state.users,
        projects: state.projects,
        fetchingUsers: state.loading.effects['users/update'],
    };
})(Form.create()(UserDetails));
