import React, { PureComponent } from 'react';
import {
    Row,
    Col,
    Typography,
    Divider,
    Timeline,
    Tabs,
    Form,
    Input,
    Radio,
    Select,
    Button,
    Table,
    Descriptions,
    Empty,
    Icon,
} from 'antd';
import ImageDisplayBox from '@/components/InstanceImages/ImageDisplayBox';
import { connect } from 'dva';
import FormRow from '../../../../components/FormRow';
import VPCTable from '@/pages/service/network/VirtualPrivateCloud/VPCElementsTable';

const { Option } = Select;

class Fifth extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            firstChoice: '',
            secondChoice: '',
            count: 0,
        };
    }
    componentDidMount() {
        const { dispatch } = this.props;
    }
    componentDidUpdate(prevProps) {
        if (this.props.metaData !== prevProps.metaData) {
            const { metaData } = this.props;
            const { dispatch } = this.props;

            var metadata = {};
            var stepData = metaData.map(item => {
                metadata[item.metaKey] = item.metaValue;
            });
            dispatch({
                type: `createECS/updateFormData`,
                payload: {
                    formIndex: 'Fifth',
                    value: {
                        metadata,
                    },
                },
            });
        }
    }
    handleDelete(key) {
        const { dispatch } = this.props;
        const dataSource = [...this.state.dataSource];

        const update_metadata = this.props.metaData.filter(
            item => item.key !== key
        );
        dispatch({
            type: 'createECS/deleteMetaData',
            payload: update_metadata,
        });
    }
    handleFirstChoice(value) {
        this.setState({
            firstChoice: value,
            secondChoice: '',
            thirdChoice: '',
        });
        this.props.form.setFieldsValue({
            secondChoice: undefined,
            thirdChoice: undefined,
        });
    }
    handleSecondChoice(value) {
        this.setState({ secondChoice: value, thirdChoice: '' });
        this.props.form.setFieldsValue({ thirdChoice: undefined });
    }

    handleAdd(e) {
        e.preventDefault();

        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { keys, names } = values;
                const { count, dataSource, firstChoice } = this.state;
                const { dispatch } = this.props;

                if (firstChoice !== 'Others') {
                    var newData = {
                        key: this.props.count,
                        metaKey: `${values['firstChoice']}-${values['secondChoice']}-${values['thirdChoice']}`,
                        metaValue: `${values['fourthChoice']}`,
                    };
                } else {
                    var newData = {
                        key: this.props.count,
                        metaKey: `${values['othersFirstChoice']}`,
                        metaValue: `${values['othersSecondChoice']}`,
                    };
                }
                this.props.form.resetFields();
                dispatch({
                    type: 'createECS/setMetaData',
                    payload: {
                        new_data: newData,
                        counter: this.props.count + 1,
                    },
                });
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const columns = [
            {
                title: 'Key',
                dataIndex: 'metaKey',
            },
            {
                title: 'Value',
                dataIndex: 'metaValue',
            },
            {
                title: 'Delete',
                dataIndex: 'operation',
                render: (text, record) =>
                    this.props.metaData.length >= 1 ? (
                        <Button
                            onClick={this.handleDelete.bind(this, record.key)}
                        >
                            <Icon type="close" />
                        </Button>
                    ) : null,
            },
        ];
        const data = Object.values(this.props.helperData.dbmsMetadata);

        return (
            <React.Fragment>
                <Divider
                    orientation="left"
                    style={{ color: '#333', fontWeight: 'normal' }}
                >
                    Metadata
                </Divider>
                <Row>
                    <Col span={12}>
                        <Form onSubmit={this.handleAdd.bind(this)}>
                            <Row gutter={16}>
                                <Col span={24}>
                                    <Descriptions>
                                        <Descriptions.Item>
                                            This step allows you to add Metadata
                                            items to your instance.
                                        </Descriptions.Item>
                                    </Descriptions>
                                    <Descriptions>
                                        <Descriptions.Item>
                                            You can specify resource metadata by
                                            selecting these Options.In the
                                            options fields there are metadata
                                            definitions from the Metdata
                                            Catalog.Use the "Others" option to
                                            add metadata with the key of your
                                            choice.
                                        </Descriptions.Item>
                                    </Descriptions>
                                    <Form.Item>
                                        {getFieldDecorator('firstChoice', {
                                            rules: [
                                                {
                                                    required: true,
                                                },
                                            ],
                                        })(
                                            <Select
                                                style={{ width: '400px' }}
                                                onChange={this.handleFirstChoice.bind(
                                                    this
                                                )}
                                            >
                                                {data.map(item => (
                                                    <Option
                                                        key={item}
                                                        value={
                                                            item.display_name
                                                        }
                                                    >
                                                        {item.display_name}
                                                    </Option>
                                                ))}
                                                <Option value="Others">
                                                    Others
                                                </Option>
                                            </Select>
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            {this.state.firstChoice !== 'Others' ? (
                                <>
                                    <Row gutter={16}>
                                        <Col span={24}>
                                            <Form.Item>
                                                {getFieldDecorator(
                                                    'secondChoice',
                                                    {
                                                        rules: [
                                                            {
                                                                required: true,
                                                            },
                                                        ],
                                                    }
                                                )(
                                                    <Select
                                                        allowClear
                                                        style={{
                                                            width: '400px',
                                                        }}
                                                        onChange={this.handleSecondChoice.bind(
                                                            this
                                                        )}
                                                    >
                                                        {this.state.firstChoice
                                                            ? data
                                                                  .filter(
                                                                      item =>
                                                                          item.display_name ===
                                                                          this
                                                                              .state
                                                                              .firstChoice
                                                                  )[0]
                                                                  .objects.map(
                                                                      item => (
                                                                          <Option
                                                                              key={
                                                                                  item
                                                                              }
                                                                              value={
                                                                                  item.name
                                                                              }
                                                                          >
                                                                              {
                                                                                  item.name
                                                                              }
                                                                          </Option>
                                                                      )
                                                                  )
                                                            : null}
                                                    </Select>
                                                )}
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col span={24}>
                                            <Input.Group compact>
                                                <Form.Item>
                                                    {getFieldDecorator(
                                                        'thirdChoice',
                                                        {
                                                            rules: [
                                                                {
                                                                    required: true,
                                                                },
                                                            ],
                                                        }
                                                    )(
                                                        <Select
                                                            style={{
                                                                width: '250px',
                                                            }}
                                                        >
                                                            {this.state
                                                                .secondChoice
                                                                ? Object.values(
                                                                      data
                                                                          .filter(
                                                                              item =>
                                                                                  item.display_name ===
                                                                                  this
                                                                                      .state
                                                                                      .firstChoice
                                                                          )[0]
                                                                          .objects.filter(
                                                                              item =>
                                                                                  item.name ===
                                                                                  this
                                                                                      .state
                                                                                      .secondChoice
                                                                          )[0]
                                                                          .properties
                                                                  ).map(
                                                                      item => (
                                                                          <Option
                                                                              key={
                                                                                  item
                                                                              }
                                                                              value={
                                                                                  item.title
                                                                              }
                                                                          >
                                                                              {
                                                                                  item.title
                                                                              }
                                                                          </Option>
                                                                      )
                                                                  )
                                                                : null}
                                                        </Select>
                                                    )}
                                                </Form.Item>
                                                <Form.Item>
                                                    {getFieldDecorator(
                                                        'fourthChoice',
                                                        {
                                                            rules: [
                                                                {
                                                                    required: true,
                                                                },
                                                            ],
                                                        }
                                                    )(
                                                        <Input
                                                            style={{
                                                                width: '150px',
                                                                textAlign:
                                                                    'center',
                                                            }}
                                                            size="default"
                                                            placeholder="Value"
                                                        />
                                                    )}
                                                </Form.Item>
                                            </Input.Group>
                                        </Col>
                                    </Row>
                                </>
                            ) : (
                                <>
                                    <Row gutter={16}>
                                        <Col span={24}>
                                            <Form.Item>
                                                {getFieldDecorator(
                                                    'othersFirstChoice',
                                                    {
                                                        rules: [
                                                            {
                                                                required: true,
                                                            },
                                                        ],
                                                    }
                                                )(
                                                    <Input
                                                        style={{
                                                            width: '400px',
                                                        }}
                                                        size="default"
                                                        placeholder="Enter key of your choice"
                                                    />
                                                )}
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col span={24}>
                                            <Form.Item>
                                                {getFieldDecorator(
                                                    'othersSecondChoice',
                                                    {
                                                        rules: [
                                                            {
                                                                required: true,
                                                            },
                                                        ],
                                                    }
                                                )(
                                                    <Input
                                                        style={{
                                                            width: '400px',
                                                        }}
                                                        size="default"
                                                        placeholder="Value"
                                                    />
                                                )}
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </>
                            )}
                            <Form.Item>
                                <Button
                                    style={{ width: '30%', height: '45px' }}
                                    type="primary"
                                    htmlType="submit"
                                >
                                    Add
                                </Button>
                            </Form.Item>
                        </Form>
                    </Col>
                    <Col span={12}>
                        <Table
                            scroll={{ y: 290 }}
                            pagination={false}
                            dataSource={this.props.metaData}
                            columns={columns}
                            bordered
                            locale={{
                                emptyText: (
                                    <Empty
                                        style={{ height: '290px' }}
                                        description={'No Data'}
                                    ></Empty>
                                ),
                            }}
                        />
                    </Col>
                </Row>
            </React.Fragment>
        );
    }
}

export default connect(({ createECS }) => {
    return {
        ...createECS,
        metaData: createECS.metaData,
        formsData: createECS.formsData,
    };
})(Form.create()(Fifth));
