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
import EVSDetails from './EVSDetails';
import styles from '../../ElementsTable.css';
import moment from 'moment';
import { connect } from 'dva';
import router from 'umi/router';
import ResizeVolume from './ResizeVolume';
import { Link } from 'umi';

class EVSElementsTable extends React.Component {
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
                    title: 'Size',
                    dataIndex: 'size',
                    key: 'size',
                    width: 150,
                },

                {
                    title: 'Status',
                    dataIndex: 'status',
                    key: 'status',
                    width: 150,
                },

                {
                    title: 'Volume Type',
                    dataIndex: 'volumetype',
                    key: 'volumetype',
                    width: 150,
                    render: text => (text === null ? '-' : text),
                },
                {
                    title: 'Created',
                    dataIndex: 'created',
                    key: 'created',
                    width: 150,
                },
                {
                    title: 'Availability Zone',
                    dataIndex: 'availabilityzone',
                    key: 'availabilityzone',
                    width: 150,
                },
                {
                    title: 'Attached To',
                    dataIndex: 'attached_to',
                    key: 'attached_to',
                    width: 150,
                    render: (text, id) => text,
                },
                {
                    title: 'Device',
                    dataIndex: 'device',
                    key: 'device',
                    width: 150,
                    render: text => (text.length > 0 ? text[0].device : '-'),
                },
                {
                    title: 'Bootable',
                    dataIndex: 'bootable',
                    key: 'bootable',
                    width: 150,
                    render: text =>
                        text === true ? (
                            <Typography> Yes </Typography>
                        ) : (
                            <Typography> No </Typography>
                        ),
                },
                {
                    title: 'Encrypted',
                    dataIndex: 'encrypted',
                    key: 'booencryptedtable',
                    width: 150,
                    render: text =>
                        text === true ? (
                            <Typography> Yes </Typography>
                        ) : (
                            <Typography> No </Typography>
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

    async componentDidMount() {
        await this.props.dispatch({
            type: 'ecs/update',
        });
    }

    createNewSnapshot(id, status) {
        const value = {
            volumeId: id,
            force: true,
            source: 'fromVolume',
        };

        this.props.dispatch({
            type: 'snapshot/createSnapshotFromVolume',
            payload: value,
        });
        router.push('/service/storage/snapshots/create');
    }

    extendVolume(id, status) {
        this.props.dispatch({
            type: 'drawer/showDrawer',
            payload: {
                componentPath: `storage/ElasticVolumeServices/ResizeVolume`,
                mountedData: { id: id, drawerName: 'Extend Volume' },
            },
        });
    }

    onRow(record, rowIndex) {
        const { dispatch } = this.props;
        return {
            onClick(e) {
                e.preventDefault();
                if (
                    event.target.innerText !== 'Create Snapshot' &&
                    event.target.innerText !== 'Extend Volume'
                ) {
                    dispatch({
                        type: 'evs/selectedRows',
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
            type: 'evs/selectedRows',
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
            type: 'evs/sdAllRows',
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

        const data = this.props.evsLists.map(listItem => {
            return {
                key: listItem['id'],
                id: listItem['id'],
                name:
                    listItem['name'] === ''
                        ? listItem['attachments'].length > 0 &&
                          typeof this.props.ecsLists.filter(
                              item =>
                                  item.id ===
                                  listItem['attachments'][0].server_id
                          )[0] !== 'undefined'
                            ? this.props.ecsLists.filter(
                                  item =>
                                      item.id ===
                                      listItem['attachments'][0].server_id
                              )[0]?.name + '-Volume'
                            : listItem['id']
                        : listItem['name'],
                size: listItem['size'] + ' GB',
                status: listItem['status'],
                attached_to:
                    listItem['attachments'].length > 0 &&
                    typeof this.props.ecsLists.filter(
                        item => item.id === listItem['attachments'][0].server_id
                    )[0] !== 'undefined'
                        ? this.props.ecsLists.filter(
                              item =>
                                  item.id ===
                                  listItem['attachments'][0].server_id
                          )[0]?.name
                        : '-',
                device: listItem['attachments'],
                volumetype: listItem['volume_type'],
                created: moment.utc(listItem.created_at).fromNow(),

                availabilityzone: listItem['availability_zone'],
                bootable: listItem['is_bootable'],
                encrypted: listItem['is_encrypted'],

                actions: (
                    <div style={{ display: 'flex', alignContent: 'center' }}>
                        <Button
                            size="small"
                            type="primary"
                            style={{
                                marginRight: `12px`,
                                fontFamily: `Open Sans`,
                                fontWeight: `600`,
                                height: '35px',
                            }}
                            onClick={() =>
                                this.createNewSnapshot(
                                    listItem['id'],
                                    listItem['status']
                                )
                            }
                        >
                            Create Snapshot
                        </Button>
                        <Button
                            size="small"
                            type="primary"
                            style={{
                                fontFamily: `Open Sans`,
                                fontWeight: `600`,
                                height: '35px',
                            }}
                            onClick={() =>
                                this.extendVolume(
                                    listItem['id'],
                                    listItem['status']
                                )
                            }
                        >
                            Extend Volume
                        </Button>
                    </div>
                ),
                description: (
                    <EVSDetails eachEVSDetail={listItem['description']} />
                ),
            };
        });

        return (
            <div>
                <Table
                    size="small"
                    loading={this.props.loading || this.props.fetchingECSList}
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

export default EVSElementsTable;
