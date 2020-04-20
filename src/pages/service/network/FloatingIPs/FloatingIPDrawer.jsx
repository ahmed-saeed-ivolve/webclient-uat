import { Drawer, Form, Button, Col, Row, Input, Select, DatePicker, Icon, Radio } from 'antd';
import ReactDOM from 'react-dom';

const { Option } = Select;

class FloatingIPDrawer extends React.Component {
  state = {
    value1: '1',
    value2: '1',
    value3: '1',
  };

  onClose = () => {
    this.props.whenCloseCalled(false);
  };

  handleChange(value) {}

  onChange1 = e => {
    this.setState({
      value1: e.target.value,
    });
  };

  onChange2 = e => {
    this.setState({
      value2: e.target.value,
    });
  };

  onChange3 = e => {
    this.setState({
      value3: e.target.value,
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };
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
                <Typography.Title
                  level={4}
                  style={{
                    fontSize: ` 1.2em`,

                    fontFamily: 'Open Sans',
                    fontWeight: 600,
                    color: `#2b7797`,
                  }}
                >
                  Name
                </Typography.Title>
                <Typography.Paragraph
                  style={{ color: `#747373`, fontSize: `1.1em`, marginBottom: `0.3em` }}
                ></Typography.Paragraph>

                <Form.Item>
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: 'Please enter Floating-IP name' }],
                  })(<Input placeholder="Please enter Floating-IP name" />)}
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Typography.Title
                  level={4}
                  style={{
                    fontSize: ` 1.2em`,

                    fontFamily: 'Open Sans',
                    fontWeight: 600,
                    color: `#2b7797`,
                  }}
                >
                  Description
                </Typography.Title>
                <Typography.Paragraph
                  style={{ color: `#747373`, fontSize: `1.1em`, marginBottom: `0.3em` }}
                ></Typography.Paragraph>

                <Form.Item>{getFieldDecorator('description', {})(<Input />)}</Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Typography.Title
                  level={4}
                  style={{
                    fontSize: ` 1.2em`,

                    fontFamily: 'Open Sans',
                    fontWeight: 600,
                    color: `#2b7797`,
                  }}
                >
                  Last Name
                </Typography.Title>
                <Typography.Paragraph
                  style={{ color: `#747373`, fontSize: `1.1em`, marginBottom: `0.3em` }}
                ></Typography.Paragraph>

                <Form.Item label="Network Service Tier">
                  {getFieldDecorator('networkservicetier', {
                    initialValue: '1',
                  })(
                    <Radio.Group onChange={this.onChange1} value={this.state.value1}>
                      <Radio style={radioStyle} value="1">
                        Premium (Current project-level tier, change)
                      </Radio>
                      <Radio style={radioStyle} value="2">
                        Standard
                      </Radio>
                    </Radio.Group>,
                  )}
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Typography.Title
                  level={4}
                  style={{
                    fontSize: ` 1.2em`,

                    fontFamily: 'Open Sans',
                    fontWeight: 600,
                    color: `#2b7797`,
                  }}
                >
                  Last Name
                </Typography.Title>
                <Typography.Paragraph
                  style={{ color: `#747373`, fontSize: `1.1em`, marginBottom: `0.3em` }}
                ></Typography.Paragraph>

                <Form.Item label="IP version">
                  {getFieldDecorator('ipversion', {
                    initialValue: '1',
                  })(
                    <Radio.Group onChange={this.onChange1} value={this.state.value1}>
                      <Radio style={radioStyle} value="1">
                        Premium (Current project-level tier, change)
                      </Radio>
                      <Radio style={radioStyle} value="2">
                        Standard
                      </Radio>
                    </Radio.Group>,
                  )}
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Type">
                  {getFieldDecorator('type', {
                    initialValue: '1',
                  })(
                    <Radio.Group onChange={this.onChange2} value={this.state.value2}>
                      <Radio style={radioStyle} value="1">
                        IPV4
                      </Radio>
                      <Radio style={radioStyle} value="2">
                        IPV6
                      </Radio>
                    </Radio.Group>,
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

export default Form.create()(FloatingIPDrawer);
