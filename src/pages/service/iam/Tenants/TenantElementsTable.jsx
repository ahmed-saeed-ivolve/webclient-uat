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
    Button,
    Row,
    Col,
} from 'antd';

import styles from '../../ElementsTable.css';
import { Link } from 'umi';

class TenantElementsTable extends React.Component {
    constructor(props) {
        super(props);
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
                        return (
                            <Link
                                to={`/service/iam/projects/show-project?id=${text.id}`}
                            >
                                {text.name}
                            </Link>
                        );
                    },
                },
                {
                    title: 'Domain',
                    dataIndex: 'domain_id',
                    key: 'domain_id',
                    width: 150,
                },
            ],

            data: [],
            hasData: true,
        };
    }

    onSelectClick(record, state) {
        const { dispatch } = this.props;

        dispatch({
            type: 'projects/selectedRows',
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
            type: 'projects/sdAllRows',
            payload: {
                records,
                value,
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

        const data = this.props.projectList?.map(listItem => {
            return {
                key: listItem['id'],
                id: listItem['id'],
                name: listItem,
                domain_id: listItem['domain_id'],
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
                    rowSelection={{ ...rowSelection }}
                />
            </div>
        );
    }
}

export default TenantElementsTable;
