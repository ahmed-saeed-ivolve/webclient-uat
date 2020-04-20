import React, { PureComponent, Suspense, lazy } from 'react';
import {
    Row,
    Col,
    Icon,
    Menu,
    Dropdown,
    Avatar,
    Typography,
    Badge,
    Divider,
    Tag,
} from 'antd';
import { Input, Tooltip } from 'antd';
import HeaderNavigation from '@/components/GlobalHeader/HeaderNavigation';
import { connect } from 'dva';
import { Link, Redirect } from 'umi';
import Authorized from '@/utils/Authorized';
import DetasadLeftContent from '@/components/GlobalHeader/DetasadLeftConent';
import DetasadRightContent from '@/components/GlobalHeader/DetasadRightContent';
import ServicesMenu from '@/components/ServicesMenu';
import OutSideClickListener from '@/components/OutSideClickListener';
import styles from './DetasadCloudLayout.less';
import Button from 'antd/es/button';
import LogoHolder from '../components/DetasadLogoHolder/DetasadLogoHolder';
import ResponsiveSider from './ResponsiveSider';
import { Sider } from 'antd/lib/layout/Sider';
import AllDrawer from '@/components/AllDrawer/AllDrawer';
import Footer from '../components/Footer/Footer';
import ErrorBoundary from '@/components/ErrorBoundary';
import { getScope } from '../utils/utils';
import { checkAdminScope } from '@/utils/utils';
const { SubMenu } = Menu;

@connect(({ drawer }) => {
    return {
        drawer,
    };
})
class Layout extends PureComponent {
    state = {
        showServiceMenu: false,
        showResponsiveMenu: false,
    };

    attachServiceMenu() {
        if (this.state.showServiceMenu !== true) {
            this.setState(state => ({
                ...state,
                showServiceMenu: true,
            }));
        } else {
            this.setState(state => ({
                ...state,
                showServiceMenu: false,
            }));
        }
    }

    closeMenu(value) {
        this.setState(state => ({
            ...state,
            showServiceMenu: value,
        }));
    }

    handleLogout(e) {
        const { dispatch } = this.props;
        e.preventDefault();

        dispatch({
            type: 'userAccount/logoutOpenstack',
        });
    }

    toggleResponsiveMenu() {
        this.setState(state => ({
            ...state,
            showResponsiveMenu: !this.state.showResponsiveMenu,
        }));
    }

    getDrawerComponent(url, mountedData) {
        if (url) {
            const Component = lazy(() => import(`../pages/service/${url}`));
            return <Component type="modal" mountedData={mountedData} />;
        }
    }

    drawerClose() {
        try {
            this.props.dispatch({
                type: 'drawer/closeDrawer',
            });
        } catch (error) {}
    }

    async changeProject(values) {
        await this.props.dispatch({
            type: 'userAccount/projectChange',
            payload: {
                ...values,
            },
        });
        window.location.reload(true);
    }

    render() {
        const currentUser = window.localStorage.getItem('user');
        const scope = window.localStorage.getItem('detasadUserType');
        const allProjects = JSON.parse(
            window.localStorage.getItem('allProjects')
        );
        const unscopedToken = JSON.parse(
            window.localStorage.getItem('unscopedToken')
        );

        const username = JSON.parse(currentUser)?.user?.name;
        const currentUserDetail = JSON.parse(currentUser);
        const userScope = JSON.parse(scope);
        const project = JSON.parse(currentUser)?.project?.name;

        const sider = this.state.showResponsiveMenu ? (
            <div>
                <Row>
                    <Col xxl={0} xl={0} md={0}>
                        <ResponsiveSider
                            toggleMenu={this.toggleResponsiveMenu.bind(this)}
                        ></ResponsiveSider>
                    </Col>
                </Row>
            </div>
        ) : null;

        const menu = (
            <Menu>
                <Menu.Item key="iam3">
                    <Button
                        style={{
                            padding: '0px',
                            width: '100%',
                            textAlign: 'left',
                        }}
                        type="link"
                        onClick={this.handleLogout.bind(this)}
                    >
                        Logout
                    </Button>
                </Menu.Item>
            </Menu>
        );

        const menuProject = (
            <Menu>
                {allProjects
                    ? allProjects.map(item => (
                          <Menu.Item
                              key={item.id}
                              disabled={
                                  currentUserDetail.project.id === item.id
                              }
                              onClick={this.changeProject.bind(this, {
                                  unscopedToken: unscopedToken,
                                  project_id: item.id,
                                  domain_id: item.domain_id,
                              })}
                          >
                              {item.name}
                          </Menu.Item>
                      ))
                    : null}
            </Menu>
        );

        return (
            <ErrorBoundary>
                <div>
                    <AllDrawer
                        show={this.props.drawer.show}
                        width={700}
                        name={this.props.drawer.mountedData.drawerName}
                        onClose={this.drawerClose.bind(this)}
                    >
                        <Suspense fallback={'loading...'}>
                            {this.getDrawerComponent.bind(this)(
                                this.props.drawer.componentPath,
                                this.props.drawer.mountedData
                            )}
                        </Suspense>
                    </AllDrawer>
                    <div
                        style={{
                            visibility: this.state.showServiceMenu
                                ? 'visible'
                                : 'hidden',
                            opacity: this.state.showServiceMenu ? '1' : '0',
                            transform: this.state.showServiceMenu
                                ? 'translateY(0px)'
                                : 'translateY(-500px)',
                            transition: 'all .2s ease-out',
                            zIndex: '1',
                        }}
                        className={styles['services-container']}
                    >
                        <OutSideClickListener
                            currentValue={this.state.showServiceMenu}
                            outClickDetected={this.closeMenu.bind(this)}
                        >
                            <ServicesMenu
                                closeMenu={this.closeMenu.bind(this)}
                                onItemClicked={this.closeMenu.bind(this)}
                            />
                        </OutSideClickListener>
                    </div>

                    <Row
                        className={styles['ds-globalHeader']}
                        style={{
                            position: `fixed`,
                            top: 0,
                            zIndex: 9,
                            width: `100%`,
                        }}
                        type={'flex'}
                    >
                        <Col xxl={8} xl={8} lg={8} md={8} sm={8} xs={8}>
                            <DetasadLeftContent>
                                <HeaderNavigation side="left">
                                    <ul className={styles['leftUL']}>
                                        <li>
                                            <Link
                                                className={styles['link']}
                                                to="/"
                                            >
                                                Dashboard
                                            </Link>
                                        </li>

                                        <li
                                            style={{ display: 'flex' }}
                                            onClick={this.attachServiceMenu.bind(
                                                this
                                            )}
                                            className={
                                                styles[
                                                    ('ds-gh-links-ul-dropdown',
                                                    'link')
                                                ]
                                            }
                                        >
                                            <span
                                                style={{
                                                    marginRight: `4px`,
                                                }}
                                            >
                                                Services
                                            </span>{' '}
                                            <Icon
                                                style={{
                                                    display: 'inline',
                                                }}
                                                type="caret-down"
                                            />
                                        </li>

                                        {allProjects ? (
                                            <Dropdown
                                                overlay={menuProject}
                                                trigger={['click']}
                                                style={{
                                                    backgroundColor: '#06597F',
                                                }}
                                            >
                                                <a
                                                    className="ant-dropdown-link"
                                                    href="#"
                                                    style={{
                                                        color: 'white',
                                                        width: 'max-content',
                                                    }}
                                                >
                                                    Projects
                                                    <Icon
                                                        type="caret-down"
                                                        style={{
                                                            color: 'white',
                                                            marginLeft: '5px',
                                                        }}
                                                    />{' '}
                                                </a>
                                            </Dropdown>
                                        ) : null}
                                    </ul>
                                </HeaderNavigation>
                            </DetasadLeftContent>
                        </Col>

                        <Col xxl={10} xl={10} lg={10} md={10} sm={10} xs={10}>
                            <Row type="flex" justify="end">
                                <DetasadRightContent>
                                    <HeaderNavigation side="right">
                                        <ul className={styles['leftUL']}>
                                            <li style={{ display: 'flex' }}>
                                                <Link
                                                    className={styles['link']}
                                                    to="/service/billing/usage-report"
                                                >
                                                    Billing
                                                </Link>
                                            </li>

                                            {!checkAdminScope() && (
                                                <li style={{ display: 'flex' }}>
                                                    <Link
                                                        className={
                                                            styles['link']
                                                        }
                                                        to="/support"
                                                    >
                                                        Support
                                                    </Link>
                                                </li>
                                            )}

                                            <li
                                                style={{ display: 'flex' }}
                                                className={
                                                    styles[
                                                        'ds-gh-links-ul-dropdown'
                                                    ]
                                                }
                                            >
                                                <Dropdown
                                                    overlayStyle={{
                                                        width: `160px`,
                                                    }}
                                                    overlay={menu}
                                                    trigger={['click']}
                                                >
                                                    <div
                                                        style={{
                                                            display: `flex`,
                                                            alignItems: `center`,
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                display: `flex`,
                                                                flexDirection: `column`,
                                                                alignItems: `flex-end`,
                                                            }}
                                                        >
                                                            <Typography.Text
                                                                style={{
                                                                    color: `#f5f5f5`,
                                                                    fontSize: `1em`,
                                                                }}
                                                            >
                                                                {username}
                                                            </Typography.Text>
                                                            <Typography.Text
                                                                style={{
                                                                    color: `#f5f5f5`,
                                                                    fontSize: `1em`,
                                                                    lineHeight: 1.7,
                                                                    fontWeight: 300,
                                                                }}
                                                            >
                                                                {project}
                                                            </Typography.Text>
                                                        </div>

                                                        <Avatar
                                                            style={{
                                                                backgroundColor: `#00a2ae`,
                                                                verticalAlign:
                                                                    'middle',
                                                                marginLeft: `12px`,
                                                            }}
                                                        >
                                                            <Icon
                                                                type="user"
                                                                style={{
                                                                    fontSize: `15px`,
                                                                }}
                                                            />
                                                        </Avatar>
                                                    </div>
                                                </Dropdown>
                                            </li>
                                        </ul>
                                    </HeaderNavigation>
                                </DetasadRightContent>
                            </Row>
                        </Col>
                    </Row>

                    <Row
                        className={styles['ds-globalHeader-responsive']}
                        style={{
                            position: `fixed`,
                            top: 0,
                            zIndex: 9,
                            width: `100%`,
                        }}
                        type={'flex'}
                    >
                        <Col xxl={0} xl={0} lg={0} md={0} sm={24} xs={24}>
                            <Row
                                type={'flex'}
                                justify={'space-between'}
                                align={'middle'}
                            >
                                <Col>
                                    <LogoHolder
                                        style={{
                                            lineHeight: '58px',
                                            marginRight: `10%`,
                                        }}
                                        width={100}
                                    />
                                </Col>
                                <Col>
                                    <Icon
                                        onClick={this.toggleResponsiveMenu.bind(
                                            this
                                        )}
                                        className={
                                            styles['responsive-nav-fold-icon']
                                        }
                                        type={
                                            this.state.showResponsiveMenu
                                                ? 'up-circle'
                                                : 'down-circle'
                                        }
                                    ></Icon>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    {sider}
                    <div
                        className={
                            this.state.showServiceMenu ? styles['blur'] : ''
                        }
                    >
                        {this.props.children}
                        {!window.location.href.includes('create') ? (
                            <Footer />
                        ) : null}
                    </div>
                </div>
            </ErrorBoundary>
        );
    }
}

export default Layout;
