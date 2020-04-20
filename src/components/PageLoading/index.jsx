import React from 'react';
import { Spin, Icon } from 'antd';
import logo from '../../../public/favicon.png';
import cloud7logo from '../../../public/faviconcloud7.png';
import styles from '../../pages/dashboard/analysis/style.less';

const antIcon = <Icon type="loading" style={{ fontSize: 50 }} spin />;
let finalLogo = '';

if (CLOUDFOR === 'detasad') {
    finalLogo = logo;
} else if (CLOUDFOR === 'cloud7') {
    finalLogo = cloud7logo;
}

const PageLoading = () => (
    <div
        style={{
            marginTop: '100px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        }}
    >
        <img
            alt="loader"
            className={styles['bounce']}
            src={finalLogo}
            style={{ borderRadius: '50%', height: '55px', border: '0px' }}
        />
    </div>
);

export default PageLoading;
