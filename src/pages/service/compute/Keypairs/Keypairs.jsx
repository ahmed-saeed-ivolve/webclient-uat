import React, { PureComponent } from 'react';
import { Button, Typography, Row, Col, Input } from 'antd';
import KeypairElementsTable from './KeypairElementsTable';
import KeypairButtons from './KeypairButtons';

import { connect } from 'dva';
const ButtonGroup = Button.Group;
class KeyPairs extends PureComponent {
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
                        margin: `0`,
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
                                        icon="redo"
                                        onClick={() => {
                                            this.props.dispatch({
                                                type: 'keypair/update',
                                                payload: {
                                                    method:
                                                        'Compute.list_keypairs',
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
                            <KeypairElementsTable
                                loading={this.props.fetchingKeyPairList}
                                onSelectChange={this.onSelectChange.bind(this)}
                                selectedRowKeys={
                                    this.props.keypairList.selectedRows
                                }
                                keypairsList={this.props.keypairList.list}
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
        keypairList: {
            ...state.keypair,
        },
        fetchingKeyPairList: state.loading.effects['keypair/update'],
    };
})(KeyPairs);
