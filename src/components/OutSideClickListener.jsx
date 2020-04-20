import React, { Component } from 'react';

export default class OutsideAlerter extends Component {
    constructor(props) {
        super(props);

        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    setWrapperRef(node) {
        this.wrapperRef = node;
    }

    handleClickOutside(event) {
        if (
            this.wrapperRef &&
            !this.wrapperRef.contains(event.target) &&
            event.target.innerHTML !== 'Services' &&
            event.target.innerText !== 'Services'
        ) {
            if (this.props.currentValue === true && event.target.innerText) {
                this.props.outClickDetected(false);
            }
            if (this.props.currentValue === true && !event.target.innerText) {
                this.props.outClickDetected(this.props.currentValue);
            }
        }
    }

    render() {
        return <div ref={this.setWrapperRef}>{this.props.children}</div>;
    }
}
