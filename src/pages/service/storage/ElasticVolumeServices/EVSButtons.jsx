import React from 'react';
import { Button } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';

class EVSButtons extends React.Component {
  state = {};

  deleteResource() {}

  createNewItem() {
    this.props.dispatch({
      type: `evs/createVolumeFromVolume`,
    });
    router.push('elastic-volume-services/create');
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

export default connect()(EVSButtons);
