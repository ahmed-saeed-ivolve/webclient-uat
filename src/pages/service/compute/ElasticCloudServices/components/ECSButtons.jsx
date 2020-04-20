import React from 'react';
import { Button } from 'antd';
import { router } from 'umi'

class ECSButtons extends React.Component {


  render() {
    return (
      <>

        <Button
          type="primary"
          style={{

            height: `43px`,
            width: `160px`,
            fontFamily: `Open Sans`,
            fontWeight: `600`,
          }}
          onClick={() => {
            router.push('/service/compute/elastic-cloud-services/create')
          }}
        >
          Create
        </Button>
        <Button
        type='danger'
          style={{

            marginRight: `20px`,
            height: `43px`,
            width: `125px`,
            fontFamily: `Open Sans`,
            fontWeight: `600`,
          }}
        >
          Delete
        </Button>


      </>
    );
  }
}

export default ECSButtons;
