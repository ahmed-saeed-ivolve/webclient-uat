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
    Table,
} from 'antd';
import ImageDisplayBox from '@/components/InstanceImages/ImageDisplayBox';
import { connect } from 'dva';

class FinalizeEcs extends PureComponent {
    render() {
        const { getFieldDecorator } = this.props.form;

        const dataSource = { ...this.props.dataSource };
        let source = {};
        if (dataSource.Second.billing_mode.value === 'on_demand') {
            for (var property in dataSource) {
                if (property !== 'Second') {
                    source[property] = dataSource[property];
                } else {
                    source[property] = {};

                    for (var innerProperty in dataSource.Second) {
                        if (
                            innerProperty === 'pay_term' ||
                            innerProperty === 'duration'
                        ) {
                            continue;
                        } else {
                            source[property][innerProperty] =
                                dataSource[property][innerProperty];
                        }
                    }
                }
            }
            var a = Object.entries(source).map(i =>
                Object.entries(i[1]).map(k => k[1])
            );
        } else {
            var a = Object.entries(dataSource).map(i =>
                Object.entries(i[1]).map(k => k[1])
            );
        }

        let dataTable = {};
        a.map(j =>
            j.map(i => {
                if (i.name) {
                    if (i.name?.includes('_')) {
                        dataTable[
                            `${i.name[0].toUpperCase()}${i.name
                                .substr(1)
                                .split('_')
                                .join(' ')
                                .substr(0)}`
                        ] = i.value;
                    } else {
                        dataTable[
                            `${i.name[0].toUpperCase() + i.name.substr(1)}`
                        ] = i.value;
                    }
                } else {
                    var temp = '';
                    if (i) {
                        for (let [key, value] of Object.entries(i)) {
                            temp += `${key}: ${value},  `;
                        }
                        dataTable['Metdata'] = temp;
                    } else {
                        dataTable['Metdata'] = '';
                    }
                }
                return dataTable;
            })
        );
        const table_dataSource = Object.keys(dataTable).map(key => ({
            key,
            value: Array.isArray(dataTable[key])
                ? dataTable[key].join('/')
                : `${dataTable[key]}`,
        }));

        const table_columns = [
            {
                title: '',
                dataIndex: 'key',
                key: 'key',
            },
            {
                title: '',
                dataIndex: 'value',
                key: 'value',
            },
        ];
        return (
            <React.Fragment>
                <Table
                    showHeader={false}
                    size="small"
                    pagination={false}
                    dataSource={table_dataSource}
                    columns={table_columns}
                />
            </React.Fragment>
        );
    }
}
export default Form.create()(FinalizeEcs);
