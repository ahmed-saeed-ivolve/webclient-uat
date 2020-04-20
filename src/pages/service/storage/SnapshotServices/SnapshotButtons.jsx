import React from 'react';
import { Button } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';

class SnapshotButtons extends React.Component {
  state = {};

  deleteResource() {
    this.props.dispatch({
      type: 'snapshot/deleteResources',
      payload: this.props.selectedRowKeys,
    });
  }

  createNewItem() {
    router.push('elastic-volume-services/create');
  }
  render() {
    return (
      <div style={{ marginBottom: `20px`, textAlign: `right` }}>
        <Button
        type='danger'
          style={{
            marginRight: `20px`,
            height: `45px`,
            width: `125px`,
            fontFamily: `Open Sans`,
            fontWeight: `600`,
          }}
          onClick={this.deleteResource.bind(this)}
        >
          Delete
        </Button>
      </div>
    );
  }
}

export default connect()(SnapshotButtons);
