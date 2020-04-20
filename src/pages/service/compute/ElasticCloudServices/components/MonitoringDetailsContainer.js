import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';
import MonitoringDetails from './MonitoringDetails';

const graphWindowLimit = 7;
const networkWindowLimit = 16;

class MonitoringDetailsContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cpuData: [],
            ramData: [],
            networkData: [],
            storageData: [],
            errorMessage: '',
        };

        let token = localStorage.getItem('detasadToken');
        token = JSON.parse(token);
        const { currentInstance } = props;
        const instanceId = currentInstance?.id;
        const projectId = currentInstance?.project_id;
        const instanceName = currentInstance?.name;

        this.socket = socketIOClient(MONITORING_SOCKET_IP, {
            query: `authtoken=${token}&tenant_id=${projectId}&vm_name=${instanceName}`,
        });

        this.socket.on('error', data => {
            this.showNotification(data);
        });
        this.socket.on('connect_error', () => {
            this.showNotification('Sorry! Monitoring Service is unavailable.');
        });
    }

    showNotification(errorMessage) {
        this.setState({
            errorMessage,
        });
    }

    componentWillUnmount() {
        this.socket.on('disconnect', () => {
            this.socket.close();
        });
    }

    componentDidMount() {
        this.socket.on('update-cpu', data => {
            let cpuData = [...this.state.cpuData, data];
            if (cpuData.length > graphWindowLimit) {
                cpuData = cpuData.slice(
                    Math.max(cpuData.length - graphWindowLimit, 1)
                );
            }
            this.setState(prevState => ({
                errorMessage: '',
                ...prevState.cpuData,
                cpuData,
            }));
        });

        this.socket.on('update-ram', data => {
            let ramData = [...this.state.ramData, data];
            if (ramData.length > graphWindowLimit) {
                ramData = ramData.slice(
                    Math.max(ramData.length - graphWindowLimit, 1)
                );
            }
            this.setState(prevState => ({
                errorMessage: '',
                ...prevState.ramData,
                ramData,
            }));
        });

        this.socket.on('update-network', data => {
            let networkData = [...this.state.networkData, data];
            if (networkData.length > networkWindowLimit) {
                networkData = networkData.slice(
                    Math.max(networkData.length - networkWindowLimit, 1)
                );
            }
            this.setState(prevState => ({
                errorMessage: '',
                ...prevState.ramData,
                networkData,
            }));
        });

        this.socket.on('update-storage', data => {
            let storageData = [...this.state.storageData, data];
            if (storageData.length > graphWindowLimit) {
                storageData = storageData.slice(
                    Math.max(storageData.length - graphWindowLimit, 1)
                );
            }
            this.setState(prevState => ({
                errorMessage: '',
                ...prevState.storageData,
                storageData,
            }));
        });
    }

    render() {
        const {
            cpuData,
            ramData,
            networkData,
            storageData,
            errorMessage,
        } = this.state;
        const { ram, disk } = this.props.currentInstance?.flavor;
        return (
            <React.Fragment>
                <MonitoringDetails
                    ecs={cpuData}
                    network={networkData}
                    ram={ramData}
                    storage={storageData}
                    totalRAM={ram}
                    totalDisk={disk * 1024}
                    errorMessage={errorMessage}
                />
            </React.Fragment>
        );
    }
}

export default MonitoringDetailsContainer;
