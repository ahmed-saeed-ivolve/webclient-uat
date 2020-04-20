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
            trialAccount: false,
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

    componentDidMount() {
        if (
            this.props.mountedData.description === 'trial' ||
            this.props.mountedData.description === 'suspended'
        ) {
            this.setState({ trialAccount: true });
        }
    }

    onChangeTrial = e => {
        this.setState({ trialAccount: e.target.checked });
    };

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { keys, names } = values;
                values['id'] = this.props.mountedData.id;
                values['name'] =
                    values['name'] && values['name'] !== ''
                        ? values['name']
                        : this.props.mountedData.name;
                values['email'] =
                    values['email'] && values['email'] !== ''
                        ? values['email']
                        : this.props.mountedData.email;

                values['trialAccount'] = this.state.trialAccount;
                values['options'] = this.props.mountedData.options;

                this.props.dispatch({
                    type: 'users/updateUser',
                    payload: values,
                });
            }
        });
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
        console.log('this.props = ', this.props);
        const { getFieldDecorator } = this.props.form;
        return (
            <div
                style={{
                    marginBottom: `0`,
                    backgroundColor: `#fff`,
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
                                    ],
                                })(
                                    <Input
                                        placeholder={
                                            this.props.mountedData.name
                                        }
                                        defaultValue={
                                            this.props.mountedData.name
                                        }
                                    />
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
                                            type: 'email',
                                            message:
                                                'The input is not valid E-mail!',
                                        },
                                    ],
                                    onChange: e => this.email(e),
                                })(
                                    <Input
                                        placeholder={
                                            this.props.mountedData.email
                                        }
                                        defaultValue={
                                            this.props.mountedData.email
                                        }
                                    />
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Checkbox
                                disabled={
                                    this.props.mountedData.description !==
                                        'trial' &&
                                    this.props.mountedData.description !==
                                        'suspended'
                                }
                                checked={this.state.trialAccount}
                                onChange={this.onChangeTrial}
                            >
                                Trial Account{' '}
                                {this.props.mountedData.description !==
                                    'trial' &&
                                this.props.mountedData.description !==
                                    'suspended' ? (
                                    <Typography style={{ color: '#06597F' }}>
                                        Permanent User Cannot be convert into
                                        Trial User
                                    </Typography>
                                ) : null}
                            </Checkbox>
                        </Col>
                    </Row>
                    <Button
                        style={{ marginTop: '30px' }}
                        loading={this.props.updatingUser}
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
        fetchingUsers: state.loading.effects['users/update'],
        updatingUser: state.loading.effects['users/updateUser'],
    };
})(Form.create()(UserDetails));
