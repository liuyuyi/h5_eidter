import 
  types
 from './mutations-types';

export default {    
    changeWidth({commit}, {id, width}){
        commit(types.CHANGE_WIDTH, {id, width});
    },
    changeHeight({commit}, {id, height}){
        commit(types.CHANGE_HEIGHT, {id, height});
    },
    changeTop({commit}, {id, top}){
        commit(types.CHANGE_TOP, {id, top});
    },
    changeLeft({commit}, {id, left}){
        commit(types.CHANGE_LEFT, {id, left});
    },
    setActive({commit, state}, {id}){
        for (let i = 0, len = state.areas.length;i<len;i++){
            if(i === id){
                commit(types.ENBALE_ACTIVE, i);
            }
            commit(types.DISABLE_ACTIVE, i);
        }
    },
    unActive({commit}, {id}){
        commit(types.DISABLE_ACTIVE, id);
    }
}