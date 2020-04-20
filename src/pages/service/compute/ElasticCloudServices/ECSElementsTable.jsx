import React from 'react';
import {
    Table,
    Spin,
    Input,
    Alert,
    Icon,
    Row,
    Col,
    Switch,
    Popconfirm,
    Radio,
    Form,
    Divider,
    Menu,
    message,
    Dropdown,
    Button,
    Tag,
    Typography,
    Badge,
    notification,
} from 'antd';
import ECSDetails from './ECSDetails';

import router from 'umi/router';
import { connect } from 'dva';
import { Link } from 'umi';
import Highlighter from 'react-highlight-words';
import './ECSElementsTable.less';
import { isEmptyStatement } from '@babel/types';
import moment from 'moment';

const tableMetaData = {};

const antIcon = (
    <Icon
        type="loading"
        style={{ fontSize: 15, opacity: `0.7`, marginRight: '8px' }}
        spin
    />
);

class ECSElementsTable extends React.Component {
    constructor(props) {
        super(props);
        this.onRow = this.onRow.bind(this);
        this.onSelectClick = this.onSelectClick.bind(this);
        this.onSelectAll = this.onSelectAll.bind(this);
        this.disableRow = this.disableRow.bind(this);
        this.state = {
            searchText: '',
        };

        this.columns = [
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                ...this.getColumnSearchProps('name'),
            },
            {
                title: 'Image',
                dataIndex: 'Image_Name',
                key: 'Image_Name',

                render: text => {
                    if (text.image_id === null && text.image.id) {
                        return this.props.imageList.list.find(
                            elem => elem.id === text.image.id
                        )?.name;
                    } else if (text.image_id !== null) {
                        return this.props.imageList.list.find(
                            elem => elem.id === text.image_id
                        )?.name;
                    }
                },
            },

            {
                title: 'Created ',
                dataIndex: 'created_at',
                key: 'created_at',
                render: date => {
                    const momentDate = moment(date).fromNow();
                    return momentDate === 'Invalid date' ? '-' : momentDate;
                },
            },

            {
                title: 'Fixed IP',
                dataIndex: 'fixed_ip',
                key: 'fixed_ip',
                width: 300,
                render: text => (
                    <>
                        {' '}
                        {
                            <Row>
                                <Col lg={24}>
                                    {text['vm_state'] === 'error' ||
                                    text['vm_state'] === 'building' ||
                                    text['vm_state'] === null
                                        ? '-'
                                        : text.addresses &&
                                          Object.keys(text.addresses).map(obj =>
                                              text.addresses[
                                                  obj
                                              ].map((elem, index) =>
                                                  elem['OS-EXT-IPS:type'] ===
                                                  'fixed' ? (
                                                      <Tag>{elem.addr}</Tag>
                                                  ) : (
                                                      ''
                                                  )
                                              )
                                          )}
                                </Col>
                            </Row>
                        }
                    </>
                ),
            },
            {
                title: 'Flavor',
                dataIndex: 'flavors',
                key: 'flavors',

                render: text => {
                    if (text.flavor_id === null && text.flavor.id) {
                        return this.props.flavorList.list.find(
                            elem => elem.id === text.flavor.id
                        )?.name;
                    } else if (text.flavor_id !== null) {
                        return this.props.flavorList.list.find(
                            elem => elem.id === text.flavor_id
                        )?.name;
                    } else if (text.flavor_id === null) {
                        return text.flavor.original_name;
                    }
                },
            },
            {
                title: 'Keypair',
                dataIndex: 'keypairs',
                key: 'keypairs',

                render: text => <> {text.key_name ? text.key_name : '-'}</>,
            },
            {
                title: 'Availability Zone',
                dataIndex: 'Availability_zone',
                key: 'Availability_zone',

                render: text => (
                    <>
                        {' '}
                        {text.availability_zone ? text.availability_zone : '-'}
                    </>
                ),
            },
            {
                title: 'Type',
                dataIndex: 'type',
                key: 'type',
                render: text => <>{text === 'building' ? '-' : text}</>,
            },
            {
                title: 'State',
                dataIndex: 'vm_state',
                key: 'vm_state',
                render: text => (
                    <>
                        {' '}
                        {text ? (
                            <Badge
                                status={
                                    text === 'error' || text === 'stopped'
                                        ? 'error'
                                        : text === 'building'
                                        ? 'processing'
                                        : text === 'shelved_offloaded' ||
                                          text === 'paused'
                                        ? 'warning'
                                        : 'success'
                                }
                                text={`${text
                                    .substr(0, 1)
                                    .toUpperCase()}${text
                                    .substr(1)
                                    .toLowerCase()}`}
                            />
                        ) : (
                            text
                        )}
                    </>
                ),
            },

            {
                title: 'Actions',
                dataIndex: 'actions_ecs',
                key: 'actions_ecs',
                render: text => (
                    <div>
                        {this.props.ecs.loading.includes(text['ecs_id']) ? (
                            <Spin style={{ marginLeft: '25px' }} />
                        ) : (
                            <Dropdown
                                trigger={['click']}
                                disabled={
                                    text['vm_state'] === 'error' ||
                                    text['vm_state'] === null ||
                                    text['vm_state'] === 'building' ||
                                    text.status === 'RESIZE'
                                }
                                overlay={
                                    <Menu size="small">
                                        <Menu.Item
                                            disabled={
                                                text['vm_state'] === 'active' ||
                                                text['vm_state'] === 'paused' ||
                                                text['vm_state'] ===
                                                    'shelved_offloaded'
                                            }
                                            onClick={() => {
                                                this.props.dispatch({
                                                    type: 'ecs/startServer',
                                                    payload: {
                                                        id: text['ecs_id'],
                                                        method: 'start_server',
                                                    },
                                                });
                                            }}
                                        >
                                            Start
                                        </Menu.Item>

                                        <Menu.Item
                                            disabled={
                                                text['vm_state'] ===
                                                    'stopped' ||
                                                text['vm_state'] === 'paused' ||
                                                text['vm_state'] ===
                                                    'shelved_offloaded'
                                            }
                                            onClick={() => {
                                                this.props.dispatch({
                                                    type: 'ecs/startServer',
                                                    payload: {
                                                        id: text['ecs_id'],
                                                        method: 'stop_server',
                                                    },
                                                });
                                            }}
                                        >
                                            Stop
                                        </Menu.Item>

                                        <Menu.Item
                                            disabled={
                                                text['vm_state'] ===
                                                'shelved_offloaded'
                                            }
                                            onClick={() => {
                                                this.props.dispatch({
                                                    type: 'ecs/startServer',
                                                    payload: {
                                                        id: text['ecs_id'],
                                                        method: 'shelve_server',
                                                    },
                                                });
                                            }}
                                        >
                                            Shelve
                                        </Menu.Item>

                                        <Menu.Item
                                            disabled={
                                                text['vm_state'] ===
                                                    'stopped' ||
                                                text['vm_state'] === 'paused' ||
                                                text['vm_state'] === 'active' ||
                                                text['vm_state'] === 'building'
                                            }
                                            onClick={() => {
                                                this.props.dispatch({
                                                    type: 'ecs/startServer',
                                                    payload: {
                                                        id: text['ecs_id'],
                                                        method:
                                                            'unshelve_server',
                                                    },
                                                });
                                            }}
                                        >
                                            Un-Shelve
                                        </Menu.Item>

                                        <Menu.Item
                                            disabled={
                                                text['vm_state'] ===
                                                    'stopped' ||
                                                text['vm_state'] === 'paused' ||
                                                text['vm_state'] ===
                                                    'shelved_offloaded'
                                            }
                                            onClick={() => {
                                                this.props.dispatch({
                                                    type: 'ecs/startServer',
                                                    payload: {
                                                        id: text['ecs_id'],
                                                        method: 'pause_server',
                                                    },
                                                });
                                            }}
                                        >
                                            Pause
                                        </Menu.Item>

                                        <Menu.Item
                                            disabled={
                                                text['vm_state'] === 'active' ||
                                                text['vm_state'] ===
                                                    'stopped' ||
                                                text['vm_state'] ===
                                                    'shelved_offloaded'
                                            }
                                            onClick={() => {
                                                this.props.dispatch({
                                                    type: 'ecs/startServer',
                                                    payload: {
                                                        id: text['ecs_id'],
                                                        method:
                                                            'unpause_server',
                                                    },
                                                });
                                            }}
                                        >
                                            Resume
                                        </Menu.Item>

                                        <Menu.Item
                                            disabled={
                                                text['vm_state'] ===
                                                    'stopped' ||
                                                text['vm_state'] ===
                                                    'shelved_offloaded'
                                            }
                                            onClick={() => {
                                                this.props.dispatch({
                                                    type: 'ecs/startServer',
                                                    payload: {
                                                        id: text['ecs_id'],
                                                        type: 'HARD',
                                                        method: 'reboot_server',
                                                    },
                                                });
                                            }}
                                        >
                                            Hard Reboot
                                        </Menu.Item>

                                        <Menu.Item
                                            disabled={
                                                text['vm_state'] ===
                                                    'stopped' ||
                                                text['vm_state'] ===
                                                    'shelved_offloaded'
                                            }
                                            onClick={() => {
                                                this.props.dispatch({
                                                    type: 'ecs/startServer',
                                                    payload: {
                                                        id: text['ecs_id'],
                                                        type: 'SOFT',
                                                        method: 'reboot_server',
                                                    },
                                                });
                                            }}
                                        >
                                            Soft Reboot
                                        </Menu.Item>
                                    </Menu>
                                }
                                placement="bottomLeft"
                            >
                                <Button style={{ padding: `0px` }} type="link">
                                    {' '}
                                    Actions <Icon type="down" />{' '}
                                </Button>
                            </Dropdown>
                        )}
                    </div>
                ),
            },
        ];
    }

    switchChange(checked) {}

    handleSearch = (selectedKeys, confirm) => {
        confirm();
        this.setState({ searchText: selectedKeys[0] });
    };

    handleReset = clearFilters => {
        clearFilters();
        this.setState({ searchText: '' });
    };

    getColumnSearchProps = dataIndex => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
        }) => (
            <div style={{ padding: 10 }}>
                <Input
                    ref={node => {
                        this.searchInput = node;
                    }}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e =>
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                    }
                    onPressEnter={() =>
                        this.handleSearch(selectedKeys, confirm)
                    }
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Button
                    type="primary"
                    onClick={() => this.handleSearch(selectedKeys, confirm)}
                    size="default"
                    style={{ width: 90, marginRight: 8 }}
                >
                    Search
                </Button>
                <Button
                    onClick={() => this.handleReset(clearFilters)}
                    size="default"
                    style={{ width: 90 }}
                >
                    Reset
                </Button>
            </div>
        ),
        filterIcon: filtered => (
            <Icon
                type="search"
                style={{ color: filtered ? '#5f5f5f' : undefined }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => this.searchInput.select());
            }
        },

        render: (text, record) => {
            return (
                <div>
                    {record.vm_state !== 'error' &&
                    record.vm_state !== 'building' &&
                    record.vm_state !== null &&
                    record.vm_state !== 'resizing' ? (
                        <Link
                            to={`${this.props.describeInstanceLink}${record.id}`}
                        >
                            <Highlighter
                                highlightStyle={{
                                    backgroundColor: '#ffc069',
                                    padding: 0,
                                }}
                                searchWords={[this.state.searchText]}
                                autoEscape
                                textToHighlight={text.toString()}
                            />
                        </Link>
                    ) : (
                        <>
                            {record.vm_state === 'building' ||
                            record.vm_state === 'resizing' ? (
                                <Spin indicator={antIcon} spinning={true} />
                            ) : null}
                            <Highlighter
                                onClick={() => {
                                    message.info(
                                        `VM ${record.name} is in ${record.vm_state} state, detailed view is disabled`
                                    );
                                }}
                                highlightStyle={{
                                    backgroundColor: '#ffc069',
                                    padding: 0,
                                    color: 'silver',
                                }}
                                searchWords={[this.state.searchText]}
                                autoEscape
                                textToHighlight={text.toString()}
                            />
                        </>
                    )}
                </div>
            );
        },
    });

    parseFloatingIP(payload) {
        let addresses = payload.addresses[Object.keys(payload.addresses)[0]];
        let floatingIp = addresses.map(address => {
            address['addr'];
        });
        return floatingIp;
    }

    checkFlavor(flavorID, ecsid) {
        const flavorName = this.props.flavorList.filter(
            item => item.uuid === flavorID
        );
        return flavorName[0]['name'];
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
                if (
                    e.target.innerHTML !== record.name &&
                    e.target.innerText !== 'Instance Actions' &&
                    e.target.innerText !== 'Actions' &&
                    e.target.innerText !== 'Pause' &&
                    e.target.innerText !== 'Start' &&
                    e.target.innerText !== 'Stop' &&
                    e.target.innerText !== 'Resume' &&
                    e.target.innerText !== 'Hard Reboot' &&
                    e.target.innerText !== 'Soft Reboot'
                ) {
                    dispatch({
                        type: 'ecs/selectedRows',
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
            type: 'ecs/selectedRows',
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
            type: 'ecs/sdAllRows',
            payload: {
                records,
                value,
            },
        });
    }

    createNewSnapshot(id, status) {
        const value = [];
        value[0] = id;
        value[1] = true;
        value[2] = 'fromvm';

        this.props.dispatch({
            type: 'snapshot/createSnapshotFromInstance',
            payload: value,
        });
        router.push('/service/storage/snapshots/create');
    }
    disableRow = item => {
        const { recs, list } = this.props.ecs;
        const reserved_ecs = recs.find(resinstance => {
            const currentDate = moment.utc().format();
            if (
                resinstance.id === item.id &&
                resinstance.end_date >= currentDate
            ) {
                return true;
            }
            return false;
        });
        return {
            disabled: reserved_ecs,
        };
    };

    render() {
        const { state } = this;

        const rowSelection = {
            selectedRowKeys: this.props.selectedRowKeys,
            onSelect: this.onSelectClick,
            onSelectAll: this.onSelectAll,
            getCheckboxProps: this.disableRow,
        };
        const { recs, list } = this.props.ecs;

        const data = this.props.ecsList.map(listItem => {
            return {
                key: listItem['id'],
                Image_Name: listItem,
                id: listItem['id'],
                type:
                    listItem['status'] === null
                        ? 'building'
                        : listItem['tags'][2],
                created_at: listItem.created_at,
                name: listItem['name'],
                fixed_ip: listItem,
                vm_state:
                    listItem['status'] === 'RESIZE'
                        ? 'resizing'
                        : listItem['vm_state'] === null
                        ? 'building'
                        : listItem['vm_state'],
                flavors: listItem,
                keypairs: listItem,
                Availability_zone: listItem,
                actions_ecs: {
                    vm_state: listItem['vm_state'],
                    ecs_id: listItem['id'],
                    status: listItem['status'],
                    attached_volumes: listItem['attached_volumes'],
                },
            };
        });

        return (
            <div>
                <Table
                    size="small"
                    showHeader={true}
                    bordered={false}
                    loading={
                        this.props.fetchingFlavors || this.props.fetchingServers
                    }
                    columns={this.columns}
                    dataSource={data}
                    pagination={{ pageSize: 10 }}
                    rowSelection={{ ...rowSelection }}
                />
            </div>
        );
    }
}

export default connect(state => {
    return {
        fetchingEcs: state.loading.effects['ecs/startServer'],
        fetchingServers: state.loading.effects['ecs/update'],
        fetchingFlavors: state.loading.effects['flavor/update'],
        stopServer: state.loading.effects['ecs/stopServer'],
        ecs: state.ecs,
        pollingServer: state.loading.effects['ecs/create'],
        flavorList: state.flavor,
        imageList: state.ims,
    };
})(ECSElementsTable);
