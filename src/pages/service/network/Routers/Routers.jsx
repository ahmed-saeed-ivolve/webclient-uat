import React, { PureComponent } from 'react';
import { Row,Col,Button,Typography } from 'antd';
import { RedoOutlined } from '@ant-design/icons';
import RouterElementsTable from './RouterElementsTable';


import AllDrawer from './RouterDrawer';
import { connect } from 'dva';
const ButtonGroup = Button.Group;
class Routers extends PureComponent {
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
                    icon='redo'
                    onClick={() => {
                      this.props.dispatch({
                        type: 'router/update',
                        payload: {
                          method: 'Network.routers',
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
          <RouterElementsTable
            loading={this.props.fetchingRouter}
            loadingPorts={this.props.fetchingPorts}
            loadingdeletingInterface={this.props.deletingInterface}
            loadingdcreatingInterface={this.props.creatingInterface}
            selectedRowKeys={this.props.routerList.selectedRows}
            onSelectChange={this.onSelectChange.bind(this)}
            routersList={this.props.routerList.list}
            routerPorts={this.props.routerList.portList}
            vpcList={this.props.vpcList}
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
    routerList: state.router,

    vpcList: state.vpc,
    fetchingRouter: state.loading.effects['router/update'],
    fetchingPorts: state.loading.effects['router/fetchPort'],
    deletingInterface: state.loading.effects['router/deleteInterface'],
    creatingInterface: state.loading.effects['router/addInterface'],
  };
})(Routers);
