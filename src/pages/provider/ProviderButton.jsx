import React from 'react';
import { Button } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
import { Redirect } from 'umi';

class ProviderButton extends React.Component {
    state = {};

   
    
   
   
   
   

   

    createNewItem() {
       
        router.push('provider/create');
    }
    render() {
        return (
            <div style={{ marginBottom: `20px`, textAlign: `right` }}>
                <Button
                    type="primary"
                    style={{
                        marginRight: `70px`,
                        marginTop: '32px',
                        height: `45px`,
                        width: `180px`,
                        fontFamily: `Open Sans`,
                        fontWeight: `600`,
                        fontSize: `20px`,
                    }}
                    onClick={this.createNewItem.bind(this)}
                >
                    Add Provider
        </Button>
            </div>
        );
    }
}


export default ProviderButton;
