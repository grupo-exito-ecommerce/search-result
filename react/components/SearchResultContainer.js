import React, { useEffect } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

import { PopupProvider } from './Popup'
import SearchResult from './SearchResult'
import { searchResultContainerPropTypes } from '../constants/propTypes'
import { useFetchMore } from '../hooks/useFetchMore'
import { PAGINATION_TYPE } from '../constants/paginationType'
import { Container } from 'vtex.store-components'
import { useSearchPageStateDispatch } from 'vtex.search-page-context/SearchPageContext'

/**
 * Search Result Container Component.
 */
const SearchResultContainer = props => {
  const {
    maxItemsPerPage = 10,
    searchQuery: {
      fetchMore,
      data: {
        facets: {
          brands = [],
          specificationFilters = [],
          priceRanges = [],
          categoriesTrees,
        } = {},
        productSearch: { products = [], recordsFiltered, breadcrumb = [] } = {},
      } = {},
      loading,
      variables: { query, map, orderBy, priceRange },
    },
    pagination,
    page,
    children,
  } = props

  const queryData = {
    query,
    map,
    orderBy,
    priceRange,
  }
  const {
    handleFetchMoreNext,
    handleFetchMorePrevious,
    loading: fetchMoreLoading,
    from,
    to,
    infiniteScrollError,
  } = useFetchMore({
    page,
    recordsFiltered,
    maxItemsPerPage,
    fetchMore,
    products,
    queryData,
  })

  const dispatch = useSearchPageStateDispatch()

  useEffect(() => {
    dispatch({ type: 'SET_FETCHING_MORE', args: { isFetchingMore: loading } })
  }, [loading, dispatch])

  const resultComponent = children || (
    <SearchResult
      {...props}
      breadcrumbsProps={{ breadcrumb }}
      onFetchMore={handleFetchMoreNext}
      fetchMoreLoading={fetchMoreLoading}
      onFetchPrevious={handleFetchMorePrevious}
      pagination={pagination}
      query={query}
      loading={loading}
      recordsFiltered={recordsFiltered}
      products={products}
      brands={brands}
      specificationFilters={specificationFilters}
      priceRanges={priceRanges}
      tree={categoriesTrees}
      to={to}
      from={from}
      infiniteScrollError={infiniteScrollError}
    />
  )

  const infiniteScrollComponent = (
    <InfiniteScroll
      style={{ overflow: 'none' }}
      dataLength={products.length}
      next={handleFetchMoreNext}
      hasMore={to + 1 < recordsFiltered}
      useWindow={false}
    >
      {resultComponent}
    </InfiniteScroll>
  )

  const isInfiniteScroll = pagination != PAGINATION_TYPE.SHOW_MORE

  return (
    <Container className="pt3-m pt5-l">
      <PopupProvider>
        <div id="search-result-anchor" />
        {isInfiniteScroll ? infiniteScrollComponent : resultComponent}
      </PopupProvider>
    </Container>
  )
}

SearchResultContainer.propTypes = searchResultContainerPropTypes

export default SearchResultContainer
