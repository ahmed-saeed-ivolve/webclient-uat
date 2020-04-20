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

const antIcon = (
    <Icon type="loading" style={{ fontSize: 15, opacity: `0.7` }} spin />
);

const antIcon2 = (
    <Icon
        type="loading"
        style={{ fontSize: 48, margin: '40px 0px 40px 0px' }}
        spin
    />
);

const customPanelStyle = {
    background: '#f7f7f7',
    borderRadius: 4,
    marginBottom: 24,
    border: 0,
    overflow: 'hidden',
};

@connect(({ evs, loading, ecs }) => {
    return {
        fetchingDisk: loading.effects['evs/fetchVolumes'],
        fetchingAllVolumes: loading.effects['evs/update'],
        attachingVolume: loading.effects['ecs/attachVolume'],
        makeBootable: loading.effects['evs/forBootable'],
        evs,
        ecs,
    };
})
@Form.create()
class VolumeDetails extends PureComponent {
    constructor(props) {
        super(props);

        this.attachVolumeForm = this.attachVolumeForm.bind(this);
        this.closeAttachVolume = this.closeAttachVolume.bind(this);
        this.showCreateNewVolume = this.showCreateNewVolume.bind(this);
        this.hideCreateNewVolume = this.hideCreateNewVolume.bind(this);
        this.state = {
            showAttachVolumeForm: false,
            showCreateNewVolume: false,
        };
    }

    componentDidMount() {
        const { currentInstance, dispatch } = this.props;
        const { attached_volumes } = currentInstance;

        if (attached_volumes.length !== 0) {
            attached_volumes.forEach(element => {
                const isAlreadyAvailable = this.props.evs.list.find(
                    vol => vol.id === element.id
                );

                if (!isAlreadyAvailable) {
                    dispatch({
                        type: 'evs/fetchVolumes',
                        payload: element,
                    });
                }
            });
        }
    }
    showAttachVolumeForm() {
        this.props.dispatch({
            type: 'evs/update',
            payload: {
                force: true,
            },
        });

        this.setState({ showAttachVolumeForm: true });
    }

    closeAttachVolume() {
        this.setState({ showAttachVolumeForm: false });
    }
    showCreateNewVolume() {
        this.props.dispatch({
            type: 'drawer/showDrawer',
            payload: {
                componentPath: 'storage/ElasticVolumeServices/CreateEVS',
                mountedData: { drawerName: 'Create New Volume' },
            },
        });
    }
    hideCreateNewVolume() {}

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values['server'] = this.props.currentInstance.id;
                values['VolumeAttachment'] = {
                    volumeId: values['VolumeAttachment'],
                };
                this.props.dispatch({
                    type: `ecs/attachVolume`,
                    payload: values,
                });
            }
        });
    };

    confirm(volume, event) {
        event.stopPropagation();

        const values = {
            instance_id: this.props.currentInstance.id,
            volume_id: volume.id,
        };

        this.props.dispatch({
            type: `ecs/detachVolume`,
            payload: values,
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.fetchingAllVolumes && !this.props.fetchingAllVolumes) {
            this.props.form.setFieldsValue({
                VolumeAttachment: null,
            });
        }
    }
    attachVolumeForm() {
        const { getFieldDecorator } = this.props.form;

        return (
            <div>
                <Row>
                    <Col span={12}>
                        <Spin
                            indicator={antIcon}
                            spinning={this.props.fetchingAllVolumes}
                        >
                            <Card
                                type="inner"
                                title="Attach Volume To This Instance"
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
                                                    Select a volume
                                                </Typography.Title>
                                                {getFieldDecorator(
                                                    'VolumeAttachment',
                                                    {
                                                        rules: [
                                                            {
                                                                required: true,
                                                                message:
                                                                    'Select the Volume',
                                                            },
                                                        ],
                                                    }
                                                )(
                                                    <Select
                                                        style={{
                                                            width: `100%`,
                                                        }}
                                                    >
                                                        {this.props.evs.list.map(
                                                            items => (
                                                                <Select.Option
                                                                    disabled={
                                                                        items.status !==
                                                                        'available'
                                                                    }
                                                                    value={
                                                                        items.id
                                                                    }
                                                                >
                                                                    {items.name ===
                                                                    ''
                                                                        ? `${items.id} / ${items.size}GB`
                                                                        : items.name}
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
                                                            .attachingVolume
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
                                                            .attachingVolume
                                                    }
                                                    onClick={
                                                        this.closeAttachVolume
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
        const { dispatch, evs, currentInstance } = this.props;

        const { attached_volumes } = currentInstance
            ? currentInstance
            : { attached_volumes: [] };

        const instanceId = currentInstance?.id;

        const filteredVolumes =
            this.props.evs.list.length > 0 &&
            attached_volumes.map(volume =>
                this.props.evs.list.find(vol => vol.id === volume.id)
            );

        if (instanceId) {
            const volumeBootableMenu = (volumeID, bootableState) => (
                <Menu style={{ width: '122px' }}>
                    <Menu.Item
                        style={{ paddingTop: '0px', paddingBottom: '0px' }}
                        key="0"
                    >
                        <Button
                            disabled={bootableState}
                            style={{ padding: `0px` }}
                            type="link"
                            onClick={() =>
                                this.props.dispatch({
                                    type: 'evs/forBootable',
                                    payload: {
                                        volume_id: volumeID,
                                        bootable: true,
                                    },
                                })
                            }
                        >
                            Yes
                        </Button>
                    </Menu.Item>
                    <Menu.Item
                        style={{ paddingTop: '0px', paddingBottom: '0px' }}
                        key="1"
                    >
                        <Button
                            disabled={!bootableState}
                            style={{ padding: `0px` }}
                            type="link"
                            onClick={() =>
                                this.props.dispatch({
                                    type: 'evs/forBootable',
                                    payload: {
                                        volume_id: volumeID,
                                        bootable: false,
                                    },
                                })
                            }
                        >
                            No
                        </Button>
                    </Menu.Item>
                </Menu>
            );

            if (
                attached_volumes.length === 0 &&
                !this.state.showAttachVolumeForm
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
                                        There are no volumes attached to this
                                        instance
                                    </span>
                                }
                            >
                                <Button
                                    type="primary"
                                    onClick={e => {
                                        e.preventDefault();
                                        this.showCreateNewVolume();
                                    }}
                                >
                                    Create New
                                </Button>
                                <Button
                                    type="primary"
                                    onClick={e => {
                                        e.preventDefault();
                                        this.showAttachVolumeForm();
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
                                marginBottom: this.state.showAttachVolumeForm
                                    ? '20px'
                                    : '0px',
                            }}
                        >
                            <Col span={24}>
                                <Button
                                    type="primary"
                                    disabled={this.state.showAttachVolumeForm}
                                    onClick={e => {
                                        e.preventDefault();
                                        this.showAttachVolumeForm();
                                    }}
                                >
                                    Attach Volume
                                </Button>
                                <Button
                                    type="primary"
                                    style={{ marginLeft: `10px` }}
                                    onClick={e => {
                                        e.preventDefault();
                                        this.showCreateNewVolume();
                                    }}
                                >
                                    Create New Volume
                                </Button>
                            </Col>
                        </Row>
                        {this.state.showAttachVolumeForm
                            ? this.attachVolumeForm()
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
                                {Array.isArray(filteredVolumes)
                                    ? filteredVolumes.map((volume, index) => {
                                          if (volume) {
                                              return (
                                                  <Panel
                                                      style={{ padding: `0px` }}
                                                      header={
                                                          <>
                                                              <span
                                                                  style={{
                                                                      color: `#7d7d7d`,
                                                                  }}
                                                              >
                                                                  {volume.name ===
                                                                  ''
                                                                      ? currentInstance.name +
                                                                        '-Volume'
                                                                      : volume.name}{' '}
                                                              </span>
                                                              <Divider type="vertical" />
                                                              <span
                                                                  style={{
                                                                      color: `#7d7d7d`,
                                                                  }}
                                                              >
                                                                  {volume.size}{' '}
                                                                  GB
                                                              </span>{' '}
                                                          </>
                                                      }
                                                      extra={
                                                          <Popconfirm
                                                              style={{
                                                                  marginRight:
                                                                      '10px',
                                                              }}
                                                              title="Are you sure?"
                                                              onConfirm={this.confirm.bind(
                                                                  this,
                                                                  volume
                                                              )}
                                                              okText="Yes"
                                                              cancelText="No"
                                                              onCancel={e =>
                                                                  e.stopPropagation()
                                                              }
                                                          >
                                                              <Button
                                                                  type="danger"
                                                                  onClick={e =>
                                                                      e.stopPropagation()
                                                                  }
                                                                  loading={this.props.ecs.loading.includes(
                                                                      volume.id
                                                                  )}
                                                                  style={{
                                                                      margin: `-10px`,
                                                                  }}
                                                              >
                                                                  Detach
                                                              </Button>
                                                          </Popconfirm>
                                                      }
                                                      key={volume.id}
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
                                                                  {volume.id}
                                                              </Descriptions.Item>
                                                              <Descriptions.Item label="Status">
                                                                  {
                                                                      volume.status
                                                                  }
                                                              </Descriptions.Item>
                                                              <Descriptions.Item label="Created">
                                                                  {moment(
                                                                      volume.created_at
                                                                  ).fromNow()}
                                                              </Descriptions.Item>

                                                              <Descriptions.Item label="Bootable">
                                                                  <>
                                                                      <Spin
                                                                          indicator={
                                                                              antIcon
                                                                          }
                                                                          spinning={
                                                                              typeof this
                                                                                  .props
                                                                                  .makeBootable ===
                                                                                  'undefined' ||
                                                                              this
                                                                                  .props
                                                                                  .makeBootable ===
                                                                                  false
                                                                                  ? false
                                                                                  : true
                                                                          }
                                                                      />{' '}
                                                                      {volume.is_bootable ? (
                                                                          <>
                                                                              {' '}
                                                                              <Badge
                                                                                  status="success"
                                                                                  text={`Yes`}
                                                                              />
                                                                          </>
                                                                      ) : (
                                                                          <>
                                                                              <Badge
                                                                                  status="error"
                                                                                  text={`No`}
                                                                              />
                                                                          </>
                                                                      )}
                                                                      <Dropdown
                                                                          overlay={() =>
                                                                              volumeBootableMenu(
                                                                                  volume.id,
                                                                                  volume.is_bootable
                                                                              )
                                                                          }
                                                                          trigger={[
                                                                              'click',
                                                                          ]}
                                                                      >
                                                                          <a
                                                                              style={{
                                                                                  marginLeft:
                                                                                      '7px',
                                                                              }}
                                                                              className="ant-dropdown-link"
                                                                              href="#"
                                                                          >
                                                                              More{' '}
                                                                              <Icon type="down" />
                                                                          </a>
                                                                      </Dropdown>
                                                                  </>
                                                              </Descriptions.Item>
                                                              <Descriptions.Item label="Encrypted">
                                                                  {volume.is_encrypted ? (
                                                                      <Badge
                                                                          status="success"
                                                                          text={`Yes`}
                                                                      />
                                                                  ) : (
                                                                      <Badge
                                                                          status="error"
                                                                          text={`No`}
                                                                      />
                                                                  )}
                                                              </Descriptions.Item>
                                                              <Descriptions.Item label="Volume Type">
                                                                  {
                                                                      volume.volume_type
                                                                  }
                                                              </Descriptions.Item>
                                                              <Descriptions.Item label="Availability Zone">
                                                                  {
                                                                      volume.availability_zone
                                                                  }
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
                                                          attached_volumes[
                                                              index
                                                          ].id
                                                      }
                                                      style={customPanelStyle}
                                                  />
                                              );
                                          }
                                      })
                                    : attached_volumes.map((volume, index) => {
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
                                                  key={volume.id}
                                                  style={customPanelStyle}
                                              />
                                          );
                                      })}
                            </Collapse>
                        </Col>
                    </Row>
                </div>
            );
        }
        return (
            <Spin
                style={{ display: 'flex', justifyContent: 'center' }}
                indicator={antIcon2}
            />
        );
    }
}

export default VolumeDetails;
