import { queryNotices } from '@/services/user';
import { queryMonthlySpend,querySpendByService } from '@/services/globalCloud';
import * as GenericService from '../pages/service/services/generic_service';


const BillingModel = {
  namespace: 'billing',
  state: {
   
    collapsed: false,
    notices: [],
    availabilityZones : [],
    regions:[],
    flavors:[],
    images:[],
    networks:[],
    floatingips:[],
    spends:[],
    spendByService:[]
  },
  effects: {
   
    *fetchMonthlySpendByService({payload},{call,put}){
      const data=yield call(queryMonthlySpend,payload);
      
      
      yield put({
        type: 'genericReducer',
        payload: {
          spends:data.body
        }
      })
    },
   
    *fetchSpendByService({payload},{call,put}){
      
      
      const data=yield call(querySpendByService,payload);
      
      yield put({
        type: 'genericReducer',
        payload: {
          spendByService:data.body.summary?data.body.summary:[]
        }
      })
    },

    *fetchMonthlySpendsByService({payload},{call,put}){
      const data=yield call(queryMonthlySpend,{...payload,groupby:'res_type'});
      
      
      yield put({
        type: 'genericReducer',
        payload: {
          spends:data.body
        }
      })
    },
  },
  reducers: {
    genericReducer(state,{payload}){
      return{
        ...state,
        ...payload
      }
    },
  },
  subscriptions: {
   
   
   
   
   
   
   
   
  },
};
export default BillingModel;
