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
    Tag,
    DatePicker,
    Button,
    Typography,
} from 'antd';
import SnapshotDetails from './SnapshotDetails';
import styles from '../../ElementsTable.css';
import moment from 'moment';
import router from 'umi/router';
import CreateVolume from './../ElasticVolumeServices/CreateEVS';
import { connect } from 'dva';

class SnapshotElementsTable extends React.Component {
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
                    render: text => text,
                    // render: text => <a href="javascript:;">{text}</a>,
                },
                {
                    title: 'Description',
                    dataIndex: 'descriptions',
                    key: 'descriptions',
                    width: 150,
                    render: text => (text === null || text === '' ? '-' : text),
                },

                {
                    title: 'Size',
                    dataIndex: 'size',
                    key: 'size',
                    width: 150,
                },
                {
                    title: 'Available',
                    dataIndex: 'status',
                    key: 'status',
                    width: 150,
                    render: text =>
                        text === 'available' ? (
                            <Typography>Yes</Typography>
                        ) : (
                            <Typography>No</Typography>
                        ),
                },

                {
                    title: 'Status',
                    dataIndex: 'status',
                    key: 'status',
                    width: 150,
                },

                {
                    title: 'Volume',
                    dataIndex: 'volumename',
                    key: 'volumename',
                    width: 150,
                    render: text => (text === '' ? '-' : text),
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
    createNewItem(value) {
        this.props.dispatch({
            type: `evs/createVolumeFromSnapshot`,
            payload: value,
        });
        router.push('elastic-volume-services/create');
    }

    onRow(record, rowIndex) {
        const { dispatch } = this.props;
        return {
            onClick(e) {
                e.preventDefault();
                if (e.target.innerText !== record.actions.props.children) {
                    dispatch({
                        type: 'snapshot/selectedRows',
                        payload: [
                            {
                                ...record,
                            },
                        ],
                    });
                }
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
            type: 'snapshot/selectedRows',
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
            type: 'snapshot/sdAllRows',
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
        const data = this.props.snapshotLists.map(listItem => {
            return {
                key: listItem['id'],
                id: listItem['id'],

                descriptions: listItem['description'],
                name: listItem['name'],
                size: listItem['size'] + ' GB',
                status: listItem['status'],

                volumename:
                    this.props.evsLists.length > 0
                        ? this.props.evsLists.filter(
                              item => item.id === listItem['volume_id']
                          )[0]?.name
                        : null,
                actions: (
                    <Button
                        type="primary"
                        style={{
                            marginRight: `20px`,
                            fontFamily: `Open Sans`,
                            fontWeight: `600`,
                        }}
                        onClick={() => this.createNewItem(listItem['id'])}
                    >
                        Create Volume
                    </Button>
                ),
                description: (
                    <SnapshotDetails
                        eachSnapshotDetail={listItem['description']}
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
                />
            </div>
        );
    }
}

export default connect()(SnapshotElementsTable);
