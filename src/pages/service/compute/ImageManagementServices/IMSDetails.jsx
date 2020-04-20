import React from 'react';
import { Tabs, Button, Icon, Typography, Card, Descriptions, Tag } from 'antd';
import { connect } from 'dva';
import { throwStatement } from '@babel/types';

const { TabPane } = Tabs;

class IMSDetails extends React.Component {
    constructor() {
        super();
        this.state = {
            currentImage: [],
        };
    }

    changeDetailsTab(clickedTab) {
        const { key } = clickedTab;

        const { instance_id } = this.props.location.query;
    }

    componentDidMount() {
        const currentImage = this.props.imageList.list.filter(
            item => item.id === this.props.location.query.image_id
        );
        this.setState({ currentImage: currentImage });
    }

    render() {
        return (
            <div type="card">
                {this.state.currentImage.map(obj => {
                    return (
                        <div>
                            <h2 style={{ padding: '20px' }}> IMS Details </h2>
                            <Card
                                style={{
                                    width: 500,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginLeft: '10em',
                                }}
                            >
                                <Descriptions>
                                    <Descriptions.Item label="Id" span={3}>
                                        {' '}
                                        <Tag blue> {obj.id} </Tag>{' '}
                                    </Descriptions.Item>
                                    <Descriptions.Item
                                        label="Image name"
                                        span={3}
                                    >
                                        {obj.name}{' '}
                                    </Descriptions.Item>
                                    <Descriptions.Item
                                        label="Updated At"
                                        span={3}
                                    >
                                        {obj.updated_at}
                                    </Descriptions.Item>
                                    <Descriptions.Item
                                        label="Disk Format"
                                        span={3}
                                    >
                                        {' '}
                                        {obj.disk_format}{' '}
                                    </Descriptions.Item>
                                </Descriptions>
                            </Card>
                        </div>
                    );
                })}
            </div>
        );
    }
}

export default connect(state => {
    return {
        imageList: state.ims,
        fetchingImageList: state.loading.effects['ims/fetchList'],
    };
})(IMSDetails);
