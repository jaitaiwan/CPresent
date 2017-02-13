import {GO_LIVE, THATS_A_WRAP} from 'state/presentationActions'

const defaultState = {
  isLive: false
}

export const presentation = (state = defaultState, action) => {
  switch (action.type) {
    case GO_LIVE:
      return {
        isLive: true
      }

    case THATS_A_WRAP:
      return {
        isLive: false
      }
  }

  return state
}
