import {
    Collapse,
    Icon,
    Row,
    Col,
    Spin,
    Divider,
    Descriptions,
    Badge,
    Card,
    Popconfirm,
    Form,
    Select,
    Typography,
    Tag,
    Input,
    Switch,
    Button,
} from 'antd';
import ReactDOM from 'react-dom';
import moment from 'moment';
import React from 'react';
import { connect } from 'dva';
import FormRow from '@/pages/service/components/FormRow';

const { Option } = Select;
const marks = {
    50: '50',
    100: '100',
    150: '150',
    200: '200',
    250: '250',
    300: '300',
    350: '350',
    400: '400',
    450: '450',
    500: '500',
};

class SubnetDetailPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            subnet: props.subnet.id,
            enable_gateway: props.subnet.gateway_ip ? true : false,
            is_dhcp_enabled: props.subnet.is_dhcp_enabled,
            gateway_ip: props.subnet.gateway_ip,
            allocation_pools: props.subnet.allocation_pools
                .map(item => `${item.start}-${item.end},`)[0]
                .substring(
                    0,
                    props.subnet.allocation_pools.map(
                        item => `${item.start}-${item.end},`
                    )[0].length - 1
                ),
        };
    }

    enableGateway(value) {
        this.setState({ enable_gateway: value });
    }

    enableDHCP(value) {
        this.setState({ is_dhcp_enabled: value });
    }

    gatewayIP(e) {
        this.setState({ gateway_ip: e.target.value });
    }

    allocationPools(e) {
        this.setState({ allocation_pools: e.target.value });
    }

    onChange = value => {
        this.setState({
            inputValue: value,
        });
    };

    async onOK() {
        await this.props.dispatch({
            type: 'vpc/updateSubnet',
            payload: { ...this.state },
        });

        this.setState({
            subnet: this.props.subnet.id,
            enable_gateway: this.props.subnet.gateway_ip ? true : false,
            is_dhcp_enabled: this.props.subnet.is_dhcp_enabled,
            gateway_ip: this.props.subnet.gateway_ip,
            allocation_pools: this.props.subnet.allocation_pools
                .map(item => `${item.start}-${item.end},`)[0]
                .substring(
                    0,
                    this.props.subnet.allocation_pools.map(
                        item => `${item.start}-${item.end},`
                    )[0].length - 1
                ),
        });
        this.props.onCancel();
    }

    render() {
        const { subnet } = this.props;
        return subnet.id !== this.props.updateSubnetState ? (
            <Descriptions column={2} colon={true}>
                <Descriptions.Item label="ID">{subnet.id}</Descriptions.Item>
                <Descriptions.Item label="CIDR">
                    {subnet.cidr}
                </Descriptions.Item>
                <Descriptions.Item label="Enable Gateway">
                    {
                        <Switch
                            disabled
                            checkedChildren="On"
                            unCheckedChildren="Off"
                            defaultChecked={subnet.gateway_ip}
                        />
                    }
                </Descriptions.Item>
                <Descriptions.Item label="Gateway">
                    {subnet.gateway_ip}
                </Descriptions.Item>
                <Descriptions.Item label="Allocation Pool">
                    {subnet?.allocation_pools.map(item => (
                        <Tag>
                            {item.start} - {item.end}
                        </Tag>
                    ))}
                </Descriptions.Item>
                <Descriptions.Item label="Created At">
                    {moment(subnet?.created_at).fromNow()}
                </Descriptions.Item>
                <Descriptions.Item label="Updated At">
                    {moment(subnet?.updated_at).fromNow()}
                </Descriptions.Item>
                <Descriptions.Item label="DHCP">
                    {
                        <Switch
                            disabled
                            checkedChildren="On"
                            unCheckedChildren="Off"
                            defaultChecked={subnet.is_dhcp_enabled}
                        />
                    }
                </Descriptions.Item>
            </Descriptions>
        ) : (
            <>
                <Descriptions column={2} colon={true}>
                    <Descriptions.Item label="ID">
                        {subnet.id}
                    </Descriptions.Item>
                    <Descriptions.Item label="CIDR">
                        {subnet.cidr}
                    </Descriptions.Item>
                    <Descriptions.Item label="Enable Gateway">
                        {
                            <Switch
                                checkedChildren="On"
                                unCheckedChildren="Off"
                                defaultChecked={subnet.gateway_ip}
                                onChange={this.enableGateway.bind(this)}
                            />
                        }
                    </Descriptions.Item>
                    <Descriptions.Item label="Gateway">
                        <Input
                            disabled={!this.state.enable_gateway}
                            placeholder={subnet.gateway_ip}
                            onChange={this.gatewayIP.bind(this)}
                        />
                    </Descriptions.Item>
                    <Descriptions.Item label="Allocation Pool">
                        <Input
                            onChange={this.allocationPools.bind(this)}
                            placeholder={
                                subnet?.allocation_pools.length > 0
                                    ? `${subnet.allocation_pools[0].start} - ${subnet.allocation_pools[0].end}`
                                    : '-'
                            }
                        />
                    </Descriptions.Item>
                    <Descriptions.Item label="Created At">
                        {moment(subnet?.created_at).fromNow()}
                    </Descriptions.Item>
                    <Descriptions.Item label="Updated At">
                        {moment(subnet?.updated_at).fromNow()}
                    </Descriptions.Item>
                    <Descriptions.Item label="DHCP">
                        {
                            <Switch
                                checkedChildren="On"
                                unCheckedChildren="Off"
                                defaultChecked={subnet.is_dhcp_enabled}
                                onChange={this.enableDHCP.bind(this)}
                            />
                        }
                    </Descriptions.Item>
                </Descriptions>

                <div style={{ paddingTop: `12px` }}>
                    <Button
                        loading={this.props.updatingSubnet}
                        style={{ marginRight: `12px` }}
                        type="primary"
                        onClick={this.onOK.bind(this)}
                    >
                        Save
                    </Button>
                    <Button onClick={this.props.onCancel}>Cancel</Button>
                </div>
            </>
        );
    }
}

export default connect(state => {
    return {
        updatingSubnet: state.loading.effects['vpc/updateSubnet'],
    };
})(SubnetDetailPanel);
