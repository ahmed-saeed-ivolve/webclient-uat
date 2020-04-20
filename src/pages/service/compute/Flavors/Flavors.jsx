import React, { PureComponent } from 'react';
import { Button, Row, Col, Typography } from 'antd';
import FlavorElementsTable from './FlavorElementsTable';
import FlavorButtons from './FlavorButtons';
import CardList from '@/components/CardList';

import { connect } from 'dva';

const ButtonGroup = Button.Group;
class Flavors extends PureComponent {
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
                <div style={{ backgroundColor: `#fff`, padding: `34px` }}>
                    <Row style={{ marginBottom: `20px` }}>
                        <Col span={24}>
                            <div style={{ textAlign: `right` }}>
                                <ButtonGroup>
                                    <Button
                                        style={{
                                            float: 'right',
                                            marginBottom: '10px',
                                        }}
                                        icon="redo"
                                        onClick={() => {
                                            this.props.dispatch({
                                                type: 'flavor/update',
                                                payload: {
                                                    method:
                                                        'Compute.list_flavors',
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
                            <CardList
                                loading={this.props.fetchingFlavorList}
                                onSelectChange={this.onSelectChange.bind(this)}
                                selectedRowKeys={
                                    this.props.flavorList.selectedRows
                                }
                                flavorsList={this.props.flavorList.list}
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
        flavorList: state.flavor,
        fetchingFlavorList: state.loading.effects['flavor/update'],
    };
})(Flavors);
