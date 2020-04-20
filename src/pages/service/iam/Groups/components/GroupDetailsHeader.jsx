import React, { PureComponent } from 'react'
import { PageHeader, Icon, Row, Col, Skeleton } from 'antd'
import { routerRedux } from 'dva/router'
import { getPageQuery } from '@/utils/utils'


export default class GroupDetailsHeader extends PureComponent {

    render() {
       
       
       
        const currentGroup = this.props.groups.currentGroup;


        if (!currentGroup) {
            return <Row><Col span={6}><Skeleton active /></Col></Row>
        }

        return (
            <PageHeader
                backIcon={<Icon type="arrow-left" />}
                onBack={() => {

                    this.props.dispatch(routerRedux.replace('/service/iam/groups'))

                }}
               
                style={{ padding: `0px` }}
                title={currentGroup.name}
                subTitle="Groups"
           
           
           
           

           
           
           
           
           
           
           
           
           
           
           
           

           
           

           
           
           
           
           
           
           
           
           

           
           
           
           
           
           
           
           
           
            >

            </PageHeader>
        )
    }
}
