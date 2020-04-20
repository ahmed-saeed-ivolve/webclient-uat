import React, { PureComponent } from 'react';
import {
    Collapse,
    Icon,
    Row,
    Col,
    Spin,
    Divider,
    Popconfirm,
    Descriptions,
    Badge,
    Card,
    Form,
    Select,
    Typography,
} from 'antd';
import { connect } from 'dva';
import { Empty, Button } from 'antd';
import moment from 'moment';
import { getPageQuery } from '@/utils/utils';
import FormRow from '@/pages/service/components/FormRow';
import AllDrawer from '@/components/AllDrawer/AllDrawer';
import CreateEVS from '@/pages/service/storage/ElasticVolumeServices/CreateEVS';
import { elementType } from 'prop-types';

const { Panel } = Collapse;
const antIcon = (
    <Icon type="loading" style={{ fontSize: 15, opacity: `0.7` }} spin />
);

const customPanelStyle = {
    background: '#f7f7f7',
    borderRadius: 4,
    marginBottom: 24,
    border: 0,
    overflow: 'hidden',
};

@connect(({ securitygroup, loading, ecs }) => {
    return {
        fetchingDisk: loading.effects['securitygroup/fetchSecurityGroups'],
        fetchingAllSecurityGroups: loading.effects['securitygroup/update'],
        attachingSecurityGroup: loading.effects['ecs/attachSecurityGroup'],
        detachingSecurityGroup: loading.effects['ecs/detachSecurityGroup'],
        securitygroup,
        ecs,
    };
})
@Form.create()
class SecurityGroupDetails extends PureComponent {
    constructor(props) {
        super(props);
        this.attachSecurityGroupForm = this.attachSecurityGroupForm.bind(this);
        this.closeAttachSecurityGroup = this.closeAttachSecurityGroup.bind(
            this
        );
        this.showCreateNewSecurityGroup = this.showCreateNewSecurityGroup.bind(
            this
        );
        this.hideCreateNewSecurityGroup = this.hideCreateNewSecurityGroup.bind(
            this
        );
        this.state = {
            showAttachSecurityGroupForm: false,
            showCreateNewSecurityGroup: false,
        };
    }

    componentDidMount() {
        this.props.dispatch({
            type: 'securitygroup/update',
            payload: {
                force: true,
            },
        });
    }

    showAttachSecurityGroupForm() {
        this.props.dispatch({
            type: 'securitygroup/update',
            payload: {
                force: true,
            },
        });

        this.setState({ showAttachSecurityGroupForm: true });
    }

    closeAttachSecurityGroup() {
        this.setState({ showAttachSecurityGroupForm: false });
    }
    showCreateNewSecurityGroup() {
        this.props.dispatch({
            type: 'drawer/showDrawer',
            payload: {
                componentPath: 'network/SecurityGroups/CreateSg',
                mountedData: { drawerName: 'Create New Security Group' },
            },
        });
    }
    hideCreateNewSecurityGroup() {
        this.setState({ showCreateNewSecurityGroup: false });
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values['server'] = this.props.currentInstance.id;
                this.props.dispatch({
                    type: `ecs/attachSecurityGroup`,
                    payload: values,
                });
            }
        });
    };

    confirm(securityGroup, event) {
        event.stopPropagation();

        const values = {
            instance_id: this.props.currentInstance.id,
            security_group: {
                id: securityGroup.id,
                name: securityGroup.name,
            },
        };

        this.props.dispatch({
            type: `ecs/detachSecurityGroup`,
            payload: values,
        });
    }

    attachSecurityGroupForm(securityGroupNames) {
        const { getFieldDecorator } = this.props.form;

        return (
            <div>
                <Row>
                    <Col span={12}>
                        <Spin
                            indicator={antIcon}
                            spinning={this.props.fetchingAllSecurityGroups}
                        >
                            <Card
                                type="inner"
                                title="Attach Security Group To This Instance"
                            >
                                <Form onSubmit={this.handleSubmit}>
                                    <Row>
                                        <Col span={24}>
                                            <Form.Item
                                                style={{ marginBottom: `10px` }}
                                            >
                                                <Typography.Title
                                                    level={4}
                                                    style={{
                                                        fontSize: ` 1.2em`,

                                                        fontFamily: 'Open Sans',
                                                        fontWeight: 600,
                                                        color: `#2b7797`,
                                                    }}
                                                >
                                                    Select a Security Group
                                                </Typography.Title>
                                                {getFieldDecorator(
                                                    'securityGroupAttachment',
                                                    {
                                                        rules: [
                                                            {
                                                                required: true,
                                                                message:
                                                                    'Select a Security Group',
                                                            },
                                                        ],
                                                    }
                                                )(
                                                    <Select
                                                        labelInValue
                                                        style={{
                                                            width: `100%`,
                                                        }}
                                                    >
                                                        {this.props.securitygroup.list.map(
                                                            items => (
                                                                <Select.Option
                                                                    disabled={securityGroupNames.includes(
                                                                        items.name
                                                                    )}
                                                                    value={
                                                                        items.id
                                                                    }
                                                                >
                                                                    {items.name}
                                                                </Select.Option>
                                                            )
                                                        )}
                                                    </Select>
                                                )}
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Row gutter={10}>
                                        <Col span={6}>
                                            <Form.Item
                                                style={{ marginBottom: `0px` }}
                                            >
                                                <Button
                                                    loading={
                                                        this.props
                                                            .attachingSecurityGroup
                                                    }
                                                    style={{ width: `100%` }}
                                                    type="primary"
                                                    htmlType="submit"
                                                >
                                                    Attach
                                                </Button>
                                            </Form.Item>
                                        </Col>

                                        <Col span={18}>
                                            <Form.Item
                                                style={{ marginBottom: `0px` }}
                                            >
                                                <Button
                                                    disabled={
                                                        this.props
                                                            .attachingSecurityGroup
                                                    }
                                                    onClick={
                                                        this
                                                            .closeAttachSecurityGroup
                                                    }
                                                    loading={
                                                        this.props
                                                            .creatingKeyPair
                                                    }
                                                >
                                                    Cancel
                                                </Button>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Form>
                            </Card>
                        </Spin>
                    </Col>
                </Row>
            </div>
        );
    }

    render() {
        const { dispatch, securitygroup, currentInstance } = this.props;

        const security_groups = currentInstance.security_groups
            ? currentInstance.security_groups
            : [];

        const instanceId = currentInstance?.id;

        const filteredSecurityGroups =
            this.props.securitygroup?.list.length > 0 &&
            this.props.securitygroup.list.filter(securityGroup =>
                security_groups.find(item => item.name === securityGroup.name)
            );

        const securityGroupNames =
            filteredSecurityGroups.length > 0
                ? filteredSecurityGroups.map(items => items?.name)
                : [];

        if (
            security_groups?.length === 0 &&
            !this.state.showAttachSecurityGroupForm
        ) {
            return (
                <>
                    <div style={{ padding: `50px` }}>
                        <Empty
                            image="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original"
                            imageStyle={{
                                height: 60,
                            }}
                            description={
                                <span>
                                    There are no security groups attached to
                                    this instance
                                </span>
                            }
                        >
                            <Button
                                onClick={e => {
                                    e.preventDefault();
                                    this.showCreateNewSecurityGroup();
                                }}
                            >
                                Create New
                            </Button>
                            <Button
                                onClick={e => {
                                    e.preventDefault();
                                    this.showAttachSecurityGroupForm();
                                }}
                                style={{ marginLeft: `10px` }}
                            >
                                Attach Now
                            </Button>
                        </Empty>
                    </div>
                </>
            );
        }
        return (
            <div>
                <div style={{ marginBottom: `24px` }}>
                    <Row
                        style={{
                            marginBottom: this.state.showAttachSecurityGroupForm
                                ? '20px'
                                : '0px',
                        }}
                    >
                        <Col span={24}>
                            <Button
                            type='primary'
                                disabled={
                                    this.state.showAttachSecurityGroupForm
                                }
                                onClick={e => {
                                    e.preventDefault();
                                    this.showAttachSecurityGroupForm();
                                }}
                            >
                                Attach Security Group
                            </Button>
                            <Button
                            type='primary'
                                style={{ marginLeft: `10px` }}
                                onClick={e => {
                                    e.preventDefault();
                                    this.showCreateNewSecurityGroup();
                                }}
                            >
                                Create New
                            </Button>
                        </Col>
                    </Row>
                    {this.state.showAttachSecurityGroupForm
                        ? this.attachSecurityGroupForm(securityGroupNames)
                        : null}
                </div>

                <Row>
                    <Col span={24}>
                        <Collapse
                            bordered={false}
                            expandIcon={({ isActive }) => (
                                <Icon
                                    type="caret-right"
                                    rotate={isActive ? 90 : 0}
                                />
                            )}
                        >
                            {Array.isArray(filteredSecurityGroups)
                                ? filteredSecurityGroups.map(
                                      (securityGroup, index) => {
                                          if (securityGroup) {
                                              return (
                                                  <Panel
                                                      style={{ padding: `0px` }}
                                                      disabled={
                                                          this.props
                                                              .detachingSecurityGroup
                                                      }
                                                      header={
                                                          <>
                                                              <span
                                                                  style={{
                                                                      color: `#7d7d7d`,
                                                                  }}
                                                              >
                                                                  {
                                                                      securityGroup.name
                                                                  }
                                                              </span>
                                                          </>
                                                      }
                                                      extra={
                                                          filteredSecurityGroups.length >
                                                          1 ? (
                                                              <Popconfirm
                                                                  style={{
                                                                      marginRight:
                                                                          '10px',
                                                                  }}
                                                                  title="Are you sure?"
                                                                  onConfirm={this.confirm.bind(
                                                                      this,
                                                                      securityGroup
                                                                  )}
                                                                  placement="leftTop"
                                                                  okText="Yes"
                                                                  cancelText="No"
                                                                  onCancel={e =>
                                                                      e.stopPropagation()
                                                                  }
                                                              >
                                                                  <Button
                                                                  type='danger'
                                                                      onClick={e =>
                                                                          e.stopPropagation()
                                                                      }
                                                                      loading={this.props.ecs.loading.includes(
                                                                          securityGroup.id
                                                                      )}
                                                                      style={{
                                                                          margin: `-10px`,
                                                                      }}
                                                                  >
                                                                      {' '}
                                                                      Detach
                                                                  </Button>
                                                              </Popconfirm>
                                                          ) : null
                                                      }
                                                      key={securityGroup.id}
                                                      style={customPanelStyle}
                                                  >
                                                      <div
                                                          style={{
                                                              marginTop: `20px`,
                                                          }}
                                                      >
                                                          <Descriptions
                                                              column={2}
                                                              colon={true}
                                                          >
                                                              <Descriptions.Item label="ID">
                                                                  {
                                                                      securityGroup.id
                                                                  }
                                                              </Descriptions.Item>
                                                              <Descriptions.Item label="Created">
                                                                  {moment(
                                                                      securityGroup?.created_at
                                                                  ).fromNow()}
                                                              </Descriptions.Item>
                                                              <Descriptions.Item
                                                                  style={{
                                                                      fontSize:
                                                                          '1.5em',
                                                                  }}
                                                                  label="Rules"
                                                              >
                                                                  {securityGroup.security_group_rules.map(
                                                                      items => (
                                                                          <Descriptions
                                                                              column={
                                                                                  8
                                                                              }
                                                                              style={{
                                                                                  paddingLeft:
                                                                                      '30px',
                                                                              }}
                                                                          >
                                                                              <Descriptions.Item label="Direction">
                                                                                  {
                                                                                      items.direction
                                                                                  }
                                                                              </Descriptions.Item>
                                                                              <Descriptions.Item label="Type">
                                                                                  {Object.keys(
                                                                                      items
                                                                                  ).includes(
                                                                                      'ethertype'
                                                                                  )
                                                                                      ? items.ethertype
                                                                                      : items.ether_type}
                                                                              </Descriptions.Item>
                                                                              <Descriptions.Item label="IP">
                                                                                  {items.remote_ip_prefix ===
                                                                                  null
                                                                                      ? '-'
                                                                                      : items.remote_ip_prefix}
                                                                              </Descriptions.Item>
                                                                              <Descriptions.Item label="Ports">
                                                                                  {items?.port_range_max ===
                                                                                  null
                                                                                      ? 'Any'
                                                                                      : items?.port_range_max ===
                                                                                        items?.port_range_min
                                                                                      ? items.port_range_max
                                                                                      : items.port_range_min -
                                                                                        items.port_range_max}
                                                                              </Descriptions.Item>
                                                                              <Descriptions.Item label="Protocol">
                                                                                  {
                                                                                      items?.protocol
                                                                                  }
                                                                              </Descriptions.Item>
                                                                          </Descriptions>
                                                                      )
                                                                  )}
                                                              </Descriptions.Item>
                                                          </Descriptions>
                                                      </div>
                                                  </Panel>
                                              );
                                          } else {
                                              return (
                                                  <Panel
                                                      disabled={true}
                                                      header={
                                                          <>
                                                              <Spin
                                                                  indicator={
                                                                      antIcon
                                                                  }
                                                              />
                                                              <span
                                                                  style={{
                                                                      marginLeft: `12px`,
                                                                  }}
                                                              >
                                                                  Fetching...
                                                              </span>{' '}
                                                          </>
                                                      }
                                                      key={
                                                          security_groups[index]
                                                              .id
                                                      }
                                                      style={customPanelStyle}
                                                  />
                                              );
                                          }
                                      }
                                  )
                                : security_groups &&
                                  security_groups.map(
                                      (securityGroup, index) => {
                                          return (
                                              <Panel
                                                  disabled={true}
                                                  header={
                                                      <>
                                                          <Spin
                                                              indicator={
                                                                  antIcon
                                                              }
                                                          />
                                                          <span
                                                              style={{
                                                                  marginLeft: `12px`,
                                                              }}
                                                          >
                                                              Fetching...
                                                          </span>{' '}
                                                      </>
                                                  }
                                                  key={securityGroup.id}
                                                  style={customPanelStyle}
                                              />
                                          );
                                      }
                                  )}
                        </Collapse>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default SecurityGroupDetails;
