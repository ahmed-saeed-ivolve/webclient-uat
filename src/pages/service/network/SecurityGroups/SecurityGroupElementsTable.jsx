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
import SecurityGroupDetails from './SecurityGroupDetails';
import styles from '../../ElementsTable.css';

class SecurityGroupElementsTable extends React.Component {
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
                    title: 'Description',
                    dataIndex: 'descriptions',
                    key: 'descriptions',
                    width: 150,
                    render: text => (text === '' ? '-' : text),
                },
            ],

            data: [],

            hasData: true,
        };
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
                    type: 'securitygroup/selectedRows',
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
            type: 'securitygroup/selectedRows',
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
            type: 'securitygroup/sdAllRows',
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
        const data = this.props.securitygroupsList.map((listItem, index) => {
            return {
                key: listItem['id'],
                id: listItem['id'],
                securitygroupId: listItem['id'],
                name: listItem['name'],
                descriptions: listItem['description'],
                description: (
                    <SecurityGroupDetails
                        loadingdeletingrule={this.props.loadingdeletingrule}
                        sgid={listItem['id']}
                        sgdetail={listItem}
                        dispatch={this.props.dispatch}
                    />
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
                    onRow={this.onRow}
                    rowSelection={{ ...rowSelection }}
                    expandRowByClick={false}
                    expandedRowRender={record => record.description}
                />
            </div>
        );
    }
}

export default SecurityGroupElementsTable;
