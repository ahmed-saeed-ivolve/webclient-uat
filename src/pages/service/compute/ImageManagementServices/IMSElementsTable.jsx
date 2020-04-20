import React from 'react';
import {
    Table,
    Icon,
    Switch,
    Radio,
    Form,
    Divider,
    Menu,
    Dropdown,
    Tag,
    Button,
    Modal,
    Input,
    InputNumber,
} from 'antd';
import IMSDetails from './IMSDetails';
import styles from '../../ElementsTable.css';
import { connect } from 'dva';
import router from 'umi/router';

Icon.setTwoToneColor('#4c98bf');

class IMSElementsTable extends React.Component {
    constructor(props) {
        super(props);
        this.onRow = this.onRow.bind(this);
        this.onSelectClick = this.onSelectClick.bind(this);
        this.onSelectAll = this.onSelectAll.bind(this);
        this.showImageModal = this.showImageModal.bind(this);
        this.onChangeField = this.onChangeField.bind(this);
        this.onClickEditImage = this.onClickEditImage.bind(this);
        this.state = {
            bordered: false,

            rowSelection: {},
            scroll: undefined,
            size: 'default',
            selectedRowKeys: [],
            showModal: false,
            imageId: '',
            imageName: '',
            minimumDisk: '',

            menu: (
                <Menu>
                    <Menu.Item key="0">
                        <a>Start</a>
                    </Menu.Item>
                    <Menu.Item key="1">
                        <a>Stop</a>
                    </Menu.Item>
                    <Menu.Item key="2">Pause</Menu.Item>
                </Menu>
            ),

            columns: [
                {
                    title: 'Name',
                    dataIndex: 'name',
                    key: 'name',
                    width: 150,
                },
                {
                    title: 'Visibility',
                    dataIndex: 'visibility',
                    key: 'visibility',
                    width: 100,
                },

                {
                    title: 'Minimum disk',
                    dataIndex: 'minimumdisk',
                    key: 'minimumdisk',
                    width: 100,
                },

                {
                    title: 'Minimum RAM',
                    dataIndex: 'minimumram',
                    key: 'minimumram',
                    width: 100,
                },

                {
                    title: 'Actions',
                    dataIndex: 'actions',
                    key: 'actions',
                    width: 180,
                },
            ],

            data: [],
            hasData: true,
        };
    }
    displayImageData() {
        if (typeof this.props.imagesList !== 'undefined') {
            if (this.state.data.length !== 0) {
                this.setState({ data: [] });
            }

            for (var i = 0; i < this.props.imagesList['length']; i++) {
                var x = this.props.imagesList[i];

                this.state.data.push({
                    key: this.props.imagesList[i]['id'],
                    name: this.props.imagesList[i]['name'],
                    visibility: this.props.imagesList[i]['visibility'],
                    protected: this.props.imagesList[i]['is_protected'],
                    minimumdisk: this.props.imagesList[i]['min_disk'],
                    minimumram: this.props.imagesList[i]['min_ram'],
                    architecture: this.props.imagesList[i]['architecture'],

                    description: (
                        <IMSDetails
                            eachImageDetail={
                                this.props.imagesList[i]['description']
                            }
                        />
                    ),
                });
            }
        }
    }
    onSelectChange(selectedRowKeys) {
        this.setState(state => {
            return { ...state, selectedRowKeys };
        });
    }

    createNewItem(value) {
        this.props.dispatch({
            type: `evs/createVolumeFromImage`,
            payload: value,
        });
        router.push('../storage/elastic-volume-services/create');
    }

    editImage(value, imageName, minimumDisk) {
        this.setState({
            imageId: value,
        });
        this.props.form.setFieldsValue({
            imageName,
            minimumDisk,
        });
        this.showImageModal(true);
    }

    onChangeField(key, value) {
        this.setState({
            [key]: value,
        });
    }

    showImageModal(showModal) {
        this.setState({
            showModal,
        });
    }

    onClickEditImage = e => {
        e.preventDefault();
        const { imageId } = this.state;
        const name = this.props.form.getFieldValue('imageName');
        const minimumDisk = Number(
            this.props.form.getFieldValue('minimumDisk')
        );
        if (minimumDisk > -1 && name) {
            const payload = {
                id: imageId,
                min_disk: minimumDisk,
                name,
            };
            this.props.dispatch({
                type: 'ims/updateImage',
                payload,
            });
        }
    };

    componentDidUpdate(prevProps) {
        const { imagesList } = this.props;
        if (
            JSON.stringify(prevProps.imagesList) !== JSON.stringify(imagesList)
        ) {
            this.showImageModal(false);
        }
    }

    onRow(record, rowIndex) {
        const { dispatch } = this.props;
        return {
            onClick(e) {
                e.preventDefault();

                if (
                    e.target.innerHTML !== record.name &&
                    e.target.innerHTML !== record.actions
                ) {
                    dispatch({
                        type: 'ims/selectedRows',
                        payload: [
                            {
                                ...record,
                            },
                        ],
                    });
                } else {
                    router.push(
                        `image-management-services/show-image?image_id=${record.key}`
                    );
                }
            },
            onDoubleClick: event => {},
            onContextMenu: event => {},
            onMouseEnter: event => {},
            onMouseLeave: event => {},
        };
    }

    onSelectClick(record, state) {
        const { dispatch } = this.props;

        dispatch({
            type: 'ims/selectedRows',
            payload: [
                {
                    ...record,
                },
            ],
        });
    }

    onSelectAll(value, records) {
        const { dispatch } = this.props;

        dispatch({
            type: 'ims/sdAllRows',
            payload: {
                records,
                value,
            },
        });
    }

    render() {
        const { updatingImage, selectedRowKeys, imagesList, form } = this.props;
        const rowSelection = {
            selectedRowKeys,
            onSelect: this.onSelectClick,
            onSelectAll: this.onSelectAll,
            selections: imagesList.map(items =>
                items.visibility === 'public' ? false : true
            ),
        };

        const { showModal, columns, imageName, minimumDisk } = this.state;
        const { getFieldDecorator } = form;

        const data = imagesList.map(listItem => {
            return {
                key: listItem['id'],
                id: listItem['id'],
                name: listItem['name'],
                visibility: listItem['visibility'],

                minimumdisk: listItem['min_disk'] + ' GB',
                minimumram: listItem['min_ram'] + ' GB',

                actions: (
                    <div>
                        <Button
                            type="primary"
                            className={styles.rowButton}
                            onClick={() => this.createNewItem(listItem['id'])}
                        >
                            Create Volume
                        </Button>
                        <Button
                            type="primary"
                            className={styles.rowButton}
                            onClick={() =>
                                this.editImage(
                                    listItem['id'],
                                    listItem['name'],
                                    listItem['min_disk']
                                )
                            }
                        >
                            Edit Image
                        </Button>
                    </div>
                ),
                description: (
                    <IMSDetails eachImageDetail={listItem['description']} />
                ),
            };
        });

        return (
            <div>
                <Modal
                    title="Edit Image"
                    visible={showModal}
                    centered
                    onCancel={() => this.showImageModal(false)}
                    onOk={e => this.onClickEditImage(e)}
                    confirmLoading={updatingImage}
                >
                    <Form style={{ height: '180px' }}>
                        <Form.Item label="Image name">
                            {getFieldDecorator('imageName', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please enter image name',
                                    },
                                ],
                            })(
                                <Input
                                    name="imageName"
                                    placeholder="Image name"
                                />
                            )}
                        </Form.Item>

                        <Form.Item label="Minimum Disk Space">
                            {getFieldDecorator('minimumDisk', {
                                rules: [
                                    {
                                        required: true,
                                        pattern: /^[0-9]*$/,
                                        message:
                                            'Please enter minimum disk space',
                                    },
                                ],
                            })(
                                <InputNumber
                                    name="minimumDisk"
                                    min="0"
                                    max="500"
                                    style={{ width: '100%' }}
                                    placeholder="Image minimum disk space"
                                />
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
                <Table
                    size="small"
                    loading={this.props.loading}
                    columns={columns}
                    dataSource={data}
                    pagination={{ pageSize: 10 }}
                />
            </div>
        );
    }
}

export default connect(state => {
    return {
        imageList: state.ims,
        fetchingImageList: state.loading.effects['ims/fetchList'],
        updatingImage: state.loading.effects['ims/updateImage'],
    };
})(Form.create()(IMSElementsTable));
