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
    Typography,
    Input,
    Button,
} from 'antd';
import { Link } from 'umi';
import VPCDetails from './VPCDetails';
import styles from '../../ElementsTable.css';
import Highlighter from 'react-highlight-words';

Icon.setTwoToneColor('#4c98bf');

class VPCElementsTable extends React.Component {
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
                    ...this.getColumnSearchProps('name'),
                },

                {
                    title: 'Subnet',
                    dataIndex: 'subnet',
                    key: 'subnet',
                },

                {
                    title: 'Status',
                    dataIndex: 'status',
                    key: 'status',
                },

                {
                    title: 'shared',
                    dataIndex: 'isshared',
                    key: 'isshared',

                    render: text => (
                        <Typography> {text === true ? 'yes' : 'No'}</Typography>
                    ),
                },

                {
                    title: 'Availability Zones',
                    dataIndex: 'availabilityZones',
                    key: 'availabilityZones',
                    width: 150,
                    render: text =>
                        text.length < 1 ? (
                            <Typography> - </Typography>
                        ) : (
                            <Typography> {text[0]} </Typography>
                        ),
                },

                {
                    title: 'External',
                    dataIndex: 'external',
                    key: 'external',

                    render: text =>
                        text === true ? (
                            <Typography> yes </Typography>
                        ) : (
                            <Typography> No </Typography>
                        ),
                },
                {
                    title: 'Admin State',
                    dataIndex: 'adminState',
                    key: 'adminState',
                    width: 150,
                    render: text =>
                        text === true ? (
                            <Typography> Up </Typography>
                        ) : (
                            <Typography> No </Typography>
                        ),
                },
            ],

            data: [],
            hasData: true,
        };
    }

    onRow(record, rowIndex) {
        const { dispatch } = this.props;
        return {
            onClick(e) {
                e.preventDefault();
                dispatch({
                    type: 'vpc/selectedRows',
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
            type: 'vpc/selectedRows',
            payload: [
                {
                    ...record,
                },
            ],
        });
    }

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
                    <Link to={`${this.props.describeNetworkLink}${record.id}`}>
                        <Highlighter
                            highlightStyle={{
                                backgroundColor: '#ffc069',
                                padding: 0,
                            }}
                            searchWords={[this.state.searchText]}
                            autoEscape
                            textToHighlight={text}
                        />
                    </Link>
                </div>
            );
        },
    });

    onSelectAll(value, records) {
        const { dispatch } = this.props;

        dispatch({
            type: 'vpc/sdAllRows',
            payload: {
                records,
                value,
            },
        });
    }

    vpcData() {
        const data =
            this.props.VPCList?.length !== 0
                ? this.props.VPCList.map(listItem => {
                      return {
                          key: listItem['id'],
                          id: listItem['id'],
                          availabilityZones: listItem['availability_zones'],
                          name: listItem['name'],
                          status: listItem['status'],
                          cidrblock:
                              this.props.SubnetList.filter(
                                  subnetItem =>
                                      subnetItem.network_id === listItem['id']
                              ).length > 0
                                  ? this.props.SubnetList.filter(
                                        subnetItem =>
                                            subnetItem.network_id ===
                                            listItem['id']
                                    )[0]['cidr']
                                  : '-',
                          subnet:
                              this.props.SubnetList.filter(
                                  subnetItem =>
                                      subnetItem.network_id === listItem['id']
                              ).length > 0
                                  ? this.props.SubnetList.filter(
                                        subnetItem =>
                                            subnetItem.network_id ===
                                            listItem['id']
                                    )[0]['name']
                                  : '-',
                          isshared: listItem['is_shared'],
                          external: listItem['is_router_external'],
                          adminState: listItem['is_admin_state_up'],
                          price: listItem['architecture'],
                      };
                  })
                : [];
        return data;
    }

    render() {
        const { state } = this;
        const rowSelection = {
            selectedRowKeys: this.props.selectedRowKeys,
            onSelect: this.onSelectClick,
            onSelectAll: this.onSelectAll,
        };

        return (
            <div>
                <Table
                    size="small"
                    loading={this.props.loading}
                    columns={this.state.columns}
                    dataSource={this.vpcData()}
                    pagination={{ pageSize: 10 }}
                    onRow={this.onRow}
                    rowSelection={{ ...rowSelection }}
                />
            </div>
        );
    }
}

export default VPCElementsTable;
