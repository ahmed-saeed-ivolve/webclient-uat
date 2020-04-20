import { PureComponent } from 'react';
import {
    Row,
    Col,
    Typography,
    Divider,
    Timeline,
    Tabs,
    Form,
    Input,
    Radio,
} from 'antd';
import { tsImportEqualsDeclaration } from '@babel/types';

class FormRow extends PureComponent {
    componentDidMount() {}
    render() {
        return (
            <Row style={{ ...this.props.style }}>
                <Col span={this.props.span || 24}>
                    <Typography.Title
                        level={4}
                        style={{
                            fontSize: ` 1.2em`,

                            fontFamily: 'Open Sans',
                            fontWeight: 600,
                            color: `#2b7797`,
                        }}
                    >
                        {this.props.title}
                    </Typography.Title>
                    <Typography.Paragraph
                        style={{
                            color: `#747373`,
                            fontSize: `1.1em`,
                            marginBottom: `0.3em`,
                        }}
                    >
                        {this.props.paragraph}
                    </Typography.Paragraph>
                    <Form.Item style={{ marginBottom: `0px` }}>
                        {this.props.getFieldDecorator(this.props.dataKey, {
                            ...this.props.decorator,
                            initialValue: this.props.default,
                        })(
                            this.props.field
                                ? this.props.field
                                : this.props.children
                        )}
                    </Form.Item>
                </Col>
            </Row>
        );
    }
}

export default FormRow;
