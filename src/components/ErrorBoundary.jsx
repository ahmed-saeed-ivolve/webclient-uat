import { Component } from 'react';
export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    componentDidCatch() {
        this.setState({ hasError: true });
    }

    render() {
        if (this.state.hasError) {
            return (
                <h3
                    style={{
                        marginTop: '10px',
                        marginRight: '10px',
                    }}
                >
                    Please Wait...
                </h3>
            );
        }
        return this.props.children;
    }
}
