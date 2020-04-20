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
  InputNumber,
  Slider,
  Typography,
} from 'antd';
import ReactDOM from 'react-dom';
import { connect } from 'dva';

const { Option } = Select;

class CreateFlavor extends React.Component {
  state = {
    inputValueRam: 1,
    inputValueDisk: 1,
    inputValueEphemeralDisk: 1,
    inputValueSwapDisk: 1,
    inputValueVcpu: 1,
    inputValueRxtx: 1,
  };

  onClose = () => {
    this.props.whenCloseCalled(false);
  };

  onChangeVcpu = value => {
    this.setState({
      inputValueVcpu: value,
    });
  };

  onChangeRam = value => {
    this.setState({
      inputValueRam: value,
    });
  };

  onChangeDisk = value => {
    this.setState({
      inputValueDisk: value,
    });
  };

  onChangeEphemeralDisk = value => {
    this.setState({
      inputValueEphemeralDisk: value,
    });
  };

  onChangeSwapDisk = value => {
    this.setState({
      inputValueSwapDisk: value,
    });
  };


  onChangeRxtx = value => {
    this.setState({
      inputValueRxtx: value,
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { keys, names } = values;
        values['is_public'] = true;
        values['vcpus'] = this.state.inputValueVcpu;
        values['ram'] = this.state.inputValueRam;
        values['disk'] = this.state.inputValueDisk;
        values['ephemeral_gb'] = this.state.inputValueEphemeralDisk;
        values['swap'] = this.state.inputValueSwapDisk;
        values['rxtx_factor'] = this.state.inputValueRxtx;
        
        this.props.dispatch({
          type: 'flavor/create',
          payload: values,
        });
      }
    });
  };

  render() {
    const {
      inputValue,
      inputValueRam,
      inputValueDisk,
      inputValueEphemeralDisk,
      inputValueSwapDisk,
      inputValueRxtx,
      inputValueVcpu,

    } = this.state;

    const marks = {
      1: '1',
      16: '16',
      32: '32',
      48: '48',
      64: '64',
    };


    const { getFieldDecorator } = this.props.form;
    return (
      <div style={{ marginBottom: `0`, backgroundColor: `#fff`, padding: `34px` }}>
        <Form onSubmit={this.handleSubmit} layout="vertical" hideRequiredMark>
          <Row gutter={16}>
            <Col span={24}>
              <Typography.Title level={4} style={{
                fontSize: ` 1.2em`,

                fontFamily: "Open Sans",
                fontWeight: 600,
                color: `#2b7797`,
               
              }}>Name</Typography.Title>
              <Typography.Paragraph style={{ color: `#747373`, fontSize: `1.1em`, marginBottom: `0.3em` }}></Typography.Paragraph>
              <Form.Item>
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: 'Please enter Flavor name' }],
                })(<Input placeholder="Please enter user name" />)}
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Typography.Title level={4} style={{
                fontSize: ` 1.2em`,

                fontFamily: "Open Sans",
                fontWeight: 600,
                color: `#2b7797`,
               
              }}>VCPUs</Typography.Title>
              <Typography.Paragraph style={{ color: `#747373`, fontSize: `1.1em`, marginBottom: `0.3em` }}></Typography.Paragraph>
              <Form.Item>
                {getFieldDecorator('vcpus', {
                 
                })(
                  <div>
                    <Col span={21}>
                      <Slider
                        marks={marks}
                        min={1}
                        max={64}
                        onChange={this.onChangeVcpu}
                        value={typeof inputValueVcpu === 'number' ? inputValueVcpu : 0}
                      />
                    </Col>

                    <Col span={3}>
                      <InputNumber
                        size="large"
                        style={{ marginLeft: '20px' }}
                        min={1}
                        max={64}
                        onChange={this.onChangeVcpu}
                        value={inputValueVcpu}
                      />
                    </Col>
                  </div>,
                )}
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Typography.Title level={4} style={{
                fontSize: ` 1.2em`,

                fontFamily: "Open Sans",
                fontWeight: 600,
                color: `#2b7797`,
               
              }}>RAM (MB)</Typography.Title>
              <Typography.Paragraph style={{ color: `#747373`, fontSize: `1.1em`, marginBottom: `0.3em` }}></Typography.Paragraph>
              <Form.Item >
                {getFieldDecorator('ram', {
                 
                })(
                  <div>
                    <Col span={21}>
                      <Slider
                        marks={marks}
                        min={1}
                        max={64}
                        onChange={this.onChangeRam}
                        value={typeof inputValueRam === 'number' ? inputValueRam : 0}
                      />
                    </Col>

                    <Col span={3}>
                      <InputNumber
                        size="large"
                        style={{ marginLeft: '20px' }}
                        min={1}
                        max={64}
                        onChange={this.onChangeRam}
                        value={inputValueRam}
                      />
                    </Col>
                  </div>,
                )}
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Typography.Title level={4} style={{
                fontSize: ` 1.2em`,

                fontFamily: "Open Sans",
                fontWeight: 600,
                color: `#2b7797`,
               
              }}>DISK (MB)</Typography.Title>
              <Typography.Paragraph style={{ color: `#747373`, fontSize: `1.1em`, marginBottom: `0.3em` }}></Typography.Paragraph>

              <Form.Item >
                {getFieldDecorator('disk', {
                 
                })(
                  <div>
                    <Col span={21}>
                      <Slider
                        marks={marks}
                        min={1}
                        max={64}
                        onChange={this.onChangeDisk}
                        value={typeof inputValueDisk === 'number' ? inputValueDisk : 0}
                      />
                    </Col>

                    <Col span={3}>
                      <InputNumber
                        size="large"
                        style={{ marginLeft: '20px' }}
                        min={1}
                        max={64}
                        onChange={this.onChangeDisk}
                        value={inputValueDisk}
                      />
                    </Col>
                  </div>,
                )}
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Typography.Title level={4} style={{
                fontSize: ` 1.2em`,

                fontFamily: "Open Sans",
                fontWeight: 600,
                color: `#2b7797`,
               
              }}>Ephemeral Disk (GB)</Typography.Title>
              <Typography.Paragraph style={{ color: `#747373`, fontSize: `1.1em`, marginBottom: `0.3em` }}></Typography.Paragraph>

              <Form.Item >
                {getFieldDecorator('ephemeral_gb', {
                 
                })(
                  <div>
                    <Col span={21}>
                      <Slider
                        marks={marks}
                        min={1}
                        max={64}
                        onChange={this.onChangeEphemeralDisk}
                        value={
                          typeof inputValueEphemeralDisk === 'number' ? inputValueEphemeralDisk : 0
                        }
                      />
                    </Col>

                    <Col span={3}>
                      <InputNumber
                        size="large"
                        style={{ marginLeft: '20px' }}
                        min={1}
                        max={64}
                        onChange={this.onChangeEphemeralDisk}
                        value={inputValueEphemeralDisk}
                      />
                    </Col>
                  </div>,
                )}
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Typography.Title level={4} style={{
                fontSize: ` 1.2em`,

                fontFamily: "Open Sans",
                fontWeight: 600,
                color: `#2b7797`,
               
              }}>Swap Disk (MB)</Typography.Title>
              <Typography.Paragraph style={{ color: `#747373`, fontSize: `1.1em`, marginBottom: `0.3em` }}></Typography.Paragraph>

              <Form.Item >
                {getFieldDecorator('swap', {
                 
                })(
                  <div>
                    <Col span={21}>
                      <Slider
                        marks={marks}
                        min={1}
                        max={64}
                        onChange={this.onChangeSwapDisk}
                        value={typeof inputValueSwapDisk === 'number' ? inputValueSwapDisk : 0}
                      />
                    </Col>

                    <Col span={3}>
                      <InputNumber
                        size="large"
                        style={{ marginLeft: '20px' }}
                        min={1}
                        max={64}
                        onChange={this.onChangeSwapDisk}
                        value={inputValueSwapDisk}
                      />
                    </Col>
                  </div>,
                )}
              </Form.Item>
            </Col>
          </Row>


          <Row gutter={16}>
            <Col span={24}>
              <Typography.Title level={4} style={{
                fontSize: ` 1.2em`,

                fontFamily: "Open Sans",
                fontWeight: 600,
                color: `#2b7797`,
               
              }}>RX/TX Factor</Typography.Title>
              <Typography.Paragraph style={{ color: `#747373`, fontSize: `1.1em`, marginBottom: `0.3em` }}></Typography.Paragraph>

              <Form.Item>
                {getFieldDecorator('rxtx_factor', {
                 
                })(
                  <div>
                    <Col span={21}>
                      <Slider
                        marks={marks}
                        min={1}
                        max={64}
                        onChange={this.onChangeRxtx}
                        value={typeof inputValueRxtx === 'number' ? inputValueRxtx : 0}
                      />
                    </Col>

                    <Col span={3}>
                      <InputNumber
                        size="large"
                        style={{ marginLeft: '20px' }}
                        min={1}
                        max={64}
                        onChange={this.onChangeRxtx}
                        value={inputValueRxtx}
                      />
                    </Col>
                  </div>,
                )}
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button loading={this.props.creatingFloatingIP} style={{ width: '100%', height: '45px' }} type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default connect(state => {
  return {
    creatingFloatingIP: state.loading.effects['flavor/create']
  };

})(Form.create()(CreateFlavor));

