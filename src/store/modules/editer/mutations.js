import {
  CHANGE_WIDTH,
  CHANGE_HEIGHT,
  CHANGE_TOP,
  CHANGE_LEFT,
  CHANGE_ZINDEX,
  ENBALE_ACTIVE,
  DISABLE_ACTIVE
} from './mutations-types'

export default {
    [CHANGE_WIDTH](state, area){
        state.areas[area.id].width = area.width;
    },
    [CHANGE_HEIGHT](state, area) {
      state.areas[area.id].height = area.height;
    },
    [CHANGE_TOP](state, area) {
      state.areas[area.id].top = area.top;
    },
    [CHANGE_LEFT](state, area) {
      state.areas[area.id].left = area.left;
    },
    [CHANGE_ZINDEX](state, area) {
      state.areas[area.id].zIndex = area.zIndex;
    },
    [ENBALE_ACTIVE](state, id) {
      state.areas[id].active = false;
    },
    [DISABLE_ACTIVE](state, id) {
      state.areas[id].active = true;
    },
}