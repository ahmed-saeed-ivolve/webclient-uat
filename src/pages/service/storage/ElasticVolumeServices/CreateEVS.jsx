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
    Radio,
    Spin,
    Layout,
    Divider,
} from 'antd';
import ReactDOM from 'react-dom';
import React from 'react';
import { connect } from 'dva';
import FormRow from '@/pages/service/components/FormRow';
import PricingStrip from '../../compute/ElasticCloudServices/components/PricingStrip';
const { Header, Footer, Sider, Content } = Layout;
import { debounce } from 'lodash';

const { Option } = Select;
const marks = {
    5: '5',
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

const antIcon = (
    <Icon
        type="loading"
        style={{ fontSize: 48, margin: '40px 0px 40px 0px' }}
        spin
    />
);

class CreateEVS extends React.Component {
    state = {
        minVal: 5,
        maxVal: 500,
        inputValue: 5,
        choice: '',
        disabled: false,
        type: '',
    };
    onClose = () => {
        this.props.whenCloseCalled(false);
    };

    onChange = debounce(updatedvalue_disk => {
        const { dispatch } = this.props;

        if (updatedvalue_disk) {
            const result = {
                evs: this.state.type,
                updatedvalue_disk,
            };

            dispatch({
                type: 'price/pricingServiceVolume',
                payload: { volume: result },
            });
        }

        this.setState({
            inputValue: updatedvalue_disk,
        });
    }, 250);

    handleVolumeSource(value) {
        this.setState({ choice: value });
    }
    handleVolumeType(value) {
        const { dispatch } = this.props;

        const filtered = this.props.evs?.volumeTypes.filter(
            item => item.id === value
        )[0]?.name;

        const result = {
            evs: filtered,
            updatedvalue_disk: this.state.inputValue,
        };

        dispatch({
            type: 'price/pricingServiceVolume',
            payload: { volume: result },
        });
        this.setState({ type: filtered });
    }

    componentDidMount() {
        const { dispatch } = this.props;

        const result = {
            evs: this.state.type,
            updatedvalue_disk: this.state.inputValue,
        };

        // dispatch({
        //     type: 'price/pricingServiceVolume',
        //     payload: { volume: result },
        // });
    }

    handleSubmit = e => {
        e.preventDefault();

        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { keys, names } = values;
                values['size'] = this.state.inputValue;
                if ('volumesource' in values) {
                    delete values['volumesource'];
                }

                if (!('volume_type' in values)) {
                    values['volume_type'] = '';
                }
                values['volume'];

                this.props.dispatch({
                    type: 'evs/create',
                    payload: values,
                });
                const result = {
                    evs: this.state.type,
                    updatedvalue_disk: this.state.inputValue,
                };

                // dispatch({
                //     type: 'price/pricingServiceVolume',
                //     payload: { volume: result },
                // });
            }
        });
    };

    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'price/clearPricingVolume',
        });
    }

    fetchAvailabilityZones() {
        this.props.dispatch({
            type: 'global/fetchAvailabilityZone',
        });
    }

    fetchVolumeTypes() {
        this.props.dispatch({
            type: 'evs/volumeTypes',
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        let { inputValue, disabled } = this.state;

        return (
            <div>
                <div
                    style={{
                        marginBottom: `0`,
                        backgroundColor: `#fff`,
                        padding: this.props.type !== 'modal' ? `34px` : `0px`,
                        overflow: 'scroll',
                        overflowX: 'hidden',
                        overflowY: 'auto',
                        height: window.screen.height - 250,
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

                                <Form.Item style={{ width: '600px' }}>
                                    {getFieldDecorator('name', {
                                        rules: [
                                            {
                                                message:
                                                    'Please enter correct volume name',
                                                pattern: /^[a-zA-Z]+([._-]?[a-zA-Z0-9]+)*$/,
                                            },
                                            {
                                                required: true,
                                                message:
                                                    'Please enter volume name',
                                            },
                                        ],
                                    })(
                                        <Input
                                            size="default"
                                            placeholder="Please enter volume name"
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

                        {this.props.evsCreationData.type === 1 ? (
                            <div>
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
                                            Volume Source
                                        </Typography.Title>
                                        <Typography.Paragraph
                                            style={{
                                                color: `#747373`,
                                                fontSize: `1.1em`,
                                                marginBottom: `0.3em`,
                                            }}
                                        ></Typography.Paragraph>

                                        <Form.Item>
                                            {getFieldDecorator('volumesource', {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message:
                                                            'Please select volume source',
                                                    },
                                                ],
                                            })(
                                                <Select
                                                    style={{ width: '600px' }}
                                                    onSelect={value =>
                                                        this.handleVolumeSource(
                                                            value
                                                        )
                                                    }
                                                >
                                                    <Option value="volume">
                                                        Volume
                                                    </Option>
                                                    <Option value="image">
                                                        Image
                                                    </Option>
                                                    <Option value="snapshot">
                                                        Snapshot
                                                    </Option>
                                                </Select>
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row>
                                    {this.state.choice === 'image' ? (
                                        <>
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
                                                    Use Image as a Source
                                                </Typography.Title>
                                                <Typography.Paragraph
                                                    style={{
                                                        color: `#747373`,
                                                        fontSize: `1.1em`,
                                                        marginBottom: `0.3em`,
                                                    }}
                                                ></Typography.Paragraph>

                                                <Form.Item
                                                    style={{ width: '600px' }}
                                                >
                                                    {getFieldDecorator(
                                                        'image_id',
                                                        {
                                                            rules: [
                                                                {
                                                                    required: true,
                                                                    message:
                                                                        'Please select an image',
                                                                },
                                                            ],
                                                        }
                                                    )(
                                                        <Select
                                                            size="default"
                                                            placeholder="Choose an Image"
                                                        >
                                                            {this.props.imageList.list.map(
                                                                items => (
                                                                    <Option
                                                                        value={
                                                                            items.id
                                                                        }
                                                                    >
                                                                        {
                                                                            items.name
                                                                        }
                                                                    </Option>
                                                                )
                                                            )}
                                                        </Select>
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
                                                    Volume Source
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
                                                        'volumesource',
                                                        {
                                                            rules: [
                                                                {
                                                                    required: true,
                                                                    message:
                                                                        'Please select volume source',
                                                                },
                                                            ],
                                                        }
                                                    )(
                                                        <Select
                                                            style={{
                                                                width: '600px',
                                                            }}
                                                            onSelect={value =>
                                                                this.handleVolumeSource(
                                                                    value
                                                                )
                                                            }
                                                        >
                                                            <Option value="volume">
                                                                Volume
                                                            </Option>
                                                            <Option value="image">
                                                                Image
                                                            </Option>
                                                            <Option value="snapshot">
                                                                Snapshot
                                                            </Option>
                                                        </Select>
                                                    )}
                                                </Form.Item>
                                            </Col>
                                        </>
                                    ) : (
                                        <div />
                                    )}

                                    {this.state.choice === 'snapshot' ? (
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
                                                Use Snapshot as a Source
                                            </Typography.Title>
                                            <Typography.Paragraph
                                                style={{
                                                    color: `#747373`,
                                                    fontSize: `1.1em`,
                                                    marginBottom: `0.3em`,
                                                }}
                                            ></Typography.Paragraph>

                                            <Form.Item
                                                style={{ width: '600px' }}
                                            >
                                                {getFieldDecorator(
                                                    'snapshot_id',
                                                    {
                                                        rules: [
                                                            {
                                                                required: true,
                                                                message:
                                                                    'Please select snapshot',
                                                            },
                                                        ],
                                                    }
                                                )(
                                                    <Select
                                                        size="default"
                                                        placeholder="Choose Snapshot"
                                                    >
                                                        {this.props.snapshotList.list.map(
                                                            items => (
                                                                <Option
                                                                    value={
                                                                        items.id
                                                                    }
                                                                >
                                                                    {items.name}
                                                                </Option>
                                                            )
                                                        )}
                                                    </Select>
                                                )}
                                            </Form.Item>
                                        </Col>
                                    ) : (
                                        <div />
                                    )}
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
                                            Volume Type
                                        </Typography.Title>
                                        <Typography.Paragraph
                                            style={{
                                                color: `#747373`,
                                                fontSize: `1.1em`,
                                                marginBottom: `0.3em`,
                                            }}
                                        ></Typography.Paragraph>

                                        <Form.Item style={{ width: '600px' }}>
                                            {getFieldDecorator('volume_type', {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message:
                                                            'Please select volume type',
                                                    },
                                                ],
                                            })(
                                                <Select
                                                    onSelect={value =>
                                                        this.handleVolumeType(
                                                            value
                                                        )
                                                    }
                                                    size="default"
                                                    placeholder="Choose Volume Type"
                                                    onFocus={this.fetchVolumeTypes.bind(
                                                        this
                                                    )}
                                                >
                                                    {this.props
                                                        .fetchingVolumeTypes ===
                                                    true ? (
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
                                                                }}
                                                                indicator={
                                                                    antIcon
                                                                }
                                                            />
                                                        </Option>
                                                    ) : (
                                                        this.props.evs?.volumeTypes.map(
                                                            item => (
                                                                <Option
                                                                    value={
                                                                        item.id
                                                                    }
                                                                >
                                                                    {item.name}
                                                                </Option>
                                                            )
                                                        )
                                                    )}
                                                </Select>
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </div>
                        ) : null}

                        {this.props.evsCreationData.type === 3 ? (
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
                                        Use Snapshot as a source
                                    </Typography.Title>
                                    <Typography.Paragraph
                                        style={{
                                            color: `#747373`,
                                            fontSize: `1.1em`,
                                            marginBottom: `0.3em`,
                                        }}
                                    ></Typography.Paragraph>

                                    <Form.Item>
                                        {getFieldDecorator('snapshot_id', {
                                            initialValue: this.props
                                                .evsCreationData.payload,
                                        })(<Input disabled></Input>)}
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
                                        Volume Type
                                    </Typography.Title>
                                    <Typography.Paragraph
                                        style={{
                                            color: `#747373`,
                                            fontSize: `1.1em`,
                                            marginBottom: `0.3em`,
                                        }}
                                    ></Typography.Paragraph>

                                    <Form.Item style={{ width: '600px' }}>
                                        {getFieldDecorator('volume_type', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message:
                                                        'Please select volume type',
                                                },
                                            ],
                                        })(
                                            <Select
                                                onSelect={value =>
                                                    this.handleVolumeType(value)
                                                }
                                                size="default"
                                                placeholder="Choose Volume Type"
                                                onFocus={this.fetchVolumeTypes.bind(
                                                    this
                                                )}
                                            >
                                                {this.props
                                                    .fetchingVolumeTypes ===
                                                true ? (
                                                    <Option
                                                        disabled={true}
                                                        value={1}
                                                    >
                                                        <Spin
                                                            style={{
                                                                display: 'flex',
                                                                justifyContent:
                                                                    'center',
                                                            }}
                                                            indicator={antIcon}
                                                        />
                                                    </Option>
                                                ) : (
                                                    this.props.evs?.volumeTypes.map(
                                                        item => (
                                                            <Option
                                                                value={item.id}
                                                            >
                                                                {item.name}
                                                            </Option>
                                                        )
                                                    )
                                                )}
                                            </Select>
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                        ) : null}

                        {this.props.evsCreationData.type === 2 ? (
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
                                        Use Image as a source
                                    </Typography.Title>
                                    <Typography.Paragraph
                                        style={{
                                            color: `#747373`,
                                            fontSize: `1.1em`,
                                            marginBottom: `0.3em`,
                                        }}
                                    ></Typography.Paragraph>

                                    <Form.Item style={{ width: '600px' }}>
                                        {getFieldDecorator('image_id', {
                                            initialValue: this.props
                                                .evsCreationData.payload,
                                        })(<Input disabled></Input>)}
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
                                        Volume Type
                                    </Typography.Title>
                                    <Typography.Paragraph
                                        style={{
                                            color: `#747373`,
                                            fontSize: `1.1em`,
                                            marginBottom: `0.3em`,
                                        }}
                                    ></Typography.Paragraph>

                                    <Form.Item style={{ width: '600px' }}>
                                        {getFieldDecorator('volume_type', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message:
                                                        'Please select volume type',
                                                },
                                            ],
                                        })(
                                            <Select
                                                onSelect={value =>
                                                    this.handleVolumeType(value)
                                                }
                                                size="default"
                                                placeholder="Choose Volume Type"
                                                onFocus={this.fetchVolumeTypes.bind(
                                                    this
                                                )}
                                            >
                                                {this.props
                                                    .fetchingVolumeTypes ===
                                                true ? (
                                                    <Option
                                                        disabled={true}
                                                        value={1}
                                                    >
                                                        <Spin
                                                            style={{
                                                                display: 'flex',
                                                                justifyContent:
                                                                    'center',
                                                            }}
                                                            indicator={antIcon}
                                                        />
                                                    </Option>
                                                ) : (
                                                    this.props.evs?.volumeTypes.map(
                                                        item => (
                                                            <Option
                                                                value={item.id}
                                                            >
                                                                {item.name}
                                                            </Option>
                                                        )
                                                    )
                                                )}
                                            </Select>
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                        ) : null}

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
                                    Size
                                </Typography.Title>
                                <Typography.Paragraph
                                    style={{
                                        color: `#747373`,
                                        fontSize: `1.1em`,
                                        marginBottom: `0.3em`,
                                    }}
                                ></Typography.Paragraph>

                                <Form.Item style={{ width: '800px' }}>
                                    {getFieldDecorator(
                                        'size',
                                        {}
                                    )(
                                        <Col span={14}>
                                            <Slider
                                                marks={marks}
                                                min={this.state.minVal}
                                                max={this.state.maxVal}
                                                onChange={this.onChange}
                                                checked={disabled}
                                                value={
                                                    typeof inputValue ===
                                                    'number'
                                                        ? inputValue
                                                        : 0
                                                }
                                            />
                                            {this.state.inputValue % 1 !== 0 ? (
                                                <Typography
                                                    style={{ color: 'red' }}
                                                >
                                                    Volume size must be integer
                                                </Typography>
                                            ) : null}
                                        </Col>
                                    )}
                                    <Col span={4}>
                                        <InputNumber
                                            size="default"
                                            style={{ marginLeft: '20px' }}
                                            min={this.state.minVal}
                                            max={this.state.maxVal}
                                            onChange={this.onChange}
                                            value={inputValue}
                                        />
                                    </Col>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item>
                            <Button
                                disabled={this.state.inputValue % 1 !== 0}
                                loading={this.props.creatingEVS}
                                style={{ width: '30%', height: '45px' }}
                                type="primary"
                                htmlType="submit"
                            >
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
                <Divider />
                <PricingStrip />
            </div>
        );
    }
}

export default connect(state => {
    return {
        evsCreationData: { ...state.evs.creationType },
        imageList: state.ims,
        snapshotList: state.snapshot,
        creatingEVS: state.loading.effects['evs/create'],
        availabilityZones: state.global.availabilityZones,
        evs: state.evs,
        fetchingVolumeTypes: state.loading.effects['evs/volumeTypes'],
        fetchingAvailabilityZones:
            state.loading.effects['global/fetchAvailabilityZone'],
    };
})(Form.create()(CreateEVS));
