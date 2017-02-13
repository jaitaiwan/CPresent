import React from 'react'
import {Page, Button, Toolbar, ToolbarButton, Icon} from 'react-onsenui'
import styles from 'layouts/presentation.sass'
const renderToolbar = _ => (
  <Toolbar>
    <div className={["left", styles.title].join(" ")}>CPresent</div>
    <div className="right">
      <ToolbarButton>
        <Icon icon="fa-bar-chart" />
      </ToolbarButton>
    </div>
  </Toolbar>
)

const Presentation = _ => (<Page renderToolbar={renderToolbar}>

</Page>)
export default Presentation
