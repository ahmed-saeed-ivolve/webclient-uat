import React, { PureComponent } from 'react';
import { Button } from 'antd';
import ProviderButton from './ProviderButton';
import ProviderList from './ProviderList';


import { connect } from 'dva';
import style from './Provider.less';

class Provider extends PureComponent {
    render() {
        return (
            <div className={style[`provider-container`]}>
                <ProviderButton />
                <div style={{ margin: '40px 70px 0px 70px' }}>
                    <ProviderList />
                </div>
            </div>
        );
    }
}









export default Provider;
