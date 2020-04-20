import React from 'react';
import {
    Row,
    Col,
    Card,
    Tabs,
    Typography,
    Icon,
    Form,
    Input,
    Button,
    Result,
    Divider,
} from 'antd';
import styles from './support.less';
const { TabPane } = Tabs;
import { connect } from 'dva';
const { TextArea } = Input;
const FormItem = Form.Item;

@Form.create()
class Support extends React.Component {
    constructor() {
        super();
        this.state = {
            email: '',
            query: '',
            subject: '',
            showForm: true,
        };
    }

    sendAgain() {
        this.setState({ showForm: !this.state.showForm });
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.dispatch({
                    type: 'support/sendMail',
                    payload: values,
                });
            }
        });
        this.props.form.resetFields();
    };

    render() {
        const { query, showForm } = this.state;
        const { getFieldDecorator } = this.props.form;

        return (
            <div style={{ backgroundColor: 'white', padding: '65px' }}>
                <Row>
                    <Col>
                        <Card className={styles['support']}>
                            <Tabs type="card">
                                <TabPane
                                    tab={
                                        <span style={{ fontSize: '20px' }}>
                                            <Icon type="phone" />
                                            Contact Us
                                        </span>
                                    }
                                >
                                    <Typography
                                        className={styles['contact-text']}
                                    >
                                        Detecon Al Saudia Co.Ltd. P.O.Box 22135,
                                        Riyadh 11495, Kingdom of Saudi Arabia
                                    </Typography>
                                    <Typography
                                        className={styles['contact-text']}
                                    >
                                        For sales related queries , please email
                                        at info@detasad.com.sa <br />
                                    </Typography>
                                    <Typography
                                        className={styles['contact-text']}
                                    >
                                        Phone +922 13713 1564
                                        <br />
                                        Fax +966 11 249 78 87
                                    </Typography>
                                    <Divider />
                                    <Typography
                                        className={styles['contact-text']}
                                    >
                                        For further queries you may connect with
                                        us
                                    </Typography>
                                    {showForm ? (
                                        <Form
                                            id="create-course-form"
                                            layout="horizontal"
                                            loading={this.props.sendingMail}
                                            onSubmit={this.handleSubmit.bind(
                                                this
                                            )}
                                            className="login-form"
                                            style={{ width: '550px' }}
                                        >
                                            <br />
                                            <FormItem>
                                                {getFieldDecorator('email', {
                                                    rules: [
                                                        {
                                                            type: 'email',
                                                            required: true,
                                                            message:
                                                                'Please enter a valid email !',
                                                            pattern: /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/,
                                                        },
                                                    ],
                                                })(
                                                    <Input
                                                        prefix={
                                                            <Icon type="user" />
                                                        }
                                                        style={{
                                                            height: '40px',
                                                        }}
                                                        placeholder="Email"
                                                    />
                                                )}
                                            </FormItem>

                                            <FormItem>
                                                {getFieldDecorator('subject', {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message:
                                                                'Enter email subject',
                                                        },
                                                    ],
                                                })(
                                                    <Input
                                                        style={{
                                                            height: '40px',
                                                        }}
                                                        placeholder="Subject"
                                                    />
                                                )}
                                            </FormItem>

                                            <FormItem>
                                                {getFieldDecorator('query', {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message:
                                                                'Please input your query!',
                                                        },
                                                    ],
                                                })(
                                                    <TextArea
                                                        value={query}
                                                        rows={6}
                                                        placeholder="Place your query here"
                                                    />
                                                )}
                                            </FormItem>
                                            <Button
                                                type="primary"
                                                loading={this.props.sendingMail}
                                                htmlType="submit"
                                                className="login-form-button btn"
                                                style={{
                                                    width: 'inherit',
                                                    height: '40px',
                                                    backgroundColor: '#0c3446',
                                                }}
                                            >
                                                Send
                                            </Button>
                                        </Form>
                                    ) : (
                                        <Result
                                            status="success"
                                            subTitle="Your query has been successfully submitted ,our team will get back to you soon!"
                                            extra={[
                                                <Button
                                                    key="buy"
                                                    onClick={this.sendAgain.bind(
                                                        this
                                                    )}
                                                >
                                                    Request another
                                                </Button>,
                                            ]}
                                        />
                                    )}
                                </TabPane>
                            </Tabs>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}
export default connect(({ loading, support }) => {
    return {
        sendingMail: loading.effects['support/sendMail'],
        statusCode: support.statusCode,
    };
})(Form.create()(Support));
