import React, { PureComponent } from 'react';
import TenantElementsTable from './TenantElementsTable';
import TenantButtons from './TenantButtons';
import { Row, Col, Button, Typography } from 'antd';
import AllDrawer from './TenantDrawer';
import { connect } from 'dva';
const ButtonGroup = Button.Group;
class Tenant extends PureComponent {
    state = {
        selectedRowKeys: [],
    };

    onSelectChange(selectedRowKeys) {
        this.setState(state => ({
            ...state,
            selectedRowKeys,
        }));
    }

    render() {
        return (
            <React.Fragment>
                <div
                    style={{
                        marginBottom: `0`,
                        backgroundColor: `#fff`,
                        padding: `34px`,
                    }}
                >
                    <Row style={{ marginBottom: `20px` }}>
                        <Col span={9}></Col>
                        <Col span={15}>
                            <div style={{ textAlign: `right` }}>
                                <ButtonGroup>
                                    <Button
                                        style={{ float: 'right' }}
                                        icon='redo'
                                        onClick={() => {
                                            this.props.dispatch({
                                                type: 'projects/update',
                                                payload: {
                                                    method: 'IAM.projects',
                                                    force: true,
                                                },
                                            });
                                        }}
                                    >
                                        Refresh
                                    </Button>
                                </ButtonGroup>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <TenantElementsTable
                                loading={this.props.fetchingProjectList}
                                onSelectChange={this.onSelectChange.bind(this)}
                                selectedRowKeys={
                                    this.props.projectList.selectedRows
                                }
                                projectList={this.props.projectList.list}
                                dispatch={this.props.dispatch}
                            />
                        </Col>
                    </Row>
                </div>
            </React.Fragment>
        );
    }
}

export default connect(state => {
    return {
        projectList: {
            ...state.projects,
        },
        fetchingProjectList: state.loading.effects['projects/update'],
    };
})(Tenant);
