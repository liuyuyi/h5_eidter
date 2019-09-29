export default {
  getActive: state => {
    for (let i = 0, l = state.areas.length; i < l; i++) {
      let area = state.areas[i];

      if (area.active) {
        return i;
      }
    }
    return null;
  }
}