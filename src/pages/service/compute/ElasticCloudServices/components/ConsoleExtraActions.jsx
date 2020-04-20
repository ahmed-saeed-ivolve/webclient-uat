import React, { PureComponent } from 'react';
import { Collapse, Icon, Row, Col, Spin, Divider, Descriptions, Badge, Button } from 'antd';
import { connect } from 'dva';

import moment from 'moment';
import NoVNC from 'react-novnc';

const { Panel } = Collapse;

const antIcon = <Icon type="loading" style={{ fontSize: 50 }} spin />;

@connect(({ ecs, loading }) => {
  return {
    currentInstanceConsoleUrl: ecs.currentInstanceConsoleUrl,
    loadingConsole: loading.effects['ecs/getConsoleUrl'],
  };
})
class ConsoleExtra extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <Button
          type="link"
          icon="fullscreen"
          style={{ margin: `7px` }}
          onClick={() => {
            window.open(this.props.consoleUrl.currentInstanceConsoleUrl);
          }}
        ></Button>
      </>
    );
  }
}

export default connect(state => {
  return {
    consoleUrl: state.ecs,
  };
})(ConsoleExtra);
