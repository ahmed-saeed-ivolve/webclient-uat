import { Drawer, Form, Button, Col, Row, Input, Select, DatePicker, Icon, InputNumber } from 'antd';
import ReactDOM from 'react-dom';

const { Option } = Select;

class FlavorDrawer extends React.Component {
  onClose = () => {
    this.props.whenCloseCalled(false);
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Drawer
          title="Create a new account"
          width={720}
          onClose={this.onClose}
          visible={this.props.visible}
        >
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Name">
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: 'Please enter router name' }],
                  })(<Input placeholder="Please enter router name" />)}
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Admin State">
                  {getFieldDecorator('adminstate', {
                    initialValue: 'up',
                  })(
                    <Select placeholder="Select admin state">
                      <Option value="up">UP</Option>
                      <Option value="down">DOWN</Option>
                    </Select>,
                  )}
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="External Network">
                  {getFieldDecorator('externalnetwork', {
                    initialValue: 'network1',
                  })(
                    <Select placeholder="Select External Network">
                      <Option value="network1">Network 1</Option>
                      <Option value="network2">Network 2</Option>
                    </Select>,
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <div
            style={{
              position: 'absolute',
              left: 0,
              bottom: 0,
              width: '100%',
              borderTop: '1px solid #e9e9e9',
              padding: '10px 16px',
              background: '#fff',
              textAlign: 'right',
            }}
          >
            <Button onClick={this.onClose} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button onClick={this.onClose} type="primary">
              Submit
            </Button>
          </div>
        </Drawer>
      </div>
    );
  }
}

export default Form.create()(FlavorDrawer);
