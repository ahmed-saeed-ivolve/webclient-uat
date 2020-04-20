import React, { PureComponent } from 'react';
import { Row,Col,Button,Typography } from 'antd';
import SecurityGroupElementsTable from './SecurityGroupElementsTable';
import SecurityGroupButtons from './SecurityGroupButtons';

import AllDrawer from './SecurityGroupDrawer';
import { connect } from 'dva';
const ButtonGroup = Button.Group;
class SecurityGroups extends PureComponent {
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
                        type: 'securitygroup/update',
                        payload: {
                          method: 'Network.security_groups',
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
          <SecurityGroupElementsTable
            loading={this.props.fetchingSgList}
            loadingdeletingrule={this.props.deletingrule}
            selectedRowKeys={this.props.securitygroupList.selectedRows}
            onSelectChange={this.onSelectChange.bind(this)}
            securitygroupsList={this.props.securitygroupList.list}
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
    securitygroupList: state.securitygroup,
    fetchingSgList: state.loading.effects['securitygroup/update'],
    deletingrule: state.loading.effects['securitygroup/deleteRule'],
  };
})(SecurityGroups);
