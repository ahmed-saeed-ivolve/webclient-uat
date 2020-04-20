import React, { PureComponent } from 'react';
import { Collapse, Skeleton, Icon, Spin, Typography, Button, Row, Col, Tag } from 'antd';
import { connect } from 'dva';
const { Panel } = Collapse;

const antIcon = <Icon type="loading" style={{ fontSize: 50 }} spin />;

class GroupAssignments extends PureComponent {
  componentDidMount() {
    const { currentGroup } = this.props;

    if ((currentGroup !== null || currentGroup !== undefined) && !currentGroup.roleAssignment) {
      this.props.dispatch({
        type: 'groups/getGroupRoleAssignments',
        payload: {
          id: currentGroup.id,
        },
      });
    }
  }
  render() {
    const { currentGroup, projects } = this.props;
    if (!currentGroup.roleAssignment) {
      return (
        <div style={{ textAlign: 'center', marginTop: `150px` }}>
          <Spin indicator={antIcon} spinning={this.props.loadingConsole} delay={300} />
        </div>
      );
    }

    return (
      <Collapse>
        {Object.entries(this.props.currentGroup.roleAssignment).map(entry => {
          const project = this.props.projects.list.find(elem => elem.id === entry[0]);
          return (
            <Panel header={project.name} key={entry[0]}>
              {entry[1].map(elem => {
                return (
                  <Row>
                    <Col span={24}>
                      <Typography>
                        {' '}
                        <Tag> {elem.name} </Tag>{' '}
                      </Typography>
                    </Col>
                  </Row>
                );
              })}
            </Panel>
          );
        })}
      </Collapse>
    );
  }
}

export default GroupAssignments;
