import React from 'react'
import {Page, Button, Toolbar, ToolbarButton, Icon, Row, Col as Column} from 'react-onsenui'
import {connect} from 'react-redux'
import styles from 'layouts/presentation.sass'
import * as actions from 'state/presentationActions'


const renderToolbar = function () {
  let {isLive, goLive, thatsAWrap, next} = this
  let icon = isLive ? 'ion-play' : 'ion-stop'
  const toggleLive = _ => isLive ? thatsAWrap() : goLive()

  return (
    <Toolbar>
      <div className={["left", styles.title].join(" ")}>
        {/* <ToolbarButton>
          <Icon icon="fa-bars" />
        </ToolbarButton> */}
        Church Present
      </div>
      <div className="center">
        {next ? `Next: ${next}` : null}
      </div>
      <div className="right">
        <ToolbarButton onClick={toggleLive}>
          <Icon icon={icon} size={{default:20}} /> Live
        </ToolbarButton>
      </div>
    </Toolbar>
  )
}

const Presentation = ({isLive, goLive, thatsAWrap, nextItem}) => {
  return (
    <Page renderToolbar={renderToolbar} isLive={isLive} goLive={goLive} thatsAWrap={thatsAWrap} next={nextItem}>
      <Row>
        <Column className={styles.preview}>Preview</Column>
        <Column>Live</Column>
      </Row>
    </Page>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    isLive: state.presentation.isLive,
    nextItem: "Broken Vessels"
  }
}

export default connect(mapStateToProps, actions)(Presentation)
