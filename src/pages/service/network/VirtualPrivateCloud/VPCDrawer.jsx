import {
  Drawer,
  Form,
  Button,
  Col,
  Row,
  Input,
  Select,
  DatePicker,
  Icon,
  Slider,
  InputNumber,
} from 'antd';
import ReactDOM from 'react-dom';
import React from 'react';

const { Option } = Select;

class EVSDrawer extends React.Component {
  state = {
    inputValue: 1,
    choice: '',
  };
  onClose = () => {
    this.props.whenCloseCalled(false);
  };

  onChange = value => {
    this.setState({
      inputValue: value,
    });
  };

  handleVolumeSource(value) {
    this.setState({ choice: value });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { inputValue } = this.state;
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
                    rules: [{ required: true, message: 'Please enter user name' }],
                  })(<Input placeholder="Please enter user name" />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Description">
                  {getFieldDecorator('description', {})(<Input.TextArea rows={4} />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Volume Source">
                  {getFieldDecorator('volumesource', {
                    rules: [{ required: true, message: 'Please choose the volume source' }],
                  })(
                    <Select onSelect={value => this.handleVolumeSource(value)}>
                      <Option value="image">Image</Option>
                    </Select>,
                  )}
                </Form.Item>
              </Col>

              {this.state.choice === 'image' ? (
                <Col span={12}>
                  <Form.Item label="Use Image as a Source">
                    {getFieldDecorator('name', {
                      rules: [{ required: true, message: 'Please select an image' }],
                    })(
                      <Select placeholder="Choose an Image">
                        <Option value="Windows">Windows</Option>
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
              ) : (
                <div />
              )}
            </Row>

            <Row>
              <Col span={24}>
                <Form.Item label="Size">
                  <Col span={16}>
                    <Slider
                      min={1}
                      max={64}
                      onChange={this.onChange}
                      value={typeof inputValue === 'number' ? inputValue : 0}
                    />
                  </Col>
                  <Col span={4}>
                    <InputNumber
                      style={{ marginLeft: '20px' }}
                      min={1}
                      max={64}
                      onChange={this.onChange}
                      value={inputValue}
                    />
                  </Col>

                  <Col span={4}>
                    <Select placeholder="MB/GB">
                      <Option value="mb">MB</Option>
                      <Option value="gb">GB</Option>
                    </Select>
                  </Col>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="Availability Zone">
                  {getFieldDecorator('availabilityzone', {
                    rules: [{ required: true, message: 'Please choose the approver' }],
                  })(
                    <Select placeholder="Choose an Availability Zone">
                      <Option value="">Choose an Availability Zone</Option>
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

export default Form.create()(EVSDrawer);
