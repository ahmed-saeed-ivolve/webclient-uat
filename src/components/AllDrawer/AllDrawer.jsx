import { Drawer, Button, Col, Row, Input, Select, DatePicker, Icon, Typography } from 'antd';

const { Option } = Select;

class AllDrawer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Drawer
        title={this.props.name}
        width={this.props.width}
        onClose={this.props.onClose}
        placement="right"
        visible={this.props.show}
        closable={true}
      >
        {this.props.children}
      </Drawer>
    );
  }
}

export default AllDrawer;
