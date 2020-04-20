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
    Typography,
    notification,
    message,
} from 'antd';
import ReactDOM from 'react-dom';
import { connect } from 'dva';
import { create } from '@/pages/service/services/generic_service';
import { CopyToClipboard } from 'react-copy-to-clipboard';

class Encryption extends React.Component {
    constructor(props) {
        super();
        this.state = {
            encrypted_data: '',
            loading: false,
            copied: false,
        };
    }

    handleSubmit = e => {
        e.preventDefault();

        this.props.form.validateFields(['plain_text'], async (err, values) => {
            if (!err) {
                const { keys, names } = values;

                values['id'] = this.props.currentKMS.id;
                this.setState({ loading: true });
                const encrypted_data = await create({
                    data: { ...values },
                    method: '/encrypt_kms',
                    config: 'security',
                });

                if (encrypted_data?.statusCode === 200) {
                    this.props.dispatch({
                        type: 'kms/keysHasData',
                        payload: { id: this.props.currentKMS.id },
                    });
                    message.success('Data Saved');
                } else if (encrypted_data?.statusCode === 409) {
                    message.error(encrypted_data.body.data);
                }
                this.setState({ loading: false });
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const disableInputText =
            this.props.currentKMS.hasOwnProperty('content_types') ||
            this.props.keysHasDataId.includes(this.props.currentKMS.id);
        return (
            <div>
                <Row>
                    <Col>
                        <Form
                            onSubmit={this.handleSubmit}
                            layout="vertical"
                            hideRequiredMark
                        >
                            <Row gutter={16}>
                                <Col span={10}>
                                    <Typography.Title
                                        level={4}
                                        style={{
                                            fontSize: ` 1.2em`,

                                            fontFamily: 'Open Sans',
                                            fontWeight: 600,
                                            color: `#2b7797`,
                                        }}
                                    >
                                        Text
                                    </Typography.Title>
                                    <Typography.Paragraph
                                        style={{
                                            color: `#747373`,
                                            fontSize: `1.1em`,
                                            marginBottom: `0.3em`,
                                        }}
                                    ></Typography.Paragraph>
                                    <Form.Item>
                                        {getFieldDecorator('plain_text', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message:
                                                        'Please enter text',
                                                },
                                            ],
                                        })(
                                            <Input.TextArea
                                                disabled={disableInputText}
                                                rows={4}
                                                placeholder={
                                                    disableInputText
                                                        ? 'Data is already stored in this key, go to decrypt tab to view the data'
                                                        : 'Enter your text here which you want to save in the key'
                                                }
                                            />
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item>
                                <Button
                                    disabled={disableInputText}
                                    loading={this.state.loading}
                                    type="primary"
                                    htmlType="submit"
                                >
                                    Encrypt
                                </Button>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default connect(({ kms, loading }) => {
    return {
        currentKMS: kms.selectedKMS,
        encrypting: loading.effects['kms/encrypt'],
        keysHasDataId: kms.keysHasDataId,
    };
})(Form.create()(Encryption));
