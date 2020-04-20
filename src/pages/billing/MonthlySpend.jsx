import React, { PureComponent } from 'react';
import TestChart from './components/GroupedBarChart';
import { connect } from 'dva';
import { transform } from './utils';
import { Radio, Table, Icon, Spin } from 'antd';
import moment from 'moment';

const columns = [
  {
    title: 'Month',
    dataIndex: 'month',
    key: 'month',
    width: 150,
  },
  {
    title: 'Amount Due(SAR)',
    dataIndex: 'rate',
    key: 'rate',
    width: 150,
    align: 'center',
  },
];
const monthsNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

@connect(({ global, loading }) => {
  return {
    isLoadingData: loading.effects['global/fetchSpends'],
    global: { ...global },
  };
})
export default class SpendByService extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      date: null,
      summary: [],
    };
  }

  handleMonthSelect(e) {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/fetchSpends',
      payload: { num_months: e.target.value, groupby: 'res_type' },
    });
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/fetchSpends',
      payload: { num_months: 3, groupby: 'res_type' },
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.global.spends.length) {
    }
  }

  transformToTabular(data) {
    let t = null;
    try {
      t = data.map((summaryItem, index, arr) => {
        const { summary } = summaryItem;
        if (summary.length == 0) {
          let len = arr.length;
          let targetMonthName = moment()
            .subtract(len - 1 - index, 'months')
            .format('MMMM YYYY');
          return { month: targetMonthName, rate: `0 SAR` };
        }
        let rate = summary.reduce((acc, x) => {
          return acc + Number(x.rate);
        }, 0);

        return { month: moment(summary[0].begin).format('MMMM YYYY'), rate: `${rate} SAR` };
      });
    } catch (e) {}

    return t;
  }

  render() {
    if (this.props.isLoadingData) {
      return (
        <div style={{ textAlign: 'center', marginTop: `150px` }}>
          <Spin indicator={<Icon type="loading" style={{ fontSize: 34 }} spin />} />
        </div>
      );
    }
    const spends = this.props.global.spends;
    const data = transform(spends);
    let dataSource = [];
    if (spends.length > 0) {
      dataSource = this.transformToTabular(spends);
    }

    return (
      <>
        <div style={{ padding: `35px` }}>
          <Radio.Group defaultValue="3" buttonStyle="solid">
            <Radio.Button value="3" onChange={e => this.handleMonthSelect(e)}>
              Last 3 Months
            </Radio.Button>
            <Radio.Button value="6" onChange={e => this.handleMonthSelect(e)}>
              Last 6 Months
            </Radio.Button>
            <Radio.Button value="12" onChange={e => this.handleMonthSelect(e)}>
              Last 12 Months
            </Radio.Button>
          </Radio.Group>
          <TestChart dataSource={data} />
          <Table dataSource={dataSource} columns={columns} />
        </div>
      </>
    );
  }
}
