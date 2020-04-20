import React, { Component } from 'react';
import {
    Form,
    Icon,
    Input,
    Button,
    Checkbox,
    Card,
    Modal,
    Row,
    Statistic,
    Typography,
    List,
    Col,
    Menu,
    Dropdown,
} from 'antd';
import { connect } from 'dva';
import request from 'umi-request';

class UpdateEvs extends Component {
    constructor() {
        super();
        this.state = {
            evs: [],
            update: true,
            filteredItmes: [],
        };
    }

    handleChange = event => {
        const { value } = event.target;
        this.setState({ value });
    };

    UpdateEvs(event) {
        this.setState({ update: !this.state.update, flavor: event.flavor });
    }

    handleSubmit = e => {
        e.preventDefault();

        this.props.form.validateFields((err, values) => {
            if (!err) {
                const {
                    storage_type,
                    storage_price,
                    storage_description,
                } = values;
                const { evs } = this.props;
                const { evstype, description, price } = evs;
                const data = {
                    storage_type:
                        storage_type && storage_type !== ''
                            ? storage_type
                            : evstype,
                    storage_price:
                        storage_price && storage_price !== ''
                            ? storage_price
                            : price,
                    storage_description:
                        storage_description && storage_description !== ''
                            ? storage_description
                            : description,
                };
                this.props.dispatch({
                    type: 'evs/updateFromDb',
                    payload: {
                        params: evs,
                        updatedData: data,
                    },
                });
                this.props.dispatch({
                    type: 'evs/singleVolume',
                    payload: {
                        showmodal: this.props.showmodal,
                    },
                });
            }
        });
        this.props.form.resetFields();
    };

    handleClose = async () => {
        await this.props.dispatch({
            type: 'evs/singleVolume',
            payload: { showmodal: this.props.showmodal },
        });

        this.props.dispatch({
            type: 'evs/stopLoading',
        });
    };

    render() {
        const menu = (
            <Menu>
                <Menu.Item key="0">
                    <a href="http://www.alipay.com/">1st menu item</a>
                </Menu.Item>
                <Menu.Item key="1">
                    <a href="http://www.taobao.com/">2nd menu item</a>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="3">3rd menu item</Menu.Item>
            </Menu>
        );

        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <Modal
                    okButtonProps={{ style: { display: 'none' } }}
                    title="Elastic Volume Service Update"
                    visible={this.props.showModal}
                    onCancel={this.handleClose}
                    cancelButtonProps={{ loading: !this.props.showModal }}
                >
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Form.Item label="Evs Type">
                            {getFieldDecorator(
                                'storage_type',
                                {}
                            )(
                                <Input
                                    placeholder={this.props?.evs?.evstype}
                                    value={this.props?.evs?.evstype}
                                />
                            )}
                        </Form.Item>

                        <Form.Item label="Evs description">
                            {getFieldDecorator('storage_description', {
                                rules: [
                                    {
                                        message: 'Please enter evs description',
                                        value: this.props?.evs?.description,
                                    },
                                ],
                            })(
                                <Input
                                    placeholder={this.props?.evs?.description}
                                    value={this.props?.evs?.description}
                                />
                            )}
                        </Form.Item>

                        <Form.Item label="Evs Price">
                            {getFieldDecorator(
                                'storage_price',

                                {}
                            )(
                                <Input
                                    placeholder={this.props?.evs?.price}
                                    value={this.props?.evs?.price}
                                />
                            )}
                        </Form.Item>
                        <Form.Item>
                            <Button
                                loading={!this.props.showModal}
                                type="primary"
                                htmlType="submit"
                            >
                                update
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
    }
}

export default connect(state => {
    return {
        showModal: state.evs.showmodal,
    };
})(Form.create()(UpdateEvs));
