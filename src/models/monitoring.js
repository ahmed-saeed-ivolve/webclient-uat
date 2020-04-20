import { routerRedux } from 'dva/router';
import moment from 'moment';
const generateRandomData = startTime => {
    const diffTime = Math.round(
        moment.duration(moment().diff(startTime)).asSeconds()
    );
    return {
        timestamp: diffTime,
        percent: Math.floor(Math.random() * (89 - 60 + 1) + 60),
    };
};

const getECSMonitoring = startTime => generateRandomData(startTime);

const getNetworkMonitoring = startTime => generateRandomData(startTime);

const getRamMonitoring = startTime => generateRandomData(startTime);

const getMemoryMonitoring = startTime => generateRandomData(startTime);

const getMonitoringData = startTime => {
    return {
        ecs: getECSMonitoring(startTime),
        network: getNetworkMonitoring(startTime),
        ram: getRamMonitoring(startTime),
        memory: getMemoryMonitoring(startTime),
    };
};

export default {
    namespace: 'monitoring',
    state: {
        ecs: [],
        network: [],
        ram: [],
        memory: [],
    },
    effects: {
        *ecs({ payload }, { call, put }) {
            const { startTime } = payload;
            const response = yield call(() => getMonitoringData(startTime));
            if (Object.keys(response).length > 0) {
                yield put({
                    type: 'putMonitoring',
                    payload: {
                        ecsData: response.ecs,
                        networkData: response.network,
                        ramData: response.ram,
                        memoryData: response.memory,
                    },
                });
            }
        },
    },
    reducers: {
        putMonitoring(state, action) {
            const { ecs, network, ram, memory } = state;
            const {
                ecsData,
                networkData,
                ramData,
                memoryData,
            } = action.payload;
            let newEcs = [...ecs, ecsData];
            if (newEcs.length > 60) {
                newEcs = newEcs.slice(Math.max(newEcs.length - 60, 1));
            }
            let newNetwork = [...network, networkData];
            if (newNetwork.length > 60) {
                newNetwork = newNetwork.slice(
                    Math.max(newNetwork.length - 60, 1)
                );
            }
            let newRam = [...ram, ramData];
            if (newRam.length > 60) {
                newRam = newRam.slice(Math.max(newRam.length - 60, 1));
            }
            let newMemory = [...memory, memoryData];
            if (newMemory.length > 60) {
                newMemory = newMemory.slice(Math.max(newMemory.length - 60, 1));
            }
            return {
                ...state,
                ecs: newEcs,
                network: newNetwork,
                ram: newRam,
                memory: newMemory,
            };
        },
    },
};
