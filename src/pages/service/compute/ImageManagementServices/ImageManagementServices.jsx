import React, { PureComponent } from 'react';
import { Row, Col, Button, Typography } from 'antd';
import IMSElementsTable from './IMSElementsTable';
import IMSButtons from './IMSButtons';

import { connect } from 'dva';
const ButtonGroup = Button.Group;
class ImageManagementServices extends PureComponent {
    state = {
        selectedRowKeys: [],
    };

    onSelectChange(selectedRowKeys) {
        this.setState(state => ({
            ...state,
            selectedRowKeys,
        }));
    }

    componentDidMount() {
        const { dispatch } = this.props;
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
                                        icon="redo"
                                        onClick={() => {
                                            this.props.dispatch({
                                                type: 'ims/fetchList',
                                                payload: {
                                                    method: 'Image.list',
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
                            <IMSElementsTable
                                describeInstanceLink={`${this.props.location.pathname}/show-image/id=`}
                                loading={this.props.fetchingImageList}
                                selectedRowKeys={
                                    this.props.imageList.selectedRows
                                }
                                imagesList={this.props.imageList.list}
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
        imageList: state.ims,
        fetchingImageList: state.loading.effects['ims/fetchList'],
    };
})(ImageManagementServices);
