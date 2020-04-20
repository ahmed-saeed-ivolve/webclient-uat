import React, { PureComponent } from 'react';
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
  Select,
  Button,
} from 'antd';
import ImageDisplayBox from '@/components/InstanceImages/ImageDisplayBox';
import { connect } from 'dva';
import FormRow from '../../../../components/FormRow';
import VPCTable from '@/pages/service/network/VirtualPrivateCloud/VPCElementsTable';

const { Option } = Select;

class Third extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <React.Fragment>
        <Row>
          <Col>
            <Form>
              <FormRow
                style={{ marginBottom: `20px` }}
                title={'Network'}
                paragraph={'Select network for this instance'}
                dataKey="networks"
                decorator={{}}
                getFieldDecorator={this.props.form.getFieldDecorator}
              >
                <Select style={{ width: '600px' }}>
                  {this.props.helperData.vpc
                    .filter(item => item.is_router_external === false)
                    .map(item => (
                      <Option key={item.id} value={item.id}>
                        {item.name}
                      </Option>
                    ))}
                </Select>
              </FormRow>
            </Form>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default connect(({ createECS }) => {
  return {
    ...createECS,
  };
})(
  Form.create({
    onFieldsChange(props, changedFields) {
      const { dispatch } = props;
      dispatch({
        type: `createECS/updateFormData`,
        payload: {
          formIndex: 'Third',
          value: {
            ...changedFields,
          },
        },
      });
    },
    mapPropsToFields(props) {
      const { formsData } = props;

      return Object.entries(formsData.Third).reduce(
        (inital, values) => ({ ...inital, [values[0]]: Form.createFormField({ ...values[1] }) }),
        {},
      );
    },
  })(Third),
);
