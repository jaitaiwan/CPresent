import React from 'react'
import {Page, Button, Toolbar, ToolbarButton, Icon, Row, Col as Column} from 'react-onsenui'
import {connect} from 'react-redux'
import styles from 'layouts/presentation.sass'
import * as actions from 'state/presentationActions'
import Slide from 'views/slide'


const renderToolbar = function () {
  let {isLive, liveCue, goLive, thatsAWrap, next, hasNextCue, hasPreviousCue, cueItem} = this
  let icon = isLive ? 'ion-eye' : 'ion-eye-disabled'
  const live = _ => (goLive(next.index))
  const toggleLive = _ => isLive ? thatsAWrap() : liveCue ? live() : null
  const nextCue = _ => (cueItem(next.index +1))
  const lastCue = _ => !next && liveCue ? cueItem(liveCue.index) : cueItem(next.index -1)

  return (
    <Toolbar>
      <div className={["left", styles.title].join(" ")}>
        {/* <ToolbarButton>
          <Icon icon="fa-bars" />
        </ToolbarButton> */}
        Church Present
      </div>
      <div className="center">
            {hasPreviousCue ? (<ToolbarButton onClick={lastCue}><Icon icon="ion-ios-arrow-left" size={{default:16}} /></ToolbarButton>) : <ToolbarButton><Icon icon="ion" /></ToolbarButton>}
            <ToolbarButton onClick={live}><Icon icon="ion-ios-play" size={{default:16}} /></ToolbarButton>
            {hasNextCue ? (<ToolbarButton onClick={nextCue}><Icon icon="ion-ios-arrow-right" size={{default:16}} /></ToolbarButton>) : <ToolbarButton><Icon icon="ion" /></ToolbarButton>}
            {next ? `Next: (${next.index}) ${next.name}` : "End Of Set"}
      </div>
      <div className="right">
        <ToolbarButton onClick={toggleLive}>
          <Icon icon={icon} size={{default:18}} /> <span className="">Live</span>
        </ToolbarButton>
      </div>
    </Toolbar>
  )
}

const Live = ({name, author, slides}) => {
  return (
    <div className={styles.pad}>
      <h4>
        <Icon className={styles.redIcon} icon="ion-ios-monitor-outline" size={{default:30}} /> Live: {name} <Icon name="ion-pencil" />
        <span className="subtitle">Copyright {author}</span>
      </h4>
      <div className={styles.slides}>
        <Slide title="Chorus" /><Slide/><Slide/>
<Slide/>
        {slides && slides.map((s, i) => {
          return (<div key={i}></div>)
        })}
      </div>
    </div>
  )
}

const Preview = ({name, author, slides}) => {
  return (
    <div className={styles.pad}>
      <h4>
        <Icon icon="ion-ios-monitor-outline" size={{default:30}} /> Previewing: {name} <Icon name="ion-pencil" />
        <span className="subtitle">Copyright {author}</span>
      </h4>
      <div className={styles.slides}>
        <Slide title="Chorus" /><Slide/><Slide/>
<Slide/>        {slides && slides.map((s, i) => {
          return (<div key={i}></div>)
        })}
      </div>
    </div>
  )
}

const Presentation = ({isLive, liveCue, goLive, thatsAWrap, nextCue, hasNextCue, hasPreviousCue, cueItem}) => {
  return (
    <Page renderToolbar={renderToolbar}
          isLive={isLive}
          goLive={goLive}
          thatsAWrap={thatsAWrap}
          next={nextCue}
          hasNextCue={hasNextCue}
          hasPreviousCue={hasPreviousCue}
          cueItem={cueItem}
          liveCue={liveCue}>
      <Row>
        <Column className={styles.preview}>
          {nextCue ? (<Preview name={nextCue.name} author={nextCue.author} slides={nextCue.slides} />) : (
            <div className={styles.pad}>
              <h4><Icon icon="ion-ios-monitor-outline" size={{default:30}} /> Nothing To Preview</h4>
            </div>
          )}
        </Column>
        <Column>
          {liveCue ? (<Live name={liveCue.name} author={liveCue.author} slides={liveCue.slides} />) : (
            <div className={styles.pad}>
              <h4><Icon icon="ion-ios-monitor-outline" size={{default:30}} /> Nothing is Live</h4>
            </div>
          )}
        </Column>
      </Row>
    </Page>
  )
}

const mapStateToProps = (state, ownProps) => {
  let totalCues = state.presentation.cues.length
  let nextCue = state.presentation.nextCue
  let liveCue = state.presentation.liveCue

  return {
    isLive: state.presentation.isLive,
    hasNextCue: nextCue && totalCues > 1 &&  nextCue.index < totalCues,
    hasPreviousCue: ((nextCue && nextCue.index > 1) || (liveCue && liveCue.index > 1)) && totalCues > 1,
    liveCue,
    totalCues,
    nextCue
  }
}

export default connect(mapStateToProps, actions)(Presentation)
