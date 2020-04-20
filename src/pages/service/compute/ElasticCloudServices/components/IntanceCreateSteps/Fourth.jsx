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
    Slider,
    InputNumber,
    Button,
} from 'antd';
import ImageDisplayBox from '@/components/InstanceImages/ImageDisplayBox';
import { connect } from 'dva';
import FormRow from '@/pages/service/components/FormRow';
import { getPageQuery } from '../../../../../../utils/utils';

const { Option } = Select;

const marks = {
    1: '1',
    20: '20',
    40: '40',
    60: '60',
    80: '80',
    100: '100',
};

class Fourth extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            minVal: 40,
            maxVal: 80,
            inputValue: 40,
            choice: '',
            disabled: false,
            visible: false,
        };
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        const imageId = getPageQuery()?.image_id;
        const { dispatch, form } = this.props;
        if (imageId) {
            this.setState({ imageId });
        }
    }

    handleChange(e) {
        e.preventDefault();
        this.setState({ selectedImage: e.target.value });
    }

    setDiskSize = value => {
        this.setState({
            inputValue: value,
        });
    };

    showModal = () => {
        this.props.dispatch({
            type: 'drawer/showDrawer',
            payload: {
                componentPath: `compute/Keypairs/CreateKeypair`,
                mountedData: { drawerName: 'Create New keypair' },
            },
        });
    };

    handleSubmit = e => {
        e.preventDefault();

        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                const { keys, names } = values;

                await this.props.dispatch({
                    type: 'keypair/create',
                    payload: values,
                });
            }
        });
        this.handleCancel();
    };

    render() {
        const { imageId } = this.state;
        let { inputValue, disabled } = this.state;

        const filteredImage = Object.keys(this.props.formsData).includes(
            'image_id'
        )
            ? this.props.helperData.ims.filter(
                  items => items.id === this.props.formsData.image_id
              )
            : null;

        const { data } = this.props;
        return (
            <div>
                <Row>
                    <Col>
                        <Form>
                            <FormRow
                                style={{ marginBottom: `28px` }}
                                field={
                                    <Select mode="multiple" size="default">
                                        {this.props.helperData.securitygroup.map(
                                            item => (
                                                <Option
                                                    key={item.id}
                                                    value={item.name}
                                                >
                                                    {`${item.name}`.toUpperCase()}
                                                </Option>
                                            )
                                        )}
                                    </Select>
                                }
                                title={'Select Security Group'}
                                dataKey="security_groups"
                                decorator={{
                                    rules: [
                                        {
                                            required: false,
                                            message:
                                                'you must select a security group',
                                        },
                                    ],
                                }}
                                getFieldDecorator={
                                    this.props.form.getFieldDecorator
                                }
                            />

                            <FormRow
                                field={
                                    <Select size="default">
                                        {this.props.helperData.keypair.map(
                                            item => (
                                                <Option
                                                    key={item.id}
                                                    value={item.name}
                                                >
                                                    {`${item.name}`.toUpperCase()}
                                                </Option>
                                            )
                                        )}
                                    </Select>
                                }
                                title={'Select Keypair'}
                                dataKey="key_name"
                                decorator={{
                                    rules: [
                                        {
                                            required: false,
                                            message:
                                                'you must select a keypair',
                                        },
                                    ],
                                }}
                                getFieldDecorator={
                                    this.props.form.getFieldDecorator
                                }
                            />
                        </Form>
                    </Col>

                    <Col style={{ marginTop: '10px' }}>
                        <Button size="medium" type='primary' onClick={this.showModal}>
                            Create Keypair
                        </Button>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default connect(({ createECS, keypair, loading, drawer }) => {
    return {
        ...createECS,
        keypairList: { ...keypair },
        creatingKeyPair: loading.effects['keypair/create'],
        showKeypairModel: drawer.show,
    };
})(
    Form.create({
        onFieldsChange(props, changedFields) {
            const { dispatch } = props;
            dispatch({
                type: `createECS/updateFormData`,
                payload: {
                    formIndex: 'Fourth',
                    value: {
                        ...changedFields,
                    },
                },
            });
        },
        mapPropsToFields(props) {
            const { formsData } = props;
            return Object.entries(formsData.Fourth).reduce(
                (inital, values) => ({
                    ...inital,
                    [values[0]]: Form.createFormField({ ...values[1] }),
                }),
                {}
            );
        },
    })(Fourth)
);
