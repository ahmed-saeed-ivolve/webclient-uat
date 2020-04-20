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
import FloatingIPDetails from './FloatingIPDetails';
import styles from '../../ElementsTable.css';

class FloatingIPElementsTable extends React.Component {
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
                    title: 'IP Address',
                    dataIndex: 'floatingipaddress',
                    key: 'floatingipaddress',
                    width: 150,
                },

                {
                    title: 'Status',
                    dataIndex: 'status',
                    key: 'status',
                    width: 150,
                },
            ],

            data: [],
            hasData: true,
        };
    }
    displayFloatingIpData() {
        if (typeof this.props.FloatingIpList !== 'undefined') {
            if (this.state.data.length !== 0) {
                this.setState({ data: [] });
            }

            for (var i = 0; i < this.props.FloatingIpList['length']; i++) {
                this.state.data.push({
                    key: this.props.FloatingIpList[i]['uuid'],
                    floatingipaddress: this.props.FloatingIpList[i][
                        'floating_ip_address'
                    ],
                    floating_network_id: this.props.FloatingIpList[i][
                        'floating_network_id'
                    ],
                    description: (
                        <FloatingIPDetails
                            eachFloatingIpDetail={
                                this.props.FloatingIpList[i]['description']
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
                    type: 'floatingip/selectedRows',
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
            type: 'floatingip/selectedRows',
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
            type: 'floatingip/sdAllRows',
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

        const { selectedRowKeys } = this.state;
        const data = this.props.FloatingIpList.map(listItem => {
            return {
                key: listItem['id'],
                descriptions: listItem.description,
                status: listItem['status'],
                id: listItem['id'],
                floatingipaddress: listItem['floating_ip_address'],

                description: (
                    <FloatingIPDetails
                        eachFloatingIpDetail={listItem['description']}
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

export default FloatingIPElementsTable;
