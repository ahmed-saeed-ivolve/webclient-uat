import React from 'react';
import LogoHolder from '../DetasadLogoHolder/DetasadLogoHolder';
import styles from './DetasadLeftContent.less';
import { Input, Icon, Tooltip } from 'antd';

const DetasadLeftContent = ({ children }) => {
    return (
        <div className={styles['ds-gh-left-content']}>
            <LogoHolder
                style={{
                    marginLeft: '30px',
                    marginRight: '139px',
                    lineHeight: '58px',
                }}
                width={CLOUDFOR === 'detasad' ? 100 : 100}
            />
            {children}
        </div>
    );
};

export default DetasadLeftContent;
