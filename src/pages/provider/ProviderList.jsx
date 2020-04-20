import React, { Component } from 'react';
import { Card, Col, Row, Icon, Avatar, Menu, Dropdown, Modal, Table } from 'antd';
import styles from './ProviderDetailModal.css';

const { Meta } = Card;
class ProviderList extends Component {
  state = {
    visible: false,

    columns: [
      {
        dataIndex: 'name',
        render: text => <a>{text}</a>,
      },
      {
        dataIndex: 'address',
      },
    ],
    data: [
      {
        key: '1',
        name: 'User Name',
        address: 'New York No. 1 Lake Park',
      },
      {
        key: '2',
        name: 'Project Name',
        address: 'London No. 1 Lake Park',
      },
      {
        key: '3',
        name: 'Domain Name',
        address: 'Sidney No. 1 Lake Park',
      },
      {
        key: '4',
        name: 'Auth URL',
        address: 'Sidney No. 1 Lake Park',
      },
      {
        key: '5',
        name: 'Tenant Name',
        address: 'Sidney No. 1 Lake Park',
      },
    ],
  };

  info() {
    Modal.info({
      width: '1000px',
      title: 'Provider Details',
      content: (
        <div style={{ marginTop: '30px' }}>
          <Table
            className={styles.name}
            columns={this.state.columns}
            dataSource={this.state.data}
            pagination={false}
          />
        </div>
      ),
      onOk() {},
    });
  }

  render() {
    const menu = (
      <Menu>
        <Menu.Item key="0">
          <a href="">Test Connection</a>
        </Menu.Item>
        <Menu.Item key="1">
          <a href="">Attach/DeAttach Tenants</a>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="3">Delete Provider</Menu.Item>
      </Menu>
    );
    return (
      <div style={{ background: '#ECECEC', padding: '30px' }}>
        <Row gutter={40}>
          <Col span={6} style={{ paddingBottom: '20px' }}>
            <Card
              style={{ BorderRadiusTopleft: '18px', BorderRadiusTopright: '18px' }}
              cover={
                <img
                  className="img-rounded-provider"
                  style={{ padding: '20px 80px 20px 80px' }}
                  alt="example"
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/OpenStack%C2%AE_Logo_2016.svg/1200px-OpenStack%C2%AE_Logo_2016.svg.png"
                />
              }
              actions={[
                <Icon type="setting" key="setting" onClick={this.info.bind(this)} />,
                <Dropdown overlay={menu} trigger={['click']}>
                  <Icon type="ellipsis" key="ellipsis" />
                </Dropdown>,
              ]}
            >
              <p style={{ marginBottom: '10px' }}>Name : admin</p>
              <p style={{ marginBottom: '10px' }}>Keystone : http://192.168.24.8</p>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default ProviderList;
