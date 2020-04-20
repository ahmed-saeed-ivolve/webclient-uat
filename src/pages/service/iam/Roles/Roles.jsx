import React ,{PureComponent}from 'react';
import RoleElementsTable from './RoleElementsTable';
import RoleButtons from './RoleButtons';
import { Row, Col, Button, Typography} from 'antd';
import { connect } from 'dva';

const ButtonGroup = Button.Group;

class Roles extends PureComponent {
  state = {
    selectedRowKeys: [],
  };

  onSelectChange(selectedRowKeys) {
    this.setState(state => ({
      ...state,
      selectedRowKeys,
    }));
  }

  handleChange(selectedRoles) {
    this.props.dispatch({
      type: 'roles/update',
      payload: selectedRoles,
    });
  }

  render() {

    return (
      <React.Fragment>
        <div
          style={{ marginBottom: `0`, 
          backgroundColor: `#fff`,
           padding: `20px` }}
        >
         <Row style={{ marginBottom: `10px` }}>
                        <Col span={9}></Col>
                        <Col span={15}>
                            <div style={{ textAlign: `right` }}>
                                <ButtonGroup>
                                    <Button
                                        style={{ float: 'right' }}
                                        icon="redo"
                                        onClick={() => {
                                            this.props.dispatch({
                                                type: 'roles/update',
                                                payload: {
                                                    method: 'IAM.roles',
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
          <RoleElementsTable
            loading={this.props.fetchingRoleList}
            selectedRowKeys={this.props.roleList.selectedRowKeys}
            onSelectChange={this.onSelectChange.bind(this)}
            RoleList={this.props.roleList.list}
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
    roleList: {...state.roles,},
    //userList: {...state.users},
    //tenantlist: state.tenant,

    fetchingRoleList: state.loading.effects['roles/update'],
  };
})(Roles);
