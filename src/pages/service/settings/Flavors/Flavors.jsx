import React, { Component } from 'react';
import {
    Form,
    Icon,
    Input,
    Button,
    Checkbox,
    Card,
    Modal,
    Row,
    Statistic,
    Typography,
    List,
    Col,
    Spin,
    Table,
} from 'antd';
import { connect } from 'dva';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import request from 'umi-request';
import UpdateFlavor from './UpdateFlavor';
import CopyBlock from '@/components/CopyBlock';
import SearchFlavor from './SearchFlavor';
import { Link } from 'umi';
const ButtonGroup = Button.Group;

class FlavorIam extends Component {
    constructor() {
        super();
        this.state = {
            flavors: [],
            update: true,
            filteredArray: [],
            search: '',
            mysearches: true,
            value: '',
            showFiltered: false,
            loading_ids: [],
            searchText: '',
            searchedColumn: '',
        };
    }

    async updateFlavor(flavor) {
        this.setState({
            flavor: flavor.update.flavor,
        });

        await this.props.dispatch({
            type: 'flavor/singleFlavor',
            payload: { id: flavor.update._id, type: 'add' },
        });
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
                    {record.vm_state !== 'error' &&
                    record.vm_state !== 'building' &&
                    record.vm_state !== null &&
                    record.vm_state !== 'resizing' ? (
                        <Highlighter
                            highlightStyle={{
                                backgroundColor: '#ffc069',
                                padding: 0,
                            }}
                            searchWords={[this.state.searchText]}
                            autoEscape
                            textToHighlight={text.toString()}
                        />
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

    render() {
        const { Search } = Input;
        const { value } = this.state;
        const { getFieldDecorator } = this.props.form;

        const columns = [
            {
                title: 'Name',
                dataIndex: 'name',
                width: 150,
                ...this.getColumnSearchProps('name'),
            },
            {
                title: 'Type',
                dataIndex: 'com',
                width: 100,
            },
            {
                title: 'Mode',
                dataIndex: 'mod',
                width: 100,
            },
            {
                title: 'VCPUs',
                dataIndex: 'vcpu',
                width: 100,
            },
            {
                title: 'Ram',
                dataIndex: 'ram',
                width: 100,
            },
            {
                title: 'Price',
                dataIndex: 'price',
                width: 150,
            },
            {
                title: 'Update',
                key: 'update',
                width: 150,

                render: flavor => {
                    return (
                        <Button
                            type="primary"
                            loading={
                                this.props?.flavor?.loading.includes(
                                    flavor.update['_id']
                                )
                                    ? true
                                    : false
                            }
                            variant="info"
                            onClick={this.updateFlavor.bind(this, flavor)}
                        >
                            Update
                        </Button>
                    );
                },
            },
        ];

        const data = this.props?.listDb?.map(listItem => {
            return {
                name: listItem['flavor']['name'],
                vcpu: listItem['flavor']['vcpu'],
                ram: listItem['flavor']['ram'],
                price: listItem['flavor']['price'],
                mod: listItem['flavor']['mod'],
                com: listItem['flavor']['com'],
                update: listItem,
            };
        });

        return (
            <React.Fragment>
                <div
                    style={{
                        marginBottom: `0`,
                        backgroundColor: `#fff`,
                        padding: `34px`,
                    }}
                >
                    <Row style={{ marginBottom: `20px` }}>
                        <Col span={9}></Col>
                        <Col span={15}>
                            <div style={{ textAlign: `right` }}>
                                <ButtonGroup>
                                    <Button
                                        style={{ float: 'right' }}
                                        icon="redo"
                                        onClick={() => {
                                            this.props.dispatch({
                                                type: 'flavor/fetchFlavors',
                                            });
                                        }}
                                    >
                                        Refresh
                                    </Button>
                                </ButtonGroup>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Table
                                loading={this.props?.fetchFlavors}
                                style={{ padding: '20px' }}
                                columns={columns}
                                dataSource={data}
                                pagination={{ pageSize: 50 }}
                            />

                            <UpdateFlavor flavor={this.state.flavor} />
                        </Col>
                    </Row>
                </div>
            </React.Fragment>
        );
    }
}

export default connect(state => {
    return {
        flavor: state.flavor,
        listDb: state.flavor.listDb,
        showmodal: state.flavor.showmodal,
        fetchFlavors: state.loading.effects['flavor/fetchFlavors'],
        singleFlavor: state.loading.effects['flavor/singleFlavor'],
    };
})(Form.create()(FlavorIam));
