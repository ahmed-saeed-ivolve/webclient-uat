import React from 'react';
import { Button } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';

class VPCButtons extends React.Component {
  state = {};

  deleteResource() {
    this.props.dispatch({
      type: 'vpc/deleteResources',
      payload: this.props.selectedRowKeys,
    });
  }

  createNewItem() {
    router.push('networks/create');
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
        <Button
          type="primary"
          style={{
            height: `45px`,
            width: `125px`,
            fontFamily: `Open Sans`,
            fontWeight: `600`,
          }}
          onClick={this.createNewItem.bind(this)}
        >
          Create
        </Button>
      </div>
    );
  }
}

export default connect()(VPCButtons);
