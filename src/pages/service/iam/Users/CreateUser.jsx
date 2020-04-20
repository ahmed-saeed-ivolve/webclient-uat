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
    Checkbox,
    Spin,
    message,
} from 'antd';
import validator from 'validator';

import ReactDOM from 'react-dom';
import { connect } from 'dva';
import { getPageQuery } from '@/utils/utils';
import { generateRandomPassword } from '../../../../utils/random_password_generator';
import { CopyToClipboard } from 'react-copy-to-clipboard';
const { Option } = Select;

const antIcon = (
    <Icon
        type="loading"
        style={{ fontSize: 48, margin: '40px 0px 40px 0px' }}
        spin
    />
);

class CreateUser extends React.Component {
    constructor() {
        super();
        this.state = {
            trialAccount: false,
            confirmDirty: false,
            generatedPassword: '',
        };
        this.generatePassword = this.generatePassword.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
    }

    onClose = () => {
        this.props.whenCloseCalled(false);
    };

    email = e => {
        if (!validator.isEmail(e.target.value)) {
            return `${e.target.value} is not a valid email.`;
        }
    };

    trialCheckbox = e => {
        this.setState({ trialAccount: e.target.checked });
    };
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { keys, names } = values;

                this.props.dispatch({
                    type: 'users/create',
                    payload: {
                        ...values,
                        trialAccount: this.state.trialAccount,
                    },
                });
            }
        });
    };

    handleConfirmBlur = e => {
        const { value } = e.target;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };

    compareToFirstPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && value !== form.getFieldValue('password')) {
            callback(`Password did not match`);
        } else {
            callback();
        }
    };
    validateToNextPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    };

    componentDidMount() {}

    handleFocus(value) {
        this.props.dispatch({
            type: 'users/fetchRoles',
            payload: {
                force: true,
            },
        });
    }

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
    fetchProjects() {
        this.props.dispatch({
            type: 'projects/update',
            payload: {
                force: true,
            },
        });
    }
    generatePassword() {
        const generatedPassword = generateRandomPassword(
            true,
            true,
            true,
            true,
            8
        );
        this.setState({
            generatedPassword,
        });
        this.props.form.setFieldsValue({
            password: generatedPassword,
            confirm: generatedPassword,
        });
    }

    onChangePassword(e) {
        if (this.state.generatedPassword) {
            this.setState({
                generatedPassword: '',
            });
            this.props.form.setFieldsValue({
                confirm: '',
            });
        }
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        console.log('trialAccount = ', this.state.trialAccount);
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
                                            pattern: /^[a-zA-Z]+([-_.]?[a-zA-Z0-9]+)*$/,
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
                                First name
                            </Typography.Title>
                            <Typography.Paragraph
                                style={{
                                    color: `#747373`,
                                    fontSize: `1.1em`,
                                    marginBottom: `0.3em`,
                                }}
                            ></Typography.Paragraph>

                            <Form.Item>
                                {getFieldDecorator('first_name', {
                                    rules: [
                                        {
                                            message:
                                                'Please enter correct first name',
                                            pattern: /^[a-zA-Z]+([-_.]?[a-zA-Z0-9]+)*$/,
                                        },
                                        {
                                            required: true,
                                            message: 'Please enter name',
                                        },
                                    ],
                                })(
                                    <Input placeholder="Please enter first name" />
                                )}
                            </Form.Item>
                        </Col>
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
                                Last name
                            </Typography.Title>
                            <Typography.Paragraph
                                style={{
                                    color: `#747373`,
                                    fontSize: `1.1em`,
                                    marginBottom: `0.3em`,
                                }}
                            ></Typography.Paragraph>

                            <Form.Item>
                                {getFieldDecorator('last_name', {
                                    rules: [
                                        {
                                            message:
                                                'Please enter correct last name',
                                            pattern: /^[a-zA-Z]+([-_.]?[a-zA-Z0-9]+)*$/,
                                        },
                                        {
                                            required: true,
                                            message: 'Please enter last name',
                                        },
                                    ],
                                })(
                                    <Input placeholder="Please enter last name" />
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
                            <Row>
                                <Col xs={18} sm={11} lg={8} xl={5} xxl={4}>
                                    <Typography.Title
                                        level={4}
                                        style={{
                                            fontSize: ` 1.2em`,

                                            fontFamily: 'Open Sans',
                                            fontWeight: 600,
                                            color: `#2b7797`,
                                        }}
                                    >
                                        Password
                                    </Typography.Title>
                                </Col>
                                <Col span={4}>
                                    <a
                                        placement="right"
                                        rel="tooltip"
                                        title={`Your Password must be 8 characters long and should include: 
                                    1. Atleast one capital letter 
                                    2. Atleast one small letter 
                                    3. Atleast one number
                                    4. Atleast one symbol i.e; *@#$?!|`}
                                    >
                                        <Icon type="info-circle" />
                                    </a>
                                </Col>
                            </Row>
                            <Form.Item
                                hasFeedback
                                style={{ paddingBottom: '0' }}
                            >
                                {getFieldDecorator('password', {
                                    rules: [
                                        {
                                            required: true,
                                            pattern: /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/,
                                            message:
                                                'Please set a strong password.',
                                        },
                                        {
                                            validator: this
                                                .validateToNextPassword,
                                        },
                                    ],
                                })(
                                    <Input.Password
                                        minLength={8}
                                        autocomplete="new-password"
                                        onChange={this.onChangePassword}
                                    />
                                )}
                            </Form.Item>
                            <Row>
                                <Col xs={22} sm={22} lg={12} xl={10} xxl={7}>
                                    <Button
                                        type="link"
                                        style={{
                                            fontSize: `1.1em`,
                                            marginBottom: `0.3em`,
                                            paddingLeft: '0',
                                        }}
                                        onClick={() => this.generatePassword()}
                                    >
                                        Generate Password
                                    </Button>
                                </Col>
                                <Col
                                    xs={8}
                                    sm={4}
                                    lg={4}
                                    xl={4}
                                    style={{
                                        marginTop: '0.5em',
                                    }}
                                >
                                    <CopyToClipboard
                                        text={this.props.form.getFieldValue(
                                            'password'
                                        )}
                                        onCopy={() => {
                                            if (
                                                !this.props.form.getFieldValue(
                                                    'password'
                                                )
                                            ) {
                                                message.error(
                                                    'Please Generate a Password'
                                                );
                                                return;
                                            }
                                            message.success(
                                                'Password has been copied'
                                            );
                                        }}
                                    >
                                        <Icon
                                            style={{
                                                fontSize: '20px',
                                                color: '#2990fe',
                                                marginLeft: '6px',
                                            }}
                                            title="Copy"
                                            type="copy"
                                        />
                                    </CopyToClipboard>
                                </Col>
                            </Row>
                        </Col>
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
                                Confirm Password
                            </Typography.Title>

                            <Form.Item hasFeedback>
                                {getFieldDecorator('confirm', {
                                    rules: [
                                        {
                                            required: true,
                                            message:
                                                'Please confirm your password!',
                                        },
                                        {
                                            validator: this
                                                .compareToFirstPassword,
                                        },
                                    ],
                                })(
                                    <Input.Password
                                        minLength={8}
                                        autocomplete="new-password"
                                        onBlur={this.handleConfirmBlur}
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
                                Project
                            </Typography.Title>

                            <Form.Item>
                                {getFieldDecorator(
                                    'default_project_id',
                                    {}
                                )(
                                    <Select
                                        placeholder="Select Project"
                                        onFocus={this.fetchProjects.bind(this)}
                                    >
                                        {this.props.fetchingProjects ===
                                        true ? (
                                            <Option disabled={true} value={1}>
                                                <Spin
                                                    style={{
                                                        display: 'flex',
                                                        justifyContent:
                                                            'center',
                                                    }}
                                                    indicator={antIcon}
                                                />
                                            </Option>
                                        ) : (
                                            this.props.projects.list.map(
                                                items => (
                                                    <Option value={items.id}>
                                                        {items.name}
                                                    </Option>
                                                )
                                            )
                                        )}
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>

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
                                Roles
                            </Typography.Title>
                            <Form.Item>
                                {getFieldDecorator(
                                    'role_id',
                                    {}
                                )(
                                    <Select
                                        placeholder="Select Role"
                                        onFocus={this.handleFocus.bind(this)}
                                    >
                                        {this.props.fetchingRoles === true ? (
                                            <Option disabled={true} value={1}>
                                                <Spin
                                                    style={{
                                                        display: 'flex',
                                                        justifyContent:
                                                            'center',
                                                    }}
                                                    indicator={antIcon}
                                                />
                                            </Option>
                                        ) : (
                                            this.props.usersList.roleList.map(
                                                items => (
                                                    <Option value={items.id}>
                                                        {items.name}
                                                    </Option>
                                                )
                                            )
                                        )}
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={9}>
                            <Checkbox
                                checked={this.state.trialAccount}
                                onChange={this.trialCheckbox}
                            >
                                Trial Account{' '}
                                {!this.state.trialAccount ? (
                                    <Typography style={{ color: '#06597F' }}>
                                        Once Permanent User has been created, it
                                        cannot be convert into trial user
                                    </Typography>
                                ) : null}
                            </Checkbox>
                        </Col>
                    </Row>
                    <Button
                        style={{ marginTop: '30px' }}
                        loading={this.props.creatingUser}
                        type="primary"
                        htmlType="submit"
                    >
                        Submit
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
        fetchingProjects: state.loading.effects['projects/update'],
        creatingUser: state.loading.effects['users/create'],
        fetchingRoles: state.loading.effects['users/fetchRoles'],
    };
})(Form.create()(CreateUser));
