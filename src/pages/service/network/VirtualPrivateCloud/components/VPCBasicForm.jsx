import React, { PureComponent } from 'react';
import {
    Form,
    Row,
    Col,
    Typography,
    Input,
    Radio,
    Checkbox,
    Icon,
    Spin,
} from 'antd';
import FormRow from '../../../components/FormRow';
import { connect } from 'dva';
import { checkAdminScope } from '@/utils/utils';

const antIcon = (
    <Icon
        type="loading"
        style={{ fontSize: 20, margin: '10px 0px 10px 0px' }}
        spin
    />
);

class VPCBasicForm extends PureComponent {
    render() {
        return (
            <div>
                <Form hideRequiredMark onSubmit={this.handleSubmit}>
                    <FormRow
                        title={'Name'}
                        paragraph={''}
                        dataKey="name"
                        default={this.props?.data?.name}
                        style={{ padding: '15px' }}
                        decorator={{
                            rules: [
                                {
                                    message:
                                        'Please enter correct network name',
                                    pattern: /^[a-zA-Z]+([-_.]?[a-zA-Z0-9]+)*$/,
                                },
                                {
                                    required: true,
                                    message: 'Please enter network name',
                                },
                            ],
                        }}
                        getFieldDecorator={this.props.form.getFieldDecorator}
                        span={12}
                    >
                        <Input />
                    </FormRow>
                    <FormRow
                        title={'Region'}
                        style={{ padding: '15px' }}
                        dataKey="region"
                        default={this.props?.data?.region}
                        decorator={{
                            rules: [
                                {
                                    required: true,
                                    message: 'You must select a region',
                                },
                            ],
                            initialValue: false,
                        }}
                        getFieldDecorator={this.props.form.getFieldDecorator}
                        span={12}
                    >
                        <Radio.Group
                            style={{ width: '100%' }}
                            buttonStyle="solid"
                        >
                            {this.props.fetchingRegions ? (
                                <Spin
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                    }}
                                    indicator={antIcon}
                                />
                            ) : (
                                this.props.global.regions.map(item => (
                                    <Radio.Button
                                        style={{
                                            width: '50%',
                                            textAlign: 'center',
                                        }}
                                        value={item.id}
                                    >
                                        {item.id === 'RegionOne'
                                            ? 'Riyadh'
                                            : item.id}
                                    </Radio.Button>
                                ))
                            )}
                        </Radio.Group>
                    </FormRow>

                    <FormRow
                        default={this.props?.data?.is_router_external}
                        title={'Network Type'}
                        dataKey="is_router_external"
                        style={{ padding: '15px' }}
                        decorator={{
                            rules: [
                                {
                                    required: true,
                                    message: 'Please select Network type',
                                },
                            ],
                            initialValue: false,
                        }}
                        getFieldDecorator={this.props.form.getFieldDecorator}
                        span={12}
                    >
                        <Radio.Group
                            defaultValue={false}
                            style={{ width: '100%' }}
                            buttonStyle="solid"
                        >
                            <Radio.Button
                                style={{ width: '50%', textAlign: 'center' }}
                                value={false}
                            >
                                Internal
                            </Radio.Button>
                            {checkAdminScope() && (
                                <Radio.Button
                                    style={{
                                        width: '50%',
                                        textAlign: 'center',
                                    }}
                                    value={true}
                                >
                                    External
                                </Radio.Button>
                            )}
                        </Radio.Group>
                    </FormRow>
                </Form>
            </div>
        );
    }
}

export default connect(({ vpc, global, loading }) => {
    return {
        ...vpc,
        global,
        fetchingRegions: loading.effects['global/fetchRegions'],
    };
})(
    Form.create({
        onValuesChange(props, values) {
            const { dispatch } = props;
            dispatch({
                type: `vpc/updateFormData`,
                payload: {
                    ...values,
                },
            });
        },
    })(VPCBasicForm)
);
