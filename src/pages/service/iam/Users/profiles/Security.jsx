import React, { Component } from 'react';
import { Button, Modal, Typography, Popconfirm } from 'antd';
import { RedoOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import { Collapse } from 'antd';
import ChangePassword from '@/pages/user/account/components/changepassword/ChangePassword';
import WrapContext from '@/pages/user/account/components/Login/LoginTab';
const { Panel } = Collapse;
const { Paragraph } = Typography;

const QRCode = require('qrcode.react');
class Security extends Component {
    constructor() {
        super();
        const roles = JSON.parse(localStorage.getItem('user')).roles;

        if (roles === undefined) {
            localStorage.clear();
            window.location.assign('/');
        }

        const check = roles.find(role => role.name === 'admin');
        this.state = {
            title: 'Not Authorized',
            MFAModalActive: false,
            mfa_loading: false,
            isAdmin: check === undefined ? false : true,
        };
    }

    componentDidMount() {
        const userDetails = JSON.parse(localStorage.getItem('user'));
        this.props.dispatch({
            type: 'users/getCredentials',
            payload: {
                user_id: userDetails.user.id,
            },
        });
    }
    componentDidUpdate(prevProps) {
        const { credentials } = this.props;

        if (prevProps.credentials !== credentials) {
            const title =
                credentials.length === 0
                    ? 'Generate QR credential'
                    : 'Delete QR credential';
            this.setState({
                title,
                MFAModalActive: title === 'Delete QR credential',
            });
        }
    }
    showMFAModalState() {
        this.setState({
            MFAModalActive: true,
        });
    }

    refreshQR() {
        const userDetails = JSON.parse(localStorage.getItem('user'));

        this.props.dispatch({
            type: 'users/refreshQR',
            payload: {
                user_id: userDetails.user.id,
                user_name: userDetails.user.name,
            },
        });
    }

    confirmMFA() {
        const userDetails = JSON.parse(localStorage.getItem('user'));

        let action = 'disable';
        let MFAModalActive = false;
        let title = 'Generate QR credential';
        let method = 'IAM.disable_mfa_and_clear_credentials';

        if (this.state.title === 'Generate QR credential') {
            action = 'enable';
            method = 'IAM.enable_mfa_and_add_rules';
            MFAModalActive = true;
            title = 'Delete QR credential';
        }

        this.props.dispatch({
            type: 'users/mfa_enable_or_disable',
            payload: {
                user_id: userDetails.user.id,
                user_name: userDetails.user.name,
                action,
                method,
            },
        });
        this.setState({ MFAModalActive, title });
    }
    enableMFAModal() {
        return (
            <div>
                <Button
                    loading={
                        this.props.loading.effects[
                            'users/mfa_enable_or_disable'
                        ]
                    }
                    onClick={this.confirmMFA.bind(this)}
                    disabled={this.state.title === 'Not Authorized'}
                    className="enableDisable"
                    type="primary"
                >
                    {this.state.title}
                </Button>
                {this.state.MFAModalActive ? (
                    <div>
                        <div style={{ width: `65%`, float: `left` }}>
                            <Typography.Title
                                level={4}
                                style={{
                                    marginTop: 20,
                                    display: 'inline-block',
                                }}
                            >
                                Steps to follow:
                            </Typography.Title>
                            <ul style={{ listStyleType: 'disc' }}>
                                <li>
                                    {`Scan this QR code from your Google Authenticator to
                            get the 6-digit code.`}
                                </li>

                                {this.state.isAdmin ? (
                                    ``
                                ) : (
                                    <li>{`
                        Multi factor authentication is enabled by default for each user.If you are unable to use the totp authentication method kindly contact administrator to enable multi factor authentication for this account.`}</li>
                                )}
                                {this.state.isAdmin ? (
                                    <li>{`
                            This operation also enables or disables Multi factor authentication for
                            users bearing admin role.`}</li>
                                ) : (
                                    ``
                                )}
                            </ul>
                        </div>
                        <div
                            style={{ display: 'inline-block', float: 'right' }}
                        >
                            <QRCode
                                style={{
                                    width: 200,
                                    height: 200,
                                    marginRight: '37px',
                                }}
                                value={this.props.uri}
                            />

                            <Button
                                type="primary"
                                loading={
                                    this.props.loading.effects[
                                        'users/refreshQR'
                                    ]
                                }
                                style={{
                                    marginTop: 20,
                                    paddingRight: 73,
                                    paddingLeft: 76,
                                    marginBottom: 10,
                                }}
                                onClick={this.refreshQR.bind(this)}
                            >
                                Refresh
                            </Button>
                        </div>
                    </div>
                ) : null}
            </div>
        );
    }
    render() {
        const { Disable } = this.state;

        return (
            <div>
                <div>
                    <ChangePassword />
                </div>
                <div>
                    <Collapse>
                        <Panel header="Multi Factor Authentication" key="1">
                            {this.enableMFAModal()}
                        </Panel>
                    </Collapse>
                </div>
            </div>
        );
    }
}
const mapStateToProps = (state, ownProps) => {
    const { loading, users } = state;
    const { uri, credentials } = users;

    return {
        uri,
        credentials,
        loading,
    };
};
export default connect(mapStateToProps)(Security);
