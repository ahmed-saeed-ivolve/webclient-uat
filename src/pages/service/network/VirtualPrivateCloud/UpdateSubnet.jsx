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
  Typography,
  Radio,
} from 'antd';
import ReactDOM from 'react-dom';
import React from 'react';
import { connect } from 'dva';
import FormRow from '@/pages/service/components/FormRow';

const { Option } = Select;
const marks = {
  50: '50',
  100: '100',
  150: '150',
  200: '200',
  250: '250',
  300: '300',
  350: '350',
  400: '400',
  450: '450',
  500: '500',
};

class CreateEVS extends React.Component {
  state = {
    minVal: 0,
    maxVal: 500,
    inputValue: 0,
    choice: '',
    disabled: false,
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

  componentDidMount() {
    const { dispatch } = this.props;
  }

  handleSubmit = e => {
    e.preventDefault();

    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { keys, names } = values;
        values['volume_id'] = this.props.mountedData.id;
        values['size'] = this.state.inputValue;
        this.props.dispatch({
          type: 'evs/resize',
          payload: values,
        });
      }
    });
  };

  componentDidMount() {
    var selectedVolume = this.props.evs.list.find(item => item.id === this.props.mountedData.id);
    this.setState({ minVal: selectedVolume.size, inputValue: parseInt(selectedVolume.size) });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    let { inputValue, disabled } = this.state;
    var selectedVolume = this.props.evs.list.find(item => item.id === this.props.mountedData.id);
    return (
      <div
        style={{
          marginBottom: `0`,
          backgroundColor: `#fff`,
          padding: this.props.type !== 'modal' ? `34px` : `0px`,
        }}
      >
        <Form onSubmit={this.handleSubmit} layout="vertical" hideRequiredMark>
          <Row gutter={16}>
            <Col span={24}>
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

              <Form.Item style={{ width: '600px' }}>
                {getFieldDecorator('name', {
                  initialValue:
                    selectedVolume.name === '' ? selectedVolume.id : selectedVolume.name,
                })(
                  <Input
                    disabled
                    size="default"
                    placeholder={
                      selectedVolume.name === '' ? selectedVolume.id : selectedVolume.name
                    }
                  />,
                )}
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Typography.Title
                level={4}
                style={{
                  fontSize: ` 1.2em`,

                  fontFamily: 'Open Sans',
                  fontWeight: 600,
                  color: `#2b7797`,
                }}
              >
                Current Size
              </Typography.Title>
              <Typography.Paragraph
                style={{ color: `#747373`, fontSize: `1.1em`, marginBottom: `0.3em` }}
              ></Typography.Paragraph>

              <Form.Item style={{ width: '600px' }}>
                {getFieldDecorator(
                  'oldsize',
                  {},
                )(<Input disabled size="default" placeholder={selectedVolume.size} />)}
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={24}>
              <Typography.Title
                level={4}
                style={{
                  fontSize: ` 1.2em`,

                  fontFamily: 'Open Sans',
                  fontWeight: 600,
                  color: `#2b7797`,
                }}
              >
                New Size
              </Typography.Title>
              <Typography.Paragraph
                style={{ color: `#747373`, fontSize: `1.1em`, marginBottom: `0.3em` }}
              ></Typography.Paragraph>
              <Form.Item style={{ width: '800px' }}>
                {getFieldDecorator(
                  'size',
                  {},
                )(
                  <Col span={14}>
                    <Slider
                      marks={marks}
                      min={this.state.minVal}
                      max={this.state.maxVal}
                      onChange={this.onChange}
                      checked={disabled}
                      value={typeof inputValue === 'number' ? inputValue : this.state.inputValue}
                    />
                  </Col>,
                )}
                <Col span={4}>
                  <InputNumber
                    size="default"
                    style={{ marginLeft: '20px' }}
                    min={this.state.minVal}
                    max={this.state.maxVal}
                    onChange={this.onChange}
                    value={inputValue}
                  />
                </Col>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button
              disabled={this.state.inputValue === parseInt(selectedVolume.size)}
              loading={this.props.resizingVM}
              style={{ width: '30%', height: '45px' }}
              type="primary"
              htmlType="submit"
            >
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
    resizingVM: state.loading.effects['evs/resize'],

    evs: state.evs,
  };
})(Form.create()(CreateEVS));
