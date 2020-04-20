import React, { PureComponent } from 'react';
import {
    Collapse,
    Icon,
    Row,
    Col,
    Spin,
    Popconfirm,
    Divider,
    Descriptions,
    Badge,
    Card,
    Form,
    Select,
    Typography,
    Menu,
    Dropdown,
    Button,
} from 'antd';
import UserInGroupDetailPanel from './UserInGroupDetailPanel';
import { connect } from 'dva';

const { Panel } = Collapse;

const antIcon = <Icon type="loading" style={{ fontSize: 50 }} spin />;

const antIcon2 = (
    <Icon
        type="loading"
        style={{ fontSize: 48, margin: '40px 0px 40px 0px' }}
        spin
    />
);

@connect(state => {
    return {
        groups: state.groups,
        users: state.users,
        addingUser: state.loading.effects['groups/addUserToGroup'],
        fetchingUsers: state.loading.effects['users/update'],
    };
})
@Form.create()
export default class UsersInGroup extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showAttachForm: false,
        };
    }

    componentDidMount() {
        const { currentGroup } = this.props;

        if (
            (currentGroup !== null || currentGroup !== undefined) &&
            !currentGroup.userInGroup
        ) {
            this.props.dispatch({
                type: 'groups/getUsersInGroup',
                payload: {
                    id: currentGroup.id,
                },
            });
        }
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.dispatch({
                    type: 'groups/addUserToGroup',
                    payload: {
                        id: values['userID'],
                        group_id: this.props.currentGroup.id,
                    },
                });
            }
        });
    };

    onFocus() {
        this.props.dispatch({
            type: 'users/update',
            payload: {
                force: false,
            },
        });
    }

    removeUser(userID, e) {
        e.stopPropagation();
        this.props.dispatch({
            type: 'groups/removeUserFromGroup',
            payload: { id: userID, group_id: this.props.currentGroup.id },
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.addingUser === true && !this.props.addingUser) {
            this.props.form.setFieldsValue({
                userID: null,
            });
        }
    }

    attachUser() {
        const { getFieldDecorator } = this.props.form;
        const currentGroupUsers = this.props.currentGroup.userInGroup.users.map(
            item => item.id
        );
        return (
            <div style={{ marginBottom: `20px` }}>
                <Row>
                    <Col span={12}>
                        <Spin indicator={antIcon} spinning={false}>
                            <Card type="inner" title="Add User To This Group">
                                <Form onSubmit={this.handleSubmit}>
                                    <Row>
                                        <Col span={24}>
                                            <Form.Item
                                                style={{ marginBottom: `10px` }}
                                            >
                                                <Typography.Title
                                                    level={4}
                                                    style={{
                                                        fontSize: ` 1.2em`,

                                                        fontFamily: 'Open Sans',
                                                        fontWeight: 600,
                                                        color: `#2b7797`,
                                                    }}
                                                >
                                                    Select a user
                                                </Typography.Title>
                                                {getFieldDecorator('userID', {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message:
                                                                'Select the user',
                                                        },
                                                    ],
                                                })(
                                                    <Select
                                                        style={{
                                                            width: `100%`,
                                                        }}
                                                        onFocus={this.onFocus.bind(
                                                            this
                                                        )}
                                                    >
                                                        {this.props
                                                            .fetchingUsers ===
                                                        true ? (
                                                            <Select.Option
                                                                disabled={true}
                                                                value={1}
                                                            >
                                                                <Spin
                                                                    style={{
                                                                        display:
                                                                            'flex',
                                                                        justifyContent:
                                                                            'center',
                                                                    }}
                                                                    indicator={
                                                                        antIcon
                                                                    }
                                                                />
                                                            </Select.Option>
                                                        ) : (
                                                            this.props.users.list.map(
                                                                item => (
                                                                    <Select.Option
                                                                        disabled={currentGroupUsers.includes(
                                                                            item.id
                                                                        )}
                                                                        value={
                                                                            item.id
                                                                        }
                                                                    >
                                                                        {
                                                                            item.name
                                                                        }
                                                                    </Select.Option>
                                                                )
                                                            )
                                                        )}
                                                    </Select>
                                                )}
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Row gutter={10}>
                                        <Col span={6}>
                                            <Form.Item
                                                style={{ marginBottom: `0px` }}
                                            >
                                                <Button
                                                    loading={
                                                        this.props.addingUser
                                                    }
                                                    style={{ width: `100%` }}
                                                    type="primary"
                                                    htmlType="submit"
                                                >
                                                    Add
                                                </Button>
                                            </Form.Item>
                                        </Col>

                                        <Col span={18}>
                                            <Form.Item
                                                style={{ marginBottom: `0px` }}
                                            >
                                                <Button
                                                    disabled={
                                                        this.props.addingUser
                                                    }
                                                    onClick={this.closeAttachUserForm.bind(
                                                        this
                                                    )}
                                                >
                                                    Cancel
                                                </Button>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Form>
                            </Card>
                        </Spin>
                    </Col>
                </Row>
            </div>
        );
    }

    showAttachUserForm() {
        this.setState(state => {
            return {
                ...state,
                showAttachForm: true,
            };
        });
    }

    closeAttachUserForm() {
        this.setState(state => {
            return {
                ...state,
                showAttachForm: false,
            };
        });
    }

    render() {
        const { currentGroup } = this.props;

        if (!currentGroup.userInGroup) {
            return (
                <div style={{ textAlign: 'center', marginTop: `150px` }}>
                    <Spin indicator={antIcon} delay={300} />
                </div>
            );
        }

        const showForm = this.state.showAttachForm ? (
            this.attachUser()
        ) : (
            <Button
                type="primary"
                style={{ marginBottom: `20px` }}
                onClick={this.showAttachUserForm.bind(this)}
            >
                Add User
            </Button>
        );

        return (
            <>
                {showForm}
                <Collapse>
                    {Object.entries(
                        this.props.currentGroup.userInGroup.users
                    ).map(entry => {
                        return (
                            <Panel
                                header={entry[1].name}
                                key={entry[0]}
                                extra={
                                    <>
                                        <Button
                                            type="danger"
                                            loading={this.props.groups.loading.includes(
                                                entry[1].id
                                            )}
                                            onClick={this.removeUser.bind(
                                                this,
                                                entry[1].id
                                            )}
                                            style={{ margin: `-10px` }}
                                        >
                                            Remove User
                                        </Button>
                                    </>
                                }
                            >
                                <div style={{ marginTop: `20px` }}>
                                    <UserInGroupDetailPanel
                                        userInGroupDetail={entry[1]}
                                    />
                                </div>
                            </Panel>
                        );
                    })}
                </Collapse>
            </>
        );
    }
}
