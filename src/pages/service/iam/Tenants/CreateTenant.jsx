import {
    Drawer,
    Form,
    Button,
    Col,
    Row,
    Input,
    InputNumber,
    Select,
    DatePicker,
    Icon,
    Radio,
    Typography,
    Progress,
} from 'antd';
import ReactDOM from 'react-dom';
import { connect } from 'dva';

const { Option } = Select;

class CreateTenant extends React.Component {
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { keys, names } = values;

                const projectDetails = {
                    name: values.name,
                    description: values.description,
                };

                const computeQuota = {
                    cores: values.cores,
                    ram: values.ram,
                    instances: values.instances,
                    key_pairs: values.keypairs,
                    server_groups: values.server_groups,
                    server_group_members: values.server_group_members,
                    fixed_ips: values.fixed_ips,
                };

                const neutronQuota = {
                    floatingip: values.floating_ip,
                    network: values.network,
                    port: values.port,
                    rbac_policy: values.rbac_policy,
                    router: values.router,
                    security_group: values.security_groups,
                    security_group_rule: values.security_group_rule,
                    subnet: values.subnets,
                    subnetpool: values.subnetpool,
                };

                const volumeQuota = {
                    volumes: values.volumes,
                    snapshots: values.snapshots,
                    per_volume_gigabytes: values.per_volume_gigabytes,
                    gigabytes: values.gigabytes,
                };
                const project = {
                    projectDetails,
                    computeQuota,
                    neutronQuota,
                    volumeQuota,
                };

                this.props.dispatch({
                    type: 'projects/create',
                    payload: project,
                });
            }
        });
    };

    onKeyPress(event) {
        const keyCode = event.keyCode || event.which;
        const keyValue = String.fromCharCode(keyCode);
        if (
            (typeof keyValue !== 'number' && keyValue % 1 !== 0) ||
            keyValue.includes('-')
        ) {
            event.preventDefault();
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
        };

        return (
            <div
                style={{
                    marginBottom: `0`,
                    backgroundColor: `#fff`,
                    padding: `34px`,
                }}
            >
                <Form
                    onSubmit={this.handleSubmit}
                    layout="vertical"
                    hideRequiredMark
                >
                    <Row gutter={16}>
                        <Col span={24}>
                            <Typography.Title
                                level={4}
                                style={{
                                    fontSize: ` 1.2em`,
                                    fontFamily: 'Open Sans',
                                    fontWeight: 600,
                                    color: `#2b7797`,
                                }}
                            >
                                Name
                            </Typography.Title>
                            <Form.Item>
                                {getFieldDecorator('name', {
                                    rules: [
                                        {
                                            message:
                                                'Please enter correct project name',
                                            pattern: /^[a-zA-Z]+([-_.]?[a-zA-Z0-9]+)*$/,
                                        },
                                        {
                                            required: true,
                                            message:
                                                'Please enter project name',
                                        },
                                    ],
                                })(
                                    <Input
                                        style={{ width: '600px' }}
                                        placeholder="Please enter project name"
                                    />
                                )}
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={24}>
                            <Typography.Title
                                level={4}
                                style={{
                                    fontSize: ` 1.2em`,

                                    fontFamily: 'Open Sans',
                                    fontWeight: 600,
                                    color: `#2b7797`,
                                }}
                            >
                                Description
                            </Typography.Title>
                            <Typography.Paragraph
                                style={{
                                    color: `#747373`,
                                    fontSize: `1.1em`,
                                    marginBottom: `0.3em`,
                                }}
                            ></Typography.Paragraph>

                            <Form.Item>
                                {getFieldDecorator('description', {
                                    rules: [],
                                })(
                                    <Input.TextArea
                                        style={{ width: '600px' }}
                                        rows={4}
                                    />
                                )}
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={24}>
                        <div>
                            <Typography.Title
                                style={{
                                    fontSize: `20px`,
                                    marginBottom: `23px`,
                                    paddingLeft: '10px',
                                }}
                            >
                                Compute Quota{' '}
                            </Typography.Title>

                            <Col span={6}>
                                <Typography.Title
                                    level={4}
                                    style={{
                                        fontSize: ` 1.2em`,
                                        fontFamily: 'Open Sans',
                                        fontWeight: 600,
                                        color: `#2b7797`,
                                    }}
                                >
                                    Ram (MB){' '}
                                </Typography.Title>
                                <Typography.Paragraph
                                    style={{
                                        color: `#747373`,
                                        fontSize: `1.1em`,
                                        marginBottom: `0.3em`,
                                    }}
                                ></Typography.Paragraph>

                                <Form.Item>
                                    {getFieldDecorator('ram', {
                                        initialValue: 512,
                                    })(
                                        <Input
                                            type={'number'}
                                            min={0}
                                            onKeyPress={this.onKeyPress.bind(
                                                this
                                            )}
                                            style={{
                                                width: '200px',
                                            }}
                                            rows={3}
                                        />
                                    )}
                                </Form.Item>
                            </Col>

                            <Col span={6}>
                                <Typography.Title
                                    level={4}
                                    style={{
                                        fontSize: ` 1.2em`,
                                        fontFamily: 'Open Sans',
                                        fontWeight: 600,
                                        color: `#2b7797`,
                                    }}
                                >
                                    Cores{' '}
                                </Typography.Title>
                                <Typography.Paragraph
                                    style={{
                                        color: `#747373`,
                                        fontSize: `1.1em`,
                                        marginBottom: `0.3em`,
                                    }}
                                ></Typography.Paragraph>

                                <Form.Item>
                                    {getFieldDecorator('cores', {
                                        initialValue: 2,
                                    })(
                                        <Input
                                            min={0}
                                            type={'number'}
                                            onKeyPress={this.onKeyPress.bind(
                                                this
                                            )}
                                            style={{
                                                width: '200px',
                                            }}
                                            rows={3}
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Typography.Title
                                    level={4}
                                    style={{
                                        fontSize: ` 1.2em`,
                                        fontFamily: 'Open Sans',
                                        fontWeight: 600,
                                        color: `#2b7797`,
                                    }}
                                >
                                    Instances{' '}
                                </Typography.Title>
                                <Typography.Paragraph
                                    style={{
                                        color: `#747373`,
                                        fontSize: `1.1em`,
                                        marginBottom: `0.3em`,
                                    }}
                                ></Typography.Paragraph>

                                <Form.Item>
                                    {getFieldDecorator('instances', {
                                        initialValue: 2,
                                    })(
                                        <Input
                                            min={0}
                                            type={'number'}
                                            onKeyPress={this.onKeyPress.bind(
                                                this
                                            )}
                                            style={{
                                                width: '200px',
                                            }}
                                            rows={3}
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Typography.Title
                                    level={4}
                                    style={{
                                        fontSize: ` 1.2em`,
                                        fontFamily: 'Open Sans',
                                        fontWeight: 600,
                                        color: `#2b7797`,
                                    }}
                                >
                                    Keypairs{' '}
                                </Typography.Title>
                                <Typography.Paragraph
                                    style={{
                                        color: `#747373`,
                                        fontSize: `1.1em`,
                                        marginBottom: `0.3em`,
                                    }}
                                ></Typography.Paragraph>

                                <Form.Item>
                                    {getFieldDecorator('keypairs', {
                                        initialValue: 2,
                                    })(
                                        <Input
                                            min={0}
                                            type={'number'}
                                            onKeyPress={this.onKeyPress.bind(
                                                this
                                            )}
                                            style={{
                                                width: '200px',
                                            }}
                                            rows={3}
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                        </div>
                    </Row>
                    <Row gutter={24}>
                        <div>
                            <Col span={6}>
                                <Typography.Title
                                    level={4}
                                    style={{
                                        fontSize: ` 1.2em`,
                                        fontFamily: 'Open Sans',
                                        fontWeight: 600,
                                        color: `#2b7797`,
                                    }}
                                >
                                    Fixed IP addresses{' '}
                                </Typography.Title>
                                <Typography.Paragraph
                                    style={{
                                        color: `#747373`,
                                        fontSize: `1.1em`,
                                        marginBottom: `0.3em`,
                                    }}
                                ></Typography.Paragraph>

                                <Form.Item>
                                    {getFieldDecorator('fixed_ips', {
                                        initialValue: 20,
                                    })(
                                        <Input
                                            min={0}
                                            type={'number'}
                                            onKeyPress={this.onKeyPress.bind(
                                                this
                                            )}
                                            style={{
                                                width: '200px',
                                            }}
                                            rows={3}
                                        />
                                    )}
                                </Form.Item>
                            </Col>

                            <Col span={6}>
                                <Typography.Title
                                    level={4}
                                    style={{
                                        fontSize: ` 1.2em`,

                                        fontFamily: 'Open Sans',
                                        fontWeight: 600,
                                        color: `#2b7797`,
                                    }}
                                >
                                    Server Groups{' '}
                                </Typography.Title>
                                <Form.Item>
                                    {getFieldDecorator('server_groups', {
                                        initialValue: 5,
                                    })(
                                        <Input
                                            min={0}
                                            type={'number'}
                                            onKeyPress={this.onKeyPress.bind(
                                                this
                                            )}
                                            style={{ width: '200px' }}
                                            rows={4}
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Typography.Title
                                    level={4}
                                    style={{
                                        fontSize: ` 1.2em`,

                                        fontFamily: 'Open Sans',
                                        fontWeight: 600,
                                        color: `#2b7797`,
                                    }}
                                >
                                    Server Group Members{' '}
                                </Typography.Title>
                                <Form.Item>
                                    {getFieldDecorator('server_group_members', {
                                        initialValue: 5,
                                    })(
                                        <Input
                                            min={0}
                                            type={'number'}
                                            onKeyPress={this.onKeyPress.bind(
                                                this
                                            )}
                                            style={{ width: '200px' }}
                                            rows={4}
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                        </div>
                    </Row>
                    <Row>
                        <Typography.Title
                            style={{
                                fontSize: `20px`,
                                marginBottom: `23px`,
                            }}
                        >
                            {' '}
                            Neutron Quota{' '}
                        </Typography.Title>

                        <Row gutter={24}>
                            <Col span={6}>
                                <Typography.Title
                                    level={4}
                                    style={{
                                        fontSize: ` 1.2em`,

                                        fontFamily: 'Open Sans',
                                        fontWeight: 600,
                                        color: `#2b7797`,
                                    }}
                                >
                                    Elastic IPs{' '}
                                </Typography.Title>
                                <Form.Item>
                                    {getFieldDecorator('floating_ip', {
                                        initialValue: 5,
                                    })(
                                        <Input
                                            min={0}
                                            type={'number'}
                                            onKeyPress={this.onKeyPress.bind(
                                                this
                                            )}
                                            style={{ width: '200px' }}
                                            rows={4}
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Typography.Title
                                    level={4}
                                    style={{
                                        fontSize: ` 1.2em`,

                                        fontFamily: 'Open Sans',
                                        fontWeight: 600,
                                        color: `#2b7797`,
                                    }}
                                >
                                    Networks{' '}
                                </Typography.Title>
                                <Form.Item>
                                    {getFieldDecorator('network', {
                                        initialValue: 5,
                                    })(
                                        <Input
                                            min={0}
                                            type={'number'}
                                            onKeyPress={this.onKeyPress.bind(
                                                this
                                            )}
                                            style={{ width: '200px' }}
                                            rows={4}
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Typography.Title
                                    level={4}
                                    style={{
                                        fontSize: ` 1.2em`,

                                        fontFamily: 'Open Sans',
                                        fontWeight: 600,
                                        color: `#2b7797`,
                                    }}
                                >
                                    Ports{' '}
                                </Typography.Title>
                                <Form.Item>
                                    {getFieldDecorator('port', {
                                        initialValue: 5,
                                    })(
                                        <Input
                                            min={0}
                                            type={'number'}
                                            onKeyPress={this.onKeyPress.bind(
                                                this
                                            )}
                                            style={{ width: '200px' }}
                                            rows={4}
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Typography.Title
                                    level={4}
                                    style={{
                                        fontSize: ` 1.2em`,

                                        fontFamily: 'Open Sans',
                                        fontWeight: 600,
                                        color: `#2b7797`,
                                    }}
                                >
                                    RBAC Policies{' '}
                                </Typography.Title>
                                <Form.Item>
                                    {getFieldDecorator('rbac_policy', {
                                        initialValue: 5,
                                    })(
                                        <Input
                                            min={0}
                                            type={'number'}
                                            onKeyPress={this.onKeyPress.bind(
                                                this
                                            )}
                                            style={{ width: '200px' }}
                                            rows={4}
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={6}>
                                <Typography.Title
                                    level={4}
                                    style={{
                                        fontSize: ` 1.2em`,

                                        fontFamily: 'Open Sans',
                                        fontWeight: 600,
                                        color: `#2b7797`,
                                    }}
                                >
                                    Routers{' '}
                                </Typography.Title>
                                <Form.Item>
                                    {getFieldDecorator('router', {
                                        initialValue: 5,
                                    })(
                                        <Input
                                            min={0}
                                            type={'number'}
                                            onKeyPress={this.onKeyPress.bind(
                                                this
                                            )}
                                            style={{ width: '200px' }}
                                            rows={4}
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Typography.Title
                                    level={4}
                                    style={{
                                        fontSize: ` 1.2em`,

                                        fontFamily: 'Open Sans',
                                        fontWeight: 600,
                                        color: `#2b7797`,
                                    }}
                                >
                                    Security Groups{' '}
                                </Typography.Title>
                                <Form.Item>
                                    {getFieldDecorator('security_groups', {
                                        initialValue: 5,
                                    })(
                                        <Input
                                            min={0}
                                            type={'number'}
                                            onKeyPress={this.onKeyPress.bind(
                                                this
                                            )}
                                            style={{ width: '200px' }}
                                            rows={4}
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Typography.Title
                                    level={4}
                                    style={{
                                        fontSize: ` 1.2em`,

                                        fontFamily: 'Open Sans',
                                        fontWeight: 600,
                                        color: `#2b7797`,
                                    }}
                                >
                                    Subnets{' '}
                                </Typography.Title>
                                <Form.Item>
                                    {getFieldDecorator('subnets', {
                                        initialValue: 5,
                                    })(
                                        <Input
                                            min={0}
                                            type={'number'}
                                            onKeyPress={this.onKeyPress.bind(
                                                this
                                            )}
                                            style={{ width: '200px' }}
                                            rows={4}
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Typography.Title
                                    level={4}
                                    style={{
                                        fontSize: ` 1.2em`,

                                        fontFamily: 'Open Sans',
                                        fontWeight: 600,
                                        color: `#2b7797`,
                                    }}
                                >
                                    Security Group Rules{' '}
                                </Typography.Title>
                                <Form.Item>
                                    {getFieldDecorator('security_group_rule', {
                                        initialValue: 5,
                                    })(
                                        <Input
                                            min={0}
                                            type={'number'}
                                            onKeyPress={this.onKeyPress.bind(
                                                this
                                            )}
                                            style={{ width: '200px' }}
                                            rows={4}
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Row>
                    <Row gutter={20}>
                        <Col span={4}>
                            <Typography.Title
                                level={4}
                                style={{
                                    fontSize: ` 1.2em`,

                                    fontFamily: 'Open Sans',
                                    fontWeight: 600,
                                    color: `#2b7797`,
                                }}
                            >
                                Subnet Pool{' '}
                            </Typography.Title>
                            <Form.Item>
                                {getFieldDecorator('subnetpool', {
                                    initialValue: 5,
                                })(
                                    <Input
                                        min={0}
                                        type={'number'}
                                        onKeyPress={this.onKeyPress.bind(this)}
                                        style={{ width: '200px' }}
                                        rows={4}
                                    />
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Typography.Title
                            style={{
                                fontSize: `20px`,
                                marginBottom: `23px`,
                            }}
                        >
                            {' '}
                            Volume Quota{' '}
                        </Typography.Title>
                        <Row gutter={24}>
                            <Col span={6}>
                                <Typography.Title
                                    level={4}
                                    style={{
                                        fontSize: ` 1.2em`,

                                        fontFamily: 'Open Sans',
                                        fontWeight: 600,
                                        color: `#2b7797`,
                                    }}
                                >
                                    Volumes{' '}
                                </Typography.Title>
                                <Form.Item>
                                    {getFieldDecorator('volumes', {
                                        initialValue: 5,
                                    })(
                                        <Input
                                            min={0}
                                            type={'number'}
                                            onKeyPress={this.onKeyPress.bind(
                                                this
                                            )}
                                            style={{ width: '200px' }}
                                            rows={4}
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Typography.Title
                                    level={4}
                                    style={{
                                        fontSize: ` 1.2em`,

                                        fontFamily: 'Open Sans',
                                        fontWeight: 600,
                                        color: `#2b7797`,
                                    }}
                                >
                                    Snapshots{' '}
                                </Typography.Title>
                                <Form.Item>
                                    {getFieldDecorator('snapshots', {
                                        initialValue: 5,
                                    })(
                                        <Input
                                            min={0}
                                            type={'number'}
                                            onKeyPress={this.onKeyPress.bind(
                                                this
                                            )}
                                            style={{ width: '200px' }}
                                            rows={4}
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Typography.Title
                                    level={4}
                                    style={{
                                        fontSize: ` 1.2em`,

                                        fontFamily: 'Open Sans',
                                        fontWeight: 600,
                                        color: `#2b7797`,
                                    }}
                                >
                                    Per Volume Gigabytes{' '}
                                </Typography.Title>
                                <Form.Item>
                                    {getFieldDecorator('per_volume_gigabytes', {
                                        initialValue: 5,
                                    })(
                                        <Input
                                            min={0}
                                            type={'number'}
                                            onKeyPress={this.onKeyPress.bind(
                                                this
                                            )}
                                            style={{ width: '200px' }}
                                            rows={4}
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Typography.Title
                                    level={4}
                                    style={{
                                        fontSize: ` 1.2em`,

                                        fontFamily: 'Open Sans',
                                        fontWeight: 600,
                                        color: `#2b7797`,
                                    }}
                                >
                                    Total Gigabytes{' '}
                                </Typography.Title>
                                <Form.Item>
                                    {getFieldDecorator('gigabytes', {
                                        initialValue: 5,
                                    })(
                                        <Input
                                            min={0}
                                            type={'number'}
                                            onKeyPress={this.onKeyPress.bind(
                                                this
                                            )}
                                            style={{ width: '200px' }}
                                            rows={4}
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Row>

                    <Form.Item>
                        <Button
                            loading={this.props.creatingTenant}
                            type="primary"
                            htmlType="submit"
                        >
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}

export default connect(state => {
    return {
        stats: state.stats,
        projectsList: state.projects,
        usersList: state.users,
        groupsList: state.groups,
        creatingTenant: state.loading.effects['projects/create'],
    };
})(Form.create()(CreateTenant));
