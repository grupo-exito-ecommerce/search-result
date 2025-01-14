import React, { useMemo, useEffect, useRef } from 'react'
import ContextProviders from './components/ContextProviders'
import SearchResultContainer from './components/SearchResultContainer'
import {
  SearchPageContext,
  SearchPageStateContext,
  SearchPageStateDispatch,
  useSearchPageStateReducer,
} from 'vtex.search-page-context/SearchPageContext'
import { generateBlockClass } from '@vtex/css-handles'
import { pathOr, isEmpty } from 'ramda'

import getFilters from './utils/getFilters'
import LoadingOverlay from './components/LoadingOverlay'
import { PAGINATION_TYPE } from './constants/paginationType'

import styles from './searchResult.css'

const emptyFacets = {
  brands: [],
  priceRanges: [],
  specificationFilters: [],
  categoriesTrees: [],
}

const useShowContentLoader = (searchQuery, dispatch) => {
  const loadingRef = useRef(true)
  const previousLoading = loadingRef.current
  const isLoading = searchQuery && searchQuery.loading
  useEffect(() => {
    if (previousLoading && !isLoading) {
      loadingRef.current = false
      dispatch({ type: 'HIDE_CONTENT_LOADER' })
    }
  }, [dispatch, isLoading, previousLoading])
}

const SearchResultFlexible = ({
  children,
  hiddenFacets,
  pagination = PAGINATION_TYPE.SHOW_MORE,
  mobileLayout = { mode1: 'normal' },
  showProductsCount,
  blockClass,
  preventRouteChange = false,
  // Below are set by SearchContext
  searchQuery,
  maxItemsPerPage,
  map,
  params,
  priceRange,
  orderBy,
  page,
}) => {
  //This makes infinite scroll unavailable.
  //Infinite scroll was deprecated and we have
  //removed it since the flexible search release
  if (pagination === PAGINATION_TYPE.INFINITE_SCROLL) {
    pagination = PAGINATION_TYPE.SHOW_MORE
    console.warn('Infinite scroll cannot be used in flexible search')
  }
  pagination =
    pagination === PAGINATION_TYPE.INFINITE_SCROLL
      ? PAGINATION_TYPE.SHOW_MORE
      : pagination
  const facets = pathOr(emptyFacets, ['data', 'facets'], searchQuery)
  const { brands, priceRanges, specificationFilters, categoriesTrees } = facets
  const filters = useMemo(
    () =>
      getFilters({
        specificationFilters,
        priceRanges,
        brands,
        hiddenFacets,
      }),
    [brands, hiddenFacets, priceRanges, specificationFilters]
  )

  const hideFacets = !map
  const showCategories =
    hiddenFacets &&
    hiddenFacets.categories === false &&
    categoriesTrees &&
    categoriesTrees.length > 0
  const showFacets = showCategories || (!hideFacets && !isEmpty(filters))
  const [state, dispatch] = useSearchPageStateReducer({
    mobileLayout: mobileLayout.mode1,
  })

  useShowContentLoader(searchQuery, dispatch)

  const settings = useMemo(
    () => ({
      hiddenFacets,
      pagination,
      mobileLayout,
    }),
    [hiddenFacets, mobileLayout, pagination]
  )

  const context = useMemo(
    () => ({
      hiddenFacets,
      pagination,
      mobileLayout,
      searchQuery,
      page,
      maxItemsPerPage,
      map,
      params,
      priceRange,
      orderBy,
      showFacets,
      filters,
      showProductsCount,
      preventRouteChange,
    }),
    [
      hiddenFacets,
      pagination,
      mobileLayout,
      searchQuery,
      page,
      maxItemsPerPage,
      map,
      params,
      priceRange,
      orderBy,
      showFacets,
      filters,
      showProductsCount,
      preventRouteChange,
    ]
  )

  return (
    <SearchPageContext.Provider value={context}>
      <SearchPageStateContext.Provider value={state}>
        <SearchPageStateDispatch.Provider value={dispatch}>
          <ContextProviders
            queryVariables={searchQuery.variables}
            settings={settings}
          >
            <SearchResultContainer
              searchQuery={searchQuery}
              maxItemsPerPage={maxItemsPerPage}
              pagination={pagination}
              mobileLayout={mobileLayout}
              map={map}
              params={params}
              priceRange={priceRange}
              hiddenFacets={hiddenFacets}
              orderBy={orderBy}
              page={page}
            >
              {
                <LoadingOverlay loading={state.isFetchingMore}>
                  <div
                    className={`flex flex-column flex-grow-1 ${generateBlockClass(
                      styles['container--layout'],
                      blockClass
                    )}`}
                  >
                    {children}
                  </div>
                </LoadingOverlay>
              }
            </SearchResultContainer>
          </ContextProviders>
        </SearchPageStateDispatch.Provider>
      </SearchPageStateContext.Provider>
    </SearchPageContext.Provider>
  )
}

SearchResultFlexible.schema = {
  title: 'admin/editor.search-result-desktop.title',
}

export default SearchResultFlexible
