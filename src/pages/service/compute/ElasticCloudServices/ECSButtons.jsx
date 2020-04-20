import React from 'react';
import { Button } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';

class ECSButtons extends React.Component {
  createNewItem() {
   
    router.push('elastic-cloud-services/create');
  }

  deleteResource() {
   
   
    
    
   
   
    
   
   

   
   
    const value = this.props.ecsList.list.reduce(
      (acc, item) =>
        this.props.selectedRowKeys.includes(item.id)
          ? { ...acc, id: [...acc.id, item.id], name: [...acc.name, item.name] }
          : { ...acc },
      { id: [], name: [] },
    );
    
     

      
   
   
   
   
  }

  render() {
    return (
      <div style={{ }}>
     
        <Button
          type="danger"
          style={{
            marginRight: `20px`,
            height: `45px`,
            width: `125px`,
            fontFamily: `Open Sans`,
            fontWeight: `600`,
          }}
          onClick={this.deleteResource.bind(this)}
        >
          Delete
        </Button>
        <Button
          type="primary"
          style={{
           
            height: `45px`,
            width: `125px`,
            fontFamily: `Open Sans`,
            fontWeight: `600`,
          }}
          onClick={this.createNewItem.bind(this)}
         
        >
          Create
        </Button>
      </div>
    );
  }
}

export default connect(({ ecs }) => {
  return {
    ecsList: { ...ecs },
   
  };
})(ECSButtons);
