import React, { useState, useEffect, use } from 'react';
import { Link } from 'umi';
import { Row, Col, Menu, Icon, Card, Typography } from 'antd';
import styles from './ServicesMenu.less';
import servicesMarkup from '@/utils/servicesMarkup';
import { router } from 'umi';
import OutSideClickListener from '@/components/OutSideClickListener';
import { getScope, checkAdminScope } from '@/utils/utils';

const checkProjectScope = serviceKey => {
    if (
        !checkAdminScope() &&
        (serviceKey === 'Projects' ||
            serviceKey === 'Groups' ||
            serviceKey === 'Users' ||
            serviceKey === 'Flavors Pricing')
    ) {
        return false;
    }
    return true;
};

const ServicesMenu = props => {
    const [category, setCategory] = useState('Compute');

    const servicesSideMenu = () =>
        Object.keys(servicesMarkup.categories).map(key => {
            if (!checkAdminScope() && key === 'Settings') {
                return null;
            } else {
                return (
                    <Menu.Item
                        disabled={
                            servicesMarkup.categories[key]?.enabled === false
                                ? true
                                : false
                        }
                        key={key}
                    >
                        <Icon type={servicesMarkup.categories[key].icon} />{' '}
                        <span>{key}</span>
                    </Menu.Item>
                );
            }
        });

    const handleCategoryClick = selected => {
        setCategory(selected.key);
    };

    const getServices = () => {
        return Object.keys(servicesMarkup.categories[category].service).map(
            serviceKey => {
                if(serviceKey === "Key Management Service (KMS)"){
                    return(
                   
                    <div key={serviceKey} className={styles['service-card']}>
                    <span
                        style={{ color: '#3c7b96' ,cursor: 'not-allowed'}}
                    >   
                        {checkProjectScope(serviceKey) ? serviceKey : null}
                    </span>
                    <p>
                        {checkProjectScope(serviceKey)
                            ? servicesMarkup.categories[category].service[
                                  serviceKey
                              ].description
                            : null}
                    </p>
                </div>
                    );
                }
                return (
                    <div key={serviceKey} className={styles['service-card']}>
                        <span
                            style={{ color: '#3c7b96' }}
                            onClick={() => {
                                props.onItemClicked(false);
                                router.push(
                                    servicesMarkup.categories[category].service[
                                        serviceKey
                                    ].link
                                );
                            }}
                        >
                            {checkProjectScope(serviceKey) ? serviceKey : null}
                        </span>
                        <p>
                            {checkProjectScope(serviceKey)
                                ? servicesMarkup.categories[category].service[
                                      serviceKey
                                  ].description
                                : null}
                        </p>
                    </div>
                );
            
            }
        );
    };
    return (
        <div className={styles['services-dropdown-content']}>
            <Row>
                <Col style={{ backgroundColor: 'gray' }} span={24}>
                    <Row
                        type={'flex'}
                        style={{ backgroundColor: 'white', minWidth: '300px' }}
                    >
                        <Col
                            xxl={8}
                            xl={8}
                            lg={8}
                            md={8}
                            sm={12}
                            xs={12}
                            className={styles['category-container']}
                        >
                            <div className={styles['category-content']}>
                                <Menu
                                    onClick={handleCategoryClick}
                                    defaultSelectedKeys={['Compute']}
                                    theme="dark"
                                    mode="vertical-right"
                                    className={styles['category-menu']}
                                >
                                    {servicesSideMenu()}
                                </Menu>
                            </div>
                        </Col>
                        <Col xxl={8} xl={8} lg={8} md={8} sm={12} xs={12}>
                            <div className={styles['service-card-container']}>
                                <div>
                                    <Typography.Title
                                        style={{ marginBottom: '25px' }}
                                        level={4}
                                    >
                                        {category}
                                    </Typography.Title>
                                </div>
                                {getServices()}
                            </div>
                        </Col>

                        <Col xxl={8} xl={8} lg={8} md={8} sm={0} xs={0}></Col>
                    </Row>
                </Col>
            </Row>
        </div>
    );
};

export default ServicesMenu;
