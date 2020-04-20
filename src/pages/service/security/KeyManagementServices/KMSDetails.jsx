import React from 'react';
import {
    Tabs,
    Button,
    Icon,
    Form,
    Row,
    Col,
    Select,
    Input,
    Typography,
    Table,
    Descriptions,
    Badge,
    Divider,
    Menu,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { getPageQuery } from '@/utils/utils';
import { router } from 'umi';
import { symbol } from 'prop-types';
import { Skeleton } from 'antd';
import Encryption from './components/Encryption';
import Decryption from './components/Decryption';

const { TabPane } = Tabs;

const ecsComponentsDetails = {
    encrypt: Encryption,
    decrypt: Decryption,
};

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

const operations2 = <Icon type="stop" />;

@Form.create()
class KMSDetails extends React.PureComponent {
    constructor(props) {
        super(props);
        this.changeDetailsTab = this.changeDetailsTab.bind(this);
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                var payload = {};
                const { keys, names } = values;
            }
        });
    };

    componentDidMount() {
        const { dispatch } = this.props;

        const id = getPageQuery()?.key_id;
        if (id) {
            dispatch({
                type: 'kms/showCurrentKMS',
                payload: {
                    id,
                },
            });
        } else {
            router.replace('/service/security/key-management-services');
        }
    }

    componentWillUnmount() {
        this.props.dispatch({
            type: 'kms/removeCurrentShowKMS',
        });
    }

    changeDetailsTab(clickedTab) {
        const { key } = clickedTab;
        const { key_id } = this.props.location.query;
        router.push(
            `/service/security/key-management-services/show-key?tab=${key}&key_id=${key_id}`
        );
    }

    render() {
        const currentTabValue = getPageQuery()?.tab || 'encrypt';

        const CurrentTabComponent = ecsComponentsDetails[currentTabValue];

        return (
            <div
                style={{ height: `100%`, display: `flex`, flexFlow: `column` }}
            >
                <div style={{ position: `sticky`, top: `0` }}>
                    <Row>
                        <Col span={19}>
                            <Menu
                                style={{ padding: `0px 34px`, border: 0 }}
                                onClick={this.changeDetailsTab}
                                selectedKeys={[currentTabValue]}
                                mode="horizontal"
                            >
                                <Menu.Item key="encrypt">
                                    <Icon type="mail" />
                                    Encrypt
                                </Menu.Item>

                                <Menu.Item key="decrypt">
                                    <Icon type="appstore" />
                                    Decrypt
                                </Menu.Item>
                            </Menu>
                        </Col>
                        <Col span={5}></Col>
                    </Row>
                    <div
                        style={{
                            padding: `34px`,
                            height: `100%`,
                            borderTop: `1px solid #e5e5e5`,
                        }}
                    >
                        {this.props.currentKMS ? (
                            ecsComponentsDetails[currentTabValue] ? (
                                <CurrentTabComponent
                                    currentKMS={this.props.currentKMS}
                                />
                            ) : null
                        ) : (
                            <Skeleton active />
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(({ kms, loading }) => {
    return {
        fetchingCurrentNetwork: loading.effects['kms/showCurrentKMS'],
        currentKMS: kms.selectedKMS,
    };
})(KMSDetails);
