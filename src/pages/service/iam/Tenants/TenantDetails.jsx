import React from 'react';
import {
    Tabs,
    Button,
    Icon,
    Row,
    Col,
    Menu,
    Skeleton,
    Spin,
    List,
    Typography,
    Tag,
    Modal,
    Select,
    Empty,
} from 'antd';
import { getPageQuery } from '@/utils/utils';
import { connect } from 'dva';
const antIcon = <Icon type="loading" style={{ fontSize: 50 }} spin />;
const antIconSmall = <Icon type="loading" style={{ fontSize: 14 }} spin />;
const { Option, OptGroup } = Select;
import styles from './../styles.less';
@connect(({ loading, groups, users, projects }) => {
    return {
        projects,
        users,
        groups,
        roles: users.roleList,

        gettingProjectsAssignments:
            loading.effects['projects/getCurrentProjectAssignments'],
        loadingAssignRolesToUsersAndGroupsOnProject:
            loading.effects['projects/assignRolesToUsersAndGroupsOnProject'],
    };
})
class TenantDetails extends React.Component {
    constructor(props) {
        super(props);
        this.transformAssignmentData = this.transformAssignmentData.bind(this);
        this.showRoleDetails = this.showRoleDetails.bind(this);
        this.state = {
            modal: {
                visible: false,
            },
            assignments: null,
        };
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            prevProps.gettingProjectsAssignments === true &&
            !this.props.gettingProjectsAssignments
        ) {
            this.setState(state => {
                return {
                    ...state,
                    modal: {
                        visible: false,
                    },
                };
            });
        }
    }

    componentDidMount() {
        const pageQuery = getPageQuery();
        const { id } = pageQuery;
        this.props.dispatch({
            type: 'projects/selectCurrentProject',
            payload: {
                projectId: id,
            },
        });
    }

    transformAssignmentData(item) {
        const assignments = [...item.users, ...item.groups];
        return this.props.roles.reduce((acc, item) => {
            const { name } = item;
            const sameRoleUser = assignments.filter(role => {
                const { roles } = role;
                const isSameRole = roles.find(role => role.name === name);
                if (isSameRole) {
                    return true;
                }
                return false;
            });
            return {
                ...acc,
                [name]: acc[name]
                    ? [...acc[name], ...sameRoleUser]
                    : [...sameRoleUser],
            };
        }, {});
    }
    showModal(role, projectName) {
        this.fetchUsersAndGroups.bind(this)();

        this.setState(state => {
            return {
                ...state,
                mode: role,
                value: this.transformAssignmentData(
                    this.props.projects.currentProject.assignments
                )[role].map(item => item.group_id || item.user_id),
                modal: {
                    title: `Add '${role}' to project (${projectName})`,
                    visible: true,
                },
            };
        });
    }
    showRoleDetails() {
        const assignment = this.transformAssignmentData(
            this.props.projects.currentProject.assignments
        );
        return (
            <div>
                <div style={{ marginBottom: `20px` }}>
                    <List
                        split
                        dataSource={Object.entries(assignment)}
                        renderItem={item => {
                            const [role, values] = item;
                            const desc =
                                values.length === 0
                                    ? 'No Members'
                                    : values.map(role => (
                                          <Tag
                                              key={
                                                  `${
                                                      role.username
                                                  }${Math.random()
                                                      .toString(36)
                                                      .substr(2, 9)}` ||
                                                  `${
                                                      role.group_name
                                                  }${Math.random()
                                                      .toString(36)
                                                      .substr(2, 9)}`
                                              }
                                              style={{
                                                  padding: `7px 10px`,
                                                  marginBottom: '7px',
                                              }}
                                          >
                                              {role.username
                                                  ? role.username + ' - User'
                                                  : role.group_name +
                                                    ' - Group'}{' '}
                                          </Tag>
                                      ));
                            return (
                                <List.Item
                                    style={{ padding: `20px 0px 30px 0px` }}
                                    key={role}
                                    extra={[
                                        <Button
                                        type='primary'
                                            onClick={this.showModal.bind(
                                                this,
                                                role,
                                                this.props.projects
                                                    .currentProject.name
                                            )}
                                        >
                                            Edit Members
                                        </Button>,
                                    ]}
                                >
                                    <List.Item.Meta
                                        title={role}
                                        description={
                                            <div style={{ marginTop: `8px` }}>
                                                {desc}
                                            </div>
                                        }
                                    />
                                </List.Item>
                            );
                        }}
                    />
                </div>
            </div>
        );
    }

    handleOk() {
        const { id } = this.props.projects.currentProject;
        const { mode, value } = this.state;
        const initialValue = this.transformAssignmentData(
            this.props.projects.currentProject.assignments
        )[mode].map(item => item.group_id || item.user_id);
        const newAdded = value.filter(val => !initialValue.includes(val));
        const removed = initialValue.filter(val => !value.includes(val));
        const roleId = this.props.roles.find(item => item.name === mode)?.id;

        let newAddedGroups = this.props.groups.list.filter(item =>
            newAdded.includes(item.id)
        );
        let removedGroups = this.props.groups.list.filter(item =>
            removed.includes(item.id)
        );
        let removedUsers = this.props.users.list.filter(item =>
            removed.includes(item.id)
        );
        let newAddedUsers = this.props.users.list.filter(item =>
            newAdded.includes(item.id)
        );

        this.props.dispatch({
            type: 'projects/assignRolesToUsersAndGroupsOnProject',
            payload: {
                project_id: id,
                addedUsers:
                    newAddedUsers.length !== 0
                        ? newAddedUsers.map(item => item.id)
                        : null,
                removedUsers:
                    removedUsers.length !== 0
                        ? removedUsers.map(item => item.id)
                        : null,
                addedGroups:
                    newAddedGroups.length !== 0
                        ? newAddedGroups.map(item => item.id)
                        : null,
                removedGroups:
                    removedGroups.length !== 0
                        ? removedGroups.map(item => item.id)
                        : null,
                role_id: roleId,
            },
        });
    }

    handleCancel() {
        this.setState(state => {
            return {
                ...state,
                modal: {
                    visible: false,
                },
            };
        });
    }
    fetchUsersAndGroups() {
        this.props.dispatch({
            type: 'users/update',
            payload: {
                force: false,
            },
        });
        this.props.dispatch({
            type: 'groups/update',
            payload: {
                force: false,
            },
        });
    }
    saveValues(values, what, and) {
        this.setState(state => {
            return {
                ...state,
                value: values,
            };
        });
    }
    render() {
        const { currentProject } = this.props.projects;
        return (
            <div
                style={{ height: `100%`, display: `flex`, flexFlow: `column` }}
            >
                <Modal
                    destroyOnClose
                    title={this.state.modal.title}
                    visible={this.state.modal.visible}
                    onOk={this.handleOk.bind(this)}
                    confirmLoading={
                        this.props
                            .loadingAssignRolesToUsersAndGroupsOnProject ||
                        this.props.gettingProjectsAssignments
                    }
                    onCancel={this.handleCancel.bind(this)}
                >
                    <Select
                        value={this.state.value}
                        onChange={this.saveValues.bind(this)}
                        mode="tags"
                        loading={
                            this.props.fetchingUsers ||
                            this.props.fetchingGroups
                        }
                        disabled={
                            this.props.fetchingUsers ||
                            this.props.fetchingGroups
                        }
                        style={{ width: '100%' }}
                        placeholder="Please select users or groups"
                    >
                        <OptGroup
                            label={
                                <div>
                                    <Icon
                                        type="user"
                                        style={{ fontSize: '22px' }}
                                    />
                                    <Typography.Text
                                        style={{ fontSize: '1.3em' }}
                                    >
                                        {' '}
                                        Users{' '}
                                    </Typography.Text>
                                </div>
                            }
                        >
                            {this.props.users.list.map(user => (
                                <Option
                                    value={user.id}
                                    key={user.id}
                                    label={user.name}
                                >
                                    {' '}
                                    {user.name}
                                </Option>
                            ))}
                        </OptGroup>
                        <OptGroup
                            label={
                                <div>
                                    <Icon
                                        type="usergroup-add"
                                        style={{ fontSize: '22px' }}
                                    />
                                    <Typography.Text
                                        style={{ fontSize: '1.3em' }}
                                    >
                                        {' '}
                                        Groups{' '}
                                    </Typography.Text>
                                </div>
                            }
                        >
                            {this.props.groups.list.map(group => (
                                <Option
                                    value={group.id}
                                    key={group.id}
                                    label={group.name}
                                >
                                    {group.name}
                                </Option>
                            ))}
                        </OptGroup>
                    </Select>
                </Modal>
                <div className={styles.assignmentRowPageHeader}>
                    <Row>
                        <Col span={24}>
                            <Menu
                                style={{
                                    padding: `0px 34px`,
                                    border: 0,
                                }}
                                selectedKeys={['assignments']}
                                mode="horizontal"
                            >
                                <Menu.Item key="assignments">
                                    <Icon type="mail" />
                                    Assignments
                                </Menu.Item>
                            </Menu>
                        </Col>
                        <Col span={5}>
                            <Row type="flex" justify="end">
                                <Col></Col>
                            </Row>
                        </Col>
                    </Row>
                </div>
                <div
                    style={{
                        padding: '34px',
                        height: `100%`,
                        borderTop: `1px solid #e5e5e5`,
                    }}
                >
                    {!currentProject || !currentProject.assignments ? (
                        <div
                            style={{ textAlign: 'center', marginTop: `150px` }}
                        >
                            <Spin indicator={antIcon} />
                        </div>
                    ) : (
                        this.showRoleDetails()
                    )}
                </div>
            </div>
        );
    }
}
export default TenantDetails;
