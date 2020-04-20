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
    Typography,
} from 'antd';
import ReactDOM from 'react-dom';
import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

const { Option } = Select;
const marks = {
    1: '1',
    20: '20',
    40: '40',
    60: '60',
    80: '80',
    100: '100',
};

class CreateSnapshot extends React.Component {
    state = {
        inputValue: 1,
        choice: '',
    };

    onClose = () => {
        this.props.whenCloseCalled(false);
    };

    onChange = value => {
        this.setState({
            inputValue: value,
        });
    };

    handleVolumeSource(value) {
        this.setState({ choice: value });
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (this.props.creationData.payload) {
                    values[
                        'volume_id'
                    ] = this.props.creationData.payload.volumeId;
                    values['force'] = this.props.creationData.payload?.force;
                    values['source'] = this.props.creationData.payload.source;
                    this.props.dispatch({
                        type: 'snapshot/create',
                        payload: values,
                    });
                } else {
                    values['force'] = true;
                    values['source'] = 'fromSnapshot';
                    this.props.dispatch({
                        type: 'snapshot/create',
                        payload: values,
                    });
                }
            }
        });
    };

    componentWillUnmount() {
        this.props.dispatch({
            type: 'snapshot/clear',
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { inputValue } = this.state;
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
                    <Row gutter={16} style={{ marginBottom: `12px` }}>
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
                                Source volume id
                            </Typography.Title>

                            {this.props.creationData.payload?.volumeId ? (
                                <Typography.Paragraph
                                    style={{
                                        color: `#747373`,
                                        fontSize: `1.1em`,
                                        marginBottom: `0.3em`,
                                    }}
                                >
                                    {this.props.creationData.payload.volumeId}
                                </Typography.Paragraph>
                            ) : (
                                <Row
                                    gutter={16}
                                    style={{ marginBottom: `12px` }}
                                >
                                    <Col span={24}>
                                        <Form.Item style={{ width: '600px' }}>
                                            {getFieldDecorator('volume_id', {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message:
                                                            'Please select volume source id',
                                                    },
                                                ],
                                            })(
                                                <Select>
                                                    {this.props.evs.list.map(
                                                        items => (
                                                            <Option
                                                                value={items.id}
                                                            >
                                                                {`${items.name}-${items.id}`}
                                                            </Option>
                                                        )
                                                    )}
                                                </Select>
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                            )}
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
                                                'Please enter correct snapshot name',
                                            pattern: /^[a-zA-Z]+([-_.]?[a-zA-Z0-9]+)*$/,
                                        },
                                        {
                                            required: true,
                                            message:
                                                'Please enter snapshot name',
                                        },
                                    ],
                                })(
                                    <Input
                                        style={{ width: '600px' }}
                                        placeholder="Please enter snapshot name"
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
                            loading={this.props.creatingSnapshot}
                            style={{ width: '30%', height: '45px' }}
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
        imageList: state.ims,
        creationData: state.snapshot.createSnapshot,
        creatingSnapshot: state.loading.effects['snapshot/create'],
        evs: state.evs,
    };
})(Form.create()(CreateSnapshot));
