import React from 'react';
import { Tabs, Button, Icon, Input, Card } from 'antd';

const { TabPane } = Tabs;
const { TextArea } = Input;
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

class KeypairDetails extends React.Component {
  state = {};
  render() {
    return this.props.publickey;
  }
}

export default KeypairDetails;
