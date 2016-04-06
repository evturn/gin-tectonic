export default function quake(state = {
  codeLayers: []
}, action) {
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
