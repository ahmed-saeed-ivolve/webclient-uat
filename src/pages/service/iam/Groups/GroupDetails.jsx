import React from 'react';
import { Tabs, Button, Icon, Row, Col, Menu, Skeleton } from 'antd';
import { connect } from 'dva';
import ConsoleExtraActions from '../../compute/ElasticCloudServices/components/ConsoleExtraActions';
import GroupAssignments from './components/GroupAssignments';
import UsersInGroup from './components/UsersInGroup';
import { getPageQuery } from '@/utils/utils';
import { routerRedux } from 'dva/router';
import styles from './../styles.less';
const { TabPane } = Tabs;

const groupScreen = {
    assignments: GroupAssignments,
    'user-pool': UsersInGroup,
};

@connect(({ groups, projects }) => {
    return {
        groups,
        projects,
    };
})
class GroupDetails extends React.Component {
    componentDidMount() {
        this.props.dispatch({
            type: 'projects/update',
            payload: {
                force: true,
            },
        });
    }

    changeDetailsTab(clickedTab) {
        const { dispatch } = this.props;
        const { key } = clickedTab;
        const groupId = this.props.groups.currentGroup.id;
        dispatch(
            routerRedux.push(
                `/service/iam/groups/show-group?id=${groupId}&selection=${key}`
            )
        );
    }
    render() {
        const currentGroup = this.props.groups.currentGroup;
        const selection = getPageQuery()?.selection;
        const CurrentScreen = groupScreen[selection || 'assignments'];

        return (
            <div
                style={{ height: `100%`, display: `flex`, flexFlow: `column` }}
            >
                <div className={styles.assignmentRowPageHeader}>
                    <Row>
                        <Col span={24}>
                            <Menu
                                style={{ padding: `0px 34px`, border: 0 }}
                                onClick={this.changeDetailsTab.bind(this)}
                                selectedKeys={[selection]}
                                mode="horizontal"
                            >
                                <Menu.Item key="assignments">
                                    <Icon type="mail" />
                                    Assignments
                                </Menu.Item>

                                <Menu.Item key="user-pool">
                                    <Icon type="appstore" />
                                    Users Pool
                                </Menu.Item>
                            </Menu>
                        </Col>
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
                    {!currentGroup && this.props.projects.list.length === 0 ? (
                        <Skeleton active />
                    ) : (
                        <CurrentScreen
                            projects={this.props.projects}
                            dispatch={this.props.dispatch}
                            currentGroup={currentGroup}
                        />
                    )}
                </div>
            </div>
        );
    }
}

export default GroupDetails;
