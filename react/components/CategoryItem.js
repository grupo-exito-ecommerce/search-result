import classNames from 'classnames'
import React from 'react'

import styles from '../searchResult.css'

const CategoryItem = ({ label, onClick, className }) => {
  return (
    <div
      tabIndex={0}
      role="link"
      className={classNames(
        styles.categoryItemChildren,
        'ph5 ph3-ns pv5 pv1-ns lh-copy pointer hover-bg-muted-5 c-muted-1',
        className
      )}
      onClick={onClick}
      onKeyDown={e => e.key === 'Enter' && onClick(e)}
    >
      {label}
    </div>
  )
}

export default CategoryItem
