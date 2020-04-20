import React, { PureComponent } from 'react';
import FloatingIPElementsTable from './FloatingIPElementsTable';
import FloatingIPButtons from './FloatingIPButtons';
import { Row, Col, Button, Typography } from 'antd';
import AllDrawer from './FloatingIPDrawer';
import { connect } from 'dva';
const ButtonGroup = Button.Group;
class FloatingIP extends PureComponent {
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
                        <Col span={24}>
                            <div style={{ textAlign: `right` }}>
                                <ButtonGroup>
                                    <Button
                                        style={{
                                            float: 'right',
                                            marginBottom: '10px',
                                        }}
                                        icon='redo'
                                        onClick={() => {
                                            this.props.dispatch({
                                                type: 'floatingip/update',
                                                payload: {
                                                    method: 'Network.ips',
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
                            <FloatingIPElementsTable
                                loading={this.props.fetchingFIP}
                                FloatingIpList={this.props.floatingiplist.list}
                                onSelectChange={this.onSelectChange.bind(this)}
                                selectedRowKeys={
                                    this.props.floatingiplist.selectedRows
                                }
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
        floatingiplist: state.floatingip,
        fetchingFIP: state.loading.effects['floatingip/update'],
    };
})(FloatingIP);
