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
    Typography,
} from 'antd';
import ReactDOM from 'react-dom';
import { connect } from 'dva';

const { Option } = Select;

class CreateSg extends React.Component {
    state = {
        inputValue: 1,
        inputValueRAM: 1,
        uploadResponse: {},
        fileList: [],
        uploading: false,
    };

    handleUpload = () => {
        const { fileList } = this.state;
        const formData = new FormData();
        fileList.forEach(file => {
            formData.append('files[]', file);
        });

        this.setState({
            uploading: true,
        });

        reqwest({
            url: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
            method: 'post',
            processData: false,
            data: formData,
            success: () => {
                this.setState({
                    fileList: [],
                    uploading: false,
                });
                message.success('upload successfully.');
            },
            error: () => {
                this.setState({
                    uploading: false,
                });
                message.error('upload failed.');
            },
        });
    };

    onClose = () => {
        this.props.whenCloseCalled(false);
    };

    onChange = value => {
        this.setState({
            inputValue: value,
        });
    };

    onChange2 = value => {
        this.setState({
            inputValueRAM: value,
        });
    };

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { keys, names } = values;
                if (typeof values['description'] === 'undefined') {
                    delete values['description'];
                }

                this.props.dispatch({
                    type: 'securitygroup/create',
                    payload: values,
                });
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const { inputValue } = this.state;
        const { inputValueRAM } = this.state;

        const { uploading, fileList } = this.state;
        const props = {
            onRemove: file => {
                this.setState(state => {
                    const index = state.fileList.indexOf(file);
                    const newFileList = state.fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        fileList: newFileList,
                    };
                });
            },
            beforeUpload: file => {
                this.setState(state => ({
                    fileList: [...state.fileList, file],
                }));
                return false;
            },
            fileList,
        };

        const modal = this.props.type === 'modal';

        return (
            <div
                style={
                    this.props.type !== 'modal'
                        ? {
                              marginBottom: `0`,
                              backgroundColor: `#fff`,
                              padding: `34px`,
                          }
                        : { padding: '0px' }
                }
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
                                            message:
                                                'Please enter correct security-group name',
                                            pattern: /^[a-zA-Z]+([._-]?[a-zA-Z0-9]+)*$/,
                                        },
                                        {
                                            required: true,
                                            message:
                                                'Please enter security-group name',
                                        },
                                    ],
                                })(
                                    <Input
                                        style={{ width: '600px' }}
                                        placeholder="Please enter security-group name"
                                    />
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
                    <Form.Item>
                        <Button
                            loading={this.props.creatingSG}
                            style={{ width: '300px', height: '45px' }}
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

export default connect(({ loading }) => {
    return {
        creatingSG: loading.effects['securitygroup/create'],
    };
})(Form.create()(CreateSg));
