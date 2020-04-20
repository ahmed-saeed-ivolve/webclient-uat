import React, { Component } from 'react';
import { Button, Modal, Typography } from 'antd';
import { Form, Icon, Input } from 'antd';
import { connect } from 'dva';
import { Collapse } from 'antd';
const { Panel } = Collapse;
const { Paragraph } = Typography;

class ChangePassword extends Component {
    constructor() {
        super();
        this.state = {
            old_password: '',
            new_password: '',
        };
    }
    compareToOldPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && value === form.getFieldValue('old_password')) {
            callback(`New Password must be change from current Password`);
        } else {
            callback();
        }
    };
    onChangePassword_old(e) {
        this.setState({
            old_password: e.target.value,
        });
    }
    onChangePassword_new(e) {
        this.setState({
            new_password: e.target.value,
        });
    }
    compareToFirstPassword = () => {
        if (this.state.new_password === this.state.old_password) {
        }
    };
    handleSubmit = e => {
        const userDetails = JSON.parse(localStorage.getItem('user'));
        const { loading } = this.props;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { keys, names } = values;
                this.props.dispatch({
                    type: 'users/confirmChangePassword',
                    payload: {
                        user_id: userDetails.user.id,
                        old_password: values.old_password,
                        new_password: values.new_password,
                    },
                });
            }
        });
    };

    changePasswordModal() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <Form style={{ width: '50%' }} onSubmit={this.handleSubmit}>
                    <Form.Item style={{ marginBottom: '15px' }}>
                        {getFieldDecorator('old_password', {
                            rules: [
                                {
                                    required: true,
                                    message: 'Please enter current Password',
                                },
                            ],
                        })(
                            <Input.Password
                                style={{ width: '50%' }}
                                minLength={3}
                                prefix={
                                    <Icon
                                        type="password"
                                        style={{ color: 'rgba(0,0,0,.25)' }}
                                    />
                                }
                                type="password"
                                placeholder="Current Password"
                                value={this.state.old_password}
                            />
                        )}
                    </Form.Item>
                    <Form.Item style={{ marginBottom: '15px' }}>
                        {getFieldDecorator('new_password', {
                            rules: [
                                {
                                    message:
                                        'Password must be at least 8 character in length, must have at least one uppercase letter (A-Z), one lowercase letter (a-z), and one special character (@, /, # ,* etc...)',
                                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
                                },
                                {
                                    validator: this.compareToOldPassword,
                                },
                                {
                                    required: true,
                                    message: 'Please enter new Password',
                                },
                            ],
                        })(
                            <Input.Password
                                style={{ width: '50%' }}
                                prefix={
                                    <Icon
                                        type="password"
                                        style={{ color: 'rgba(0,0,0,.25)' }}
                                    />
                                }
                                type="password"
                                placeholder="New Password"
                                value={this.state.new_password}
                            />
                        )}
                    </Form.Item>
                    <Form.Item style={{ marginBottom: '15px' }}>
                        <Button
                            type="primary"
                            loading={this.props.ChangePasswordButton}
                            htmlType="submit"
                        >
                            Change Password
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <Collapse>
                    <Panel header="Change Password" key="2">
                        {this.changePasswordModal()}
                    </Panel>
                </Collapse>
            </div>
        );
    }
}

export default connect(state => {
    return {
        ChangePasswordButton:
            state.loading.effects['users/confirmChangePassword'],
    };
})(Form.create()(ChangePassword));
