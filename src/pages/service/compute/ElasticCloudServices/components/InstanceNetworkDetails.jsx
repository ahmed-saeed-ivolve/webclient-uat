import React, { PureComponent } from 'react';
import {
  Collapse,
  Icon,
  Row,
  Col,
  Spin,
  Popconfirm,
  Divider,
  Descriptions,
  Badge,
  Card,
  Form,
  Select,
  Typography,
  Menu,
  Dropdown,
} from 'antd';
import { connect } from 'dva';
import { Empty, Button } from 'antd';
import moment from 'moment';
import { getPageQuery } from '@/utils/utils';
import FormRow from '@/pages/service/components/FormRow';

import CreateEVS from '@/pages/service/storage/ElasticVolumeServices/CreateEVS';
import { elementType } from 'prop-types';

const { Panel } = Collapse;

const antIcon = <Icon type="loading" style={{ fontSize: 15, opacity: `0.7` }} spin />;

const customPanelStyle = {
  background: '#f7f7f7',
  borderRadius: 4,
  marginBottom: 24,
  border: 0,
  overflow: 'hidden',
};

@connect(({ ecs,loading}) => {
  return {
    deletingInterface: loading.effects['ecs/detachNetwork'],
    pollingInstance: loading.effects['ecs/pollingInstance'],
    ecs,
  };
})
@Form.create()
class NetworkDetails extends PureComponent {
  constructor(props) {
    super(props);
    this.showCreateNewInterface = this.showCreateNewInterface.bind(this);
  }

  componentDidMount() {}

  showCreateNewInterface() {
    this.props.dispatch({
      type: 'drawer/showDrawer',
      payload: {
        componentPath: 'compute/ElasticCloudServices/components/AttachInterfaceToInstance',
        mountedData: {
          instanceId: this.props.currentInstance.id,
          drawerName: 'Create New Interface',
        },
      },
    });
  }
  hideCreateNewVolume() {}

  handleSubmit = e => {};

  confirm(networkIps,event) {
    event.stopPropagation();
    {
      let values = {
        server_id: this.props.currentInstance.id,
        interfaceDetail: networkIps,
        addresses: this.props.currentInstance.addresses,
      };
      this.props.dispatch({
        type: `ecs/detachNetwork`,
        payload: values,
      });
      
    }
  }

  componentDidUpdate(prevProps, prevState) {}

  genExtra(networkIp) {
    return (
      <>
        <Popconfirm
          title="Are you sure?"
          onConfirm={this.confirm.bind(this, networkIp)}
          okText="Yes"
          cancelText="No"
          onCancel={e => e.stopPropagation()}
        >
          <Button
          type='danger'
            onClick={e => e.stopPropagation()}
            loading={this.props.ecs.loading.includes(networkIp.addr)? true : false}
          >
            Detach
          </Button>
        </Popconfirm>
      </>
    );
  }

  render() {
    const { currentInstance } = this.props;

    if (Object.entries(currentInstance.addresses).length === 0) {
      return (
        <>
          <div style={{ padding: `50px` }}>
            <Empty
              image="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original"
              imageStyle={{
                height: 60,
              }}
              description={<span>There are no Network Interfaces attached to this Instance</span>}
            >
              <Button
                onClick={e => {
                  e.preventDefault();
                  this.showCreateNewInterface();
                }}
              >
                Attach New
              </Button>
            </Empty>
          </div>
        </>
      );
    }

    if (currentInstance !== null && currentInstance.id) {
      const addressEntries = Object.entries(currentInstance.addresses);
      var networkIps =
        addressEntries.length > 0
          ? addressEntries.reduce((acc, item) => {
              const [networkName, netWorkPorts] = item;

              const addedNetworkKey = netWorkPorts.map(port => {
                return { ...port, networkName };
              });
              return [...acc, ...addedNetworkKey];
            }, [])
          : null;
    }

    return (
      <div>
        <div style={{ marginBottom: `24px` }}>
          <Row>
            <Col span={24}>
              <Button
              type='primary'
                style={{}}
                onClick={e => {
                  e.preventDefault();
                  this.showCreateNewInterface();
                }}
              >
                Create New Interface
              </Button>
            </Col>
          </Row>
        </div>

        <Row>
          <Col span={24}>
            {currentInstance !== null && networkIps ? (
              <Collapse
                bordered={false}
                expandIcon={({ isActive }) => (
                  <Icon type="caret-right" rotate={isActive ? 90 : 0} />
                )}
              >
                {Array.isArray(networkIps)
                  ? networkIps.map(item => (
                      <Panel
                        style={customPanelStyle}
                        header={item.addr}
                        extra={this.genExtra.bind(this)(item)}
                      >
                        <Descriptions column={2} colon={true}>
                          <Descriptions.Item label="OS-EXT-IPS:type">
                            {item['OS-EXT-IPS:type']}
                          </Descriptions.Item>
                          <Descriptions.Item label="addr">{item.addr}</Descriptions.Item>
                          <Descriptions.Item label="version">{item.version}</Descriptions.Item>
                          <Descriptions.Item label="OS-EXT-IPS-MAC:mac_addr">
                            {item['OS-EXT-IPS-MAC:mac_addr']}
                          </Descriptions.Item>
                          <Descriptions.Item label="networkName">
                            {item.networkName}
                          </Descriptions.Item>
                        </Descriptions>
                      </Panel>
                    ))
                  : 'no networks'}
              </Collapse>
            ) : null}
          </Col>
        </Row>
      </div>
    );
  }
}

export default NetworkDetails;
