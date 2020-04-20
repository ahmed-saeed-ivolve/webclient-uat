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
} from 'antd';
import ReactDOM from 'react-dom';
import React from 'react';
import { connect } from 'dva';
import { getPageQuery } from '@/utils/utils';

const { Option } = Select;
const marks = {
  1: '1',
  20: '20',
  40: '40',
  60: '60',
  80: '80',
  100: '100',
};

class createVolumeFromSnapshot extends React.Component {
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

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { keys, names } = values;
        values['size'] = this.state.inputValue;
        values['snapshot_id'] = getPageQuery().snapshot_id;

        this.props.dispatch({
          type: 'evs/create',
          payload: values,
        });
      }
    });
  };

  render() {
    const snapshotName = this.props.snapshotList.list.filter(
      item => item.id === getPageQuery().snapshot_id,
    )[0].name;

    const { getFieldDecorator } = this.props.form;
    const { inputValue } = this.state;

    return (
      <div style={{ marginBottom: `0`, backgroundColor: `#fff`, padding: `34px` }}>
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
                Volume Name
              </Typography.Title>
              <Typography.Paragraph
                style={{ color: `#747373`, fontSize: `1.1em`, marginBottom: `0.3em` }}
              ></Typography.Paragraph>

              <Form.Item>
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: 'Please enter volume name' }],
                })(<Input size="large" placeholder="Please enter volume name" />)}
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
                Description
              </Typography.Title>
              <Typography.Paragraph
                style={{ color: `#747373`, fontSize: `1.1em`, marginBottom: `0.3em` }}
              ></Typography.Paragraph>

              <Form.Item>
                {getFieldDecorator('description', {})(<Input.TextArea size="large" rows={4} />)}
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
                Use Snapshot as a source
              </Typography.Title>
              <Typography.Paragraph
                style={{ color: `#747373`, fontSize: `1.1em`, marginBottom: `0.3em` }}
              ></Typography.Paragraph>

              <Form.Item>
                {getFieldDecorator('snapshot_id', {
                  initialValue: snapshotName,
                })(<Input disabled></Input>)}
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
                Size
              </Typography.Title>
              <Typography.Paragraph
                style={{ color: `#747373`, fontSize: `1.1em`, marginBottom: `0.3em` }}
              ></Typography.Paragraph>

              <Form.Item>
                {getFieldDecorator(
                  'size',
                  {},
                )(
                  <Col span={18}>
                    <Slider
                      marks={marks}
                      min={1}
                      max={100}
                      onChange={this.onChange}
                      value={typeof inputValue === 'number' ? inputValue : 0}
                    />
                  </Col>,
                )}
                <Col span={4}>
                  <InputNumber
                    size="large"
                    style={{ marginLeft: '20px' }}
                    min={1}
                    max={100}
                    onChange={this.onChange}
                    value={inputValue}
                  />
                </Col>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button style={{ width: '100%', height: '45px' }} type="primary" htmlType="submit">
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
    snapshotList: state.snapshot,
  };
})(Form.create()(createVolumeFromSnapshot));
