import { Collapse, Icon, Row, Col, Spin, Divider, Descriptions, Badge, Card, Popconfirm, Form, Select, Typography, Tag, Input, Switch, Button } from 'antd';
import ReactDOM from 'react-dom';
import moment from 'moment';
import React from 'react';
import { connect } from 'dva';
import FormRow from '@/pages/service/components/FormRow';

const { Option } = Select;

class UserInGroupDetailPanel extends React.Component {

    render() {

        const { userInGroupDetail } = this.props

        return (


            <Descriptions column={2} colon={true}>

                <Descriptions.Item label="ID">{userInGroupDetail.id}</Descriptions.Item>
                <Descriptions.Item label="User Name">{userInGroupDetail.name}</Descriptions.Item>
                <Descriptions.Item label="Email">{userInGroupDetail.email}</Descriptions.Item>

            </Descriptions>

        )
    }
}

export default connect(state => {
    return {
       
       
       
        updatingSubnet: state.loading.effects['vpc/updateSubnet'],
       
        evs: state.evs
    };
})(UserInGroupDetailPanel);
