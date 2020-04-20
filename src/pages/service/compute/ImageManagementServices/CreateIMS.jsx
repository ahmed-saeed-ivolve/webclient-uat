import {
    Drawer,
    Form,
    Button,
    Col,
    Row,
    Input,
    Select,
    DatePicker,
    Icon,
    Slider,
    InputNumber,
    Upload,
    Radio,
    message,
    Typography,
} from 'antd';
import ReactDOM from 'react-dom';
import { connect } from 'dva';
import { async } from 'q';

const { Option } = Select;

const marks = {
    1: '1',
    16: '16',
    32: '32',
    48: '48',
    64: '64',
};

class CreateIMS extends React.Component {
    state = {
        inputValue: 1,
        inputValueRAM: 1,
        uploadResponse: {},
    };

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { keys, names } = values;
                values['min_disk'] = this.state.inputValue;
                values['min_ram'] = this.state.inputValueRAM;
                values['metadata'] = '';
                values['url'] = values.url.file.response;
                values['visibility'] = 'private';
                values['protected'] = 1;

                this.props.dispatch({
                    type: 'ims/create',
                    payload: values,
                });
            }
        });
    };

    onClose = () => {
        this.props.whenCloseCalled(false);
    };

    onChange1 = value => {
        this.setState({
            inputValue: value,
        });
    };

    onChange2 = value => {
        this.setState({
            inputValueRAM: value,
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const { inputValue } = this.state;
        const { inputValueRAM } = this.state;

        const props = {
            name: 'file',
            action: `${BEFFE}/uploads`,
            headers: {
                X_Auth_Token: localStorage.getItem('token'),
                provider: 'Openstack',
            },
            onChange(info) {
                if (info.file.status !== 'uploading') {
                }
                if (info.file.status === 'done') {
                    message.success(
                        `${info.file.name} file uploaded successfully`
                    );
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} file upload failed.`);
                }
            },
        };

        return (
            <div
                style={{
                    margin: `0px`,
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
                            <Typography.Paragraph
                                style={{
                                    color: `#747373`,
                                    fontSize: `1.1em`,
                                    marginBottom: `0.3em`,
                                }}
                            ></Typography.Paragraph>

                            <Form.Item>
                                {getFieldDecorator('name', {
                                    rules: [
                                        {
                                            required: true,
                                            message: 'Please enter image name',
                                        },
                                    ],
                                })(
                                    <Input
                                        style={{ width: '600px' }}
                                        placeholder="Please enter image name"
                                    />
                                )}
                            </Form.Item>
                        </Col>

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
                                {getFieldDecorator(
                                    'description',
                                    {}
                                )(
                                    <Input.TextArea
                                        style={{ width: '600px' }}
                                        rows={4}
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
                                Upload Image
                            </Typography.Title>
                            <Typography.Paragraph
                                style={{
                                    color: `#747373`,
                                    fontSize: `1.1em`,
                                    marginBottom: `0.3em`,
                                }}
                            ></Typography.Paragraph>

                            <Form.Item>
                                {getFieldDecorator('url', {
                                    rules: [
                                        {
                                            required: true,
                                            message: 'Please upload the Image',
                                        },
                                    ],
                                })(
                                    <Upload {...props}>
                                        <Button>
                                            <Icon type="upload" /> Click to
                                            Upload
                                        </Button>
                                    </Upload>
                                )}
                            </Form.Item>
                        </Col>
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
                                Format
                            </Typography.Title>
                            <Typography.Paragraph
                                style={{
                                    color: `#747373`,
                                    fontSize: `1.1em`,
                                    marginBottom: `0.3em`,
                                }}
                            ></Typography.Paragraph>

                            <Form.Item>
                                {getFieldDecorator('disk_format', {
                                    initialValue: 'iso',
                                })(
                                    <Select
                                        style={{ width: '500px' }}
                                        placeholder="Selct Image Format"
                                    >
                                        <Option value="iso">ISO</Option>
                                        <Option value="qcow">
                                            QCOW2-QEMU Emulator
                                        </Option>
                                    </Select>
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
                                Architecture
                            </Typography.Title>
                            <Typography.Paragraph
                                style={{
                                    color: `#747373`,
                                    fontSize: `1.1em`,
                                    marginBottom: `0.3em`,
                                }}
                            ></Typography.Paragraph>

                            <Form.Item>
                                {getFieldDecorator('architecture', {
                                    initialValue: 'x64',
                                })(
                                    <Select
                                        style={{ width: '500px' }}
                                        placeholder="Select Image Architecture"
                                    >
                                        <Option value="x64">x64</Option>
                                        <Option value="x86">x86</Option>
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row>
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
                                Minimum Disk (GB)
                            </Typography.Title>
                            <Typography.Paragraph
                                style={{
                                    color: `#747373`,
                                    fontSize: `1.1em`,
                                    marginBottom: `0.3em`,
                                }}
                            ></Typography.Paragraph>

                            <Form.Item style={{ width: '550px' }}>
                                {getFieldDecorator(
                                    'min_disk',
                                    {}
                                )(
                                    <div>
                                        <Col span={21}>
                                            <Slider
                                                marks={marks}
                                                min={1}
                                                max={64}
                                                onChange={this.onChange1}
                                                value={
                                                    typeof inputValue ===
                                                    'number'
                                                        ? inputValue
                                                        : 0
                                                }
                                            />
                                        </Col>

                                        <Col span={3}>
                                            <InputNumber
                                                size="large"
                                                style={{ marginLeft: '20px' }}
                                                min={1}
                                                max={64}
                                                onChange={this.onChange1}
                                                value={inputValue}
                                            />
                                        </Col>
                                    </div>
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
                                Minimum RAM (MB)
                            </Typography.Title>
                            <Typography.Paragraph
                                style={{
                                    color: `#747373`,
                                    fontSize: `1.1em`,
                                    marginBottom: `0.3em`,
                                }}
                            ></Typography.Paragraph>

                            <Form.Item style={{ width: '550px' }}>
                                {getFieldDecorator(
                                    'min_ram',
                                    {}
                                )(
                                    <div>
                                        <Col span={21}>
                                            <Slider
                                                marks={marks}
                                                min={1}
                                                max={64}
                                                onChange={this.onChange2}
                                                value={
                                                    typeof inputValueRAM ===
                                                    'number'
                                                        ? inputValueRAM
                                                        : 0
                                                }
                                            />
                                        </Col>

                                        <Col span={3}>
                                            <InputNumber
                                                size="large"
                                                style={{ marginLeft: '20px' }}
                                                min={1}
                                                max={64}
                                                onChange={this.onChange2}
                                                value={inputValueRAM}
                                            />
                                        </Col>
                                    </div>
                                )}
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item>
                        <Button
                            loading={this.props.creatingImage}
                            style={{ width: '30%', height: '40px' }}
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
        creatingImage: state.loading.effects['ims/create'],
    };
})(Form.create()(CreateIMS));
