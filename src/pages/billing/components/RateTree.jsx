import { Tree } from 'antd';
import { PureComponent } from 'react';
const { TreeNode } = Tree;

class RTree extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      date: null,
      rating: [],
    };
  }
  onSelect = (selectedKeys, info) => {};

  onCheck = (checkedKeys, info) => {};

  render() {
    return (
      <Tree defaultExpandedKeys={['@']}>
        <TreeNode key="0" title={'name: ' + this.props.rating['name']} />
        <TreeNode key="1" title={'service_id: ' + this.props.rating['service_id']} />
        <TreeNode key="2" title={'fields'}>
          {this.props.rating['fields'].map(x => {
            return (
              <TreeNode title={x['name']}>
                <TreeNode key="0" title={'field_id: ' + x['field_id']} />
                <TreeNode key="1" title={'name: ' + x['name']} />
                <TreeNode key="2" title={'service_id: ' + x['service_id']} />
                <TreeNode key="3" title={'field_mappings'}>
                  {x['mappings'].map(y => {
                    return (
                      <TreeNode title="" key="@">
                        <TreeNode key="0" title={'mapping_id: ' + y['mapping_id']} />
                        <TreeNode key="1" title={'cost:' + y['cost']} />
                        <TreeNode key="2" title={'type: ' + y['type']} />
                      </TreeNode>
                    );
                  })}
                </TreeNode>
              </TreeNode>
            );
          })}
        </TreeNode>
        <TreeNode title={'service_mappings'}>
          {this.props.rating['mappings'].map(x => {
            return (
              <TreeNode title="" key="@">
                <TreeNode key="0" title={'mapping_id: ' + x['mapping_id']} />
                <TreeNode key="1" title={'cost:' + x['cost']} />
                <TreeNode key="2" title={'type: ' + x['type']} />
              </TreeNode>
            );
          })}
        </TreeNode>
      </Tree>
    );
  }
}
export default RTree;
