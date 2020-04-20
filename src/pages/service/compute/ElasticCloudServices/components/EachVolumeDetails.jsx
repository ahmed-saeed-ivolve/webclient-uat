import React from 'react'
import { Icon, Row, Col, Spin } from 'antd';



export default class EachVolumeDetails extends React.PureComponent {
    state = {
        foundVolume : false
    }
    componentDidMount() {

       
       
       
       
       
       
       



    }


    render() {
        const {list, id} = this.props;
    
        if(list.length > 0) {
            const found = list.find(volume => {
                return volume.id === id;
            })

            return (
               
                    <p>found</p>
               
            )
        }

        return (
           
                <p>asdasdasd</p>
           
        )
       
    }
}