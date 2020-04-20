import React,{Component} from 'react';
import { Typography,Row,Col,Collapse,Table } from 'antd';
const { Panel } = Collapse;
const { Title } = Typography;

export default class NetworkUsage extends Component {
    render(){
        const columns = [
            {
              title: 'Network Name',
              dataIndex: 'name',
              key: 'name',
            },
            {
              title: 'Available',
              dataIndex: 'available',
              key: 'available',
            },
            {
              title: 'Inuse',
              dataIndex: 'inuse',
              key: 'inuse',
            },
            {
              title: 'Total',
              dataIndex: 'total',
              key: 'total',
            },
          ];
          
          const data = [
            {
              key: 1,
              name: 'network central',
              children: [
                {
                  key: 11,
                  total: 10
                },
                {
                  key: 12,
                  total: 15
                }
              ],
     
            },
            {
              key: 2,
              name: 'network external',
              children: [
                {
                  key: 22,
                  total: 10
                },
                {
                  key: 23,
                  total: 15
                }
              ],
     
            },
            {
              key: 3,
              name: 'internal network',
              children: [
                {
                  key: 33,
                  total: 10
                },
                {
                  key: 43,
                  total: 15
                }
              ],
     
            },

          ];
          
         
          const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
             
            },
            onSelect: (record, selected, selectedRows) => {
             
            },
            onSelectAll: (selected, selectedRows, changeRows) => {
             
            },
          };
          
        return(
            <div> 
                  <Table columns={columns} rowSelection={rowSelection} dataSource={data} />
            </div>
        )
    }
}