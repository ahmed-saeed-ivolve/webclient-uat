import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import { Input, Tooltip, Button, Icon, notification } from 'antd';
import Tachyons from 'tachyons';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Link } from 'umi';

class NumericInput extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: '',
            login_loading: false,
        };
        this.mfaLoginClick = this.mfaLoginClick.bind(this);
    }

    componentDidMount() {
        const userDetails = JSON.parse(localStorage.getItem('user'));
        if (userDetails !== null) {
            window.location.assign('/');
        }
    }

    onChange = e => {
        const { value } = e.target;
        const reg = /^-?[0-9]*([0-9]*)?$/;
        if (
            (!isNaN(value) && reg.test(value)) ||
            value === '' ||
            value === '-'
        ) {
            this.props.onChange(value);
        }

        this.setState({ value });
    };

    async mfaLoginClick() {
        this.setState({ login_loading: true });
        const { value } = this.state;
        if (
            value &&
            this.props.state.userAccount.mfa_data['Openstack-Auth-Reciept']
        ) {
            this.props.dispatch({
                type: 'userAccount/mfaPasscodeAuth',
                payload: {
                    Openstack_Auth_Reciept: this.props.state.userAccount
                        .mfa_data['Openstack-Auth-Reciept'],
                    passcode: value,
                    user_id: this.props.state.userAccount.mfa_data['user_id'],
                },
            });
        } else {
            notification.error({
                message: `Something went wrong.`,
                description: `Either your input field is empty or session has expired. Please log in again.`,
            });
            this.setState({ login_loading: false });
        }
    }
    onEnter(e) {
        e.which === 13 ? this.mfaLoginClick() : null;
    }
    render() {
        const { value } = this.props;

        return (
            <div
                className="tc"
                style={{
                    marginTop: '20%',

                    width: 400,
                    float: 'none',
                    margin: '0 auto',
                    display: 'block',
                }}
            >
                <h3 className="tc mb4">
                    Enter the 6 digit code from your
                    <br />
                    Google authenticator (or similar app)
                </h3>
                <Tooltip
                    trigger={['focus']}
                    placement="topLeft"
                    overlayClassName="numeric-input"
                >
                    <Input
                        tabIndex={0}
                        style={{
                            width: '100vh',
                            height: '40px',
                            fontSize: '16px',
                        }}
                        {...this.props}
                        onChange={this.onChange}
                        onKeyPress={this.onEnter.bind(this)}
                        placeholder="Enter the 6 Digit code"
                        maxLength={6}
                    />

                    <Button
                        className="tc"
                        style={{ width: 380, marginTop: 20 }}
                        type="primary"
                        loading={
                            this.props.loading.effects[
                                'userAccount/mfaPasscodeAuth'
                            ]
                        }
                        onClick={this.mfaLoginClick}
                    >
                        Login
                    </Button>

                    <Button
                        className="tc"
                        style={{ width: 380, marginTop: 20 }}
                        type="primary"
                    >
                        <Link to="/login">Back</Link>
                    </Button>
                    <p style={{ marginTop: 5 }}>
                        Note: If you are seeing this screen despite of disabling
                        multi factor authentication then contact admin to turn
                        off multi factor authentication for you.
                    </p>
                </Tooltip>
            </div>
        );
    }
}

export default connect(state => {
    const { loading } = state;
    return {
        state,
        loading,
    };
})(NumericInput);
