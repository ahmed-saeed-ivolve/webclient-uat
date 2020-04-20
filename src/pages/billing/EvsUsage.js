import React,{Component} from 'react';
import { Typography,Row,Col,Collapse,Table } from 'antd';
const { Panel } = Collapse;
const { Title } = Typography;

export default class EvsUsage extends Component {
    render(){
        const columns = [
            {
              title: 'Volume Name',
              dataIndex: 'name',
              key: 'name',
            },
            {
              title: 'Usage',
              dataIndex: 'usage',
              key: 'usage',
            },
           
           
           
           
           
          ];
          
          const data = [
            {
              key: 1,
              name:<span style={{fontSize: '18px',fontFamily: 'sans-serif'}}> Pro Test Volume </span>,
              usage: <span style={{fontSize: '18px',fontFamily: 'sans-serif'}}> 7 hrs </span>,
           

              children: [
                {
                  name: '50 GB',
                  key: 11,
                  usage:<span style={{fontSize: '18px',fontFamily: 'sans-serif'}}> 3 hrs </span>,
               
                },
                {
                  name: '62 GB',
                  key: 12,
                 
                  usage: <span style={{fontSize: '18px',fontFamily: 'sans-serif'}}> 4 hrs </span>,
               

                },
               
               
               
               
               
               
              ],
     
            },
            {
              key: 2,
              name: <span style={{fontSize: '18px',fontFamily: 'sans-serif'}}> Backup Storage </span>,
              usage: <span style={{fontSize: '18px',fontFamily: 'sans-serif'}}> 3 hrs </span>,
              total: `3 hrs`,

              children: [
                {
                  name: '120 GB',
                  key: 22,
                  total: `3 hrs`,
                  usage: <span style={{fontSize: '18px',fontFamily: 'sans-serif'}}> 1 hrs </span>,
                },
                {
                  name: '100 GB',
                  key: 23,
                  total: `2 hrs`,
                  usage: <span style={{fontSize: '18px',fontFamily: 'sans-serif'}}> 2 hrs </span>
                },
               
               
               
               
               
               
              ],
     
            }

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
                  <Table columns={columns}  dataSource={data} />
            </div>
        )
    }
}