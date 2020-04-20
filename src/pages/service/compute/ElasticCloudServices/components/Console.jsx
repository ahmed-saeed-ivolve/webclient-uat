import React, { PureComponent } from 'react';
import { Collapse, Icon, Row, Col, Spin, Divider, Descriptions, Badge } from 'antd';
import { connect } from 'dva';
import { Empty, Button } from 'antd';
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
class Console extends PureComponent {
  constructor(props) {
    super(props);
  }

  componentWillUnmount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'ecs/save',
      payload: {
        currentInstanceConsoleUrl: null,
      },
    });
  }

  componentDidMount() {
    const { currentInstance, dispatch } = this.props;
    const { id } = currentInstance;

    if (id) {
      dispatch({
        type: 'ecs/getConsoleUrl',
        payload: {
          id,
        },
      });
    }
  }

  componentDidUpdate(prevProps) {}

  render() {
    return (
      <div style={{ height: `100%`, position: `relative` }}>
        {this.props.currentInstance.vm_state === 'stopped' ? (
          <div style={{ padding: '34px', height: '100%' }}>
            Your VM is OFF. To see the console you have to start the VM first{' '}
          </div>
        ) : this.props.currentInstanceConsoleUrl ? (
          <iframe
            style={{ width: `100%`, height: `100%` }}
            src={this.props.currentInstanceConsoleUrl}
          ></iframe>
        ) : (
          <div style={{ textAlign: 'center', marginTop: `150px` }}>
            <Spin indicator={antIcon} spinning={this.props.loadingConsole} delay={300} />
          </div>
        )}
      </div>
    );
  }
}

export default Console;
