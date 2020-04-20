import React, { PureComponent } from 'react';
import {
  Collapse,
  Icon,
  Row,
  Col,
  Spin,
  Divider,
  Descriptions,
  Badge,
  Form,
  Select,
  Card,
  Typography,
} from 'antd';
import { connect } from 'dva';
import { Empty, Button } from 'antd';
import moment from 'moment';
import { getPageQuery } from '@/utils/utils';
import FormRow from '@/pages/service/components/FormRow';

const { Panel } = Collapse;

const antIcon = <Icon type="loading" style={{ fontSize: 50 }} spin />;

@connect(({ floatingip, loading }) => {
  return {
    floatingip,
    loading,
  };
})
@Form.create()
class FloatingIPDetail extends PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidUpdate(prevProps) {}

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { keys, names } = values;

        const value = {
          instance_id: getPageQuery().instance_id,
          floatingip_id: values['floatingip_id'],
        };

        this.props.dispatch({
          type: 'ecs/attach',
          payload: value,
        });
      }
    });
  };

  render() {
    const { list } = this.props.floatingip;
    const filteredFIP = list.filter(items => items.status === 'DOWN');

    const { getFieldDecorator } = this.props.form;

    return (
      <Form onSubmit={this.handleSubmit} layout="vertical" hideRequiredMark>
        <Row>
          <Col span={13}>
            <Card type="inner" title="Attach Elastic IP to this Instance">
              <Typography.Title
                level={4}
                style={{
                  fontSize: ` 1.2em`,

                  fontFamily: 'Open Sans',
                  fontWeight: 600,
                  color: `#2b7797`,
                }}
              >
                Select Elastic IP
              </Typography.Title>
              <Form.Item>
                {getFieldDecorator('floatingip_id', {
                  rules: [{ required: true, message: 'Select Elastic IP' }],
                })(
                  <Select size="default">
                    {filteredFIP.map(item => (
                      <Option value={item.name}>{item.name}</Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>

              <Form.Item>
                <Button
                  loading={this.props.creatingKeyPair}
                  type="primary"
                  htmlType="submit"
                  style={{ width: '250px' }}
                >
                  Submit
                </Button>
              </Form.Item>
            </Card>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default FloatingIPDetail;
