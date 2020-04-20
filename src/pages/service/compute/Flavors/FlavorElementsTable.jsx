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
import FlavorDetails from './FlavorDetails';
import styles from '../../ElementsTable.css';

class FlavorElementsTable extends React.Component {
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
                    title: 'Virtual Processors',
                    dataIndex: 'vcpus',
                    key: 'vpus',
                    width: 150,
                },
                {
                    title: 'Memory',
                    dataIndex: 'ram',
                    key: 'ram',
                    width: 150,
                },
                {
                    title: 'Disk',
                    dataIndex: 'disk',
                    key: 'disk',
                    width: 150,
                },
            ],

            data: [],

            hasData: true,
        };
    }
    displayFlavorData() {
        if (typeof this.props.flavorsList !== 'undefined') {
            if (this.state.data.length !== 0) {
                this.setState({ data: [] });
            }

            for (var i = 0; i < this.props.flavorsList['length']; i++) {
                this.state.data.push({
                    key: this.props.flavorsList[i]['uuid'],
                    name: this.props.flavorsList[i]['name'],
                    vcpus: this.props.flavorsList[i]['vcpus'],
                    ram: this.props.flavorsList[i]['ram'],
                    disk: this.props.flavorsList[i]['disk'],
                    ephemeral: this.props.flavorsList[i]['ephemeral_gb'],
                    swap: this.props.flavorsList[i]['swap'],
                    rxtx: this.props.flavorsList[i]['rxtx_factor'],
                    description: (
                        <FlavorDetails
                            eachFlavorDetail={
                                this.props.flavorsList[i]['description']
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
                if (e.target.innerHTML !== record.name) {
                    dispatch({
                        type: 'flavor/selectedRows',
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
            type: 'flavor/selectedRows',
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
            type: 'flavor/sdAllRows',
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
        const data = this.props.flavorsList.map(listItem => {
            return {
                key: listItem['id'],
                id: listItem['id'],
                name: listItem['name'],
                vcpus: listItem['vcpus'],
                ram: listItem['ram'] + ' GB',
                disk: listItem['disk'] + ' GB',
                ephemeral: listItem['ephemeral_gb'],
                swap: listItem['swap'],
                rxtx: listItem['rxtx_factor'],
                description: (
                    <FlavorDetails eachFlavorDetail={listItem['description']} />
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
                />
            </div>
        );
    }
}

export default FlavorElementsTable;
