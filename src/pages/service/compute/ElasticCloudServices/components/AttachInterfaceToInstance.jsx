import { Drawer, Form, Button, Col, Row, Input, Select, DatePicker, Icon, Typography, Spin } from 'antd';
import ReactDOM from 'react-dom';
import { connect } from 'dva';

const antIcon = <Icon type="loading" style={{ paddingLeft: '2px', fontSize: 18, marginRight: '5px' }} spin />;

const { Option } = Select;
class AttachInterfaceToInstance extends React.Component {
    state = {
        interfaceType: 'bynetwork'
    }
   
    handleSubmit(e) {
        e.preventDefault();

        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { keys, names } = values;
               
                this.props.dispatch({
                    type: `ecs/attachNetwork`,
                    payload: {
                        ...values,
                        id: this.props.mountedData.instanceId
                    }
                })



               
               
               
               

            }

        });

    };
    componentDidMount() {

    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.attachingNetwork === true && this.props.attachingNetwork === false) {
            this.props.dispatch({
                type: 'drawer/closeDrawer',

            })
        }
       
       

       
    }

    onChange(value) {
        this.setState({ 'interfaceType': value })
    }
    getAllNetworks() {
        if (this.props.vpc.list.length === 0 || this.props.vpc.subnetList.length === 0) {
            if (this.props.vpc.list.length === 0) {
                this.props.dispatch({
                    type: 'vpc/update'
                })
            }
            if (this.props.vpc.subnetList.length === 0) {
                this.props.dispatch({
                    type: 'vpc/fetchSubnet'
                })
            }

        }

    }

    getAllPorts() {

        if (this.props.port.portList.length === 0) {
            this.props.dispatch({
                type: 'router/fetchPort'
            })
        }
    }




    render() {
        const freePorts = this.props.port.portList.filter(item => item.device_id === "")
        const { getFieldDecorator } = this.props.form;

        let showNetworkLoading = true;
        if (this.props.fetchingNetworks || this.props.fetchingSubnets) {
            showNetworkLoading = true;
        } else {
            showNetworkLoading = false;
        }

        let showPortLoading = true;
        if (this.props.fetchingPorts) {
            showPortLoading = true;
        } else {
            showPortLoading = false;
        }


        return (
            <div style={{ marginBottom: `0`, backgroundColor: `#fff` }}>

                <Row>
                    <Col>
                        <Form onSubmit={this.handleSubmit.bind(this)} layout="vertical" hideRequiredMark>

                            <Row>
                                <Typography.Title level={4} style={{
                                    fontSize: ` 1.2em`,

                                    fontFamily: "Open Sans",
                                    fontWeight: 600,
                                    color: `#2b7797`,

                                }}>Attach interface by</Typography.Title>
                                <Typography.Paragraph style={{ color: `#747373`, fontSize: `1.1em`, marginBottom: `0.3em` }}></Typography.Paragraph>
                                <Form.Item >
                                    {getFieldDecorator('name', {
                                        rules: [{ required: true, message: 'Please enter keypair name' }],
                                        initialValue: 'bynetwork',
                                    })(<Select

                                        style={{ width: '100%' }}
                                        onChange={this.onChange.bind(this)}
                                    >
                                        <Option value='bynetwork'>Network</Option>
                                        <Option value='byport'>Port</Option>
                                    </Select>)}
                                </Form.Item>
                            </Row>

                            {this.state.interfaceType === "bynetwork" ? (
                                <>
                                    <Row>
                                        <Typography.Title level={4} style={{
                                            fontSize: ` 1.2em`,
                                            fontFamily: "Open Sans",
                                            fontWeight: 600,
                                            color: `#2b7797`,

                                        }}>Network</Typography.Title>
                                        <Typography.Paragraph style={{ color: `#747373`, fontSize: `1.1em`, marginBottom: `0.3em` }}></Typography.Paragraph>
                                        <Form.Item >
                                            {getFieldDecorator('net_id', {
                                                rules: [{ required: true, message: 'Please select a Network' }],
                                            })(<Select
                                                onFocus={this.getAllNetworks.bind(this)}
                                                style={{ width: '100%' }}
                                            >
                                                {showNetworkLoading ? <Option disabled={true} value={1}><Spin style={{ display: 'flex', justifyContent: 'center', height: '50px', marginTop: '10px' }} indicator={antIcon} size="large" /></Option> : this.props.vpc.list.map(item =>
                                                    <Option value={item.id}>{item.name}</Option>
                                                )}
                                            </Select>)}
                                        </Form.Item>
                                    </Row>

                                    <Row>
                                        <Typography.Title level={4} style={{
                                            fontSize: ` 1.2em`,

                                            fontFamily: "Open Sans",
                                            fontWeight: 600,
                                            color: `#2b7797`,

                                        }}>Fixed IP Address</Typography.Title>
                                        <Typography.Paragraph style={{ color: `#747373`, fontSize: `1.1em`, marginBottom: `0.3em` }}></Typography.Paragraph>
                                        <Form.Item >
                                            {getFieldDecorator('ip_address', {
                                               
                                            })(<Input placeholder="Please enter Fixed IP" />)}
                                        </Form.Item>
                                    </Row>

                                </>
                            ) :
                                (
                                    <Row>
                                        <Typography.Title level={4} style={{
                                            fontSize: ` 1.2em`,
                                            fontFamily: "Open Sans",
                                            fontWeight: 600,
                                            color: `#2b7797`,

                                        }}>Port</Typography.Title>
                                        <Typography.Paragraph style={{ color: `#747373`, fontSize: `1.1em`, marginBottom: `0.3em` }}></Typography.Paragraph>
                                        <Form.Item >
                                            {getFieldDecorator('port_id', {
                                                rules: [{ required: true, message: 'Please select a Port' }],
                                            })(<Select
                                                onFocus={this.getAllPorts.bind(this)}
                                                style={{ width: '100%' }}
                                            >
                                                {showPortLoading ? <Option disabled={true} value={1}><Spin style={{ display: 'flex', justifyContent: 'center', height: '50px', marginTop: '10px' }} indicator={antIcon} size="large" /></Option> : freePorts.map(item =>
                                                    <Option value={item.id}>{item.name} {item.fixed_ips[0].ip_address}</Option>
                                                )}
                                            </Select>
                                            )}
                                        </Form.Item>
                                    </Row>
                                )

                            }

                            <Form.Item>
                                <Button loading={this.props.attachingNetwork} type="primary" htmlType="submit">
                                    Submit
                                 </Button>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </div>
        );
    }
}


export default connect((state) => {
    return {
        vpc: state.vpc,
        port: state.router,
        fetchingSubnets: state.loading.effects['vpc/fetchSubnets'],
        fetchingNetworks: state.loading.effects['vpc/update'],
        fetchingPorts:state.loading.effects['router/fetchPort'],
        attachingNetwork: state.loading.effects['ecs/attachNetwork']
    };
})(Form.create()(AttachInterfaceToInstance));
