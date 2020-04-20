import { Alert, Checkbox, Icon } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { Component } from 'react';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import Link from 'umi/link';
import { connect } from 'dva';
import { StateType } from '../../../models/model';
import LoginComponents from './components/Login';
import styles from './style.less';

const {
    Tab,
    Username,
    Password,
    Mobile,
    Captcha,
    Submit,
    Organization,
} = LoginComponents;

interface AccountProps {
    dispatch: Dispatch<any>;
    userAccount: StateType;
    submitting: boolean;
}

interface AccountState {
    type: string;
    autoLogin: boolean;
}

export interface FormDataType {
    Username: string;
    password: string;
    mobile: string;
    captcha: string;
}

export interface OpenstackAuth {
    organization: string;
    password: string;
    username: string;
}
export interface MfaPasscodeAuth {
    user_id: string;
    passcode: string;
    Openstack_Auth_Reciept: string;
}

@connect(
    ({
        userAccount,
        loading,
    }: {
        userAccount: StateType;
        loading: {
            effects: {
                [key: string]: string;
            };
        };
    }) => ({
        userAccount,
        submitting: loading.effects['userAccount/loginOpenstack'],
    })
)
class Account extends Component<AccountProps, AccountState> {
    loginForm: FormComponentProps['form'] | undefined | null = undefined;

    state: AccountState = {
        type: 'account',
        autoLogin: true,
    };

    changeAutoLogin = (e: CheckboxChangeEvent) => {
        this.setState({
            autoLogin: e.target.checked,
        });
    };

    handleSubmit = (err: any, values: OpenstackAuth) => {
        if (!err) {
            const { dispatch } = this.props;
            dispatch({
                type: 'userAccount/loginOpenstack',
                payload: {
                    ...values,
                },
            });
        }
    };

    onTabChange = (type: string) => {
        this.setState({ type });
    };

    onGetCaptcha = () =>
        new Promise((resolve, reject) => {
            if (!this.loginForm) {
                return;
            }
            this.loginForm.validateFields(
                ['mobile'],
                {},
                (err: any, values: OpenstackAuth) => {
                    if (err) {
                        reject(err);
                    } else {
                        const { dispatch } = this.props;
                        ((dispatch({
                            type: 'userAccount/getCaptcha',
                            payload: values.mobile,
                        }) as unknown) as Promise<any>)
                            .then(resolve)
                            .catch(reject);
                    }
                }
            );
        });

    renderMessage = (content: string) => (
        <Alert
            style={{ marginBottom: 24 }}
            message={content}
            type="error"
            showIcon
        />
    );

    render() {
        const { userAccount, submitting } = this.props;
        const { status, type: loginType } = userAccount;
        const { type, autoLogin } = this.state;
        return (
            <div className={styles.main}>
                <LoginComponents
                    defaultActiveKey={type}
                    onTabChange={this.onTabChange}
                    onSubmit={this.handleSubmit}
                    ref={(form: any) => {
                        this.loginForm = form;
                    }}
                >
                    <div
                        key="account"
                        tab={formatMessage({
                            id: 'user-account.login.tab-login-credentials',
                        })}
                    >
                        {status === 'error' &&
                            loginType === 'account' &&
                            !submitting &&
                            this.renderMessage(
                                formatMessage({
                                    id:
                                        'user-account.login.message-invalid-credentials',
                                })
                            )}
                        {/* <Organization
              name="organization"
              placeholder={`Organization`}
              onPressEnter={e => {
                e.preventDefault();
                this.loginForm.validateFields(this.handleSubmit);
              }}
              rules={[
                {
                  required: true,
                  message: 'Please Enter Your Organization',
                },
              ]}
            /> */}
                        <Username
                            name="username"
                            placeholder={'Username'}
                            onPressEnter={e => {
                                e.preventDefault();
                                this.loginForm.validateFields(
                                    this.handleSubmit
                                );
                            }}
                            rules={[
                                {
                                    required: true,
                                    message: formatMessage({
                                        id: 'user-account.userName.required',
                                    }),
                                },
                            ]}
                        />
                        <Password
                            name="password"
                            placeholder={'Password'}
                            onPressEnter={e => {
                                e.preventDefault();
                                this.loginForm.validateFields(
                                    this.handleSubmit
                                );
                            }}
                        />
                    </div>

                    <Submit loading={submitting}>
                        <FormattedMessage id="user-account.login.login" />
                    </Submit>
                </LoginComponents>
            </div>
        );
    }
}

export default Account;
