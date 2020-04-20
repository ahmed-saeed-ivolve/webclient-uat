import React, { PureComponent } from 'react';
import {
    Row,
    Col,
    Select,
    Typography,
    Menu,
    Divider,
    Timeline,
    Tabs,
    Form,
    Input,
    InputNumber,
    Radio,
} from 'antd';
import ImageDisplayBox from '@/components/InstanceImages/ImageDisplayBox';
import { connect } from 'dva';
import FormRow from '@/pages/service/components/FormRow';
import _ from 'lodash';

class First extends PureComponent {
    componentDidMount(prevProps, prevState) {}

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Row>
                <Col lg={24}>
                    <Form>
                        <Row style={{ marginBottom: `20px` }}>
                            <Col span={9}>
                                <FormRow
                                    style={{ width: '500px' }}
                                    title={'Name'}
                                    paragraph={''}
                                    dataKey="name"
                                    decorator={{
                                        rules: [
                                            {
                                                message:
                                                    'Please enter correct instance name',
                                                pattern: /^[a-zA-Z]+([-_.]?[a-zA-Z0-9]+)*$/,
                                            },
                                            {
                                                required: true,
                                                message:
                                                    'Please enter instance name',
                                            },
                                        ],
                                    }}
                                    getFieldDecorator={
                                        this.props.form.getFieldDecorator
                                    }
                                    span={12}
                                >
                                    <Input style={{ width: '500px' }} />
                                </FormRow>
                            </Col>
                        </Row>

                        <Row style={{ marginBottom: `20px` }}>
                            <Col span={24}>
                                <Typography.Title
                                    level={4}
                                    style={{
                                        fontSize: ` 1.1em`,
                                        fontFamily: 'Open Sans',
                                        fontWeight: 600,
                                        color: `#2b7797`,
                                        marginBottom: `0.1em`,
                                    }}
                                >
                                    Region
                                </Typography.Title>

                                <Typography.Paragraph
                                    style={{
                                        color: `#747373`,
                                        fontSize: `1.1em`,
                                        marginBottom: `0.3em`,
                                    }}
                                >
                                    {this.props.paragraph}
                                </Typography.Paragraph>

                                <Form.Item style={{ marginBottom: `0px` }}>
                                    {this.props.form.getFieldDecorator(
                                        'region',
                                        {
                                            rules: [
                                                {
                                                    required: true,
                                                    message:
                                                        'You must specify the region for this instance',
                                                },
                                            ],
                                        }
                                    )(
                                        <Select
                                            showSearch
                                            style={{ width: 150 }}
                                            placeholder="Select a region"
                                            optionFilterProp="children"
                                        >
                                            {this.props.helperData.global.regions.map(
                                                (item, index) => {
                                                    return (
                                                        <Option
                                                            key={index}
                                                            style={{
                                                                textAlign:
                                                                    'center',
                                                            }}
                                                            value={item.id}
                                                        >
                                                            {item.id}
                                                        </Option>
                                                    );
                                                }
                                            )}
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row style={{ marginBottom: `20px` }}>
                            <Col span={24}>
                                <Typography.Title
                                    level={4}
                                    style={{
                                        fontSize: ` 1.1em`,

                                        fontFamily: 'Open Sans',
                                        fontWeight: 600,
                                        color: `#2b7797`,
                                        marginBottom: `0.1em`,
                                    }}
                                >
                                    Availability Zone
                                </Typography.Title>
                                <Typography.Paragraph
                                    style={{
                                        color: `#747373`,
                                        fontSize: `1.1em`,
                                        marginBottom: `0.3em`,
                                    }}
                                >
                                    {this.props.paragraph}
                                </Typography.Paragraph>
                                <Form.Item style={{ marginBottom: `0px` }}>
                                    {this.props.form.getFieldDecorator(
                                        'availability_zone',
                                        {
                                            rules: [
                                                {
                                                    required: true,
                                                    message:
                                                        'You must specify an Availablity zone for this instance',
                                                },
                                            ],
                                        }
                                    )(
                                        <Select
                                            showSearch
                                            style={{ width: 150 }}
                                            placeholder="Select an availability zone"
                                            optionFilterProp="children"
                                        >
                                            {this.props.helperData.availabilityZones.map(
                                                (zone, index) => {
                                                    return (
                                                        <Option
                                                            key={zone?.name}
                                                            value={zone?.name}
                                                        >
                                                            {zone?.name}
                                                        </Option>
                                                    );
                                                }
                                            )}
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row style={{ marginBottom: `20px` }}>
                            <Col span={24}>
                                <Typography.Title
                                    level={4}
                                    style={{
                                        fontSize: ` 1.1em`,
                                        fontFamily: 'Open Sans',
                                        fontWeight: 600,
                                        color: `#2b7797`,
                                        marginBottom: `0.1em`,
                                    }}
                                >
                                    Count
                                </Typography.Title>

                                <Typography.Paragraph
                                    style={{
                                        color: `#747373`,
                                        fontSize: `1.1em`,
                                        marginBottom: `0.3em`,
                                    }}
                                >
                                    {this.props.paragraph}
                                </Typography.Paragraph>

                                <Form.Item style={{ marginBottom: `0px` }}>
                                    {this.props.form.getFieldDecorator(
                                        'count',
                                        {
                                            rules: [
                                                {
                                                    required: true,
                                                    message:
                                                        'Please enter the number of instances',
                                                },
                                            ],
                                        }
                                    )(
                                        <InputNumber
                                            min={
                                                this.props.helperData
                                                    .quotaInstances.quota_set
                                                    ?.instances -
                                                    this.props.helperData.ecs
                                                        .length ===
                                                0
                                                    ? 0
                                                    : 1
                                            }
                                            max={
                                                this.props.helperData
                                                    .quotaInstances.quota_set
                                                    ?.instances -
                                                this.props.helperData.ecs.length
                                            }
                                            defaultValue={
                                                this.props.helperData
                                                    .quotaInstances.quota_set
                                                    ?.instances -
                                                    this.props.helperData.ecs
                                                        .length ===
                                                0
                                                    ? 0
                                                    : 1
                                            }
                                            // onChange={onChange}
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>
        );
    }
}

export default connect(({ createECS }) => {
    return {
        ...createECS,
    };
})(
    Form.create({
        onFieldsChange(props, changedFields) {
            const { dispatch } = props;
            dispatch({
                type: `createECS/updateFormData`,
                payload: {
                    formIndex: 'First',
                    value: {
                        ...changedFields,
                    },
                },
            });
        },
        mapPropsToFields(props) {
            const { formsData } = props;

            return Object.entries(formsData.First).reduce(
                (inital, values) => ({
                    ...inital,
                    [values[0]]: Form.createFormField({ ...values[1] }),
                }),
                {}
            );
        },
    })(First)
);
