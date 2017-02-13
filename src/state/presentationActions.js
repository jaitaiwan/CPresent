export const GO_LIVE = 'start-presentation'
export const THATS_A_WRAP = 'end-presentation'
export const CHANGE_NEXT_CUE = 'cue-item'

export const goLive = (index) => ({index, type: GO_LIVE})
export const thatsAWrap = _ => ({type: THATS_A_WRAP})
export const endPresentation = thatsAWrap
export const cueItem = (index) => ({type: CHANGE_NEXT_CUE, index})
