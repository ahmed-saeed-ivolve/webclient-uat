import React from 'react';
import { Button } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
import { Redirect } from 'umi';

class KeypairButtons extends React.Component {
  state = {};

  deleteResource() {
    const value = this.props.keypairList.list.reduce(
      (acc, item) =>
        this.props.selectedRowKeys.includes(item.id)
          ? { ...acc, id: [...acc.id, item.id], name: [...acc.name, item.name] }
          : { ...acc },
      { id: [], name: [] },
    );

    this.props.dispatch({
      type: 'keypair/deleteResources',
      payload: value,
    });
  }

  createNewItem() {
    router.push('keypairs/create');
  }
  render() {
    return (
      <div style={{ marginBottom: `20px`, textAlign: `right` }}>
        <Button
          icon="delete"
          type="danger"
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
          icon="plus"
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

export default connect(({ keypair }) => {
  return {
    keypairList: { ...keypair },
  };
})(KeypairButtons);
