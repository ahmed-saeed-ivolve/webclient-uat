import React, { Component } from 'react';
import {
  Form,
  Icon,
  Input,
  Button,
  Checkbox,
  Tag,
  Table,
  Menu,
  Row,
  Col,
  Divider,
  Skeleton,
} from 'antd';
import firebase from './../../firebase';
import { Chart, Axis, Tooltip, Geom } from 'bizcharts';
const { Search } = Input;

export default class Invoice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      invoices: [],
      keys: [],
      list: [],
      show: false,
      filteredInvoice: [],
    };
  }

  componentDidMount() {
    var data;
    let newdata = [];

    (async function(x) {
      try {
        await firebase
          .firestore()
          ?.collection(`invoices`)
          ?.get()
          .then(e => {
            data = e.docs.forEach(e => {
              newdata.push(e.data().invoices);
            });
          });
      } catch (e) {}
    })(1000).then(v => {
      this.setState({ invoices: newdata });
      const { invoices } = this.state;
      var list = [];

      for (var i = 0; i < invoices.length; i++) {
        for (var j = 0; j <= invoices[i].length; j++) {
          for (var property in invoices[i][j]) {
            list.push(invoices[i][j][property]);
            this.setState({ list, show: !this.state.show });
          }
        }
      }
    });
  }

  filterInvoices(e) {
    const { list } = this.state;
    let newlist;

    const filteredInvoice = list.filter(item => item.name.toLowerCase() === e.toLowerCase());
    this.setState({
      filteredInvoice,
    });
  }

  render() {
    const { list, show, filteredInvoice } = this.state;
    this.columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      },

      {
        title: 'startdate',
        dataIndex: 'startDate',
        key: 'startDate',
      },

      {
        title: 'endDate',
        dataIndex: 'endDate',
        key: 'endDate',
      },
    ];

    const data = this.state.list.map(listItem => {
      return {
        name: listItem['name'],
        startDate: listItem['startDate'],
        endDate: listItem['endDate'],
        downloadUrl: listItem['downloadUrl'],
      };
    });

    return (
      <Row style={{ paddingTop: '30px', paddingLeft: '20px' }}>
        <Search
          style={{ width: '20em' }}
          placeholder="input search text"
          enterButton="Search"
          size="default"
          onSearch={this.filterInvoices.bind(this)}
        />
        <Divider />

        <Col lg={20} push={2}>
          {this.state.list.length > 1 ? (
            <div>
              {filteredInvoice.length < 1 ? (
                <Table
                  size="small"
                  columns={this.columns}
                  dataSource={data}
                  onRow={this.onRow}
                  expandedRowRender={record => (
                    <p style={{ margin: 0 }}>
                      {' '}
                      url :
                      <a href={record.downloadUrl} target="_blank">
                        {' '}
                        {record.downloadUrl}{' '}
                      </a>
                    </p>
                  )}
                />
              ) : (
                <Table
                  size="small"
                  columns={this.columns}
                  dataSource={filteredInvoice}
                  onRow={this.onRow}
                  expandedRowRender={record => (
                    <p style={{ margin: 0 }}>
                      {' '}
                      url :
                      <a href={record.downloadUrl} target="_blank">
                        {' '}
                        {record.downloadUrl}{' '}
                      </a>
                    </p>
                  )}
                />
              )}
            </div>
          ) : (
            <Skeleton active />
          )}
        </Col>
      </Row>
    );
  }
}
