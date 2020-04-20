import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { router } from 'umi';
import { Link } from 'react-router-dom';
import { Layout, Menu, Icon, Typography, Divider, Skeleton } from 'antd';
import services from '@/utils/servicesMarkup';
import styles from './_layout.less';
import { connect } from 'dva';
import ServiceDetailsLayout from '@/pages/service/components/ServiceDetailsLayout';
import { Row, Col } from 'antd';
import { getScope, checkAdminScope } from '@/utils/utils';

const { Header, Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;

class ServicesLayout extends React.Component {
    state = {
        collapsed: false,
    };
    render() {
        const checkProjectScope = serviceKey => {
            if (
                !checkAdminScope() &&
                (serviceKey === 'Projects' ||
                    serviceKey === 'Groups' ||
                    serviceKey === 'Users' ||
                    serviceKey === 'Flavors Pricing')
            ) {
                return false;
            }

            return true;
        };
        if(this.props.appState.serviceLayout.sideBar.selectedCategory === 'Security'){
            return router.push('/notfound')
        }
        return (
            <Layout className={styles[`content-container-outer`]} theme="light">
                <Sider
                    breakpoint="lg"
                    collapsed={this.state.collapsed}
                    reverseArrow="true"
                    onBreakpoint={broken => {}}
                    onCollapse={(collapsed, type) => {}}
                    className={styles[`sider`]}
                    width={`270px`}
                    style={{
                        background: `#fff`,
                        borderRight: `1px solid #e5e5e5`,
                    }}
                    trigger={null}
                >
                    <div className={styles[`service-title`]}>
                        <Row>
                            <Col xxl={24} xl={24} lg={24} md={0} sm={0} xs={0}>
                                <Typography.Title
                                    style={{
                                        marginBottom: `0px`,
                                        fontSize: `1.1em`,
                                        textTransform: `uppercase`,
                                        letterSpacing: `0.2em`,
                                        fontFamily: 'Raleway',
                                        fontWeight: `700`,
                                        color: `#505050`,
                                    }}
                                    level={4}
                                >
                                    {' '}
                                    {
                                        this.props.appState.serviceLayout
                                            .sideBar.selectedCategory
                                    }
                                </Typography.Title>
                            </Col>
                        </Row>
                    </div>

                    {Object.keys(this.props.appState.serviceLayout.sideBar)
                        .length === 0 ? (
                        <div style={{ padding: `0px 30px` }}>
                            <Skeleton active={true} />
                        </div>
                    ) : (
                        <Menu
                            mode="inline"
                            style={{
                                borderRight: `0`,
                                backgroundColor: `#fff`,
                            }}
                            className={styles['service-list']}
                            selectedKeys={[this.props.location.pathname]}
                        >
                            {this.props.appState.serviceLayout.sideBar.menu.map(
                                (item, index) => {
                                    if (item.child) {
                                        return (
                                            <SubMenu
                                                key={item.title}
                                                title={
                                                    <span>
                                                        <Icon type="mail" />
                                                        <span>
                                                            {item.title}
                                                        </span>
                                                    </span>
                                                }
                                            >
                                                {item.child.map(
                                                    (item, index) => {
                                                        return (
                                                            <Menu.Item
                                                                key={`${
                                                                    item.title
                                                                }${index}${Math.random()}`}
                                                            >
                                                                <Link
                                                                    to={
                                                                        item.link
                                                                    }
                                                                >
                                                                    <Icon
                                                                        type={
                                                                            item.icon
                                                                        }
                                                                    />
                                                                    <span>
                                                                        {
                                                                            item.title
                                                                        }
                                                                    </span>
                                                                </Link>
                                                            </Menu.Item>
                                                        );
                                                    }
                                                )}
                                            </SubMenu>
                                        );
                                    }
                                    if (checkProjectScope(item.title)) {
                                        return (
                                            <Menu.Item
                                                style={{
                                                    paddingLeft: `30px`,
                                                    fontSize: `1.1em`,
                                                    height: `45px`,
                                                    lineHeight: `45px`,
                                                    margin: 0,
                                                }}
                                                key={`${item.link}`}
                                            >
                                                <Link to={item.link}>
                                                    <Icon type={item.icon} />
                                                    <span>{item.title}</span>
                                                </Link>
                                            </Menu.Item>
                                        );
                                    } else {
                                        return null;
                                    }
                                }
                            )}
                        </Menu>
                    )}
                </Sider>
                <Layout style={{ minWidth: '400px' }}>
                    <Content
                        style={{
                            overflow: `hidden`,
                            display: `flex`,
                            flexDirection: `column`,
                        }}
                    >
                        <ServiceDetailsLayout
                            appState={this.props.appState}
                            loading={this.props.loading}
                            dispatch={this.props.dispatch}
                        >
                            {this.props.children}
                        </ServiceDetailsLayout>
                    </Content>
                </Layout>
            </Layout>
        );
    }
}

export default connect(state => ({ appState: state, loading: state.loading }))(
    ServicesLayout
);
