import React, { Component } from 'react';
import { Row, Col, Divider, Avatar, message, Timeline } from 'antd';
import styles from './ItemDetails.less';
import items from './maketItems.js';
import { Typography, Button } from 'antd';
import { Card } from 'antd';
import { Link, router } from 'umi';
import { Table, Tag } from 'antd';

import { connect } from 'dva';

const columns = [
  {
    title: 'Package',
    dataIndex: 'package',
    key: 'package',
    render: text => <a>{text}</a>,
  },
  {
    title: 'Version',
    dataIndex: 'version',
    key: 'version',
  },
  {
    title: 'License',
    dataIndex: 'licencse',
    key: 'licencse',
  },
];

const data = [
  {
    key: '1',
    package: 'WordPress',
    version: '4.9.8',
    licencse: 'GPL 2',
  },
  {
    key: '2',
    package: 'Apcahe',
    version: '2.4.29',
    licencse: 'Apache2',
  },
  {
    key: '3',
    package: 'MySQL',
    version: '5.7.23',
    licencse: 'GPL 2',
  },
];
const { Title } = Typography;

class ItemDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      details: {},
    };
  }

  componentDidMount() {
    this.setState(state => ({
      ...state,
      details: items.filter(e => e.title == this.props.match.params.id)[0],
    }));
  }

  render() {
    return (
      <div>
        <Row type={'flex'} justify={'center'} className={styles['mainDetailsBox']}>
          <Col style={{ background: `#fff` }} xxl={16} xl={16} lg={16} md={20} sm={24} xs={24}>
            <Row
              className={styles['headerDiv']}
              align={'middle'}
              style={{
                padding: '34px',
                borderBottom: '1px solid #e5e5e5',
              }}
            >
              <Col
                xxl={3}
                xl={3}
                lg={3}
                md={3}
                sm={3}
                xs={3}
                style={{
                  backgroundImage: '../../assets/design.png',
                }}
              >
                <div style={{ height: '65.5px', width: '65.5px' }}>
                  <Avatar
                    style={{ width: '100%', height: '100%' }}
                    src={this.state.details.avatar}
                  ></Avatar>
                </div>
              </Col>

              <Col xxl={10} xl={10} lg={10} md={10} sm={13} xs={13}>
                <h3 className={styles['heading']}>{this.state.details.title}</h3>
                <h3 style={{ color: 'gray', marginTop: `10px` }}>
                  {this.state.details.description}
                </h3>

                <Button
                  onClick={e => {
                    e.preventDefault();
                    if (this.state.details['image_id']) {
                      this.props.dispatch({
                        type: 'createECS/updateFormData',
                      });

                      router.push(`/service/compute/elastic-cloud-services/create`);
                    } else {
                      message.info(`We're working on this`);
                    }
                  }}
                  style={{ maxWidth: '150px', marginTop: '30px' }}
                  type="primary"
                >
                  Launch
                </Button>
              </Col>
            </Row>
            <Row style={{ backgroundColor: 'white' }} type={'flex'} span={24}>
              <Col
                xxl={18}
                xl={18}
                lg={17}
                md={16}
                sm={23}
                xs={23}
                style={{ padding: '40px 40px 40px 40px' }}
              >
                <Row>
                  <Col span={20}>
                    <h1 style={{ fontSize: '1.6em' }}>Description</h1>
                    <p style={{ fontSize: '1.3em', color: 'gray' }}>
                      {this.state.details.description}
                      Over 60 million people choose WordPress to power their websites and blogs.
                      Born out of a desire for an elegant personal publishing system built on PHP
                      and MySQL, its potential has evolved to a full content management system.
                    </p>
                  </Col>
                </Row>
                <br />
                <br />
                <Row>
                  <Col></Col>
                </Row>
                <br />
                <h1 style={{ fontSize: '1.6em' }}>Guide For Deployment</h1>
                <br />
                <Timeline>
                  <Timeline.Item>Click on "Launch" button</Timeline.Item>
                  <Timeline.Item>You will be redirected to the create instace page</Timeline.Item>
                  <Timeline.Item>Select the Billing Mode, Region And Zone</Timeline.Item>
                  <Timeline.Item>Select the flavour</Timeline.Item>
                </Timeline>
                <br />
                <Row>
                  <Col span={20}>
                    <div style={{ padding: '' }}>
                      <h1 style={{ fontSize: '1.6em', lineHeight: `1.7em` }}>Softwares Included</h1>
                      <Table
                        size="small"
                        pagination={false}
                        columns={columns}
                        dataSource={data}
                      />{' '}
                    </div>
                  </Col>
                </Row>
              </Col>{' '}
              <br />
              <Col xxl={6} xl={6} lg={7} md={8} sm={0} xs={0} style={{ padding: '45px 10px' }}>
                <h2 style={{ fontSize: '1.6em' }}>Support Details</h2>
                <h4>
                  <b>Version</b> 1.0.0
                </h4>
                <h4>
                  <b>By</b> 1.0.0
                </h4>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}

export default connect(state => {
  return {
    createECS: state.createECS,
  };
})(ItemDetails);
