import React from 'react';
import { Tabs, Button, Icon, Row, Col, Typography, Select, Input, Table } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';

Icon.setTwoToneColor('#4c98bf');

const { TabPane } = Tabs;
const operations = (
  <div>
    <Button>
      <Icon type="caret-right" />
    </Button>{' '}
    <Button>
      <Icon type="pause" />
    </Button>{' '}
    <Button>
      <Icon type="stop" />
    </Button>
  </div>
);
const operations2 = (
  <Button>
    <Icon type="stop" />
  </Button>
);

class RouterDetails extends React.Component {
  state = {
    columns: [
      {
        title: 'Fixed IPs',
        dataIndex: 'fixedips',
        key: 'fixedips',
        width: 150,
        render: text => <a href="javascript:;">{text}</a>,
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: 150,
      },

      {
        title: 'Admin State',
        dataIndex: 'admin_state',
        key: 'admin_state',
        width: 150,
        render: text =>
          text === true ? <Typography> Up </Typography> : <Typography> Down </Typography>,
      },

      {
        title: 'Actions',
        dataIndex: 'actions',
        key: 'actions',
        width: 150,
      },
    ],
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        var payload = {};
        const { keys, names } = values;

        if (typeof values.floatingip === 'undefined') {
          const floatingIP = this.props.floatingIPList.list.filter(
            item => item.uuid === this.props.floatingIpId,
          );
          payload = {
            address: floatingIP[0].floating_ip_address,
            uuid: this.props.ecsuuid,
            action: 'detach',
          };
        } else {
          payload = {
            floating_ip_id: values.floatingip[1],
            address: values.floatingip[0],
            uuid: values.floatingip[3],
            action: values.floatingip[4],
          };
        }

        this.props.dispatch({
          type: 'floatingip/attachdetach',
          payload: payload,
        });
      }
    });
  };

  deleteInterface(value) {
    const payload = {
      router: this.props.routerid,
      port_id: value,
    };

    this.props.dispatch({
      type: 'router/deleteInterface',
      payload: payload,
    });
  }

  createNewItem() {
    router.push(`routers/add-interface?router_id=${this.props.routerid}`);
  }

  componentDidMount() {
    const { dispatch } = this.props;

    const id = getPageQuery()?.router_id;

    if (id) {
      dispatch({
        type: 'router/showCurrentRouter',
        payload: {
          id,
        },
      });
    } else {
      router.replace('/service/network/router');
    }
  }

  render() {
    const filteredPorts = this.props.ports.filter(item => item.device_id === this.props.routerid);

    const data = filteredPorts.map(listItem => {
      return {
        key: listItem['id'],
        id: listItem['id'],
        fixedips: listItem['fixed_ips'].length === 0 ? '-' : listItem['fixed_ips'][0]['ip_address'],
        status: listItem['status'],
        admin_state: listItem['is_admin_state_up'],
        actions: (
          <Button
          type='danger'
            loading={this.props.loadingdeletingInterface}
            style={{
              marginRight: `20px`,
              height: `45px`,
              width: `125px`,
              fontFamily: `Open Sans`,
              fontWeight: `600`,
            }}
            onClick={() => this.deleteInterface(listItem['id'])}
          >
            Delete
          </Button>
        ),
      };
    });

    return (
      <Tabs type="card" tabBarExtraContent={operations}>
        <TabPane tab="Overview" key="1">
          {this.props.eachRouterDetail}
        </TabPane>

        <TabPane tab="Interfaces" key="2">
          <div style={{ marginBottom: `20px`, textAlign: `right` }}>
            <Button
              type="primary"
              style={{
                marginRight: `20px`,
                height: `45px`,
                width: `125px`,
                fontFamily: `Open Sans`,
                fontWeight: `600`,
              }}
              onClick={this.createNewItem.bind(this)}
            >
              Add Interface
            </Button>
          </div>
          <Table
            loading={this.props.loadingPorts}
            {...this.state}
            columns={this.state.columns}
            dataSource={data}
            pagination={false}
          />
        </TabPane>
      </Tabs>
    );
  }
}

export default connect()(RouterDetails);
