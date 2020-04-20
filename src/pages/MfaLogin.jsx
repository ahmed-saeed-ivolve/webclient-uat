import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import { Input, Tooltip, Button, Icon } from 'antd';
import Tachyons from 'tachyons';
import { connect } from 'dva';
import NumericInput from './mfaNumericInput.jsx';
import { Link } from 'umi';

class MfaLogin extends React.Component {
    constructor(props) {
        super(props);
        this.state = { value: '' };
    }

    onChange = e => {
        this.setState({ value: e });
    };

    render() {
        return (
            <div
                style={{ margin: '230px auto' }}
                prefix={
                    <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
            >
                <NumericInput
                    style={{ width: 380 }}
                    value={this.state.value}
                    onChange={this.onChange.bind(this)}
                    props={this.state}
                />
            </div>
        );
    }
}

export default connect(state => {
    return {
        state,
    };
})(MfaLogin);
