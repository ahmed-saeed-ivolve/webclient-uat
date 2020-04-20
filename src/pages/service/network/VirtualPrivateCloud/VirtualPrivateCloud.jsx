import React from 'react';
import { Row, Col, Typography, Divider, Input, Button } from 'antd';
import VPCElementsTable from './VPCElementsTable';
import VPCButtons from './VPCButtons';

import AllDrawer from './VPCDrawer';
import { connect } from 'dva';
const ButtonGroup = Button.Group;

class VirtualPrivateCloud extends React.Component {
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
                <div style={{ height: `100%`, padding: `34px` }}>
                    <Row style={{ marginBottom: `20px` }}>
                        <Col span={9} />
                        <Col span={15}>
                            <div style={{ textAlign: `right` }}>
                                <ButtonGroup>
                                    <Button
                                        style={{ float: 'right' }}
                                        icon="redo"
                                        onClick={() => {
                                            this.props.dispatch({
                                                type: 'vpc/update',
                                                payload: {
                                                    method: 'Network.networks',
                                                    force: true,
                                                },
                                            });
                                            this.props.dispatch({
                                                type: 'vpc/fetchSubnets',
                                                payload: {
                                                    method: 'Network.subnets',
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
                            <VPCElementsTable
                                describeNetworkLink={`${this.props.location.pathname}/show-network?tab=subnets&network_id=`}
                                loading={this.props.isFetchingNetworks}
                                selectedRowKeys={
                                    this.props.vpclist.selectedRows
                                }
                                onSelectChange={this.onSelectChange.bind(this)}
                                VPCList={this.props.vpclist.list}
                                SubnetList={this.props.vpclist.subnetList}
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
        isFetchingNetworks: state.loading.effects['vpc/update'],
        vpclist: state.vpc,
    };
})(VirtualPrivateCloud);
