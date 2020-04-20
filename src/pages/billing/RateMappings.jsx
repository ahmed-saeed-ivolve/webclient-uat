import React, { PureComponent } from 'react';
import { Table, Spin, Icon } from 'antd';
import RateTree from './components/RateTree';
import { connect } from 'dva';
const antIcon = <Icon type="loading" style={{ fontSize: 34 }} spin />;

@connect(({ global, loading }) => {
  return {
    fetchingData: loading.effects['global/fetchRateMappings'],
    global: { ...global },
  };
})
export default class RateMappings extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      date: null,
      rating: [],
    };
  }
  onChange = (date, dateString) => {};
  disabledDate = current => {
    return current && (current > moment() || current < moment().subtract(6, 'month'));
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/fetchRateMappings',
      payload: {},
    });
  }
  formatDetails(record) {
    return <RateTree rating={record} />;
  }
  render() {
    if (this.props.fetchingData) {
      return (
        <div style={{ textAlign: 'center', marginTop: `150px` }}>
          <Spin indicator={antIcon} />
        </div>
      );
    }

    return (
      <div style={{ padding: `35px` }}>
        <Table
          columns={[
            { title: 'Service type', dataIndex: 'name' },
            {
              title: 'Service mapping',
              dataIndex: 'mappings',
              render: x => (x.length ? x[0].cost : 'N/A'),
            },
            {
              title: 'Field mapping',
              dataIndex: 'fields',
              render: x =>
                x.length && x[0].mappings.length
                  ? JSON.stringify(
                      x.reduce((acc, item, index, arr) => {
                        return [
                          ...acc,
                          {
                            'Field name': item.name,
                            'Field value': item.mappings[0].value,
                            Cost: item.mappings[0].cost,
                          },
                        ];
                      }, []),
                    )
                  : 'N/A',
            },
          ]}
          rowKey="res_type"
          expandedRowRender={record => this.formatDetails(record)}
          dataSource={this.props.global.hashmapRateMappings}
        />
      </div>
    );
  }
}
