import React, { PureComponent } from 'react';
import { Row, Col, Typography, Divider, Timeline, Tabs, Form, Input, Radio } from 'antd'
import { connect } from 'dva';
import FormRow from '../../../components/FormRow';


class LaunchVMForm extends PureComponent {


    render() {
        
       
        return (
            <React.Fragment>
            <Form>
            <FormRow field={<Input size="default" />} title={"Instance Name"} paragraph={""} dataKey='name' decorator={{ rules: [{ required: true, message: "Please Enter an Instance Name!" }] }} getFieldDecorator={this.props.form.getFieldDecorator} />
            </Form>
            </React.Fragment>
        )
    }
}
const WrappedHorizontalLoginForm = Form.create({ name: 'horizontal_login' })(LaunchVMForm);

export default WrappedHorizontalLoginForm;