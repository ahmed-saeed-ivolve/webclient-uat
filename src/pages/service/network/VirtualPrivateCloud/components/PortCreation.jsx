import React, { PureComponent } from 'react';
import { Form, Row, Col, Typography, Select, Input, Radio, Button } from 'antd';
import FormRow from '../../../components/FormRow';
import { connect } from 'dva';
import { getPageQuery } from '@/utils/utils';
const { Option } = Select;

class portCreation extends PureComponent {
    constructor() {
        super();
        this.state = {
            selected: '',
            fixed_ip: '',
            selectedSubnets: [],
        };
    }

    componentDidMount() {
        let selectedSubnets = this.props.subnet.subnetList.filter(item =>
            this.props.mountedData.subnets.includes(item.id)
        );

        this.setState({ selectedSubnets });
    }
    handleSubmit = e => {
        e.preventDefault();

        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { keys, names } = values;
                values['network_id'] = this.props.mountedData.id;

                this.props.dispatch({
                    type: 'router/createPort',
                    payload: values,
                });
            }
        });
    };

    handleChange(value) {
        this.setState({ selected: value });
    }

    handleChange2(value) {
        this.setState({ selected2: value });
    }

    handleChange3(value) {
        this.setState({ selected3: value });
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
                    title={'Port name'}
                    paragraph={'Select a name for identification'}
                    style={{ padding: '10px' }}
                    dataKey="name"
                    decorator={{
                        rules: [
                            {
                                message: 'Please enter correct port name',
                                pattern: /^[a-zA-Z]+([-_.]?[a-zA-Z0-9]+)*$/,
                            },
                            {
                                required: true,
                                message: 'Please enter port name',
                            },
                        ],
                    }}
                    getFieldDecorator={this.props.form.getFieldDecorator}
                    span={24}
                >
                    <Input size="default" style={{ width: '500px' }} />
                </FormRow>

                <FormRow
                    title={'Specify ip address or subnet'}
                    style={{ padding: '10px' }}
                    dataKey="specify_ip"
                    decorator={{
                        rules: [
                            {
                                required: true,
                                message: 'Please specify ip address or subnet',
                            },
                        ],
                    }}
                    getFieldDecorator={this.props.form.getFieldDecorator}
                    span={24}
                >
                    <Select
                        style={{ width: 120 }}
                        onSelect={value => this.handleChange(value)}
                    >
                        <Option value="fixed_ip"> Fixed ip </Option>
                        <Option value="subnet_id"> Subnet</Option>
                    </Select>
                </FormRow>

                {this.state.selected === 'fixed_ip' ? (
                    <Col>
                        <FormRow
                            title={'Fixed Ip'}
                            style={{ padding: '10px' }}
                            dataKey="fixed_ip"
                            decorator={{
                                rules: [
                                    {
                                        message:
                                            'Please enter correct IP address',
                                        pattern: IPExpression,
                                    },
                                    {
                                        required: true,
                                        message: 'Please enter IP address',
                                    },
                                ],
                            }}
                            getFieldDecorator={
                                this.props.form.getFieldDecorator
                            }
                            span={24}
                        >
                            <Input size="default" style={{ width: '500px' }} />
                        </FormRow>
                    </Col>
                ) : null}

                {this.state.selected === 'subnet_id' ? (
                    <Col>
                        <FormRow
                            title={'Subnets'}
                            style={{ padding: '10px' }}
                            dataKey="subnet_id"
                            decorator={{
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please select subnet',
                                    },
                                ],
                            }}
                            getFieldDecorator={
                                this.props.form.getFieldDecorator
                            }
                            span={24}
                        >
                            <Select
                                style={{ width: 120 }}
                                onSelect={value => this.handleChange2(value)}
                            >
                                {this.state.selectedSubnets.map(item => {
                                    return (
                                        <Option value={item.id}>
                                            {' '}
                                            {item.name}{' '}
                                        </Option>
                                    );
                                })}
                            </Select>
                        </FormRow>
                    </Col>
                ) : null}

                <FormRow
                    title={'VNIC type'}
                    style={{ padding: '10px' }}
                    dataKey="binding__vnic_type"
                    decorator={{
                        rules: [
                            {
                                required: true,
                                message: 'Please select VNIC type',
                            },
                        ],
                    }}
                    getFieldDecorator={this.props.form.getFieldDecorator}
                    span={24}
                >
                    <Select
                        style={{ width: 120 }}
                        onSelect={value => this.handleChange3(value)}
                    >
                        <Option value="normal"> Normal </Option>
                    </Select>
                </FormRow>

                <Form.Item>
                    <Button
                        style={{ margin: '10px' }}
                        loading={this.props.createPort}
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
                    title={'name'}
                    paragraph={'Select a name for identification'}
                    style={{ padding: '10px' }}
                    dataKey="subnet_name"
                    decorator={{
                        rules: [
                            {
                                required: true,
                                message: 'Please enter a port name',
                            },
                        ],
                    }}
                    getFieldDecorator={this.props.form.getFieldDecorator}
                    span={24}
                >
                    <Input size="default" style={{ width: '500px' }} />
                </FormRow>

                <FormRow
                    title={'Device Id'}
                    paragraph={'Please enter device Id'}
                    style={{ padding: '10px' }}
                    dataKey="cidr"
                    decorator={{
                        rules: [
                            {
                                required: true,
                                message: 'Please enter a port name',
                            },
                        ],
                    }}
                    getFieldDecorator={this.props.form.getFieldDecorator}
                    span={24}
                >
                    <Input size="default" style={{ width: '500px' }} />
                </FormRow>

                <FormRow
                    title={'Device Owner'}
                    paragraph={'Select IP version'}
                    style={{ padding: '10px' }}
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
                        <Radio.Button
                            style={{ width: '50%', textAlign: 'center' }}
                            value="6"
                            disabled
                        >
                            IPV6
                        </Radio.Button>
                    </Radio.Group>
                </FormRow>

                <FormRow
                    title={'Gateway'}
                    style={{ padding: '10px' }}
                    paragraph={`Specify the IP Address used for the Network gateway. If left blank, the first
                    available IP address within your Network CIDR will be automatically chosen.`}
                    dataKey="gateway_ip"
                    decorator={{
                        rules: [
                            {
                                message:
                                    'Please enter correct Gateway IP address',
                                pattern: /((25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)(,\n|,?$))/,
                            },
                        ],
                    }}
                    getFieldDecorator={this.props.form.getFieldDecorator}
                    span={24}
                >
                    <Input size="default" style={{ width: '500px' }} />
                </FormRow>

                <FormRow
                    title={'DNS Addresses'}
                    style={{ padding: '10px' }}
                    paragraph={`Enter DNS nameservers seperated by a comma.`}
                    dataKey="dns_servers"
                    decorator={{
                        rules: [
                            {
                                message:
                                    'Please enter DNS nameservers in correct form',
                                pattern: /((25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)(,\n|,?$))/,
                            },
                        ],
                    }}
                    getFieldDecorator={this.props.form.getFieldDecorator}
                    span={24}
                >
                    <Input size="default" style={{ width: '500px' }} />
                </FormRow>
            </Form>
        );
    }
}

export default connect(state => {
    return {
        createPort: state.loading.effects['router/createPort'],
        security_groups: state.securitygroup,
        subnet: state.vpc,
        ...state.router,
    };
})(
    Form.create({
        onValuesChange(props, values) {
            const { dispatch } = props;
            dispatch({
                type: `router/updateFormData`,
                payload: {
                    ...values,
                },
            });
        },
    })(portCreation)
);
