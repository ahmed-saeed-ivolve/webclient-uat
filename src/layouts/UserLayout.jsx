import {
    DefaultFooter,
    getMenuData,
    getPageTitle,
} from '@ant-design/pro-layout';
import DocumentTitle from 'react-document-title';
import Link from 'umi/link';
import React from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import SelectLang from '@/components/SelectLang';
import logo from '../assets/detasad.png';
import cloud7logo from '../assets/cloud7.png';

import styles from './UserLayout.less';

const UserLayout = props => {
    const {
        route = {
            routes: [],
        },
    } = props;

    const { routes = [] } = route;

    const {
        children,
        location = {
            pathname: '',
        },
    } = props;

    const { breadcrumb } = getMenuData(routes);
    let finalLogo = '';
    if (CLOUDFOR === 'detasad') {
        finalLogo = logo;
    } else if (CLOUDFOR === 'cloud7') {
        finalLogo = cloud7logo;
    }
    return (
        <DocumentTitle
            title={getPageTitle({
                pathname: location.pathname,
                breadcrumb,
                formatMessage,
                ...props,
            })}
        >
            <div className={styles.container}>
                <div className={styles.lang}>
                    <SelectLang />
                </div>
                <div className={styles.content}>
                    <div className={styles.top}>
                        <div className={styles.header}>
                            <Link to="/">
                                <img
                                    alt="logo"
                                    className={styles.logo}
                                    src={finalLogo}
                                />
                            </Link>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </DocumentTitle>
    );
};

export default connect(({ settings }) => ({ ...settings }))(UserLayout);
