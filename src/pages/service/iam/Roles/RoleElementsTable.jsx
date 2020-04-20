import React from 'react';
import {
    Table,
    Icon,
    Switch,
    Radio,
    Form,
    Divider,
    Dropdown,
    Button,
    Typography,
} from 'antd';
//import RoleDetails from './RoleDetails';
import styles from '../../ElementsTable.css';
import { connect } from 'dva';
class RoleElementsTable extends React.Component {
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
        selectedRowKeys: [],

        columns: [
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                width: 150,
            },
            {
                title: 'id',
                dataIndex: 'id',
                key: 'id',
                width: 150,
                render: data => <Typography.Text> {data} </Typography.Text>,
            },
            // { 
            //     title: 'Edit Role',
            //     dataIndex: 'edit_role',
            //     key: 'edit_role',
            //     width: 150,
            //     render: data=>(
            //         <Button
            //         size="small"
            //         type="primary"
            //         style={{
            //             fontFamily: `Open Sans`,
            //             fontWeight: `600`,
            //             height: '35px',
            //         }}
            //         // onClick={() =>
            //         //     this.extendVolume(
            //         //         listItem['id'],
            //         //         listItem['status']
            //         //     )
            //         // }
            //     >
            //        Edit Role
            //     </Button>
            //     )
            // }
        ],

        data: [],
        hasData: true,
    };
    }
    // displayRoleData() {
    //     if (typeof this.props.RoleList !== 'undefined') {
    //         if (this.state.data.length !== 0) {
    //             this.setState({ data: [] });
    //         }

    //         for (var i in this.props.RoleList[0]) {
    //             this.state.data.push({
    //                 key: this.props.RoleList[i]['uuid'],
    //                 name: this.props.RoleList[i]['name'],
    //                 status: this.props.RoleList[i]['status'],
    //                 cidrblock: this.props.RoleList[i]['cidr'],
    //                 subnets: this.props.RoleList[i]['subnet_count'],
    //                 adminstate: this.props.RoleList[i]['admin_state_up'],
    //                 isshared: this.props.RoleList[i]['shared'],
    //                 price: this.props.RoleList[i]['architecture'],
    //                 description: (
    //                     <RoleDetails
    //                         eachRoleDetail={
    //                             this.props.RoleList[i]['description']
    //                         }
    //                     />
    //                 ),
    //             });
    //         }
    //     }
    // }


    // onSelectChange(selectedRowKeys) {
    //     this.setState(state => {
    //         return { ...state, selectedRowKeys };
    //     });
    // }
    onRow(record, rowIndex) {
        const { dispatch } = this.props;
        return {
            onClick(e) {
                e.preventDefault();
                dispatch({
                    type: 'roles/selectedRows',
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
            type: 'roles/selectedRows',
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
            type: 'roles/sdAllRows',
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
//  const { role, list } = this.props.role;
  

        const data = this.props.RoleList.map(listItem => {
            return {
                key: listItem['id'],
                id: listItem['id'],
                name: listItem['name'],
            };
        });

        return (
            <div>
                <Table
                    size="small"
                    //className={styles.name}
                    loading={this.props.loading}
                    // expandRowByClick
                    // {...this.state}
                    columns={this.state.columns}
                    dataSource={data}
                    pagination={{ pageSize: 10 }}
                    //rowSelection={{...rowSelection}}
                />
            </div>
        );
    }
}

export default connect(state=>{
    return{
        loadingRoles: state.loading.effects['roles/update'],
        roles:state.roles,
    }
})(RoleElementsTable);
