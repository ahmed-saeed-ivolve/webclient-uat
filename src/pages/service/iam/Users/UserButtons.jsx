import React from 'react';
import { Button } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';

class UserButtons extends React.Component {
  state = {};

  deleteResource() {
    const data = {
      selectedTenant: this.props.selectedTenant,
      users: this.props.selectedRowKeys,
    };

    this.props.dispatch({
      type: 'users/deleteResources',
      payload: data,
    });
  }

  createNewItem() {
    router.push(`users/create?tenant_id=${this.props.selectedTenant}`);
  }
  render() {
    return (
      <div style={{ marginBottom: `20px`, textAlign: `right` }}>
        <Button
          type="primary"
          style={{
            marginRight: `20px`,
            height: `45px`,
            width: `125px`,
            fontFamily: `Open Sans`,
            fontWeight: `600`,
          }}
          onClick={this.createNewItem.bind(this)}
        >
          Create
        </Button>
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

export default connect()(UserButtons);
