import React from 'react';
import {
    Table,
    Icon,
    Switch,
    Popconfirm,
    Radio,
    Form,
    Divider,
    Menu,
    Dropdown,
    Button,
    Row,
    Col,
    Typography,
} from 'antd';
import { connect } from 'dva';
import styles from '../../ElementsTable.css';

class UserElementsTable extends React.Component {
    constructor(props) {
        super(props);
        this.onRow = this.onRow.bind(this);
        this.onSelectClick = this.onSelectClick.bind(this);
        this.onSelectAll = this.onSelectAll.bind(this);

        this.state = {
            bordered: false,
            expandedRowRender: record => record.description,
            rowSelection: {},
            scroll: undefined,
            size: 'default',

            menu: (
                <Menu>
                    <Menu.Item key="0">
                        <a>Start</a>
                    </Menu.Item>
                    <Menu.Item key="1">
                        <a>Stop</a>
                    </Menu.Item>
                    <Menu.Item key="2">Pause</Menu.Item>
                </Menu>
            ),

            columns: [
                {
                    title: 'Name',
                    dataIndex: 'name',
                    key: 'name',
                    width: 150,
                    render: text => {
                        return <Typography.Text>{text[0]}</Typography.Text>;
                    },
                },
                {
                    title: 'Email',
                    dataIndex: 'email',
                    key: 'email',
                    width: 150,
                    render: data => (
                        <Typography.Text>
                            {data !== null ? data : '-'}
                        </Typography.Text>
                    ),
                },
                {
                    title: 'id',
                    dataIndex: 'id',
                    key: 'id',
                    width: 150,
                    render: data => <Typography.Text> {data} </Typography.Text>,
                },
                {
                    title: 'Enabled',
                    dataIndex: 'is_enabled',
                    key: 'is_enabled',
                    width: 150,
                },
                {
                    title: 'Account Type',
                    dataIndex: 'account_type',
                    key: 'account_type',
                    width: 150,
                },
                {
                    title: 'Multi Factor Authentication',
                    dataIndex: 'mfa',
                    key: 'mfa',
                    width: 150,
                    render: data => (
                        <Popconfirm
                            title="Are you sure?"
                            onConfirm={this.mfaSwitchChange.bind(this, data)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Switch
                                loading={this.props.users.loading.includes(
                                    data[1]
                                )}
                                checked={
                                    this.props.users.loading.includes(data[1])
                                        ? data[0]
                                        : data[0]
                                }
                                //onChange={this.mfaSwitchChange.bind(this, data)}
                            />
                        </Popconfirm>
                    ),
                },
                {
                    title: 'Actions',
                    dataIndex: 'actions',
                    key: 'actions',
                    width: 150,
                },
            ],

            data: [],
            hasData: true,
        };
    }

    mfaSwitchChange(checked) {
        const { dispatch } = this.props;

        let action = 'disable';
        let method = 'IAM.disable_mfa_for_user';

        if (!checked[0]) {
            action = 'enable';
            method = 'IAM.enable_mfa_for_user';
        }

        dispatch({
            type: 'users/mfa_enable_or_disable',
            payload: {
                user_id: checked[1],
                user_name: checked[2],
                action,
                method,
            },
        });
    }
    onRow(record, rowIndex) {
        const { dispatch } = this.props;
        return {
            onClick(e) {
                e.preventDefault();
                dispatch({
                    type: 'users/selectedRows',
                    payload: [
                        {
                            ...record,
                        },
                    ],
                });
            },
            onDoubleClick: event => {},
            onContextMenu: event => {},
            onMouseEnter: event => {},
            onMouseLeave: event => {},
        };
    }

    onSelectClick(record, state) {
        const { dispatch } = this.props;

        dispatch({
            type: 'users/selectedRows',
            payload: [
                {
                    ...record,
                },
            ],
        });
    }

    onSelectAll(value, records) {
        const { dispatch } = this.props;

        dispatch({
            type: 'users/sdAllRows',
            payload: {
                records,
                value,
            },
        });
    }

    updateUser(updateUserDetail, status) {
        this.props.dispatch({
            type: 'drawer/showDrawer',
            payload: {
                componentPath: `iam/Users/UpdateUser`,
                mountedData: {
                    drawerName: `Update User ${updateUserDetail.name}`,
                    ...updateUserDetail,
                },
            },
        });
    }
    render() {
        const rowSelection = {
            selectedRowKeys: this.props.selectedRowKeys,
            onSelect: this.onSelectClick,
            onSelectAll: this.onSelectAll,
        };

        const { state } = this;

        const data = this.props.usersList.map(listItem => {
            return {
                key: listItem['id'],
                id: listItem['id'],
                name: [listItem['name'], listItem['id']],
                email: listItem['email'],
                account_type:
                    listItem['description'] !== 'trial' &&
                    listItem['description'] !== 'suspended'
                        ? 'permanent'
                        : listItem['description'],
                is_enabled: listItem['is_enabled']
                    ? 'Yes'
                    : listItem['enabled']
                    ? 'Yes'
                    : 'No',
                mfa: listItem['options']?.hasOwnProperty(
                    'multi_factor_auth_enabled'
                )
                    ? [
                          listItem['options']['multi_factor_auth_enabled'],
                          listItem['id'],
                          listItem['name'],
                      ]
                    : [false, listItem['id'], listItem['name']],
                actions: (
                    <Button
                        type="primary"
                        style={{
                            marginRight: `20px`,
                            fontFamily: `Open Sans`,
                            fontWeight: `600`,
                        }}
                        onClick={() => this.updateUser(listItem)}
                    >
                        Update User
                    </Button>
                ),
            };
        });

        return (
            <div>
                <Table
                    size="small"
                    loading={this.props.loading}
                    columns={this.state.columns}
                    dataSource={data}
                    pagination={{ pageSize: 10 }}
                    //onRow={this.onRow}
                    rowSelection={{ ...rowSelection }}
                />
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        loadingSwitch: state.loading.effects['users/mfa_enable_or_disable'],
        users: state.users,
    };
};
export default connect(mapStateToProps)(UserElementsTable);
