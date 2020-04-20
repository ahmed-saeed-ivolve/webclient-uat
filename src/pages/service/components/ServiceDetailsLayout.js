import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { router } from 'umi';
import { Link } from 'react-router-dom';
import { Layout, Menu, Icon, Typography, Divider, Button } from 'antd';
import services from '@/utils/servicesMarkup';
import PageHeader from './PageHeader';
import ServiceStatsHeader from '@/components/ServiceStatsHeader';
import { throwStatement } from '@babel/types';

const { Header, Sider, Content } = Layout;

class ServicesDetailsLayout extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <React.Fragment>
                <div
                    style={{
                        padding: `34px`,
                        background: `#fff`,
                        borderBottom: `1px solid #e5e5e5`,
                    }}
                >
                    <PageHeader {...this.props} />
                </div>

                <div
                    style={{
                        flexGrow: `2`,
                        background: `#fff`,
                        overflowY: `auto`,
                    }}
                >
                    {React.cloneElement(this.props.children)}
                </div>
            </React.Fragment>
        );
    }
}

export default ServicesDetailsLayout;
