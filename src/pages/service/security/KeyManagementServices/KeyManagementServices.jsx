import React, { PureComponent } from 'react';
import { Row, Col, Typography, Divider, Input, Button } from 'antd';
import KMSElementsTable from './KMSElementsTable';

import { connect } from 'dva';

const ButtonGroup = Button.Group;
class KeyManagementServices extends PureComponent {
    state = {
        selectedRowKeys: [],
    };

    componentDidMount() {
        const { dispatch } = this.props;
        this.props.dispatch({
            type: 'kms/update',
            payload: { method: 'Compute.list' },
        });
    }

    render() {
        return (
            <React.Fragment>
                <div style={{ height: `100%`, padding: `34px` }}>
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
                                                type: 'kms/update',
                                                payload: {
                                                    method: 'Compute.list',
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
                            <KMSElementsTable
                                describeInstanceLink={`${this.props.location.pathname}/show-key?tab=encrypt&key_id=`}
                                kmsList={this.props.kms.list}
                                selectedRowKeys={this.props.kms.selectedRows}
                                dispatch={this.props.dispatch}
                            />
                        </Col>
                    </Row>
                </div>
            </React.Fragment>
        );
    }
}

export default connect(({ kms, loading }) => {
    return {
        kms: {
            ...kms,
        },
    };
})(KeyManagementServices);
