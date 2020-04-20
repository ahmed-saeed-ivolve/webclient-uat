import React from 'react';
import { Link } from 'react-router-dom';
import { DatePicker, Button, Table, Icon, Spin } from 'antd';
import moment from 'moment';

const { MonthPicker } = DatePicker;
import PieChart from './components/PieChart';
import ColorRose from './components/ColorRose';
import { connect } from 'dva';

@connect(({ global, loading }) => {
  return {
    isLoadingData: loading.effects['global/fetchCurrentMonthSpends'],
    global: { ...global },
  };
})
class CostByServiceMonthly extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      date: null,
      summary: [],
    };
  }

  onChange = (date, dateString) => {};

  disabledDate = current => {
    return current && (current > moment() || current < moment().subtract(6, 'month'));
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/fetchCurrentMonthSpends',
      payload: {},
    });
  }

  render() {
    if (this.props.isLoadingData) {
      return (
        <div style={{ textAlign: 'center', marginTop: `150px` }}>
          <Spin indicator={<Icon type="loading" style={{ fontSize: 34 }} spin />} />
        </div>
      );
    }

    return (
      <div style={{ padding: `35px` }}>
        <MonthPicker
          disabledDate={this.disabledDate}
          onChange={(date, dateString) => {
            const { dispatch } = this.props;
            dispatch({
              type: 'global/fetchCurrentMonthSpends',
              payload: { month: moment(date._d, 'MM-DD-YYYY').toISOString() },
            });
            this.setState({ date: date._d });
          }}
          placeholder="Select month"
        />
        &nbsp;
        <Button
          type="primary"
          shape="circle"
          icon="search"
          onClick={() => {
            const { dispatch } = this.props;
            dispatch({
              type: 'global/fetchCurrentMonthSpends',
              payload: { month: moment(this.state.date, 'MM-DD-YYYY').toISOString() },
            });
          }}
        />
        <span style={{ display: 'block', height: `10px` }} />
        <Table
          columns={[
            { title: 'Service', dataIndex: 'res_type' },
            { title: 'Rate', dataIndex: 'rate' },
          ]}
          rowKey="res_type"
          dataSource={this.props.global.currentMonthSpends?.summary}
        />
        <PieChart data={this.props.global.currentMonthSpends?.summary} />
      </div>
    );
  }
}

export default CostByServiceMonthly;
