import React, { PureComponent } from 'react';
import { Form, Input, Radio, Button, Switch } from 'antd';
import FormRow from '../../../components/FormRow';
import { connect } from 'dva';
import { getPageQuery } from '@/utils/utils';

class SubnetCreation extends PureComponent {
    state = {
        is_dhcp_enabled: true,
        enable_gateway: true,
    };

    handleSubmit = e => {
        e.preventDefault();

        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { keys, names } = values;

                values['network_id'] = getPageQuery().network_id;
                values['name'] = values['subnet_name'];
                values['is_dhcp_enabled'] = this.state.is_dhcp_enabled;

                this.props.dispatch({
                    type: 'vpc/createSubnet',
                    payload: values,
                });
            }
        });
    };

    switchChange(checked) {
        this.setState({ is_dhcp_enabled: checked });
    }

    gatewayStatus(checked) {
        this.setState({ enable_gateway: checked });
    }

    render() {
        const IPExpression = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        const { getFieldDecorator } = this.props.form;
        const { initalValues } = this.props;

        return this.props.type === 'modal' ? (
            <Form
                onSubmit={this.handleSubmit}
                layout="vertical"
                hideRequiredMark
            >
                <FormRow
                    style={{ marginBottom: `12px` }}
                    title={'Subnet Name'}
                    paragraph={'Enter Subnet Name'}
                    dataKey="subnet_name"
                    decorator={{
                        rules: [
                            {
                                message: 'Please enter correct subnet name',
                                pattern: /^[a-zA-Z]+([-_.]?[a-zA-Z0-9]+)*$/,
                            },
                            {
                                required: true,
                                message: 'Please enter subnet name',
                            },
                        ],
                    }}
                    getFieldDecorator={this.props.form.getFieldDecorator}
                    span={24}
                >
                    <Input size="default" style={{ width: '500px' }} />
                </FormRow>

                <FormRow
                    style={{ marginBottom: `12px` }}
                    title={'CIDR Block'}
                    paragraph={'Please enter CIDR Block'}
                    dataKey="cidr"
                    decorator={{
                        rules: [
                            {
                                message: 'Please enter correct CIDR block',
                                pattern: /^([0-9]{1,3}\.){3}[0-9]{1,3}(\/([0-9]|[1-2][0-9]|3[0-2]))?$/,
                            },
                            {
                                required: true,
                                message: 'Please enter CIDR block',
                            },
                        ],
                    }}
                    getFieldDecorator={this.props.form.getFieldDecorator}
                    span={24}
                >
                    <Input
                        placeholder="192.168.1.0/24"
                        size="default"
                        style={{ width: '500px' }}
                    />
                </FormRow>

                <FormRow
                    style={{ marginBottom: `12px` }}
                    title={'IP Version'}
                    paragraph={'Select IP version'}
                    dataKey="ip_version"
                    decorator={{
                        rules: [
                            {
                                required: true,
                                message: 'you must select IP version',
                            },
                        ],
                    }}
                    getFieldDecorator={this.props.form.getFieldDecorator}
                    span={12}
                >
                    <Radio.Group
                        style={{ width: '100%' }}
                        size="default"
                        style={{ width: '500px' }}
                        buttonStyle="solid"
                    >
                        <Radio.Button
                            style={{ width: '50%', textAlign: 'center' }}
                            value="4"
                        >
                            IPV4
                        </Radio.Button>
                    </Radio.Group>
                </FormRow>

                <FormRow
                    style={{ marginBottom: `12px` }}
                    title={'Gateway'}
                    paragraph={`Specify the IP Address used for the gateway. If left blank, the first
                    available IP address within your VPC CIDR will be automatically chosen.`}
                    dataKey="gateway_ip"
                    decorator={{
                        rules: [
                            {
                                message: 'Please enter correct Gateway',
                                pattern: /((25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)(,\n|,?$))/,
                            },
                        ],
                    }}
                    getFieldDecorator={this.props.form.getFieldDecorator}
                    span={24}
                >
                    <Input
                        placeholder="192.168.1.1"
                        disabled={this.state.enable_gateway ? false : true}
                        size="default"
                        style={{ width: '500px' }}
                    />
                </FormRow>

                <FormRow
                    style={{ marginBottom: `12px` }}
                    title={'DNS Addresses'}
                    paragraph={`Enter DNS nameservers seperated by a comma.`}
                    dataKey="dns_servers"
                    decorator={{
                        rules: [
                            {
                                message: 'Please enter correct DNS nameservers',
                                pattern: /((25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)(,\n|,?$))/,
                            },
                        ],
                    }}
                    getFieldDecorator={this.props.form.getFieldDecorator}
                    span={24}
                >
                    <Input
                        placeholder="192.168.1.2,192.168.1.3"
                        size="default"
                        style={{ width: '500px' }}
                    />
                </FormRow>

                <FormRow
                    style={{ marginBottom: `12px` }}
                    title={'DHCP'}
                    paragraph={` `}
                    dataKey="is_dhcp_enabled"
                    decorator={{}}
                    getFieldDecorator={this.props.form.getFieldDecorator}
                    span={24}
                >
                    <Switch
                        checkedChildren="On"
                        unCheckedChildren="Off"
                        defaultChecked={this.state.is_dhcp_enabled}
                        onChange={this.switchChange.bind(this)}
                    />
                </FormRow>

                <FormRow
                    style={{ marginBottom: `12px` }}
                    title={'Allocation Pool'}
                    paragraph={` `}
                    dataKey="allocation_pools"
                    decorator={{
                        rules: [
                            {
                                message:
                                    'Please enter Allocation Pool IP in correct form',
                                pattern: /((25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)(,\n|,?$))/,
                            },
                        ],
                    }}
                    getFieldDecorator={this.props.form.getFieldDecorator}
                    span={24}
                >
                    <Input
                        placeholder="192.168.1.10-192.168.1.30,192.168.1.35-192.168.1.50"
                        disabled={this.state.is_dhcp_enabled ? false : true}
                    />
                </FormRow>

                <Form.Item>
                    <Button
                        style={{}}
                        loading={this.props.createSubnet}
                        type="primary"
                        htmlType="submit"
                    >
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        ) : (
            <Form>
                <FormRow
                    title={'Subnet Name'}
                    paragraph={'Select a name for identification'}
                    style={{ padding: '10px' }}
                    default={this.props?.data?.subnet_name}
                    dataKey="subnet_name"
                    decorator={{
                        rules: [
                            {
                                message: 'Please enter correct subnet name',
                                pattern: /^[a-zA-Z]+([-_.]?[a-zA-Z0-9]+)*$/,
                            },
                            {
                                required: true,
                                message: 'Please enter subnet name',
                            },
                        ],
                    }}
                    getFieldDecorator={this.props.form.getFieldDecorator}
                    span={24}
                >
                    <Input size="default" style={{ width: '500px' }} />
                </FormRow>

                <FormRow
                    title={'CIDR Block'}
                    default={this.props?.data?.cidr}
                    paragraph={'Please enter CIDR Block'}
                    style={{ padding: '10px' }}
                    dataKey="cidr"
                    decorator={{
                        rules: [
                            {
                                message: 'Please enter correct CIDR block',
                                pattern: /^([0-9]{1,3}\.){3}[0-9]{1,3}(\/([0-9]|[1-2][0-9]|3[0-2]))?$/,
                            },
                            {
                                required: true,
                                message: 'Please enter CIDR block',
                            },
                        ],
                    }}
                    getFieldDecorator={this.props.form.getFieldDecorator}
                    span={24}
                >
                    <Input
                        placeholder="192.168.1.0/24"
                        size="default"
                        style={{ width: '500px' }}
                    />
                </FormRow>

                <FormRow
                    title={'IP Version'}
                    default={this.props?.data?.ip_version}
                    style={{ padding: '10px' }}
                    dataKey="ip_version"
                    decorator={{
                        rules: [
                            {
                                required: true,
                                message: 'You must select IP version',
                            },
                        ],
                    }}
                    getFieldDecorator={this.props.form.getFieldDecorator}
                    span={12}
                >
                    <Radio.Group
                        style={{ width: '100%' }}
                        size="default"
                        style={{ width: '500px' }}
                        buttonStyle="solid"
                    >
                        <Radio.Button
                            style={{ width: '50%', textAlign: 'center' }}
                            value="4"
                        >
                            IPV4
                        </Radio.Button>
                    </Radio.Group>
                </FormRow>

                <FormRow
                    title={'Enable Gateway'}
                    style={{ padding: '10px' }}
                    paragraph={` `}
                    dataKey="enable_gateway"
                    decorator={{}}
                    getFieldDecorator={this.props.form.getFieldDecorator}
                    span={24}
                >
                    <Switch
                        checkedChildren="On"
                        unCheckedChildren="Off"
                        defaultChecked={this.props?.formsData?.enable_gateway}
                        onChange={this.gatewayStatus.bind(this)}
                    />
                </FormRow>
                <FormRow
                    title={'Gateway'}
                    style={{ padding: '10px' }}
                    paragraph={`Specify the IP Address used for the VPC gateway. If left blank, the first
                    available IP address within your VPC CIDR will be automatically chosen.`}
                    dataKey="gateway_ip"
                    decorator={{
                        rules: [
                            {
                                message: 'Please enter correct Gateway',
                                pattern: /((25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)(,\n|,?$))/,
                            },
                        ],
                    }}
                    getFieldDecorator={this.props.form.getFieldDecorator}
                    span={24}
                >
                    <Input
                        placeholder="192.168.1.1"
                        disabled={
                            this.props.formsData.enable_gateway ? false : true
                        }
                        size="default"
                        style={{ width: '500px' }}
                    />
                </FormRow>

                <FormRow
                    default={this.props?.data?.dns_servers}
                    title={'DNS Addresses'}
                    style={{ padding: '10px' }}
                    paragraph={`Enter DNS nameservers seperated by a comma.`}
                    dataKey="dns_servers"
                    decorator={{
                        rules: [
                            {
                                message: 'Please enter correct DNS nameservers',
                                pattern: /((25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)(,\n|,?$))/,
                            },
                        ],
                    }}
                    getFieldDecorator={this.props.form.getFieldDecorator}
                    span={24}
                >
                    <Input
                        placeholder="192.168.1.2,192.168.1.3"
                        size="default"
                        style={{ width: '500px' }}
                    />
                </FormRow>

                <FormRow
                    title={'DHCP'}
                    style={{ padding: '10px' }}
                    paragraph={` `}
                    dataKey="is_dhcp_enabled"
                    decorator={{}}
                    getFieldDecorator={this.props.form.getFieldDecorator}
                    span={24}
                >
                    <Switch
                        checkedChildren="On"
                        unCheckedChildren="Off"
                        defaultChecked={this.props?.formsData?.is_dhcp_enabled}
                        onChange={this.switchChange.bind(this)}
                    />
                </FormRow>

                <FormRow
                    title={'Allocation Pool'}
                    style={{ padding: '10px' }}
                    paragraph={` `}
                    dataKey="allocation_pools"
                    decorator={{
                        rules: [
                            {
                                message:
                                    'Please enter Allocation Pool IP in correct form',
                                pattern: /((25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)(,\n|,?$))/,
                            },
                        ],
                    }}
                    getFieldDecorator={this.props.form.getFieldDecorator}
                    span={24}
                >
                    <Input
                        disabled={
                            this.props.formsData.is_dhcp_enabled ? false : true
                        }
                        placeholder="192.168.1.10-192.168.1.30,192.168.1.35-192.168.1.50"
                    />
                </FormRow>
            </Form>
        );
    }
}

export default connect(({ vpc, global, loading }) => {
    return {
        ...vpc,
        global,
        createSubnet: loading.effects['vpc/createSubnet'],
    };
})(
    Form.create({
        onValuesChange(props, values) {
            const { dispatch } = props;
            dispatch({
                type: `vpc/updateFormData`,
                payload: {
                    ...values,
                },
            });
        },
    })(SubnetCreation)
);
