import React from 'react';
import { Row, Col, Typography, Divider, Input, Button } from 'antd';
import EVSElementsTable from './EVSElementsTable';
import EVSButtons from './EVSButtons';

import { connect } from 'dva';

const ButtonGroup = Button.Group;
class ElasticVolumeService extends React.Component {
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
            <Col span={24}>
              <div style={{ textAlign: `right` }}>
                <ButtonGroup>
                  <Button
                    style={{ float: 'right', marginBottom: '10px' }}
                    icon="redo"
                    onClick={() => {
                      this.props.dispatch({
                        type: 'evs/update',
                        payload: {
                          method: 'Volume.list',
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
              <EVSElementsTable
                loading={this.props.fetchingEVSList}
                selectedRowKeys={this.props.evsList.selectedRows}
                onSelectChange={this.onSelectChange.bind(this)}
                evsLists={this.props.evsList.list}
                ecsLists={this.props.ecsList.list}
                fetchingECSList={this.props.fetchingECSList}
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
    evsList: state.evs,
    ecsList: state.ecs,
    fetchingEVSList: state.loading.effects['evs/update'],
    fetchingECSList: state.loading.effects['ecs/update'],
  };
})(ElasticVolumeService);
