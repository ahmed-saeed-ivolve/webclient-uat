import React, { Component } from 'react';
import { Table } from 'antd';

export default class UsageReport extends Component {
    render() {
        const projectName = JSON.parse(window.localStorage.getItem('user'))[
            'project'
        ]['name'];

        const columns = [
            {
                title: 'Instance Name',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: `${projectName}`,
                dataIndex: 'projectName',
                key: 'project',
            },
            {
                title: 'Active',
                dataIndex: 'active_calculated',
                key: 'active',
            },
            {
                title: 'Paused',
                dataIndex: 'paused_calculated',
                key: 'paused',
            },
            {
                title: 'Stopped',
                dataIndex: 'stopped_calculated',
                key: 'stopped',
            },
            {
                title: 'Shelved',
                dataIndex: 'shelved_offloaded_calculated',
                key: 'shelved',
            },
        ];

        return (
            <div>
                <Table columns={columns} dataSource={this.props.ecs} />
            </div>
        );
    }
}
