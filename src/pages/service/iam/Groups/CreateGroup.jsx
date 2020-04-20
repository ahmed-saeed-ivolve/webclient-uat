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
    Slider,
    InputNumber,
    Upload,
    Typography,
    Spin,
} from 'antd';
import ReactDOM from 'react-dom';
import { connect } from 'dva';

const { Option } = Select;

const antIcon = (
    <Icon
        type="loading"
        style={{ fontSize: 48, margin: '40px 0px 40px 0px' }}
        spin
    />
);

class CreateGroup extends React.Component {
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { keys, names } = values;

                this.props.dispatch({
                    type: 'groups/create',
                    payload: values,
                });
            }
        });
    };

    handleFocus(value) {
        this.props.dispatch({
            type: 'users/fetchRoles',
            payload: {
                force: true,
            },
        });
    }

    handleFocusUsers(value) {
        this.props.dispatch({
            type: 'users/update',
            payload: {
                force: true,
            },
        });
    }

    handleFocusProjects(value) {
        this.props.dispatch({
            type: 'projects/update',
            payload: {
                force: true,
            },
        });
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
                {' '}
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
                            ></Typography.Paragraph>
                            <Form.Item>
                                {getFieldDecorator('name', {
                                    rules: [
                                        {
                                            message:
                                                'Please enter correct group name',
                                            pattern: /^[a-zA-Z]+([-_.]?[a-zA-Z0-9]+)*$/,
                                        },
                                        {
                                            required: true,
                                            message: 'Please enter group name',
                                        },
                                    ],
                                })(
                                    <Input
                                        style={{ width: '600px' }}
                                        placeholder="Please enter group name"
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
                                Users
                            </Typography.Title>
                            <Typography.Paragraph
                                style={{
                                    color: `#747373`,
                                    fontSize: `1.1em`,
                                    marginBottom: `0.3em`,
                                }}
                            ></Typography.Paragraph>

                            <Form.Item>
                                {getFieldDecorator('users', {
                                    rules: [
                                        {
                                            required: true,
                                            message: 'Please select Users Name',
                                        },
                                    ],
                                })(
                                    <Select
                                        onFocus={this.handleFocusUsers.bind(
                                            this
                                        )}
                                        mode="multiple"
                                        style={{ width: '600px' }}
                                        placeholder="Select Users"
                                    >
                                        {this.props.users === true ? (
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
                                            this.props.usersList.list.map(
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
                                Project
                            </Typography.Title>
                            <Typography.Paragraph
                                style={{
                                    color: `#747373`,
                                    fontSize: `1.1em`,
                                    marginBottom: `0.3em`,
                                }}
                            ></Typography.Paragraph>

                            <Form.Item>
                                {getFieldDecorator('project_id', {
                                    rules: [
                                        {
                                            required: true,
                                            message:
                                                'Please select Project Name',
                                        },
                                    ],
                                })(
                                    <Select
                                        onFocus={this.handleFocusProjects.bind(
                                            this
                                        )}
                                        mode="multiple"
                                        style={{ width: '600px' }}
                                        placeholder="Select projects"
                                    >
                                        {this.props.fetchProjects === true ? (
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
                                            this.props.projectsList.list.map(
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
                                Roles
                            </Typography.Title>
                            <Typography.Paragraph
                                style={{
                                    color: `#747373`,
                                    fontSize: `1.1em`,
                                    marginBottom: `0.3em`,
                                }}
                            ></Typography.Paragraph>

                            <Form.Item>
                                {getFieldDecorator('role_id', {
                                    rules: [
                                        {
                                            required: true,
                                            message:
                                                'Please select Roles to users',
                                        },
                                    ],
                                })(
                                    <Select
                                        placeholder="Select Role"
                                        style={{ width: '600px' }}
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

                    <Form.Item>
                        <Button
                            loading={this.props.creatingTenant}
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
        usersList: state.users,
        fetchingRoles: state.loading.effects['users/fetchRoles'],
        projectsList: state.projects,
        creatingTenant: state.loading.effects['groups/create'],
        users: state.loading.effects['users/update'],
        fetchProjects: state.loading.effects['projects/update'],
    };
})(Form.create()(CreateGroup));
