import React from 'react'
import {Row, Col as Column} from 'react-onsenui'

import styles from 'views/slide.sass'

const Slide = ({vAlign="center", hAlign="center", title}) => (
  <div className={styles.root}>
    {title ? (<h5>Some Title</h5>) : null }
    <Row className={styles.card}>
      <Column verticalAlign={vAlign} className={styles[hAlign]}>
        I'm a slide
      </Column>
    </Row>
  </div>
)
export default Slide
