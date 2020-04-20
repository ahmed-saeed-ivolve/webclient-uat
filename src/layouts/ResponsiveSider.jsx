import React, { Component } from 'react';
import { Link, Redirect } from 'umi';

import { Layout } from 'antd';
import { Menu, Icon, Button } from 'antd';
import servicesMarkup from '../utils/servicesMarkup';
import { router } from 'umi';
const { SubMenu } = Menu;
const { Sider } = Layout;
class ReponsiveSider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
        };
    }
    toggleCollapsed = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };

    toggleMenu = () => {
        this.props.toggleMenu();
    };

    render() {
        return (
            <Menu
                defaultSelectedKeys={['1']}
                mode="inline"
                theme="dark"
                inlineCollapsed={this.state.collapsed}
                style={{
                    marginTop: '58px',
                    height: ' 100vh',
                }}
                onClick={this.toggleMenu}
            >
                <Menu.Item key="4">
                    <Link to="/">
                        <Icon type="pie-chart" />
                        <span>Dashboard</span>
                    </Link>
                </Menu.Item>

                <SubMenu
                    key="sub1"
                    title={
                        <span>
                            <Icon type="cloud-server" />
                            <span>Compute</span>
                        </span>
                    }
                >
                    <Menu.Item
                        key="6"
                        onClick={() => {
                            router.push(
                                servicesMarkup.categories['Compute'].service[
                                    'Elastic Compute Server'
                                ].link
                            );
                        }}
                    >
                        <Icon type={'code-sandbox'} />
                        <span> Elastic Compute Server</span>
                    </Menu.Item>

                    <Menu.Item
                        key="7"
                        onClick={() => {
                            router.push(
                                servicesMarkup.categories['Compute'].service[
                                    'Image Management Service'
                                ].link
                            );
                        }}
                    >
                        <Icon type={'camera'} />
                        <span> Image Management Service</span>
                    </Menu.Item>
                    <Menu.Item
                        key="8"
                        onClick={() => {
                            router.push(
                                servicesMarkup.categories['Compute'].service[
                                    'Flavors'
                                ].link
                            );
                        }}
                    >
                        <Icon type={'experiment'} />
                        <span>Flavors</span>
                    </Menu.Item>
                    <Menu.Item
                        key="9"
                        onClick={() => {
                            router.push(
                                servicesMarkup.categories['Compute'].service[
                                    'Keypairs'
                                ].link
                            );
                        }}
                    >
                        <Icon type={'api'} />
                        <span>Keypairs</span>
                    </Menu.Item>
                </SubMenu>
                <SubMenu
                    key="sub2"
                    title={
                        <span>
                            <Icon type="block" />
                            <span>Storage</span>
                        </span>
                    }
                >
                    <Menu.Item
                        key="10"
                        onClick={() => {
                            router.push(
                                servicesMarkup.categories['Storage'].service[
                                    'Elastic Volume Service'
                                ].link
                            );
                        }}
                    >
                        <Icon type={'code-sandbox'} />
                        <span> Elastic Volume Service</span>
                    </Menu.Item>

                    <Menu.Item
                        key="10"
                        onClick={() => {
                            router.push(
                                servicesMarkup.categories['Storage'].service[
                                    'Snapshots'
                                ].link
                            );
                        }}
                    >
                        <Icon type={'database'} />
                        <span> Snapshots</span>
                    </Menu.Item>
                </SubMenu>

                <SubMenu
                    key="sub3"
                    title={
                        <span>
                            <Icon type="cloud-server" />
                            <span>Networking</span>
                        </span>
                    }
                >
                    <Menu.Item
                        key="13"
                        onClick={() => {
                            router.push(
                                servicesMarkup.categories['Networking'].service[
                                    'Networks'
                                ].link
                            );
                        }}
                    >
                        <Icon type={'code-sandbox'} />
                        <span>Networks</span>
                    </Menu.Item>

                    <Menu.Item
                        key="14"
                        onClick={() => {
                            router.push(
                                servicesMarkup.categories['Networking'].service[
                                    'Routers'
                                ].link
                            );
                        }}
                    >
                        <Icon type={'camera'} />
                        <span>Routers</span>
                    </Menu.Item>
                    <Menu.Item
                        key="15"
                        onClick={() => {
                            router.push(
                                servicesMarkup.categories['Networking'].service[
                                    'Security Groups'
                                ].link
                            );
                        }}
                    >
                        <Icon type={'experiment'} />
                        <span>Security Groups</span>
                    </Menu.Item>

                    <Menu.Item
                        key="16"
                        onClick={() => {
                            router.push(
                                servicesMarkup.categories['Networking'].service[
                                    'Elastic IP'
                                ].link
                            );
                        }}
                    >
                        <Icon type={'api'} />
                        <span>Elastic IP</span>
                    </Menu.Item>
                </SubMenu>

                <SubMenu
                    key="sub4"
                    title={
                        <span>
                            <Icon type="cloud-server" />
                            <span>IAM</span>
                        </span>
                    }
                >
                    <Menu.Item
                        key="2"
                        onClick={() => {
                            router.push(
                                servicesMarkup.categories['IAM'].service[
                                    'Account'
                                ].link
                            );
                        }}
                    >
                        <Icon type="desktop" />
                        <span>Account</span>
                    </Menu.Item>

                    <Menu.Item
                        key="19"
                        onClick={() => {
                            router.push(
                                servicesMarkup.categories['IAM'].service[
                                    'Projects'
                                ].link
                            );
                        }}
                    >
                        <Icon type={'experiment'} />
                        <span>Projects</span>
                    </Menu.Item>

                    <Menu.Item
                        key="17"
                        onClick={() => {
                            router.push(
                                servicesMarkup.categories['IAM'].service[
                                    'Groups'
                                ].link
                            );
                        }}
                    >
                        <Icon type={'code-sandbox'} />
                        <span>Groups</span>
                    </Menu.Item>

                    <Menu.Item
                        key="20"
                        onClick={() => {
                            router.push(
                                servicesMarkup.categories['IAM'].service[
                                    'Users'
                                ].link
                            );
                        }}
                    >
                        <Icon type={'api'} />
                        <span>Users</span>
                    </Menu.Item>
                </SubMenu>
                <SubMenu
                    key="sub5"
                    title={
                        <span>
                            <Icon type="cloud-server" />
                            <span>Billing</span>
                        </span>
                    }
                >
                    <Menu.Item
                        key="6"
                        onClick={() => {
                            router.push(
                                servicesMarkup.categories['Billing'].service[
                                    'Usage Report'
                                ].link
                            );
                        }}
                    >
                        <Icon type={'code-sandbox'} />
                        <span> Usege Report</span>
                    </Menu.Item>

                    <Menu.Item
                        key="7"
                        onClick={() => {
                            router.push(
                                servicesMarkup.categories['Billing'].service[
                                    'Overview'
                                ].link
                            );
                        }}
                    >
                        <Icon type={'camera'} />
                        <span> Overview</span>
                    </Menu.Item>
                    <Menu.Item
                        key="8"
                        onClick={() => {
                            router.push(
                                servicesMarkup.categories['Billing'].service[
                                    'Billing Analysis'
                                ].link
                            );
                        }}
                    >
                        <Icon type={'experiment'} />
                        <span>Billing Analysis</span>
                    </Menu.Item>
                    <Menu.Item
                        key="9"
                        onClick={() => {
                            router.push(
                                servicesMarkup.categories['Billing'].service[
                                    'Admin'
                                ].link
                            );
                        }}
                    >
                        <Icon type={'api'} />
                        <span>Admin</span>
                    </Menu.Item>
                    <Menu.Item
                        key="9"
                        onClick={() => {
                            router.push(
                                servicesMarkup.categories['Billing'].service[
                                    'Usage Dataframes'
                                ].link
                            );
                        }}
                    >
                        <Icon type={'api'} />
                        <span>Usage Dataframes</span>
                    </Menu.Item>
                </SubMenu>
            </Menu>
        );
    }
}

export default ReponsiveSider;
