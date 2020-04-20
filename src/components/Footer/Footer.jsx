import { Component } from 'react';

export default class Footer extends Component {
    render() {
        return (
            <div
                style={{
                    display: 'flex',
                    width: '200px',
                    bottom: '0px',
                    position: 'fixed',
                    color: 'black',
                    textAlign: 'right',
                    fontWeight: 'bold',
                    textAlign: 'right',
                    right: '0px',
                }}
            >
                <p
                    style={{
                        marginRight: '30px',
                        marginTop: '10px',
                    }}
                >
                    {`Version ${RELEASE_VERSION} (Build: ${BUILD_NUMBER})`}
                </p>
            </div>
        );
    }
}
