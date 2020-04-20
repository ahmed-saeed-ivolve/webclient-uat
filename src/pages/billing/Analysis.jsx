import React, { PureComponent } from 'react';
import TestChart from './components/GroupedBarChart';
import { connect } from 'dva';
import { transform } from './utils';
import { Radio, Table, Col, Row, Select, Tabs, DatePicker, Icon, Spin } from 'antd';
import PieChart from './components/PieChart';

const { Option } = Select;
const { TabPane } = Tabs;
import moment from 'moment';

const servicesNames = {
  'Elastic Cloud Server': 'instance',
  Network: 'ip.floating',
  'Elastic Block Storage': 'volume.size',
};
const columns = [
  {
    title: 'Service',
    dataIndex: 'res_type',
    key: 'res_type',
    width: 150,
  },
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

function formatTableData2(data) {
  if (data.length === 0) return [];
  let tableData = data.map(item => {
    let month = moment(item.begin).format('MMMM YYYY');
    return { month: month, res_type: item.res_type, rate: item.rate };
  });

  return tableData;
}

function formatTableData(data) {
  if (!data.length) return [];
  let x = data.reduce((acc, summaryItem, index, arr) => {
    const { summary } = summaryItem;
    if (summary.length == 0) {
      let len = arr.length;
      let targetMonthName = moment()
        .subtract(len - 1 - index, 'months')
        .format('MMMM YYYY');
      return [
        ...acc,
        { month: targetMonthName, rate: `0 SAR`, res_type: 'instance' },
        { month: targetMonthName, rate: `0 SAR`, res_type: 'volume.size' },
        { month: targetMonthName, rate: `0 SAR`, res_type: 'ip.floating' },
      ];
    }

    return [
      ...acc,
      ...summary.map(item => {
        return {
          month: moment(item.begin).format('MMMM YYYY'),
          rate: item.rate,
          res_type: item.res_type,
        };
      }),
    ];
  }, []);
  return x;
}

@connect(({ global, loading }) => {
  return {
    isLoadingData:
      loading.effects['global/fetchSpendByServiceFromTo'] || loading.effects['global/fetchSpends'],
    global: { ...global },
  };
})
export default class SpendByService extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: null,
      summary: [],
      spendByService: [],
      tableData: [],
    };
    this.onChange = this.onChange.bind(this);
    this.handleServiceFilter = this.handleServiceFilter.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/fetchSpends',
      payload: { num_months: 6, groupby: 'res_type' },
    });
    dispatch({
      type: 'global/fetchSpendByServiceFromTo',
      payload: {
        begin: moment()
          .startOf('month')
          .unix(),
        end: moment()
          .endOf('month')
          .unix(),
      },
    });
  }

  transformToTabular(data) {
    let t = data.map((summaryItem, index, arr) => {
      const { summary } = summaryItem;
      if (summary.length == 0) {
        let len = arr.length;
        let targetMonthName = moment()
          .subtract(len - 1 - index, 'months')
          .format('MMMM YYYY');
        return { month: targetMonthName, rate: 0 };
      }
      let rate = summary.reduce((acc, x) => {
        return acc + Number(x.rate);
      }, 0);

      return { month: moment(summary[0].begin).format('MMMM YYYY'), rate: rate };
    });

    return t;
  }
  onChange(date, dateString) {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/fetchSpendByServiceFromTo',
      payload: {
        begin: date[0].unix(),
        end: date[1].unix(),
      },
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.global.spends.length && this.state.tableData.length == 0) {
      let tableData = formatTableData(this.props.global.spends);

      this.setState({ tableData });
    }
  }

  handleServiceFilter(e) {
    if (e === 'ALL') {
      let tableData = formatTableData(this.props.global.spends);

      this.setState({ tableData });
    } else {
      let tableData = formatTableData(this.props.global.spends);
      let filteredTableData = tableData.filter(item => item.res_type === e);
      this.setState({ tableData: filteredTableData });
    }
  }

  render() {
    if (this.props.isLoadingData) {
      return (
        <div style={{ textAlign: 'center', marginTop: `150px` }}>
          <Spin indicator={<Icon type="loading" style={{ fontSize: 34 }} spin />} />
          {}
        </div>
      );
    }
    const { RangePicker } = DatePicker;
    const dateFormat = 'YYYY-MM-DD';

    const spends = transform(this.props.global.spends);
    const spendByService = this.props.global.spendByService;

    return (
      <>
        <div style={{ padding: `35px` }}>
          <Row>
            <Col lg={12}>
              Time &nbsp;
              <RangePicker
                showTime
                onChange={this.onChange}
                defaultValue={[moment().startOf('month'), moment().endOf('month')]}
              />
            </Col>
            <Col lg={12}>
              Filter by &nbsp;
              <Select defaultValue="ALL" style={{ width: 120 }} onChange={this.handleServiceFilter}>
                <Option value="ALL">ALL Products</Option>
                <Option value="instance">Elastic Cloud Server</Option>
                <Option value="ip.floating">Network</Option>
                <Option value="volume.size">Elastic Volume Service</Option>
              </Select>
            </Col>
          </Row>
          <span style={{ display: 'block', height: `20px` }} />

          <Tabs type="card">
            <TabPane tab="Expense by date" key="1">
              <TestChart dataSource={spends} />
            </TabPane>
            <TabPane tab="Expense by service" key="2">
              <PieChart data={spendByService?.summary} />
            </TabPane>
          </Tabs>
          <Table dataSource={this.state.tableData} columns={columns} />
        </div>
      </>
    );
  }
}
