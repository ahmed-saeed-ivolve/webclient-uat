
import React, { PureComponent } from 'react';
import { Row, Col, Typography, Divider, Timeline, Tabs, Form, Input, Radio, Select, Button, Table } from 'antd'
import ImageDisplayBox from '@/components/InstanceImages/ImageDisplayBox'
import { connect } from 'dva';

class Finalize extends PureComponent {


    render() {
        const { getFieldDecorator } = this.props.form;
        const table_dataSource = Object.keys(this.props.dataSource).map((key) => ({ key, value: Array.isArray(this.props.dataSource[key]) ? this.props.dataSource[key].join("/") : `${this.props.dataSource[key]}` }))
       
       
       
       
       
       
       
       
       
       
       
       

       
       
       
       
       
       



       
       

       
       

       

       
       
       
       
       




       
       

       
       


       
       
       
       

       
       



       
       
        const table_columns = [{
            title: '',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: '',
            dataIndex: 'value',
            key: 'value',
        }]
        return (
            <React.Fragment>
                <Table showHeader={false} size="small" pagination={false} dataSource={table_dataSource} columns={table_columns} />
            </React.Fragment>
        );
    }
}
export default Form.create()(Finalize);















