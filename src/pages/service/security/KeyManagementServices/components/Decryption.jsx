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
    message,
    Skeleton,
} from 'antd';
import ReactDOM from 'react-dom';
import { connect } from 'dva';
import { create } from '@/pages/service/services/generic_service';
import { CopyToClipboard } from 'react-copy-to-clipboard';

class Decryption extends React.Component {
    constructor(props) {
        super();
        this.state = {
            decrypted_data: '',
            loading: false,
        };
    }

    async componentDidMount() {
        let values = { id: this.props.currentKMS.id };
        this.setState({ loading: true });
        const decrypted_data = await create({
            data: { ...values },
            method: '/decrypt_kms',
            config: 'security',
        });
        this.setState({ loading: false });
        if (decrypted_data?.statusCode === 200) {
            this.setState({ decrypted_data: decrypted_data.body.data });
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
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
                                        {getFieldDecorator(
                                            'plain_text',

                                            {
                                                initialValue: this.state
                                                    .decrypted_data,
                                            }
                                        )(
                                            this.state.loading ? (
                                                <Skeleton />
                                            ) : (
                                                <>
                                                    <Col span={20}>
                                                        <Input.TextArea
                                                            disabled={true}
                                                            value={
                                                                this.state
                                                                    .decrypted_data
                                                            }
                                                            rows={4}
                                                            style={{
                                                                color: 'purple',
                                                            }}
                                                            placeholder="Your text will be display here when you saved the data in this particular key"
                                                        />
                                                    </Col>
                                                    <Col span={4}>
                                                        <CopyToClipboard
                                                            text={
                                                                this.state
                                                                    .decrypted_data
                                                            }
                                                            onCopy={() => {
                                                                this.setState({
                                                                    copied: true,
                                                                });
                                                                message.info(
                                                                    'Copied!'
                                                                );
                                                            }}
                                                        >
                                                            <Icon
                                                                style={{
                                                                    fontSize:
                                                                        '20px',
                                                                    color:
                                                                        '#2990fe',
                                                                    marginLeft:
                                                                        '6px',
                                                                }}
                                                                type="copy"
                                                            />
                                                        </CopyToClipboard>
                                                    </Col>
                                                </>
                                            )
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
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
        decrypting: loading.effects['kms/decrypt'],
    };
})(Form.create()(Decryption));
