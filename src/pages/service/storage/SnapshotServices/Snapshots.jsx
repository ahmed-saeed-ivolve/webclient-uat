import React from 'react';
import { Typography, Button, Row, Col } from 'antd';
import SnapshotElementsTable from './SnapshotElementsTable';
import SnapshotButtons from './SnapshotButtons';

import { connect } from 'dva';
const ButtonGroup = Button.Group;

class Snapshot extends React.Component {
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
        <div style={{ marginBottom: `0`, backgroundColor: `#fff`, padding: `34px` }}>
          <Row style={{ marginBottom: `20px` }}>
            <Col span={24}>
              <div style={{ textAlign: `right` }}>
                <ButtonGroup>
                  <Button
                    style={{ float: 'right', marginBottom: '10px' }}
                    icon="redo"
                    onClick={() => {
                      this.props.dispatch({
                        type: 'snapshot/update',
                        payload: {
                          method: 'Volume.snapshots',
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

          <SnapshotElementsTable
            loading={this.props.fetchingSnapshotList}
            selectedRowKeys={this.props.snapshotList.selectedRows}
            onSelectChange={this.onSelectChange.bind(this)}
            snapshotLists={this.props.snapshotList.list}
            evsLists={this.props.evsList.list}
            dispatch={this.props.dispatch}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default connect(state => {
  return {
    snapshotList: state.snapshot,
    evsList: state.evs,
    fetchingSnapshotList: state.loading.effects['snapshot/update'],
  };
})(Snapshot);
