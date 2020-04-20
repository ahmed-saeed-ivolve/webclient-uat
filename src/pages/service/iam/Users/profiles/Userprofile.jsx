import React from 'react';
import styles from './../../styles.less';
import {
    Row,
    Col,
    Tag,
    Collapse,
    Tabs,
    Modal,
    Typography,
    Menu,
    Icon,
    Button,
    Avatar,
    Divider,
    Select,
    Anchor,
    Descriptions,
    Upload,
    Card,
    message,
} from 'antd';
import { profile } from './../../../../../assets/profile.jpeg';
const { Panel } = Collapse;
import Security from './Security';
import Roles from './Roles';
import Projects from './Projects';
import { getPageQuery } from '@/utils/utils';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';

const userScreen = {
    roles: Roles,
    projects: Projects,
    security: Security,
};

const { TabPane } = Tabs;

class UserProfile extends React.Component {
    constructor() {
        super();
        this.state = {
            user: [],
            visible: false,
        };
    }

    componentDidMount() {
        let user = localStorage.getItem('user');
        this.setState({
            user: JSON.parse(user),
        });
    }

    changeDetailsTab(clickedTab) {
        const { dispatch } = this.props;
        const { key } = clickedTab;
        dispatch(routerRedux.push(`/service/iam/account?selection=${key}`));
    }

    render() {
        const selection = getPageQuery()?.selection;
        const CurrentScreen = userScreen[selection || 'security'];

        return (
            <div
                style={{ height: `100%`, display: `flex`, flexFlow: `column` }}
            >
                <div className={styles.assignmentRowPageHeader}>
                    <Row>
                        <Menu
                            style={{ padding: `0px 34px`, border: 0 }}
                            onClick={this.changeDetailsTab.bind(this)}
                            selectedKeys={[selection]}
                            mode="horizontal"
                        >
                            <Menu.Item key="security">
                                <Icon type="appstore" />
                                Security
                            </Menu.Item>
                        </Menu>

                        <Col span={5}>
                            <Row type="flex" justify="end">
                                <Col></Col>
                            </Row>
                        </Col>
                    </Row>
                </div>

                <div
                    style={{
                        padding: '34px',
                        height: `100%`,
                        borderTop: `1px solid #e5e5e5`,
                    }}
                >
                    <CurrentScreen />
                </div>
            </div>
        );
    }
}

export default connect()(UserProfile);
