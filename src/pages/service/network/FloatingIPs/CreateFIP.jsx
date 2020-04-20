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
  Radio,
  Typography,
} from 'antd';
import ReactDOM from 'react-dom';
import { connect } from 'dva';

const { Option } = Select;

class CreateFIP extends React.Component {
  state = {
    value1: '1',
    value2: '1',
    value3: '1',
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { keys, names } = values;

        this.props.dispatch({
          type: 'floatingip/create',
          payload: values,
        });
      }
    });
  };

  componentDidMount() {
    const { dispatch } = this.props;
  }

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
    const externalNetwork = this.props.vpcList.list.filter(
      item => item.is_router_external === true,
    );

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
                External Network
              </Typography.Title>
              <Typography.Paragraph
                style={{ color: `#747373`, fontSize: `1.1em`, marginBottom: `0.3em` }}
              ></Typography.Paragraph>

              <Form.Item>
                {getFieldDecorator(
                  'floating_network_id',
                  {},
                )(
                  <Select style={{ width: '600px' }} placeholder="Choose an External Network">
                    {externalNetwork.map(items => (
                      <Option value={items.id}>{items.name}</Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button
              loading={this.props.creatingFIP}
              style={{ width: '600px', height: '45px' }}
              type="primary"
              htmlType="submit"
            >
              Allocate
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default connect(state => {
  return {
    floatingip: state.floatingip,
    vpcList: state.vpc,
    creatingFIP: state.loading.effects['floatingip/create'],
  };
})(Form.create()(CreateFIP));
