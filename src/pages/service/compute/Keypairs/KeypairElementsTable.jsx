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
import KeypairDetails from './KeypairDetails';
import styles from '../../ElementsTable.css';

class KeypairElementsTable extends React.Component {
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
                    title: 'Finger Print',
                    dataIndex: 'fingerprint',
                    key: 'fingerprint',
                    width: 150,
                },
            ],

            data: [],

            hasData: true,
        };
    }
    displayKeypairData() {
        if (typeof this.props.keypairsList !== 'undefined') {
            if (this.state.data.length !== 0) {
                this.setState({ data: [] });
            }

            for (var i = 0; i < this.props.keypairsList['length']; i++) {
                this.state.data.push({
                    key: this.props.keypairsList[i]['id'],
                    name: this.props.keypairsList[i]['name'],
                    fingerprint: this.props.keypairsList[i]['fingerprint'],
                    description: (
                        <KeypairDetails
                            eachKeypairDetail={
                                this.props.keypairsList[i]['description']
                            }
                        />
                    ),
                });
            }
        }
    }

    onRow(record, rowIndex) {
        const { dispatch } = this.props;
        return {
            onClick(e) {
                e.preventDefault();

                dispatch({
                    type: 'keypair/selectedRows',
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
            type: 'keypair/selectedRows',
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
            type: 'keypair/sdAllRows',
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

        const data = this.props.keypairsList.map(listItem => {
            return {
                key: listItem['id'],
                id: listItem['id'],
                name: listItem['name'],
                fingerprint: listItem['fingerprint'],
                description: (
                    <KeypairDetails
                        publickey={listItem['public_key']}
                        eachKeypairDetail={listItem['description']}
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
                    expandedRowRender={record => record.description}
                />
            </div>
        );
    }
}

export default KeypairElementsTable;
