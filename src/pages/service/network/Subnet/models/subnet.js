import * as SubnetServices from '../services/subnet';
export default {
    namespace: 'subnet',
    state: {
        text: 'page work',
        list: [],
    },
    subscriptions: {
        setup({ dispatch, history }) {
            
            return history.listen(({ pathname, query }) => {
                if (pathname === '/service/network/subnets') {
                    dispatch({
                        type: 'update',
                    });

                }
            });
        },
    },



    effects: {
        *fetch({ payload }, { call, put }) {
            yield put({
                type: 'save',
                payload: {
                    text: 'page init',
                },
            });
        },
        *delete({ payload }, { call, put }) {
            yield put({
                type: 'save',
                payload: {
                    list: [],
                },
            });
        },
        *deleteResources({ payload }, { call, put }) {
     
            const data = yield call(SubnetServices.patch, { data: [...payload] });
            yield put({
                type: 'save',

            });

        },
        *attachdetach({ payload }, { call, put }) {
            
            const data = yield call(SubnetServices.attachdetach, { data: { ...payload } });
            yield put({
                type: 'save',
            });
        },

        *create({ payload }, { call, put }) {
            
            const data = yield call(SubnetServices.create, { data: { ...payload } });
            yield put({
                type: 'save',
            });
        },
        *update({ payload }, { call, put, select }) {
            
            const data = yield call(SubnetServices.query, payload);
            
            if (data) {
                yield put({
                    type: 'save',
                    payload: {
                        list: data,
                    },
                });
                
            }
        },

    },
    reducers: {
        selectedRows(state, action) {

            const { selectedRows } = state;
            const { payload } = action;

           
            const newSelectedKeys = payload.reduce((acc, record) => {
                if (acc.includes(record.key)) {
                   
                   
                    return acc.filter(key => key !== record.key)
                } else {
                    return [...acc, record.key]
                }
            }, selectedRows)



            return { ...state, selectedRows: [...newSelectedKeys] }
        },
        sdAllRows(state, action) {
            const { value, records } = action.payload;
            return {
                ...state,
                selectedRows: value ? records.map(record => record.id) : []
            }

        },
        save(state, action) {
            return { ...state, ...action.payload };
        },
    },
};
