export const GO_LIVE = 'start-presentation'
export const THATS_A_WRAP = 'end-presentation'

export const goLive = _ => ({type: GO_LIVE})
export const thatsAWrap = _ => ({type: THATS_A_WRAP})
export const endPresentation = thatsAWrap
