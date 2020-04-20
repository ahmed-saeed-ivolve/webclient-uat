import React from 'react';
import {
    Table,
    Icon,
    Switch,
    Radio,
    Form,
    Divider,
    Menu,
    Dropdown,
} from 'antd';
import RouterDetails from './RouterDetails';
import styles from '../../ElementsTable.css';
import { connect } from 'dva';
import Typography from 'antd/lib/typography/Typography';

Icon.setTwoToneColor('#4c98bf');

class RouterElementsTable extends React.Component {
    constructor(props) {
        super(props);
        this.onRow = this.onRow.bind(this);
        this.onSelectClick = this.onSelectClick.bind(this);
        this.onSelectAll = this.onSelectAll.bind(this);

        this.state = {
            bordered: false,

            rowSelection: {},
            scroll: undefined,
            size: 'default',
            selectedRowKeys: [],

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
                },

                {
                    title: 'Status',
                    dataIndex: 'status',
                    key: 'status',
                    width: 150,
                },

                {
                    title: 'Admin State',
                    dataIndex: 'adminstate',
                    key: 'adminstate',
                    width: 150,
                    render: text =>
                        text === true ? (
                            <Typography> Up </Typography>
                        ) : (
                            <Typography> Down </Typography>
                        ),
                },
            ],

            data: [],
            hasData: true,
        };
    }
    displayRouterData() {
        if (typeof this.props.routersList !== 'undefined') {
            if (this.state.data.length !== 0) {
                this.setState({ data: [] });
            }

            for (var i = 0; i < this.props.routersList['length']; i++) {
                this.state.data.push({
                    key: this.props.routersList[i]['uuid'],
                    name: this.props.routersList[i]['name'],
                    projectid: this.props.routersList[i]['tenant_uuid'],
                    status: this.props.routersList[i]['status'],
                    adminstate: this.props.routersList[i]['is_admin_state_up'],
                    description: (
                        <RouterDetails
                            eachRouterDetail={
                                this.props.routersList[i]['description']
                            }
                        />
                    ),
                });
            }
        }
    }
    onSelectChange(selectedRowKeys) {
        this.setState(state => {
            return { ...state, selectedRowKeys };
        });
    }

    onRow(record, rowIndex) {
        const { dispatch } = this.props;
        return {
            onClick(e) {
                e.preventDefault();
                dispatch({
                    type: 'router/selectedRows',
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
            type: 'router/selectedRows',
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
            type: 'router/sdAllRows',
            payload: {
                records,
                value,
            },
        });
    }

    render() {
        const { state } = this;
        const rowSelection = {
            selectedRowKeys: this.props.selectedRowKeys,
            onSelect: this.onSelectClick,
            onSelectAll: this.onSelectAll,
        };

        const data = this.props.routersList.map(listItem => {
            return {
                key: listItem['id'],
                id: listItem['id'],
                name: listItem['name'],
                projectid: listItem['tenant_uuid'],
                status: listItem['status'],
                adminstate: listItem['is_admin_state_up'],
                description: (
                    <RouterDetails
                        loadingPorts={this.props.loadingPorts}
                        loadingdcreatingInterface={
                            this.props.loadingdcreatingInterface
                        }
                        loadingdeletingInterface={
                            this.props.loadingdeletingInterface
                        }
                        ports={this.props.routerPorts}
                        routerid={listItem['id']}
                        eachRouterDetail={listItem['description']}
                    />
                ),
            };
        });

        return (
            <div>
                <Table
                    size="small"
                    expandRowByClick
                    loading={this.props.loading}
                    columns={this.state.columns}
                    dataSource={data}
                    pagination={{ pageSize: 10 }}
                    onRow={this.onRow}
                    rowSelection={{ ...rowSelection }}
                    expandRowByClick={false}
                    expandedRowRender={record => record.description}
                />
            </div>
        );
    }
}

export default RouterElementsTable;
