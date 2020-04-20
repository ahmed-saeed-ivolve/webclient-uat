import { Drawer, Form, Button, Col, Row, Input, Select, DatePicker, Icon, Radio } from 'antd';
import ReactDOM from 'react-dom';
import { connect } from 'dva';
import style from './Provider.less';
import { router } from 'umi';

let id = 0;

class CreateProvider extends React.Component {
  state = {
    value: 0,
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { keys, names } = values;
      }
    });
  };

  onChange = e => {
    this.setState({
      value: e.target.value,
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
      font: '',
    };
    return (
      <div className={style[`provider-container`]}>
        <div style={{ marginTop: `30px`, padding: '20px' }}>
          <Button
            onClick={() => {
              router.goBack();
            }}
            style={{ height: `45px` }}
          >
            <Icon type="left" />
            {`View All Providers`}
          </Button>
        </div>

        <Form
          onSubmit={this.handleSubmit}
          layout="vertical"
          hideRequiredMark
          style={{ padding: '20px' }}
        >
          <Row gutter={40}>
            <Col span={12}>
              <Row>
                <Form.Item label="Name">
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: 'Please enter provider name' }],
                  })(<Input size="large" placeholder="Please enter provider name" />)}
                </Form.Item>
              </Row>

              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item label="Type">
                    {getFieldDecorator('type', {
                      rules: [{ required: true, message: 'Please select the type' }],
                    })(
                      <Select size="large" placeholder="Select Type">
                        <Option value="openstack">Openstack</Option>
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item label="Keystone">
                    {getFieldDecorator('keystone', {
                      rules: [{ required: true, message: 'Please select the keystone' }],
                    })(
                      <Select size="large" placeholder="Select Keystone">
                        <Option value="v3">V3</Option>
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Form.Item label="Project Name">
                  {getFieldDecorator('projectname', {
                    rules: [{ required: true, message: 'Please enter project name' }],
                  })(<Input size="large" placeholder="Please enter project name" />)}
                </Form.Item>
              </Row>

              <Row>
                <Form.Item label="Host Name">
                  {getFieldDecorator('hostname', {
                    rules: [{ required: true, message: 'Please enter host name' }],
                  })(<Input size="large" placeholder="Please enter host name" />)}
                </Form.Item>
              </Row>

              <Row>
                <Form.Item label="User ID">
                  {getFieldDecorator('userid', {
                    rules: [{ required: true, message: 'Please enter User ID' }],
                  })(<Input size="large" placeholder="Please enter User ID" />)}
                </Form.Item>
              </Row>

              <Row>
                <Form.Item label="Password">
                  {getFieldDecorator('password', {
                    rules: [{ required: true, message: 'Please enter password' }],
                  })(<Input.Password size="large" placeholder="Please enter password" />)}
                </Form.Item>
              </Row>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Tenant">
                {getFieldDecorator('tenant', {
                  rules: [{ required: true, message: 'Please select the Tenant' }],
                })(
                  <Radio.Group size="large" onChange={this.onChange} value={this.state.value}>
                    <Radio style={radioStyle} value={1}>
                      superadmin-tenant
                    </Radio>
                    <Radio style={radioStyle} value={2}>
                      tenant-detasad
                    </Radio>
                  </Radio.Group>,
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

export default connect()(Form.create()(CreateProvider));
