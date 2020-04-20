import {
    PageHeader,
    Timeline,
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
import { connect } from 'dva';
import moment from 'moment';
const { Paragraph } = Typography;
const { Option } = Select;
const antIcon = (
    <Icon
        type="loading"
        style={{ paddingLeft: '2px', fontSize: 18, marginRight: '5px' }}
        spin
    />
);

export default props => {
    const { loading } = props.appState;
    const attachingFIP = loading.effects['ecs/attach'],
        detachingFIP = loading.effects['ecs/detach'],
        fetchingFIP = loading.effects['ecs/update'],
        resizingVM = loading.effects['ecs/resizeServer'];

    const {
        serviceLayout,
        ecs,
        keypair,
        floatingip,
        vpc,
        router,
        flavor,
    } = props.appState;

    const { dispatch } = props;

    const { selectedInstance } = ecs;
    const { selectedNetwork } = vpc;

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

        if (assignOrReleaseFIP === 'assign') {
            dispatch({
                type: 'floatingip/update',
            });
        }

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
            <div>
                <div className="content">
                    <Row>
                        <Col span={12}>
                            <Row
                                gutter={12}
                                type="flex"
                                align="middle"
                                style={{ paddingBottom: '10px' }}
                            >
                                <Col style={{ textAlign: 'right' }} span={4}>
                                    <Typography.Text>
                                        {' '}
                                        Created at{' '}
                                    </Typography.Text>
                                </Col>

                                <Col span={20}>
                                    {moment(
                                        selectedInstance?.created_at
                                    ).fromNow()}
                                </Col>
                            </Row>

                            <Row
                                gutter={12}
                                type="flex"
                                align="middle"
                                style={{ paddingBottom: '10px' }}
                            >
                                <Col style={{ textAlign: 'right' }} span={4}>
                                    <Typography.Text>
                                        {' '}
                                        Updated at{' '}
                                    </Typography.Text>
                                </Col>

                                <Col span={20}>
                                    <Typography.Text>
                                        {' '}
                                        {moment(
                                            selectedInstance?.updated_at
                                        ).fromNow()}{' '}
                                    </Typography.Text>
                                </Col>
                            </Row>

                            <Row
                                gutter={12}
                                type="flex"
                                align="middle"
                                style={{ paddingBottom: '10px' }}
                            >
                                <Col style={{ textAlign: 'right' }} span={4}>
                                    <Typography.Text>
                                        {' '}
                                        Image ID{' '}
                                    </Typography.Text>
                                </Col>

                                <Col span={20}>
                                    {selectedInstance?.image.id?.length}
                                </Col>
                            </Row>

                            <Row
                                gutter={12}
                                type="flex"
                                align="middle"
                                style={{ paddingBottom: '10px' }}
                            >
                                <Col style={{ textAlign: 'right' }} span={4}>
                                    <Typography.Text>
                                        {' '}
                                        Keypairs{' '}
                                    </Typography.Text>
                                </Col>

                                <Col span={20}>
                                    {selectedInstance.key_name
                                        ? selectedInstance.key_name
                                        : '-'}
                                </Col>
                            </Row>

                            <Row
                                gutter={12}
                                type="flex"
                                align="middle"
                                style={{ paddingBottom: '10px' }}
                            >
                                <Col style={{ textAlign: 'right' }} span={4}>
                                    <Typography.Text> Volumes </Typography.Text>
                                </Col>

                                <Col span={20}>
                                    {selectedInstance?.attached_volumes?.length}
                                </Col>
                            </Row>

                            <Row
                                gutter={12}
                                type="flex"
                                align="middle"
                                style={{ paddingBottom: '10px' }}
                            >
                                <Col style={{ textAlign: 'right' }} span={4}>
                                    <Typography.Text>
                                        {' '}
                                        Fixed Ips{' '}
                                    </Typography.Text>
                                </Col>

                                <Col span={20}>
                                    {Object.keys(
                                        selectedInstance.addresses
                                    ).map(obj =>
                                        selectedInstance.addresses[
                                            obj
                                        ].map(elem =>
                                            elem?.['OS-EXT-IPS:type'] ===
                                            'fixed' ? (
                                                <Tag> {elem.addr} </Tag>
                                            ) : null
                                        )
                                    )}{' '}
                                </Col>
                            </Row>
                            <Row
                                gutter={12}
                                type="flex"
                                align="middle"
                                style={{ paddingBottom: '10px' }}
                            >
                                <Divider orientation="left">Metadata</Divider>

                                {Object.entries(selectedInstance.metadata).map(
                                    key => (
                                        <>
                                            <Col
                                                span={16}
                                            >{`${key[0]} : `}</Col>
                                            <Col span={8}>{`${key[1]}`}</Col>
                                            <br />
                                        </>
                                    )
                                )}
                            </Row>
                        </Col>

                        <Col span={12}>
                            <Row
                                gutter={12}
                                type="flex"
                                align="middle"
                                style={{ paddingBottom: '10px' }}
                            >
                                <Col style={{ textAlign: 'right' }} span={4}>
                                    <Typography.Text>
                                        {' '}
                                        Elastic IP{' '}
                                    </Typography.Text>
                                </Col>

                                <Col span={20}>
                                    <Tooltip
                                        style={{ textAlign: 'center' }}
                                        placement="bottom"
                                        title="Please make sure that the network of this virtual machine is connected to an external router."
                                        data-html="true"
                                    >
                                        {floatingIp ? (
                                            <Tag
                                                style={{ padding: `3px 10px` }}
                                            >
                                                {floatingIp.addr}
                                            </Tag>
                                        ) : null}{' '}
                                        {assignOrReleaseFIP === 'Cancel' ? (
                                            <>
                                                <Select
                                                    loading={
                                                        attachingFIP ||
                                                        fetchingFIP
                                                    }
                                                    disabled={attachingFIP}
                                                    value={elasticIpValue}
                                                    showSearch
                                                    onChange={value => {
                                                        setElasticIpValue(
                                                            value
                                                        );
                                                    }}
                                                    style={{
                                                        width: 200,
                                                        marginRight: `10px`,
                                                    }}
                                                    placeholder="Attach an IP"
                                                    optionFilterProp="children"
                                                    autoFocus={true}
                                                    onFocus={() => {
                                                        dispatch({
                                                            type: `floatingip/update`,
                                                            payload: {
                                                                force: true,
                                                            },
                                                        });
                                                    }}
                                                    filterOption={(
                                                        input,
                                                        option
                                                    ) =>
                                                        option.props.children
                                                            .toLowerCase()
                                                            .indexOf(
                                                                input.toLowerCase()
                                                            ) >= 0
                                                    }
                                                >
                                                    {!props.appState.loading
                                                        .effects[
                                                        'floatingip/update'
                                                    ] ? (
                                                        props.appState.floatingip?.list.map(
                                                            items => {
                                                                return (
                                                                    <Option
                                                                        key={
                                                                            items.id
                                                                        }
                                                                        disabled={
                                                                            items.status ===
                                                                            'ACTIVE'
                                                                        }
                                                                        value={
                                                                            items.name
                                                                        }
                                                                    >
                                                                        {
                                                                            items.name
                                                                        }
                                                                    </Option>
                                                                );
                                                            }
                                                        )
                                                    ) : (
                                                        <Option
                                                            disabled={true}
                                                            value={1}
                                                        >
                                                            <Spin
                                                                style={{
                                                                    display:
                                                                        'flex',
                                                                    justifyContent:
                                                                        'center',
                                                                    marginTop:
                                                                        '10px',
                                                                    marginBottom:
                                                                        '10px',
                                                                }}
                                                                size="large"
                                                                indicator={
                                                                    antIcon
                                                                }
                                                            />
                                                        </Option>
                                                    )}
                                                </Select>
                                                <Button
                                                    style={{
                                                        marginRight: `10px`,
                                                    }}
                                                    type="primary"
                                                    disabled={
                                                        !elasticIpValue ||
                                                        attachingFIP
                                                    }
                                                    onClick={async () => {
                                                        await dispatch({
                                                            type: `ecs/attach`,
                                                            payload: {
                                                                instance_id:
                                                                    selectedInstance.id,
                                                                floating_ip: elasticIpValue,
                                                            },
                                                        });
                                                    }}
                                                >
                                                    Assign
                                                </Button>
                                            </>
                                        ) : null}
                                        {detachingFIP ? (
                                            <Spin
                                                indicator={antIcon}
                                                spinning={detachingFIP}
                                            />
                                        ) : null}
                                        {!detachingFIP && (
                                            <Button
                                                disabled={attachingFIP}
                                                onClick={async () => {
                                                    if (
                                                        assignOrReleaseFIP ===
                                                        'Cancel'
                                                    ) {
                                                        setElasticIpValue(null);
                                                        assignFIP(
                                                            !floatingIp
                                                                ? 'Assign'
                                                                : 'Release'
                                                        );
                                                    }

                                                    if (
                                                        assignOrReleaseFIP ===
                                                        'Assign'
                                                    ) {
                                                        assignFIP('Cancel');
                                                    }
                                                    if (
                                                        assignOrReleaseFIP ===
                                                        'Release'
                                                    ) {
                                                        await dispatch({
                                                            type: `ecs/detach`,

                                                            payload: {
                                                                instance_id:
                                                                    selectedInstance.id,
                                                                floating_ip:
                                                                    floatingIp.addr,
                                                            },
                                                        });
                                                    }
                                                }}
                                            >
                                                {assignOrReleaseFIP}
                                            </Button>
                                        )}
                                    </Tooltip>
                                </Col>
                            </Row>

                            <Row
                                gutter={12}
                                type="flex"
                                align="middle"
                                style={{ paddingBottom: '10px' }}
                            >
                                <Col style={{ textAlign: 'right' }} span={4}>
                                    <Typography.Text> Flavor </Typography.Text>
                                </Col>

                                <Col span={20}>
                                    {flavorState === false ? (
                                        <Tag
                                            style={{
                                                padding: `3px 10px`,
                                                marginRight: `10px`,
                                            }}
                                        >
                                            {selectedInstance.flavor
                                                ?.original_name
                                                ? selectedInstance.flavor
                                                      ?.original_name
                                                : flavor.list.find(
                                                      elem =>
                                                          elem.id ===
                                                          selectedInstance
                                                              ?.flavor?.id
                                                  )?.name}
                                        </Tag>
                                    ) : (
                                        <Select
                                            loading={
                                                resizingVM &&
                                                ecs.listCurrentResizeVMs.includes(
                                                    selectedInstance.id
                                                )
                                            }
                                            disabled={
                                                resizingVM &&
                                                ecs.listCurrentResizeVMs.includes(
                                                    selectedInstance.id
                                                )
                                            }
                                            showSearch
                                            style={{ width: 200 }}
                                            placeholder="Select Flavor"
                                            optionFilterProp="children"
                                            onChange={handleAssignFlavor}
                                            autoFocus={true}
                                            filterOption={(input, option) =>
                                                option.props.children
                                                    .toLowerCase()
                                                    .indexOf(
                                                        input.toLowerCase()
                                                    ) >= 0
                                            }
                                        >
                                            {flavor.list.map(items => (
                                                <Option
                                                    key={`${items.id}phflavor`}
                                                    disabled={
                                                        items.id ===
                                                        selectedInstance.flavor
                                                            .id
                                                    }
                                                    value={items.id}
                                                >
                                                    {items.name}
                                                </Option>
                                            ))}
                                        </Select>
                                    )}
                                    <>
                                        {flavorState === false ? (
                                            <Button
                                                type="primary"
                                                disabled={
                                                    !(
                                                        selectedInstance.vm_state ===
                                                            'active' ||
                                                        selectedInstance.vm_state ===
                                                            'stopped'
                                                    )
                                                }
                                                onClick={() => setFlavor(true)}
                                            >
                                                Resize
                                            </Button>
                                        ) : (
                                            <>
                                                <Popconfirm
                                                    title="Are you sure to resize vm?"
                                                    onConfirm={selectedFlavor}
                                                    okText="Yes"
                                                    cancelText="No"
                                                    disabled={
                                                        (resizingVM &&
                                                            ecs.listCurrentResizeVMs.includes(
                                                                selectedInstance.id
                                                            )) ||
                                                        newFlavorSelect === ''
                                                    }
                                                >
                                                    <Button
                                                        type="primary"
                                                        disabled={
                                                            (resizingVM &&
                                                                ecs.listCurrentResizeVMs.includes(
                                                                    selectedInstance.id
                                                                )) ||
                                                            newFlavorSelect ===
                                                                ''
                                                        }
                                                        style={{
                                                            marginLeft: '10px',
                                                        }}
                                                    >
                                                        OK
                                                    </Button>
                                                </Popconfirm>
                                                <Button
                                                    disabled={
                                                        resizingVM &&
                                                        ecs.listCurrentResizeVMs.includes(
                                                            selectedInstance.id
                                                        )
                                                    }
                                                    style={{
                                                        marginLeft: '10px',
                                                    }}
                                                    onClick={clearAll.bind(
                                                        this
                                                    )}
                                                >
                                                    Cancel
                                                </Button>
                                            </>
                                        )}
                                    </>
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Descriptions
                                column={2}
                                colon={false}
                            ></Descriptions>

                            <Descriptions></Descriptions>

                            <Descriptions></Descriptions>
                        </Col>

                        <Paragraph></Paragraph>
                    </Row>
                </div>
            </div>
        );
    }
};
