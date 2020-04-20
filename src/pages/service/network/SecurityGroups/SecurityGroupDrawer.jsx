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
  Upload,
} from 'antd';
import ReactDOM from 'react-dom';

const { Option } = Select;

class SecurityGroupDrawer extends React.Component {
  state = {
    inputValue: 1,
    inputValueRAM: 1,
    uploadResponse: {},
    fileList: [],
    uploading: false,
  };

  handleUpload = () => {
    const { fileList } = this.state;
    const formData = new FormData();
    fileList.forEach(file => {
      formData.append('files[]', file);
    });

    this.setState({
      uploading: true,
    });

    reqwest({
      url: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
      method: 'post',
      processData: false,
      data: formData,
      success: () => {
        this.setState({
          fileList: [],
          uploading: false,
        });
        message.success('upload successfully.');
      },
      error: () => {
        this.setState({
          uploading: false,
        });
        message.error('upload failed.');
      },
    });
  };

  onClose = () => {
    this.props.whenCloseCalled(false);
  };

  onChange = value => {
    this.setState({
      inputValue: value,
    });
  };

  onChange2 = value => {
    this.setState({
      inputValueRAM: value,
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { inputValue } = this.state;
    const { inputValueRAM } = this.state;

    const { uploading, fileList } = this.state;
    const props = {
      onRemove: file => {
        this.setState(state => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: file => {
        this.setState(state => ({
          fileList: [...state.fileList, file],
        }));
        return false;
      },
      fileList,
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
                <Form.Item label="Name">
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: 'Please enter security-group name' }],
                  })(<Input placeholder="Please enter the name of security group" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item label="Description">
                  {getFieldDecorator('description', {})(<Input.TextArea rows={4} />)}
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

export default Form.create()(SecurityGroupDrawer);
