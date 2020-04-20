import {
    PageHeader,
    Form,
    Input,
    Switch,
    Modal,
    Avatar,
    Spin,
    Menu,
    Select,
    Dropdown,
    Icon,
    Button,
    Tag,
    Typography,
    Popconfirm,
    Row,
    Col,
    Descriptions,
    Divider,
    Tooltip,
} from 'antd';
import { router } from 'umi';
import { routerRedux } from 'dva/router';
import { useState, useEffect } from 'react';

import { Skeleton } from 'antd';
import moment from 'moment';
import { getPageQuery } from '@/utils/utils';
import GroupDetailsHeader from '@/pages/service/iam/Groups/components/GroupDetailsHeader';
import ProjectDetailsHeader from '../iam/Tenants/components/ProjectDetailHeader';

const { Paragraph } = Typography;
const antIcon = (
    <Icon
        type="loading"
        style={{ paddingLeft: '2px', fontSize: 18, marginRight: '5px' }}
        spin
    />
);
const { Option } = Select;
const menu = (
    <Menu>
        <Menu.Item>
            <a
                target="_blank"
                rel="noopener noreferrer"
                href="http://www.alipay.com/"
            >
                1st menu item
            </a>
        </Menu.Item>
        <Menu.Item>
            <a
                target="_blank"
                rel="noopener noreferrer"
                href="http://www.taobao.com/"
            >
                2nd menu item
            </a>
        </Menu.Item>
        <Menu.Item>
            <a
                target="_blank"
                rel="noopener noreferrer"
                href="http://www.tmall.com/"
            >
                3rd menu item
            </a>
        </Menu.Item>
    </Menu>
);

const DropdownMenu = () => {
    return (
        <Dropdown key="more" overlay={menu}>
            <Button
                style={{
                    border: 'none',
                    padding: 0,
                }}
            >
                <Icon
                    type="ellipsis"
                    style={{
                        fontSize: 20,
                        verticalAlign: 'top',
                    }}
                />
            </Button>
        </Dropdown>
    );
};

const routes = [
    {
        path: 'index',
        breadcrumbName: 'First-level Menu',
    },
    {
        path: 'first',
        breadcrumbName: 'Second-level Menu',
    },
    {
        path: 'second',
        breadcrumbName: 'Third-level Menu',
    },
];

const IconLink = ({ src, text }) => (
    <Col ms={0}>
        <a
            style={{
                marginRight: 16,
                display: 'flex',
                alignItems: 'center',
            }}
        >
            <img
                style={{
                    marginRight: 8,
                }}
                src={src}
                alt="start"
            />
            {text}
        </a>
    </Col>
);

const ButtonGroup = Button.Group;

const Content = ({ children, extraContent }) => {
    return (
        <Row className="content" type="flex">
            <div className="main" style={{ flex: 1 }}>
                {children}
            </div>
            <div
                className="extra"
                style={{
                    marginLeft: 80,
                }}
            >
                {extraContent}
            </div>
        </Row>
    );
};

export default props => {
    const { loading, dispatch } = props;

    const deletingResouces = loading.effects['global/deleteEachResource'],
        attachingNetwork = loading.effects['ecs/attachNetwork'],
        detachingNetwork = loading.effects['ecs/detachNetwork'],
        fetchingNetwork = loading.effects['vpc/update'],
        startingVM = loading.effects['ecs/startServer'],
        stoppingVM = loading.effects['ecs/stopServer'];

    const {
        serviceLayout,
        ecs,
        keypair,
        floatingip,
        vpc,
        router,
        flavor,
        kms,
    } = props.appState;
    const { selectedSubService } = serviceLayout;
    const { selectedInstance } = ecs;
    const { selectedNetwork } = vpc;
    const { selectedKMS } = kms;

    function confirmDelete() {
        dispatch({
            type: 'global/deleteEachResource',
        });
    }

    const buttonTitle = window.location.href.includes(
        '/service/network/floating-ips'
    )
        ? 'release'
        : 'delete';

    if (
        selectedSubService.type === 'listView' ||
        selectedSubService.type === 'createView'
    ) {
        return (
            <PageHeader
                backIcon={
                    selectedSubService.type === 'createView' ? (
                        <Icon type="arrow-left" />
                    ) : (
                        false
                    )
                }
                onBack={() => {
                    if (history.length > 0) dispatch(routerRedux.goBack());
                }}
                subTitle={
                    selectedSubService.type === 2 ? props.goBackTitle : null
                }
                style={{ padding: `0px` }}
                title={selectedSubService.title}
                extra={
                    selectedSubService.type === 'listView'
                        ? [
                              !(
                                  window.location.href.includes(
                                      '/service/compute/flavors'
                                  ) ||
                                  window.location.href.includes(
                                    '/service/iam/roles'
                                )||
                                  window.location.href.includes(
                                      '/service/compute/image-management-services'
                                  ) ||
                                  window.location.href.includes(
                                      '/service/billing'
                                  )
                              ) ? (
                                  <Popconfirm
                                      disabled={
                                          props.appState[
                                              props.appState.serviceLayout
                                                  .selectedSubService.modelName
                                          ]?.selectedRows?.length === 0
                                      }
                                      placement="top"
                                      title={`Are you sure you want to ${buttonTitle}?`}
                                      onConfirm={confirmDelete}
                                      okText="Yes"
                                      cancelText="No"
                                  >
                                      {!window.location.href.includes(
                                          'service/settings/flavors'
                                      ) && (
                                          <Button
                                              disabled={
                                                  props.appState[
                                                      props.appState
                                                          ?.serviceLayout
                                                          .selectedSubService
                                                          .modelName
                                                  ]?.selectedRows?.length === 0
                                              }
                                              loading={deletingResouces}
                                              icon="delete"
                                              type="danger"
                                              key="2"
                                          >
                                              {`${buttonTitle
                                                  .charAt(0)
                                                  .toUpperCase()}${buttonTitle.substring(
                                                  1
                                              )}`}
                                          </Button>
                                      )}
                                  </Popconfirm>
                              ) : null,
                              !window.location.href.includes(
                                  '/service/compute/flavors'
                              ) &&
                              !window.location.href.includes(
                                  '/service/compute/image-management-services'
                              ) &&
                              !window.location.href.includes(
                                  '/service/billing'
                              ) && 
                              !window.location.href.includes(
                                '/service/iam/roles'
                            )
                              ? (
                                  <Button
                                      onClick={() => {
                                          if (
                                              `${selectedSubService.modelName}` ===
                                              'evs'
                                          ) {
                                              dispatch({
                                                  type: `evs/createVolumeFromVolume`,
                                              });
                                          }
                                          if (
                                              `${selectedSubService.modelName}` ===
                                              'snapshot'
                                          ) {
                                              dispatch({
                                                  type: `snapshot/createSnapshotFromVolume`,
                                              });
                                          }
                                          if (
                                              `${selectedSubService.modelName}` ===
                                              'ecs'
                                          ) {
                                              dispatch({
                                                  type:
                                                      'createECS/chanegBillingMode',
                                                  payload: 'on_demand',
                                              });
                                              dispatch({
                                                  type:
                                                      'createECS/resetMetaData',
                                                  payload: {
                                                      reset_metastate: [],
                                                      counter: 0,
                                                  },
                                              });
                                          }
                                          dispatch(
                                              routerRedux.push(
                                                  `${selectedSubService.link}/create`
                                              )
                                          );
                                      }}
                                      icon="plus"
                                      key="1"
                                      type="primary"
                                  >
                                      Create
                                  </Button>
                              ) : null,
                          ]
                        : null
                }
            ></PageHeader>
        );
    } else if (selectedSubService.type === 'detailsView') {
        if (selectedSubService.typeDetailed === 'groups') {
            return (
                <GroupDetailsHeader
                    dispatch={dispatch}
                    groups={props.appState.groups}
                />
            );
        }
        if (selectedSubService.typeDetailed === 'projects') {
            return (
                <ProjectDetailsHeader
                    dispatch={dispatch}
                    projects={props.appState.projects}
                />
            );
        }
    } else if (selectedSubService.type === 3) {
        if (selectedInstance === null) {
            return (
                <Row>
                    <Col span={6}>
                        <Skeleton active />
                    </Col>
                </Row>
            );
        }

        if (selectedInstance !== null && selectedInstance.id) {
            if (
                selectedInstance.vm_state === 'error' ||
                selectedInstance.vm_state === 'building' ||
                selectedInstance.vm_state === null
            ) {
                dispatch(
                    routerRedux.push('/service/compute/elastic-cloud-services')
                );
                return null;
            }

            const { addresses } = selectedInstance;
            let subnets = [];
            if (addresses !== null) {
                subnets = Object.keys(addresses);
            }

            let floatingIp = null;

            let networkAttached =
                Object.keys(selectedInstance.addresses).length > 0
                    ? Object.keys(selectedInstance.addresses)[0]
                    : null;

            for (let i = 0; i < subnets.length; i++) {
                const availableFip = addresses[subnets[i]].find(ipMetaData => {
                    return ipMetaData['OS-EXT-IPS:type'] === 'floating';
                });

                if (availableFip) {
                    floatingIp = availableFip;
                    break;
                }
            }

            const networkMenu = (
                <Menu style={{ width: '122px' }}>
                    <Menu.Item
                        style={{ paddingTop: '0px', paddingBottom: '0px' }}
                        key="0"
                    >
                        <Button
                            style={{ padding: `0px` }}
                            type="link"
                            onClick={() => assignNetwork('assign')}
                        >
                            Assign
                        </Button>
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item
                        style={{ paddingTop: '0px', paddingBottom: '0px' }}
                        key="1"
                    >
                        <Button
                            style={{ color: 'red', padding: `0px` }}
                            type="link"
                            onClick={releaseNetwork}
                        >
                            Release
                        </Button>
                    </Menu.Item>
                </Menu>
            );

            function releaseNetwork() {
                dispatch({
                    type: `ecs/detachNetwork`,

                    payload: [selectedInstance.id, selectedInstance],
                });

                assignNetwork('release');
            }

            async function handleAssignNetwork(value) {
                await dispatch({
                    type: `ecs/attachNetwork`,
                    payload: [selectedInstance.id, value],
                });
                assignNetwork('release');
            }

            const [assignOrReleaseFIP, assignFIP] = useState(
                floatingIp ? 'Release' : 'Assign'
            );
            const [elasticIpValue, setElasticIpValue] = useState(null);

            useEffect(() => {
                if (floatingIp) {
                    assignFIP('Release');
                    setElasticIpValue(null);
                } else if (!floatingIp) {
                    assignFIP('Assign');
                    setElasticIpValue(null);
                }
            }, [props.appState.ecs.selectedInstance.addresses]);

            const [assignOrReleaseNetwork, assignNetwork] = useState('');

            if (assignOrReleaseNetwork === 'assign') {
                if (vpc.list.length === 0) {
                    dispatch({
                        type: 'vpc/update',
                    });
                }
            }

            function switchChange(checked) {
                if (checked === false) {
                    dispatch({
                        type: 'ecs/startServer',
                        payload: {
                            id: selectedInstance?.id,
                            method: 'stop_server',
                        },
                    });
                }

                if (checked === true) {
                    dispatch({
                        type: 'ecs/startServer',
                        payload: {
                            id: selectedInstance?.id,
                            method: 'start_server',
                        },
                    });
                }
            }

            function confirm() {
                dispatch({
                    type: 'global/deleteEachResource',
                });
            }

            const [flavorState, setFlavor] = useState(false);
            const [newFlavorSelect, checkNewFlavorSelection] = useState('');

            function clearAll() {
                setFlavor(false);
                checkNewFlavorSelection('');
            }

            async function selectedFlavor() {
                await dispatch({
                    type: 'ecs/resizeServer',
                    payload: {
                        server_id: selectedInstance.id,
                        flavor_id: newFlavorSelect,
                        server_status: selectedInstance.status,
                    },
                });
                setFlavor(false);
                checkNewFlavorSelection('');
            }

            function handleAssignFlavor(value) {
                checkNewFlavorSelection(value);
            }

            var filteredFixedIPs =
                Object.keys(selectedInstance.addresses).length > 0
                    ? Object.keys(selectedInstance.addresses).map(item => item)
                    : null;

            const fixedIps = () => {
                var a = Object.keys(selectedInstance.addresses);
                var b = a.map(item => selectedInstance.addresses[item]);
                var c = b.map(item =>
                    item.filter(elem => elem['OS-EXT-IPS:type'] === 'fixed')
                );
                var d = c.map(item => item.map(elem => elem.addr));
                d.map(item => item.map(elem => elem));
                let data = [];
                for (let i = 0; i < d.length; i++) {
                    data.push(d[i][0]);
                }
                return data;
            };

            return (
                <PageHeader
                    backIcon={<Icon type="arrow-left" />}
                    onBack={() => {
                        dispatch(
                            routerRedux.push(
                                '/service/compute/elastic-cloud-services'
                            )
                        );
                    }}
                    subTitle={`Elastic Cloud Server`}
                    style={{ padding: `0px` }}
                    title={selectedInstance.name}
                    tags={[
                        <Tag key="instanceStateTag" color="blue">
                            {selectedInstance.vm_state
                                .substr(0, 1)
                                .toUpperCase()}
                            {selectedInstance.vm_state.substr(1).toLowerCase()}
                        </Tag>,
                    ]}
                    extra={[
                        <Dropdown
                            trigger={['click']}
                            disabled={
                                selectedInstance['vm_state'] === 'error' ||
                                selectedInstance['vm_state'] === null ||
                                selectedInstance['vm_state'] === 'building' ||
                                selectedInstance['vm_state'] === 'resizing'
                            }
                            overlay={
                                <Menu size="small">
                                    <Menu.Item
                                        disabled={
                                            selectedInstance['vm_state'] ===
                                                'active' ||
                                            selectedInstance['vm_state'] ===
                                                'paused' ||
                                            selectedInstance['vm_state'] ===
                                                'shelved_offloaded'
                                        }
                                        onClick={() => {
                                            dispatch({
                                                type: 'ecs/startServer',
                                                payload: {
                                                    id: selectedInstance['id'],
                                                    method: 'start_server',
                                                },
                                            });
                                        }}
                                    >
                                        Start
                                    </Menu.Item>

                                    <Menu.Item
                                        disabled={
                                            selectedInstance['vm_state'] ===
                                            'shelved_offloaded'
                                        }
                                        onClick={() => {
                                            dispatch({
                                                type: 'ecs/startServer',
                                                payload: {
                                                    id: selectedInstance['id'],
                                                    method: 'shelve_server',
                                                },
                                            });
                                        }}
                                    >
                                        Shelve
                                    </Menu.Item>

                                    <Menu.Item
                                        disabled={
                                            selectedInstance['vm_state'] ===
                                                'stopped' ||
                                            selectedInstance['vm_state'] ===
                                                'paused' ||
                                            selectedInstance['vm_state'] ===
                                                'active' ||
                                            selectedInstance['vm_state'] ===
                                                'building'
                                        }
                                        onClick={() => {
                                            dispatch({
                                                type: 'ecs/startServer',
                                                payload: {
                                                    id: selectedInstance['id'],
                                                    method: 'unshelve_server',
                                                },
                                            });
                                        }}
                                    >
                                        Un-Shelve
                                    </Menu.Item>

                                    <Menu.Item
                                        disabled={
                                            selectedInstance['vm_state'] ===
                                                'stopped' ||
                                            selectedInstance['vm_state'] ===
                                                'paused' ||
                                            selectedInstance['vm_state'] ===
                                                'shelved_offloaded'
                                        }
                                        onClick={() => {
                                            dispatch({
                                                type: 'ecs/startServer',
                                                payload: {
                                                    id: selectedInstance['id'],
                                                    method: 'stop_server',
                                                },
                                            });
                                        }}
                                    >
                                        Stop
                                    </Menu.Item>

                                    <Menu.Item
                                        disabled={
                                            selectedInstance['vm_state'] ===
                                                'stopped' ||
                                            selectedInstance['vm_state'] ===
                                                'paused' ||
                                            selectedInstance['vm_state'] ===
                                                'shelved_offloaded'
                                        }
                                        onClick={() => {
                                            dispatch({
                                                type: 'ecs/startServer',
                                                payload: {
                                                    id: selectedInstance['id'],
                                                    method: 'pause_server',
                                                },
                                            });
                                        }}
                                    >
                                        Pause
                                    </Menu.Item>

                                    <Menu.Item
                                        disabled={
                                            selectedInstance['vm_state'] ===
                                                'active' ||
                                            selectedInstance['vm_state'] ===
                                                'stopped' ||
                                            selectedInstance['vm_state'] ===
                                                'shelved_offloaded'
                                        }
                                        onClick={() => {
                                            dispatch({
                                                type: 'ecs/startServer',
                                                payload: {
                                                    id: selectedInstance['id'],
                                                    method: 'unpause_server',
                                                },
                                            });
                                        }}
                                    >
                                        Resume
                                    </Menu.Item>

                                    <Menu.Item
                                        disabled={
                                            selectedInstance['vm_state'] ===
                                                'stopped' ||
                                            selectedInstance['vm_state'] ===
                                                'shelved_offloaded'
                                        }
                                        onClick={() => {
                                            dispatch({
                                                type: 'ecs/startServer',
                                                payload: {
                                                    id: selectedInstance['id'],
                                                    type: 'HARD',
                                                    method: 'reboot_server',
                                                },
                                            });
                                        }}
                                    >
                                        Hard Reboot
                                    </Menu.Item>

                                    <Menu.Item
                                        disabled={
                                            selectedInstance['vm_state'] ===
                                                'stopped' ||
                                            selectedInstance['vm_state'] ===
                                                'shelved_offloaded'
                                        }
                                        onClick={() => {
                                            dispatch({
                                                type: 'ecs/startServer',
                                                payload: {
                                                    id: selectedInstance['id'],
                                                    type: 'SOFT',
                                                    method: 'reboot_server',
                                                },
                                            });
                                        }}
                                    >
                                        Soft Reboot
                                    </Menu.Item>
                                </Menu>
                            }
                            placement="bottomLeft"
                        >
                            <Button
                                type="primary"
                                loading={
                                    props.appState.ecs.loading.includes(
                                        selectedInstance['id']
                                    )
                                        ? true
                                        : false
                                }
                            >
                                {' '}
                                Actions{' '}
                                <Icon
                                    style={{ paddingLeft: '18px' }}
                                    type="down"
                                />{' '}
                            </Button>
                        </Dropdown>,
                        <Divider key="instanceActionDevider" type="vertical" />,

                        <Switch
                            loading={
                                props.appState.ecs.loading.includes(
                                    `${selectedInstance.id}`
                                )
                                    ? true
                                    : false
                            }
                            size="large"
                            checkedChildren="ON"
                            unCheckedChildren="OFF"
                            defaultChecked={
                                selectedInstance.vm_state !== 'stopped'
                            }
                            checked={
                                selectedInstance.vm_state === 'stopped'
                                    ? false
                                    : true
                            }
                            onChange={switchChange}
                            disabled={
                                selectedInstance.vm_state === 'paused' ||
                                selectedInstance.vm_state ===
                                    'shelved_offloaded'
                            }
                        />,
                    ]}
                ></PageHeader>
            );
        }
    } else if (selectedSubService.type === 6) {
        if (selectedNetwork === null) {
            return (
                <Row>
                    <Col span={6}>
                        <Skeleton active />
                    </Col>
                </Row>
            );
        }

        return (
            <PageHeader
                backIcon={<Icon type="arrow-left" />}
                onBack={() => {
                    dispatch(routerRedux.goBack());
                }}
                subTitle={'Network'}
                style={{ padding: `0px` }}
                title={selectedNetwork?.name}
            >
                <Content>
                    <div style={{ marginTop: `19px` }} className="content">
                        <Paragraph>
                            <Descriptions column={2} colon={false}>
                                <Descriptions.Item label="ID">
                                    <Tag>{selectedNetwork?.id}</Tag>
                                </Descriptions.Item>
                                <Descriptions.Item label="Created">
                                    {moment(
                                        selectedNetwork?.created_at
                                    ).fromNow()}
                                </Descriptions.Item>
                                <Descriptions.Item label="Updated">
                                    {moment(
                                        selectedNetwork?.updated_at
                                    ).fromNow()}
                                </Descriptions.Item>
                                <Descriptions.Item label="Network Type">
                                    {selectedNetwork?.is_router_external
                                        ? 'External'
                                        : 'Internal'}
                                </Descriptions.Item>
                                <Descriptions.Item label="MTU">
                                    {selectedNetwork?.mtu}
                                </Descriptions.Item>

                                <Descriptions.Item label="Status">
                                    {selectedNetwork?.status}
                                </Descriptions.Item>
                            </Descriptions>
                        </Paragraph>
                    </div>
                </Content>
            </PageHeader>
        );
    } else if (selectedSubService.type === 7) {
        if (selectedKMS === null) {
            return (
                <Row>
                    <Col span={6}>
                        <Skeleton active />
                    </Col>
                </Row>
            );
        }

        return (
            <PageHeader
                backIcon={<Icon type="arrow-left" />}
                onBack={() => {
                    dispatch(routerRedux.goBack());
                }}
                subTitle={'Security'}
                style={{ padding: `0px` }}
                title={selectedKMS?.name}
            >
                <Content>
                    <div style={{ marginTop: `19px` }} className="content">
                        <Paragraph>
                            <Descriptions column={2} colon={false}>
                                <Descriptions.Item label="ID">
                                    {selectedKMS?.id}
                                </Descriptions.Item>
                                <Descriptions.Item label="Status">
                                    {selectedKMS?.status === 'ACTIVE'
                                        ? 'Enable'
                                        : 'Disable'}
                                </Descriptions.Item>
                            </Descriptions>
                        </Paragraph>
                    </div>
                </Content>
            </PageHeader>
        );
    } else if (selectedSubService.type === 4) {
        const [modalActive, showModal] = useState(false);
        const [userName, getUserName] = useState(false);

        function confirmuserNmae() {
            dispatch({
                type: 'users/updateUser',
                payload: userName,
            });
        }

        function showModalState() {
            showModal(true);
        }

        const user = JSON.parse(localStorage.getItem('user')).user?.name;
        const userDetails = JSON.parse(localStorage.getItem('user'));

        const menu = (
            <Menu>
                <Menu.Item key="0" onClick={showModalState}>
                    edit name
                </Menu.Item>
                <Menu.Item key="1">
                    <a href="#"> edit password</a>
                </Menu.Item>
                <Menu.Divider />
            </Menu>
        );

        return !modalActive ? (
            <PageHeader
                backIcon={<Icon type="arrow-left" />}
                onBack={() => {
                    dispatch(
                        routerRedux.push(
                            '/service/compute/elastic-cloud-services'
                        )
                    );
                }}
                style={{ padding: `0px` }}
                title={`${user.charAt(0).toUpperCase() + user.slice(1)}`}
            >
                <Content>
                    <div style={{ marginTop: `19px` }} className="content">
                        <Paragraph>
                            <Descriptions column={2} colon={false}>
                                <Descriptions.Item label="Project">
                                    {' '}
                                    {userDetails.hasOwnProperty('project')
                                        ? userDetails.project.name
                                        : '-'}{' '}
                                </Descriptions.Item>
                                <Descriptions.Item label="Role">
                                    {' '}
                                    {userDetails.hasOwnProperty('roles')
                                        ? userDetails.roles.map(item => {
                                              return <Tag>{item.name}</Tag>;
                                          })
                                        : '-'}{' '}
                                </Descriptions.Item>
                            </Descriptions>
                        </Paragraph>
                    </div>
                </Content>
            </PageHeader>
        ) : (
            <Modal
                title="Edit User Name"
                visible={true}
                onOk={() => confirmuserNmae(userName)}
                onCancel={() => showModal(false)}
            >
                <Form layout="inline">
                    <Form.Item>
                        <Input
                            prefix={
                                <Icon
                                    type="user"
                                    style={{ color: 'rgba(0,0,0,.25)' }}
                                />
                            }
                            placeholder="Username"
                            onChange={e => getUserName(e.target.value)}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
};
