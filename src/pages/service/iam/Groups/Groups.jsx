import React, { PureComponent } from 'react';

import GroupElementsTable from './GroupElementsTable';
import GroupButtons from './GroupButtons';
import { Row, Col, Button, Typography } from 'antd';
import AllDrawer from './GroupDrawer';
import { connect } from 'dva';
const ButtonGroup = Button.Group;
class Groups extends PureComponent {
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
                                                type: 'groups/update',
                                                payload: {
                                                    method: 'IAM.groups',
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
                            <GroupElementsTable
                                loading={this.props.fetchingGroupList}
                                onSelectChange={this.onSelectChange.bind(this)}
                                selectedRowKeys={
                                    this.props.groupsList.selectedRows
                                }
                                groupsList={this.props.groupsList.list}
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
        groupsList: {
            ...state.groups,
        },
        fetchingGroupList: state.loading.effects['groups/update'],
    };
})(Groups);
