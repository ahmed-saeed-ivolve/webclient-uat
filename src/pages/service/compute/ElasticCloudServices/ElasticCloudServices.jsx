import React, { PureComponent } from 'react';
import { Row, Col, Typography, Divider, Input, Button } from 'antd';

import ServiceDetailsLayout from '@/pages/service/components/ServiceDetailsLayout';
import ECSElementsTable from './ECSElementsTable';
import ECSButtons from '../ElasticCloudServices/ECSButtons';
import { connect } from 'dva';

const ButtonGroup = Button.Group;
class ElasticCloudServices extends PureComponent {
  state = {
    selectedRowKeys: [],
  };
  componentDidMount() {
    const { dispatch } = this.props;
  }

  render() {
    const filteredECS = [];
    const status = [];

    if (this.props.ecs.selectedRows.length > 0) {
      filteredECS[0] = this.props.ecs.list.filter(items =>
        this.props.ecs.selectedRows.includes(items.id),
      );
    }

    if (filteredECS.length > 0) {
      for (let i = 0; i < filteredECS[0].length; i++) {
        if (filteredECS[0][i].vm_state === 'active' || filteredECS[0][i].vm_state === 'active') {
          status.push('active');
        }
        if (filteredECS[0][i].vm_state === 'stopped') {
          status.push('stopped');
        }
        if (filteredECS[0][i].vm_state === 'paused') {
          status.push('paused');
        }
      }
    }

    return (
      <React.Fragment>
        <div style={{ height: `100%`, padding: `34px` }}>
          <Row style={{ marginBottom: `20px` }}>
            <Col span={9}></Col>
            <Col span={15}>
              <div style={{ textAlign: `right` }}>
                <ButtonGroup>
                  <Button
                    style={{ float: 'right' }}
                    icon="redo"
                    onClick={() => {
                      this.props.dispatch({
                        type: 'ecs/update',
                        payload: {
                          method: 'Compute.list',
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
              <ECSElementsTable
                describeInstanceLink={`${this.props.location.pathname}/show-instance?tab=summary&instance_id=`}
                ecsList={this.props.ecs.list}
                selectedRowKeys={this.props.ecs.selectedRows}
                dispatch={this.props.dispatch}
              />
            </Col>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}

export default connect(({ ecs, loading }) => {
  return {
    ecs: {
      ...ecs,
    },
  };
})(ElasticCloudServices);
