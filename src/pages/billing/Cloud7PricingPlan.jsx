import React, { PureComponent } from "react";
import { Table, Select } from "antd";
import { columns, pricing } from "./datamodel";
const { Option } = Select;
const { Pagination } = Table;

class Cloud7PricingPlan extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      os: "all",
      category: "all",
    };
  }

  changeOS = e => {
    this.setState(state => {
      return {
        ...state,
        os: e,
        category: "Select category"
      };
    });
  };

  changeCat = e => {
    this.setState(state => {
      return {
        ...state,
        category: e
      };
    });
  };

  render() {
    const data = [];
    Object.keys(pricing).forEach(key => {
      if (this.state.os === "all" || this.state.os === key) {
        Object.keys(pricing[key]).forEach(catKey => {
          if (this.state.category === "all" || this.state.category === catKey) {
            Object.entries(pricing[key][catKey]).forEach(value => {
              data.push({ ...value[1], name: value[0] });
            });
          }
        });
      }
    });

    return (
        <div style={{ padding: `35px` }}>
          <Select
            value={this.state.os}
            style={{ width: 200 }}
            onChange={this.changeOS}
          >
            <Option key="all" value="all">Select OS flavor</Option>
            {Object.keys(pricing).map(value => (
              <Option key={value} value={value}>{value}</Option>
            ))}
          </Select> &nbsp;
          <Select
            value={this.state.category}
            style={{ width: 200 }}
            onChange={this.changeCat}
            disabled={this.state.os==='all'}
          >
            <Option key="all" value="all">Select category</Option>
            {pricing[this.state.os] ? Object.keys(pricing[this.state.os]).map(value => (
              <Option key={value} value={value}>{value}</Option>
            )) : null}
          </Select>
        <Table dataSource={data} columns={columns}  rowKey="name"/>;
      </div>
    );
  }
}
export default Cloud7PricingPlan;
