import React, { Component } from 'react';
import {
    Row,
    Col,
    Typography,
    Form,
    Spin,
    Icon,
    Progress,
    Layout,
    Divider,
} from 'antd';
const { Header, Footer, Sider, Content } = Layout;
import { connect } from 'dva';

import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

class PricingStrip extends Component {
    render() {
        const { count } = this.props;
        return (
            <div>
                <Footer
                    style={{
                        position: 'fixed',
                        width: '75%',
                        height: '60px',
                        bottom: '20px',
                        marginLeft: '30px',
                        backgroundColor: '#e8eaed',
                    }}
                >
                    <Typography.Text style={{ color: 'black' }}>
                        <Typography.Text
                            style={{
                                color: 'black',
                                marginLeft: '5px',
                            }}
                        >
                            Price :
                        </Typography.Text>

                        <Typography.Text
                            style={{
                                paddingLeft: '10px',
                                color: 'black',
                            }}
                        >
                            {count *
                                parseFloat(
                                    this.props?.price?.flavor +
                                        this.props?.price?.volume
                                ).toFixed(2)}
                        </Typography.Text>

                        <Typography.Text
                            style={{ color: 'black', paddingLeft: '10px' }}
                        >
                            SAR
                            <Spin
                                style={{ paddingLeft: '5px' }}
                                spinning={
                                    this.props.fetchPrice === undefined
                                        ? false
                                        : this.props.fetchPrice
                                }
                                indicator={antIcon}
                            />
                        </Typography.Text>
                    </Typography.Text>
                </Footer>
            </div>
        );
    }
}

export default connect(({ price, loading, createECS }) => ({
    price,
    count: createECS.formsData.First.count.value,
    fetchPrice: loading.effects['price/pricingService'],
}))(PricingStrip);
