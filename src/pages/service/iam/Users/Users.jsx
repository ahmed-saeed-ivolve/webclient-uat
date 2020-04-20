import React, { PureComponent } from 'react';

import UserElementsTable from './UserElementsTable';
import UserButtons from './UserButtons';
import { Row, Col, Button, Typography } from 'antd';
import AllDrawer from './UserDrawer';
import { connect } from 'dva';
import { Select } from 'antd';
const ButtonGroup = Button.Group;
const { Option } = Select;
class Users extends PureComponent {
    state = {
        selectedRowKeys: [],
    };

    onSelectChange(selectedRowKeys) {
        this.setState(state => ({
            ...state,
            selectedRowKeys,
        }));
    }

    handleChange(selectedTenant) {
        this.props.dispatch({
            type: 'users/update',
            payload: selectedTenant,
        });
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
                                                type: 'users/update',
                                                payload: {
                                                    method: 'IAM.users',
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
                            <UserElementsTable
                                loading={this.props.fetchingUserList}
                                onSelectChange={this.onSelectChange.bind(this)}
                                selectedRowKeys={
                                    this.props.userList.selectedRows
                                }
                                usersList={this.props.userList.list}
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
        userList: {
            ...state.users,
        },
        fetchingUserList: state.loading.effects['users/update'],
    };
})(Users);
