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

class UpdateModal extends Component {
    constructor() {
        super();
        this.state = {
            flavors: [],
            update: true,
            filteredItmes: [],
        };
    }

    handleChange = event => {
        const { value } = event.target;
        this.setState({ value });
    };

    updateFlavor(event) {
        this.setState({ update: !this.state.update, flavor: event.flavor });
    }

    handleSubmit = e => {
        e.preventDefault();

        this.props.form.validateFields((err, values) => {
            if (!err) {
                const {
                    flavor_mode,
                    flavor_price,
                    flavor_name,
                    flavor_com,
                    flavor_ram,
                    flavor_vcpu,
                } = values;
                const { flavor } = this.props;
                const { name, price, com, mod, ram, vcpu } = flavor;

                const data = {
                    flavor_mode:
                        flavor_mode && flavor_mode !== '' ? flavor_mode : mod,
                    flavor_name:
                        flavor_name && flavor_name !== '' ? flavor_name : name,
                    flavor_com:
                        flavor_com && flavor_com !== '' ? flavor_com : com,
                    flavor_ram:
                        flavor_ram && flavor_ram !== '' ? flavor_ram : ram,
                    flavor_vcpu:
                        flavor_vcpu && flavor_vcpu !== '' ? flavor_vcpu : vcpu,
                    flavor_price:
                        flavor_price && flavor_price !== ''
                            ? flavor_price
                            : price,
                };

                this.props.dispatch({
                    type: 'flavor/updateFromDb',
                    payload: {
                        params: flavor,
                        updatedData: data,
                    },
                });
                this.props.dispatch({
                    type: 'flavor/singleFlavor',
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
            type: 'flavor/singleFlavor',
            payload: { showmodal: this.props.showmodal },
        });

        this.props.dispatch({
            type: 'flavor/stopLoading',
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
                    title="Flavor Update"
                    visible={this.props.showModal}
                    onCancel={this.handleClose}
                    cancelButtonProps={{ loading: !this.props.showModal }}
                >
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Form.Item label="Flavor Name">
                            {getFieldDecorator('flavor_name', {
                                rules: [
                                    {
                                        message: 'Please enter flavor name',
                                        value: this.props?.flavor?.name,
                                    },
                                ],
                            })(
                                <Input
                                    placeholder={this.props?.flavor?.name}
                                    value={this.props?.flavor?.name}
                                />
                            )}
                        </Form.Item>
                        <Form.Item label="Flavor Period">
                            {getFieldDecorator(
                                'flavor_com',
                                {}
                            )(
                                <Input
                                    placeholder={this.props?.flavor?.com}
                                    value={this.props?.flavor?.com}
                                />
                            )}
                        </Form.Item>
                        <Form.Item label="Flavor Mode">
                            {getFieldDecorator(
                                'flavor_mode',
                                {}
                            )(
                                <Input
                                    placeholder={this.props?.flavor?.mod}
                                    value={this.props?.flavor?.mod}
                                />
                            )}
                        </Form.Item>

                        <Form.Item label="Flavor Ram">
                            {getFieldDecorator(
                                'flavor_ram',
                                {}
                            )(
                                <Input
                                    placeholder={this.props?.flavor?.ram}
                                    value={this.props?.flavor?.ram}
                                />
                            )}
                        </Form.Item>

                        <Form.Item label="Flavor Vcpu">
                            {getFieldDecorator(
                                'flavor_vcpu',
                                {}
                            )(
                                <Input
                                    placeholder={this.props?.flavor?.vcpu}
                                    value={this.props?.flavor?.vcpu}
                                />
                            )}
                        </Form.Item>

                        <Form.Item label="Flavor Price">
                            {getFieldDecorator(
                                'flavor_price',
                                {}
                            )(
                                <Input
                                    placeholder={this.props?.flavor?.price}
                                    value={this.props?.flavor?.price}
                                />
                            )}
                        </Form.Item>
                        <Form.Item>
                            <Button
                                loading={!this.props.showModal}
                                type="primary"
                                htmlType="submit"
                            >
                                Update
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
        fetchFlavors: state.loading.effects['flavor/fetchFlavors'],
        showModal: state.flavor.showmodal,
        updateFromDb: state.loading.effects['flavor/updateFromDb'],
    };
})(Form.create()(UpdateModal));
