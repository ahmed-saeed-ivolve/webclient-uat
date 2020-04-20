import React, { PureComponent } from 'react';
import { Row, Col, Card, Table, Statistic } from 'antd';
import { DatePicker } from 'antd';
import styles from './SpendingSummary.less';
const { MonthPicker } = DatePicker;
import { Link } from 'umi';
import moment from 'moment';
import { Pie } from '../dashboard/analysis/components/Charts';

import { connect } from 'dva';
const spendingByBillingMedthodColumns = [
  {
    title: 'Billing Method',
    dataIndex: 'Billing_Method',
    key: 'Billing_Method',
  },
  {
    title: 'Orignal Cost',
    dataIndex: 'Orignal_Cost',
    key: 'Orignal_Cost',
  },
  {
    title: 'Discount',
    dataIndex: 'Discount',
    key: 'Discount',
  },
  {
    title: 'Coupon',
    dataIndex: 'Coupon',
    key: 'Coupon',
  },
  {
    title: 'Round Down Discount',
    dataIndex: 'Round_Down_Discount',
    key: 'Round_Down_Discount',
  },
  {
    title: 'Pretax Cost',
    dataIndex: 'Pretax_Cost',
    key: 'Pretax_Cost',
  },
  {
    title: 'Tax',
    dataIndex: 'Tax',
    key: 'Tax',
  },
  {
    title: 'Total',
    dataIndex: 'Total',
    key: 'Total',
  },
];

const spendingByProductNameColumns = [
  {
    title: 'Product Name',
    dataIndex: 'Product_Name',
    key: 'Product_Name',
  },
  {
    title: 'Billing Method',
    dataIndex: 'Billing_Method',
    key: 'Billing_Method',
  },
  {
    title: 'Orignal Cost',
    dataIndex: 'Orignal_Cost',
    key: 'Orignal_Cost',
  },
  {
    title: 'Discount',
    dataIndex: 'Discount',
    key: 'Discount',
  },
  {
    title: 'Coupon',
    dataIndex: 'Coupon',
    key: 'Coupon',
  },
  {
    title: 'Round Down Discount',
    dataIndex: 'Round_Down_Discount',
    key: 'Round_Down_Discount',
  },
  {
    title: 'Pretax Cost',
    dataIndex: 'Pretax_Cost',
    key: 'Pretax_Cost',
  },
  {
    title: 'Tax',
    dataIndex: 'Tax',
    key: 'Tax',
  },
  {
    title: 'Total',
    dataIndex: 'Total',
    key: 'Total',
  },
];

@connect(({ global, loading }) => {
  return {
    isLoadingData: loading.effects['global/fetchSpends'],
    global: { ...global },
  };
})
export default class SpendingSummary extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <Row type={'flex'} style={{ padding: '34px' }}>
          <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
            <Row type={'flex'}>
              <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
                <div className={styles['card']}>
                  <Card
                    type="inner"
                    title="Spending Overview"
                    extra={'Monthly Spending Alert:OFF Setting >'}
                    style={{ width: '100%' }}
                  >
                    <Row>
                      <Col xxl={8} xl={8} lg={8} md={15} sm={24} xs={24}>
                        <div style={{ marginBottom: '20px' }}>
                          <p className={styles['monthPera']}>Month</p>
                          <MonthPicker
                            onChange={this.handleChange}
                            format="MMM-YYYY"
                            defaultValue={moment(
                              new Date()
                                .toLocaleString('default', { month: 'long' })
                                .toString()
                                .concat(' ' + new Date().getFullYear()),
                            )}
                          ></MonthPicker>
                        </div>
                        <Statistic
                          valueStyle={{ fontSize: '1.15em' }}
                          style={{ marginBottom: '40px' }}
                          title="Total Spending"
                          value={0.0}
                        />
                      </Col>
                      <Col xxl={8} xl={8} lg={8} md={15} sm={24} xs={24}></Col>
                      <Col xxl={8} xl={8} lg={8} md={15} sm={24} xs={24}></Col>
                    </Row>
                  </Card>
                </div>
              </Col>
            </Row>
            <Row type={'flex'}>
              <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
                <div className={styles['card']}>
                  <Card
                    type="inner"
                    className={styles['card']}
                    title="Spending By Billing Method"
                    extra={'Monthly Spending Alert:OFF Setting >'}
                    style={{ width: '100%' }}
                  >
                    <Table
                      style={{ padding: '0px !important' }}
                      size="small"
                      pagination={false}
                      columns={spendingByBillingMedthodColumns}
                    />
                  </Card>
                </div>
              </Col>
            </Row>
            <Row type={'flex'}>
              <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
                <div className={styles['card']}>
                  <Card
                    type="inner"
                    className={styles['card']}
                    title="Spending By Product Name"
                    extra={'Monthly Spending Alert:OFF Setting >'}
                    style={{ width: '100%' }}
                  >
                    <Table
                      style={{ padding: '0px !important' }}
                      size="small"
                      pagination={false}
                      columns={spendingByProductNameColumns}
                    />
                  </Card>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}
