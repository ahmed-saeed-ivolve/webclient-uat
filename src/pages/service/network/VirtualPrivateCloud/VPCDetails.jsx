import React from 'react';
import {
  Tabs,
  Button,
  Icon,
  Form,
  Row,
  Col,
  Select,
  Input,
  Typography,
  Table,
  Descriptions,
  Badge,
  Divider,
  Menu,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { getPageQuery } from '@/utils/utils';
import { router } from 'umi';
import { symbol } from 'prop-types';
import { Skeleton } from 'antd';
import SubnetDetails from './components/SubnetDetails';
import PortDetails from './components/PortDetails';

const { TabPane } = Tabs;

const ecsComponentsDetails = {
  subnets: SubnetDetails,
  ports: PortDetails,
};

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

const operations2 = <Icon type="stop" />;

@Form.create()
class VPCDetails extends React.PureComponent {
  constructor(props) {
    super(props);
    this.changeDetailsTab = this.changeDetailsTab.bind(this);

    this.state = {
      choice: '',

      columns: [
        {
          title: 'Volume Name',
          dataIndex: 'volumename',
          key: 'volumename',
          width: 150,
          render: text => <a href="javascript:;">{text}</a>,
        },
        {
          title: 'Actions',
          dataIndex: 'actions',
          key: 'actions',
          width: 150,
        },
      ],
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields(['floatingip', 'removeip'], (err, values) => {
      if (!err) {
        var payload = {};
        const { keys, names } = values;

        if (Object.keys(values)[0] === 'removeip') {
          delete values['removeip'];
          values['floatingip'] = [];
          values['floatingip'][1] = this.props.ecsid;
          values['floatingip'][0] = this.props.floatingIp;

          this.props.dispatch({
            type: 'ecs/detach',
            payload: values,
          });
        } else {
          this.props.dispatch({
            type: 'ecs/attach',
            payload: values,
          });
        }
      }
    });
  };

  handleVolumeAction(value) {
    this.setState({ choice: value });
  }

  handleVolumeSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields(['VolumeAttachment'], (err, values) => {
      if (!err) {
        const { keys, names } = values;
        values['server'] = this.props.ecsid;

        if (Object.keys(values)[0] === 'VolumeAttachment') {
          values['VolumeAttachment'] = { volumeId: values['VolumeAttachment'] };
          this.props.dispatch({
            type: `ecs/attachVolume`,
            payload: values,
          });
        }
        if (Object.keys(values)[0] === 'detach') {
          this.props.dispatch({
            type: `ecs/detachVolume`,
            payload: values,
          });
        }
      }
    });
  };

  detachVolume(volumeID) {
    const values = [];
    values[0] = this.props.ecsid;
    values[1] = volumeID;

    this.props.dispatch({
      type: `ecs/detachVolume`,
      payload: values,
    });
  }
  cancelButton() {
    this.setState({ choice: '' });
  }

  selectVolumeAction() {
    <Select
      style={{ width: `250px` }}
      size="medium"
      onSelect={value => this.handleVolumeAction(value)}
    >
      <Option value="attach">Attach Volume</Option>
      <Option value="detach">Detach Volume</Option>
    </Select>;
  }

  componentDidMount() {
    const { dispatch } = this.props;

    const id = getPageQuery()?.network_id;

    if (id) {
      dispatch({
        type: 'vpc/showCurrentNetwork',
        payload: {
          id,
        },
      });
    } else {
      router.replace('/service/network/networks');
    }
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'vpc/removeCurrentShowNetwork',
    });
  }

  changeDetailsTab(clickedTab) {
    const { key } = clickedTab;
    const { network_id } = this.props.location.query;
    router.push(`/service/network/networks/show-network?tab=${key}&network_id=${network_id}`);
  }

  render() {
    const currentTabValue = getPageQuery()?.tab || 'subnets';

    const CurrentTabComponent = ecsComponentsDetails[currentTabValue];

    return (
      <div style={{ height: `100%`, display: `flex`, flexFlow: `column` }}>
        <div style={{ position: `sticky`, top: `0` }}>
          <Row>
            <Col span={19}>
              <Menu
                style={{ padding: `0px 34px`, border: 0 }}
                onClick={this.changeDetailsTab}
                selectedKeys={[currentTabValue]}
                mode="horizontal"
              >
                <Menu.Item key="subnets">
                  <Icon type="mail" />
                  Subnets
                </Menu.Item>

                <Menu.Item key="ports">
                  <Icon type="appstore" />
                  Ports
                </Menu.Item>
              </Menu>
            </Col>
            <Col span={5}></Col>
          </Row>
          <div style={{ padding: `34px`, height: `100%`, borderTop: `1px solid #e5e5e5` }}>
            {this.props.currentNetwork ? (
              ecsComponentsDetails[currentTabValue] ? (
                <CurrentTabComponent currentNetwork={this.props.currentNetwork} />
              ) : null
            ) : (
              <Skeleton active />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default connect(({ vpc, loading, evs }) => {
  return {
    fetchingCurrentNetwork: loading.effects['vpc/showCurrentNetwork'],
    currentNetwork: vpc.selectedNetwork,
  };
})(VPCDetails);
