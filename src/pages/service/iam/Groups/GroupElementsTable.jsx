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
import GroupDetails from './GroupDetails';

import styles from '../../ElementsTable.css';
import { Link } from 'umi';

class GroupElementsTable extends React.Component {
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

            columns: [
                {
                    title: 'Name',
                    dataIndex: 'name',
                    key: 'name',
                    width: 150,
                    render: item => (
                        <Link
                            to={`/service/iam/groups/show-group?id=${item.id}&selection=assignments`}
                        >
                            {item.name}
                        </Link>
                    ),
                },
                {
                    title: 'Domain',
                    dataIndex: 'domain_id',
                    key: 'domain_id',
                    width: 150,
                },
            ],
        };
    }

    onSelectClick(record, state) {
        const { dispatch } = this.props;

        dispatch({
            type: 'groups/selectedRows',
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
            type: 'groups/sdAllRows',
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

        const data = this.props.groupsList.map(listItem => {
            return {
                key: listItem['id'],
                id: listItem['id'],
                name: listItem,
                projects: listItem.location.project.name,
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

export default GroupElementsTable;
