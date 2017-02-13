import {GO_LIVE, THATS_A_WRAP, CHANGE_NEXT_CUE} from 'state/presentationActions'

const defaultState = {
  isLive: false,
  nextCue: null,
  cues: [ // List of things cued up for show
    { id: 1, name: "Broken Vessels", author: "Hillsong Worship" },
    { id: 2, name: "Amazing Grace", author: "John Newton" },
    { id: 3, name: "Calvary", author: "Hillsong Worship" },
  ],
  liveCue: null
}

export const presentation = (state = defaultState, action) => {
  switch (action.type) {
    case GO_LIVE:
      let [lc] = state.cues.filter((c, i) => (action.index==i+1))
      lc.index = action.index
      let [nc] = state.cues.filter((c, i) => (action.index+1==i+1))
      if (nc) {
        nc.index = action.index + 1
      }

      return {
        ...state,
        isLive: true,
        liveCue: lc,
        nextCue: nc
      }

    case THATS_A_WRAP:
      return {
        ...state,
        isLive: false
      }

    case CHANGE_NEXT_CUE:
      let [nextCue] = state.cues.filter((c, i) => (action.index==i+1))
      nextCue.index = action.index
      return {
        ...state,
        nextCue
      }

  }

  if (!state.nextCue && state.cues.length > 0) {
    state.nextCue = state.cues[0]
    state.nextCue.index = 1
  }

  // Sets the default live view to the first in the set
  // if (!state.liveCue && state.cues.length > 0) {
  //   state.liveCue = state.cues[0]
  //   state.liveCue.index = 1
  // }

  return state
}
