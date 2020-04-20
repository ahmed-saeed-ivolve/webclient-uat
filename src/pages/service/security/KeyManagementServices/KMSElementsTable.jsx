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
import router from 'umi/router';
import { connect } from 'dva';
import { Link } from 'umi';
import Highlighter from 'react-highlight-words';
import './KMSElementsTable.less';
import { isEmptyStatement } from '@babel/types';
import moment from 'moment';

const antIcon = (
    <Icon
        type="loading"
        style={{ fontSize: 15, opacity: `0.7`, marginRight: '8px' }}
        spin
    />
);

class KMSElementsTable extends React.Component {
    constructor(props) {
        super(props);
        this.onRow = this.onRow.bind(this);
        this.onSelectClick = this.onSelectClick.bind(this);
        this.onSelectAll = this.onSelectAll.bind(this);
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
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
            },
        ];
    }

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
                    <Link to={`${this.props.describeInstanceLink}${record.id}`}>
                        <Highlighter
                            highlightStyle={{
                                backgroundColor: '#ffc069',
                                padding: 0,
                            }}
                            searchWords={[this.state.searchText]}
                            autoEscape
                            textToHighlight={text ? text : 'undefined'}
                        />
                    </Link>
                </div>
            );
        },
    });

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
                    e.target.innerText !== 'Actions' &&
                    e.target.innerText !== 'Enable' &&
                    e.target.innerText !== 'Disable'
                )
                    dispatch({
                        type: 'kms/selectedRows',
                        payload: [
                            {
                                ...record,
                            },
                        ],
                    });
            },
        };
    }

    onSelectClick(record, state) {
        const { dispatch } = this.props;

        dispatch({
            type: 'kms/selectedRows',
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
            type: 'kms/sdAllRows',
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
        const data = this.props.kmsList.map(listItem => {
            return {
                key: listItem['id'],
                id: listItem['id'],
                name: listItem['name'],
                status: listItem['status'] === 'ACTIVE' ? 'Enable' : 'Disable',
            };
        });

        return (
            <div>
                <Table
                    size="small"
                    showHeader={true}
                    bordered={false}
                    loading={this.props.fetchingKMS}
                    columns={this.columns}
                    dataSource={data}
                    pagination={{ pageSize: 10 }}
                    onRow={this.onRow}
                    rowSelection={{ ...rowSelection }}
                />
            </div>
        );
    }
}

export default connect(state => {
    return {
        fetchingKMS: state.loading.effects['kms/update'],
        kms: state.kms,
    };
})(KMSElementsTable);
