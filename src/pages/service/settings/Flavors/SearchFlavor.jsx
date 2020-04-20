import React, { Component } from 'react';
import Search from 'antd/lib/input/Search';

export default class SearchFlavor extends Component {
    constructor() {
        super();
        this.state = {
            value: '',
        };
    }

    render() {
        const { value } = this.props;
        return (
            <Search
                placeholder="search by name"
                onBlur={this.props.handleChange}
                style={{
                    width: 200,
                    marginBottom: '10px',
                    marginLeft: '20px',
                    marginTop: '10px',
                }}
                defaultValue={value}
            />
        );
    }
}
