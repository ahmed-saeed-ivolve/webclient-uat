import React from 'react';
import {
    Tabs,
    Button,
    Icon,
    Row,
    Col,
    Typography,
    Select,
    Input,
    Table,
    Popconfirm,
} from 'antd';
import Form from 'antd/es/form';
import { connect } from 'dva';
import router from 'umi/router';
import AddRule from './../SecurityGroups/AddRule';

const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
    <EditableContext.Provider value={form}>
        <tr {...props} />
    </EditableContext.Provider>
);
const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
    state = {
        editing: false,
    };

    toggleEdit = () => {
        const editing = !this.state.editing;
        this.setState({ editing }, () => {
            if (editing) {
                this.input.focus();
            }
        });
    };

    save = e => {
        const { record, handleSave } = this.props;
        this.form.validateFields((error, values) => {
            if (error && error[e.currentTarget.id]) {
                return;
            }
            this.toggleEdit();
            handleSave({ ...record, ...values });
        });
    };

    renderCell = form => {
        this.form = form;
        const { children, dataIndex, record, title } = this.props;
        const { editing } = this.state;
        return editing ? (
            <Form.Item style={{ margin: 0 }}>
                {form.getFieldDecorator(dataIndex, {
                    rules: [
                        {
                            required: true,
                            message: `${title} is required.`,
                        },
                    ],
                    initialValue: record[dataIndex],
                })(
                    <Input
                        ref={node => (this.input = node)}
                        onPressEnter={this.save}
                        onBlur={this.save}
                    />
                )}
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{ paddingRight: 24 }}
                onClick={this.toggleEdit}
            >
                {children}
            </div>
        );
    };

    render() {
        const {
            editable,
            dataIndex,
            title,
            record,
            index,
            handleSave,
            children,
            ...restProps
        } = this.props;

        return (
            <td {...restProps}>
                {editable ? (
                    <EditableContext.Consumer>
                        {this.renderCell}
                    </EditableContext.Consumer>
                ) : (
                    children
                )}
            </td>
        );
    }
}

const { TabPane } = Tabs;
const operations = (
    <div>
        <Button>
            <Icon type="caret-right" />
        </Button>{' '}
        <Button>
            <Icon type="pause" />
        </Button>{' '}
        <Button>
            <Icon type="stop" />
        </Button>
    </div>
);
const operations2 = (
    <Button>
        <Icon type="stop" />
    </Button>
);

const { Option } = Select;
@connect(({ securitygroup }) => {
    return {
        securitygroup,
    };
})
@Form.create()
class SecurityGroupDetails extends React.Component {
    state = {
        editing: false,

        columns: [
            {
                title: 'Direction',
                dataIndex: 'direction',
                key: 'direction',
                width: 100,
            },
            {
                title: 'Ether Type',
                dataIndex: 'ethertype',
                key: 'ethertype',
                width: 100,
            },
            {
                title: 'IP Protocol',
                dataIndex: 'ipprotocol',
                key: 'ipprotocol',
                width: 100,
            },
            {
                title: 'Port Range',
                dataIndex: 'portrange',
                key: 'portrange',
                width: 100,
            },
            {
                title: 'Remote IP Prefix',
                dataIndex: 'remoteipprefix',
                key: 'remoteipprefix',
                width: 100,
            },
            {
                title: 'Actions',
                dataIndex: 'actions',
                key: 'actions',
                width: 100,
            },
        ],

        data: [],
    };

    deleteRule(value) {
        const values = {
            value: value,
            sgid: this.props.sgid,
        };
        this.props.dispatch({
            type: 'securitygroup/deleteRule',
            payload: values,
        });
    }

    createNewItem() {
        this.setState({ editable: !this.state.editable });
    }

    cancel() {
        this.setState({ editable: !this.state.editable });
    }

    render() {
        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell,
            },
        };

        const { getFieldDecorator } = this.props.form;

        const data = this.props.sgdetail.security_group_rules.map(listItem => {
            return {
                key: listItem['id'],
                id: listItem['id'],
                direction: listItem['direction'],
                ethertype: Object.keys(listItem).includes('ethertype')
                    ? listItem['ethertype']
                    : listItem['ether_type'],
                portrange:
                    listItem['port_range_min'] === null
                        ? 'Any'
                        : listItem['port_range_min'] ===
                          listItem['port_range_max']
                        ? listItem['port_range_min']
                        : listItem['port_range_min'] +
                          ' - ' +
                          listItem['port_range_max'],
                remoteipprefix:
                    listItem['remote_ip_prefix'] === null
                        ? '-'
                        : listItem['remote_ip_prefix'],
                ipprotocol:
                    listItem['protocol'] === null
                        ? 'Any'
                        : listItem['protocol'],
                actions: (
                    <>
                        <Popconfirm
                            title="Are you sure to delete this rule?"
                            onConfirm={() => this.deleteRule(listItem['id'])}
                            onCancel={e => e.stopPropagation()}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button
                                type="danger"
                                onClick={e => e.stopPropagation()}
                                size="small"
                                style={{
                                    marginRight: `20px`,
                                    height: `36px`,
                                    width: `86px`,
                                    fontFamily: `Open Sans`,
                                    fontWeight: `600`,
                                }}
                                loading={this.props.securitygroup.loading.includes(
                                    listItem['id']
                                )}
                            >
                                Delete
                            </Button>
                        </Popconfirm>
                    </>
                ),
            };
        });
        return (
            <div style={{ padding: `30px` ,cursor:'default'}}>
                <div style={{ marginBottom: `20px`, textAlign: `right` }}>
                    <Row>
                        <Col lg={12} push={9}>
                            <Button
                                type="primary"
                                style={{
                                    fontFamily: `Open Sans`,
                                    fontWeight: `600`,
                                }}
                                disabled={this.state.editable}
                                onClick={this.createNewItem.bind(this)}
                            >
                                Add Rule
                            </Button>
                        </Col>

                        <Col lg={12}>
                            {this.state.editable ? (
                                <div>
                                    {' '}
                                    <Button onClick={this.cancel.bind(this)}>
                                        Cancel
                                    </Button>{' '}
                                </div>
                            ) : null}
                        </Col>
                    </Row>

                    {this.state.editable && (
                        <AddRule
                            sgid={this.props.sgid}
                            style={{ display: 'flex', flexDirection: 'row' }}
                        />
                    )}
                </div>

                <Table
                    size="small"
                    components={components}
                    rowClassName={() => 'editable-row'}
                    {...this.state}
                    columns={this.state.columns}
                    dataSource={data}
                    pagination={false}
                />
            </div>
        );
    }
}

export default SecurityGroupDetails;
