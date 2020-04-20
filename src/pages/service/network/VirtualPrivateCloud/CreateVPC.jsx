import { Button, Row, Select, Tabs, Steps } from 'antd';
import React from 'react';
import { connect } from 'dva';
import SubnetCreation from './components/SubnetCreation';
import VPCBasicForm from './components/VPCBasicForm';
import Finalize from '@/components/Finalize';

const { Step } = Steps;
const { TabPane } = Tabs;

class CreateVPC extends React.PureComponent {
    constructor(props) {
        super(props);
        this.add = this.add.bind(this);
        this.singleSubnet = this.singleSubnet.bind(this);
        this.cardEdit = this.cardEdit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.gatherNetworkData = this.gatherNetworkData.bind(this);
        this.gatherSubnetsData = this.gatherSubnetsData.bind(this);
        this.subnetNumber = 1;

        this.state = {
            current: 0,
            subnets: {
                activeKey: this.subnetNumber.toString(),
                list: [
                    {
                        tabData: {
                            tab: `Subnet ${this.subnetNumber}`,
                            closable: false,
                            key: this.subnetNumber.toString(),
                        },
                        data: {
                            name: '',
                            cidr: '',
                            ip_version: '',
                            gateway_ip: '',
                        },
                        content: this.singleSubnet,
                    },
                ],
            },
            networkData: null,
            subnetData: null,
        };
    }

    componentWillUnmount() {
        this.props.dispatch({
            type: 'vpc/resetFormsData',
        });
    }

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'global/fetchAvailabilityZone',
        });
        dispatch({
            type: 'global/fetchRegions',
        });
        dispatch({
            type: 'global/fetchFlavors',
        });
        dispatch({
            type: 'global/fetchImages',
        });
    }

    networkConfig = () => {
        return (
            <VPCBasicForm
                data={this.state?.networkData}
                wrappedComponentRef={ref => (this.basicNetworkForm = ref)}
            />
        );
    };

    singleSubnet(initalValues) {
        return (
            <SubnetCreation
                data={this.state.subnetData}
                wrappedComponentRef={ref => (this.subnetConfigForm = ref)}
                initalValues={{ ...initalValues }}
            />
        );
    }

    subnetConfiguration = () => {
        return (
            <Tabs
                onChange={this.onChange}
                activeKey={this.state.subnets.activeKey}
                onEdit={this.cardEdit}
            >
                {this.state.subnets.list.map(subnet => {
                    return (
                        <TabPane
                            {...subnet.tabData}
                            tab={
                                subnet.data.name === undefined ||
                                subnet.data.name === null ||
                                subnet.data.name === ''
                                    ? subnet.tabData.tab
                                    : subnet.data.name
                            }
                        >
                            {subnet.content({ ...subnet.tabData })}
                        </TabPane>
                    );
                })}
            </Tabs>
        );
    };

    cardEdit(targetKey, action) {
        this[action](targetKey);
    }

    remove(targetKey) {
        let { activeKey } = this.state.subnets;

        let lastIndex;

        this.state.subnets.list.forEach((pane, i) => {
            if (pane.tabData.key === targetKey) {
                lastIndex = i - 1;
            }
        });

        const panes = this.state.subnets.list.filter(
            pane => pane.tabData.key !== targetKey
        );

        if (panes.length && activeKey === targetKey) {
            if (lastIndex >= 0) {
                activeKey = panes[lastIndex].tabData.key;
            } else {
                activeKey = panes[0].tabData.key;
            }
        }

        this.subnetNumber = activeKey;

        this.setState(state => {
            return {
                ...state,
                subnets: {
                    ...state.subnets,
                    list: [...panes],
                    activeKey,
                },
            };
        });
    }

    onChange(activeKey) {
        this.setState(state => {
            return {
                ...state,
                subnets: {
                    ...state.subnets,
                    activeKey,
                },
            };
        });
    }

    add() {
        this.subnetNumber++;
        const newSubnet = {
            tabData: {
                closable: true,
                tab: `Subnet ${this.subnetNumber}`,
                key: this.subnetNumber.toString(),
            },
            data: {
                name: '',
                cidr: '',
                ip_version: '',
                gateway_ip: '',
            },
            content: this.singleSubnet,
        };

        this.setState(state => {
            return {
                ...state,
                subnets: {
                    ...state.subnets,
                    activeKey: this.subnetNumber.toString(),
                    list: [...state.subnets.list, newSubnet],
                },
            };
        });
    }

    handleSubmit = e => {
        e.preventDefault();
        const {
            is_router_external,
            name,
            is_shared,
            region,
        } = this.props.formsData;
        const {
            subnet_name,
            ip_version,
            gateway_ip,
            dns_servers,
            cidr,
            is_dhcp_enabled,
            allocation_pools,
            enable_gateway,
        } = this.props.formsData;

        let payload = {
            net: {
                region: region,
                name: name,
                shared: is_shared ? is_shared : false,
                is_router_external,
            },
            subnet: {
                name: subnet_name,
                cidr: cidr,
                ip_version: ip_version,
                gateway_ip: gateway_ip,
                is_dhcp_enabled: is_dhcp_enabled,
                enable_gateway: enable_gateway,
                allocation_pools: allocation_pools,
            },
        };

        if (dns_servers && !Array.isArray(dns_servers))
            payload.subnet['dns_nameservers'] = [dns_servers];

        const { dispatch, formsData } = this.props;
        dispatch({
            type: `vpc/create`,
            payload: payload,
        });
    };

    gatherNetworkData() {
        let hasNetworkFormData = false;
        this.basicNetworkForm.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({
                    networkData: values,
                });
                hasNetworkFormData = true;
            }
        });
        return hasNetworkFormData;
    }

    gatherSubnetsData() {
        let hasSubnetFormData = false;
        this.subnetConfigForm.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({
                    subnetData: values,
                });
                hasSubnetFormData = true;
            }
        });
        return hasSubnetFormData;
    }

    setNetworkData() {
        const { networkData } = this.state;
    }

    setSubnetData() {
        const { subnetData } = this.state;
    }

    next() {
        let shouldProceed = false;
        if (this.state.current === 0) {
            shouldProceed = this.gatherNetworkData();
        } else if (this.state.current === 1) {
            shouldProceed = this.gatherSubnetsData();
        }

        if (shouldProceed) {
            let current = this.state.current;
            current++;
            this.setState(state => {
                return {
                    ...state,
                    current,
                };
            });
        }
    }

    prev() {
        let current = this.state.current;
        current--;
        if (current === 0) {
            this.setNetworkData();
        } else if (current === 1) {
            this.setSubnetData();
        }
        this.setState(state => {
            return {
                ...state,
                current: current,
            };
        });
    }

    render() {
        const { current } = this.state;
        return (
            <div
                style={{
                    margin: `0px`,
                    marginBottom: `0`,
                    backgroundColor: `#fff`,
                    padding: `34px`,
                }}
            >
                <Row
                    style={{
                        margiTop: `50px`,
                        padding: `32px`,
                        border: `1px solid #e5e5e5`,
                        borderBottom: 0,
                        background: `#fbfbfb`,
                        borderRadius: `9px 9px 0px 0px`,
                        paddingRight: `55px`,
                        paddingBottom: `20px`,
                    }}
                >
                    <Steps current={current}>
                        <Step description="Basic Details" title="Step 1" />
                        <Step description="Subnets Settings" title="Step 2" />
                        <Step description="Confirmation" title="Step 3" />
                    </Steps>
                </Row>

                <Row
                    style={{
                        padding: `40px`,
                        border: `1px solid #e5e5e5`,
                    }}
                >
                    {current === 0 && this.networkConfig()}
                    {current === 1 && this.subnetConfiguration()}
                    {current === 2 && (
                        <Finalize dataSource={this.props.formsData} />
                    )}
                </Row>

                <div style={{ textAlign: 'right', marginTop: `24px` }}>
                    {current >= 1 && (
                        <Button
                            disabled={this.props.creatingVPC}
                            style={{ marginRight: 24, width: '300px' }}
                            size="large"
                            onClick={this.prev.bind(this)}
                        >
                            Previous
                        </Button>
                    )}
                    {current < 2 && (
                        <Button
                            style={{ width: '300px' }}
                            type="primary"
                            size="large"
                            onClick={this.next.bind(this)}
                        >
                            Next
                        </Button>
                    )}
                    {current === 2 && (
                        <Button
                            loading={this.props.creatingVPC}
                            style={{ width: '300px' }}
                            type="primary"
                            size="large"
                            onClick={e => {
                                this.handleSubmit(e);
                            }}
                        >
                            Done
                        </Button>
                    )}
                </div>
            </div>
        );
    }
}

export default connect(({ vpc, global, loading }) => ({
    creatingVPC: loading.effects['vpc/create'],
    ...vpc,
    ...global,
}))(CreateVPC);
