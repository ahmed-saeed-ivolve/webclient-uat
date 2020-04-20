import { Tree } from 'antd';
import {PureComponent} from "react";
const { TreeNode } = Tree;

class RDFTree extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            date:null,
            rating:[],
        };
      }
    onSelect = (selectedKeys, info) => {
      
    };
  
    onCheck = (checkedKeys, info) => {
      
    };
  
    render() {
      return (
        <Tree defaultExpandedKeys={["@"]}
        >

               {    this.props.dataSource.map((x)=>{
                         return (<TreeNode title={x["service"]}>
                             <TreeNode key="0" title={"volume: "+x["volume"]}/>
                             <TreeNode key="1" title={"rating: "+x["rating"]}/>
                             <TreeNode key="2" title={"service: "+x["service"]}/>
                             <TreeNode key="3" title={"desc"}>
                                <TreeNode key="0" title={"state: " + x["desc"]["state"]} />
                                <TreeNode key="1" title={"id:" + x["desc"]["id"]} />
                                <TreeNode key="2" title={"project_id: " + x["desc"]["project_id"]} />
                             </TreeNode>
                           </TreeNode>)
                    }) }
        </Tree>
      );
    }
  }
  export default RDFTree;