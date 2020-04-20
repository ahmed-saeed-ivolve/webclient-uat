import React from 'react';
import { Tabs, Button, Icon } from 'antd';

const { TabPane } = Tabs;
const operations = (
  <div>
    <Button>
      <Icon type="caret-right" />
    </Button>{' '}
    <Button>
      <Icon type="pause" />
    </Button>{' '}
    <Button>
      <Icon type="stop" />
    </Button>
  </div>
);
const operations2 = (
  <Button>
    <Icon type="stop" />
  </Button>
);

class EVSDetails extends React.Component {
  componentWillMount() {}

  state = {};
  render() {
    return <Tabs type="card">evs details</Tabs>;
  }
}

export default EVSDetails;
