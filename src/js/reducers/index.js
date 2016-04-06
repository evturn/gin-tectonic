export default function quake(state = {}, action) {
  switch (action.type) {
    case 'DRAW_QUAKE':{
      const { quake, quakeLayer } = action.payload;

      return Object.assign({}, state, {
        codeLayers: {
          [quake.id]: quakeLayer
        }
      });
    }
    default:
      return state;
  }
}
