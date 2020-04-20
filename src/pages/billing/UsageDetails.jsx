import React, { PureComponent } from 'react';
import RDFTree from './components/RDFTree';
import { DatePicker, Button, Table, Icon, Spin } from 'antd';
const { MonthPicker } = DatePicker;
import moment from 'moment';
import { connect } from 'dva';

const errorHandler = error => {
  const { response } = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;
    notification.error({
      message: `Request error ${status}: ${url}`,
      description: errorText,
    });
  }
};

@connect(({ global, loading }) => {
  return {
    isLoadingData: loading.effects['global/fetchRatedDataFrames'],
    global: { ...global },
  };
})
export default class UsageDetails extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { date: null, dataframes: [] };
  }
  onChange = (date, dateString) => {};

  disabledDate = current => {
    return current && (current > moment() || current < moment().subtract(6, 'month'));
  };

  async handlefetch(input) {
    let begin = moment(input)
      .startOf('month')
      .toISOString();
    let end = moment(input)
      .startOf('month')
      .add(1, 'M')
      .toISOString();
    const { dispatch } = this.props;
    dispatch({
      type: 'global/fetchRatedDataFrames',
      payload: { begin: begin, end: end },
    });
  }

  componentDidMount() {
    let begin = moment()
      .startOf('month')
      .toISOString();
    let end = moment()
      .startOf('month')
      .add(1, 'M')
      .toISOString();
    const { dispatch } = this.props;
    dispatch({
      type: 'global/fetchRatedDataFrames',
      payload: { begin: begin, end: end },
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
            this.setState({ date: date._d });
            this.handlefetch(date._d);
          }}
          placeholder="Select month"
        />
        &nbsp;
        <Button
          type="primary"
          shape="circle"
          icon="search"
          onClick={() => {
            this.handlefetch(this.state.date);
          }}
        />
        <span style={{ display: 'block', height: `10px` }} />
        <Table
          columns={[
            { title: 'Begin', dataIndex: 'begin' },
            { title: 'End', dataIndex: 'end' },
            { title: 'Tenant ID', dataIndex: 'tenant_id' },
            {
              title: 'Resources',
              dataIndex: 'resources',
              render: record => <RDFTree dataSource={record} />,
            },
          ]}
          dataSource={this.props.global.ratedDataFrames}
        />
      </div>
    );
  }
}
