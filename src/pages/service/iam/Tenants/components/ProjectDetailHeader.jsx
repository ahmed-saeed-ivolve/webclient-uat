import React, { PureComponent } from 'react';
import { PageHeader, Icon, Row, Col, Skeleton } from 'antd';
import { routerRedux } from 'dva/router';
import { getPageQuery } from '@/utils/utils';

export default class ProjectDetailsHeader extends PureComponent {
    render() {
        const currentProject = this.props.projects.currentProject;

        if (!currentProject) {
            return (
                <Row>
                    <Col span={6}>
                        <Skeleton active />
                    </Col>
                </Row>
            );
        }

        return (
            <PageHeader
                backIcon={<Icon type="arrow-left" />}
                onBack={() => {
                    this.props.dispatch(
                        routerRedux.replace('/service/iam/projects')
                    );
                }}
                style={{ padding: `0px` }}
                title={currentProject.name}
                subTitle="Projects"
            ></PageHeader>
        );
    }
}
