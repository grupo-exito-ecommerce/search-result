# VTEX Search Result

[![Build Status](https://api.travis-ci.org/vtex-apps/search-result.svg?branch=master)](https://travis-ci.org/vtex-apps/search-result)

## Description

The VTEX Search Result app is a store component that handles with the result of our [_Search API_](https://documenter.getpostman.com/view/845/vtex-search-api/Hs43#8b71745e-00f9-6c98-b776-f4468ecb7a5e), and this app is used by store theme.

:loudspeaker: **Disclaimer:** Don't fork this project; use, contribute, or open issue with your feature request.

### Supported Blocks

This are the current supported blocks in this repository. Blocks not mentioned are deprecated.

| Block name                         | Component                                                            | Description                                                                                                                                         |
| ---------------------------------- | -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `gallery`                          | [Gallery](react/Gallery)                                             | Gallery that displays found products                                                                                                                |
| `not-found`                        | [NotFoundSearch](react/NotFoundSearch)                               | Block containing text and description that search was not found                                                                                     |
| `search-result-layout`             | [SearchResultLayout](react/SearchResultLayout)                       | Layout block that enables user to build a custom search page                                                                                        |
| `search-result-layout.customQuery` | [SearchResultLayoutCustomQuery](react/SearchResultLayoutCustomQuery) | Just like `search-result-layout` but accepts a `querySchema` prop to execute custom query.                                                          |
| `search-result-layout.desktop`     | [SearchResultFlexible](react/SearchResultFlexible)                   | Block used to build layout for desktop.                                                                                                             |
| `search-result-layout.mobile`      | [SearchResultFlexibleMobile](react/SearchResultFlexibleMobile)       | Block used to build layout for mobile.                                                                                                              |
| `search-not-found-layout`          | [NotFoundLayout](react/NotFoundLayout)                               | Block used to layout when a user searches for a product that does not exist.                                                                        |
| `search-layout-switcher`           | [LayoutModeSwitcherFlexible](react/LayoutModeSwitcherFlexible)       | Enables user to switch between layout modes in mobile                                                                                               |
| `search-content`                   | [SearchContent](react/SearchContent)                                 | Block that chooses to show the `gallery` block if products are found and `not-found` if filters selected lead to an empty search                    |
| `search-fetch-more`                | [FetchMore](react/FetchMore)                                         | Renders the fetch more button if pagination is of type `show-more`. If it is infinite scroll, shows the `Loader` when bottom of the page is reached |
| `search-fetch-previous`                | [FetchPrevious](react/FetchPrevious)                                         | Renders the fetch previous button. |
| `search-products-count-per-page`   | [ProductCountPerPage](react/ProductCountPerPage)                     | Shows the total count of products displayed in search at the moment.                                                                                |
| `order-by.v2`                      | [OrderByFlexible](react/OrderByFlexible)                             | Allows user to pick the type of order of the products displayed.                                                                                    |
| `filter-navigator.v3`              | [FilterNavigatorFlexible](react/FilterNavigatorFlexible)             | Allows user to apply different filters to search. On mobile, renders a button that shows the sidebar when pressed.                                  |
| `total-products.v2`                | [TotalProductsFlexible](react/TotalProductsFlexible)                 | Shows the total products count found for that search.                                                                                               |
| `search-title.v2`                  | [SearchTitleFlexible](react/SearchTitleFlexible)                     | Display search title according to the search context.                                                                                               |

### Flexible Layout Update

`search-result` now supports a flexible layout and has all its benefits, specially using the `flex-layout` block.

You now have access to `search-result-layout`, it supports three different blocks: `search-result-layout.desktop`, `search-result-layout.mobile`, `search-not-found-layout`.

`search-result-layout.desktop` is rendered when user is using a desktop. The `.mobile` interface is rendered (if provided), when user is using a mobile device. If the `.mobile` is not provided, the `.desktop` will be used.

The `search-not-found-layout` is used (if provided) when the user searches for a term that returns nothing. 

> **Important notice:** if the user lands on a search page and adds filters until it reachs a empty search, this block will not be rendered! Instead, the `not-found` component, **which is currently not flexible**, will.

We also created the `search-result-layout.customQuery`. If you want to display a custom search-result, by passing a custom querySchema, this block should be used. `search-result-layout` does not read the values of a `querySchema` prop!

To pass parameters to the search displayed at `search-result-layout` you should use the `context` props in `store.search`. Example:

```js
"store.search": {
    "blocks": [
      "search-result-layout"
    ],
    "props": {
        "context": {
           "orderByField": "OrderByReleaseDateDESC",
            "hideUnavailableItems": true,
            "maxItemsPerPage": 8
        }
     }
  },
```

If you want to use the `.customQuery`:

```json
"store.home": {
  "blocks": [
    "carousel#home",
     "shelf#home",
    "search-result-layout.customQuery#home"
  ]
},
"search-result-layout.customQuery#home": {
  "props": {
    "querySchema": {
      "orderByField": "OrderByReleaseDateDESC",
      "hideUnavailableItems": true,
      "maxItemsPerPage": 8,
      "queryField": "clothing",
      "mapField": "c"
    }
  },
  "blocks": ["search-result-layout.desktop"]
}
```

In order to be used inside the flexible block, we created: `breadcrumb.search`, `search-fetch-more`, `search-fetch-previous`, `search-content`, `search-products-count-per-page`, `filter-navigator.v3`, `total-products.v2`, `order-by.v2` & `search-title.v2`.

Noticeable notes:

- `search-fetch-more` renders the fetch more button. Infinite-scroll was deprecated.
- `search-content` renders the gallery or the not-found block, depending on the products returned for the specified filters.
- `search-products-count-per-page` renders the current products count displayed.
- All `*.v2` or `.v3` is just a version bump, no changes in behaviour, the changes are that the new components now fetch the data from the search page context and should only be used in the flexible layout. Also changes the wrapper css class, usually by just adding a `--layout` to the previous used class (like `filters` to `filters--layout`).

Read more at the `Max Items Per Page Usage` section.

## Important Note

We ask for users, from now on, to use the `filter-navigator.v2` block if you want to keep updated with the most up to date Filter Navigator in your search-result.

The correct way to use it is setting it in your `blocks.json` like:

```
json
"search-result": {
    "blocks": [
      "filter-navigator.v2",
      "gallery",
      "not-found",
      "breadcrumb",
      "order-by",
      "total-products"
    ],
  }
```

Or via Storefront.

## Max Items Per Page Usage

Disclaimer: this notice is deprecated, please use the `search-result-layout` block.
A `search-result` block may appear in two different contexts, (a) in a search result page (store.search) or (b) as a block in your home page (store.home).

In case of (a) we can configure the search parameters in a search context in the following way:

```json
  "store.search": {
    "blocks": [
      "search-result"
    ],
    "props": {
        "context": {
           "orderByField": "OrderByReleaseDateDESC",
            "hideUnavailableItems": true,
            "maxItemsPerPage": 8
        }
     }
  },
 "store.search#category": {
    "blocks": [
      "search-result"
    ],
    "props": {
        "context": {
           "orderByField": "OrderByReleaseDateDESC",
            "hideUnavailableItems": true,
            "maxItemsPerPage": 8
        }
     }
  },
  "store.search#brand": {
    "blocks": [
      "search-result"
    ],
    "props": {
        "context": {
           "orderByField": "OrderByReleaseDateDESC",
            "hideUnavailableItems": true,
            "maxItemsPerPage": 8
        }
     }
  },
  "store.search#department": {
    "blocks": [
      "search-result"
    ],
    "props": {
        "context": {
           "orderByField": "OrderByReleaseDateDESC",
            "hideUnavailableItems": true,
            "maxItemsPerPage": 8
        }
     }
  },
  "store.search#subcategory": {
    "blocks": [
      "search-result"
    ],
    "props": {
        "context": {
           "orderByField": "OrderByReleaseDateDESC",
            "hideUnavailableItems": true,
            "maxItemsPerPage": 8
        }
     }
  }
```

Note that only in this case, the parameters must be passed in the `context` prop of the `store.search` block. Also remember that we have different `store.search` blocks and you may configure them in different ways.
You may configure a brand search (ended with /b), have 6 items per page, while a department search page, that number may be 12.

Search examples:
Free search: https://storetheme.vtex.com/shirt?map=ft. Falls on: `store.search`.
Departament: https://storetheme.vtex.com/decoration/d. Falls on: `store.search#department`.
Category: https://storetheme.vtex.com/bags/necessaire. Falls on: `store.search#category Subcategory: https://storetheme.vtex.com/decoration/smartphones/bateria. Falls on:`store.search#subcategory`. Brand: https://storetheme.vtex.com/kawasaki/b. Falls on:`store.search#brand`.

Now for option (b), when we want to show the `search-result` block outside of a search page, like in the home page, the same parameters must be passed on a different way.

At our example, we want to show a `search-result` inside a `store.home`. We put this inside our blocks.json:

```json
"store.home": {
  "blocks": [
    "carousel#home",
    "shelf#home",
    "search-result#home"
  ]
}
```

Now, to change the search done by this block, we must pass its parameters directly to it, thorugh the `querySchema` prop:

```json
"store.home": {
  "blocks": [
    "carousel#home",
     "shelf#home",
    "search-result#home"
  ]
},
"search-result#home": {
  "props": {
    "querySchema": {
      "orderByField": "OrderByReleaseDateDESC",
      "hideUnavailableItems": true,
      "maxItemsPerPage": 8
    }
  }
}
```

## Release schedule

| Release |       Status        | Initial Release | Maintenance LTS Start | End-of-life | Store Compatibility |
| :-----: | :-----------------: | :-------------: | :-------------------: | :---------: | :-----------------: |
|  [3.x]  | **Current Release** |   2018-12-01    |                       |             |         2.x         |
|  [2.x]  | **Maintenance LTS** |   2018-10-02    |      2018-12-01       | March 2019  |         1.x         |

See our [LTS policy](https://github.com/vtex-apps/awesome-io#lts-policy) for more information.

## Table of Contents

- [Usage](#usage)
  - [Blocks API](#blocks-api)
    - [Configuration](#configuration)
  - [Styles API](#styles-api)
    - [CSS namespaces](#css-namespaces)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [Tests](#tests)

## Usage

This app uses our store builder with the blocks architecture. To know more about Store Builder [click here.](https://help.vtex.com/en/tutorial/understanding-storebuilder-and-stylesbuilder#structuring-and-configuring-our-store-with-object-object)

We add the search-result as a block in our [Store](https://github.com/vtex-apps/store/blob/master/store/interfaces.json).

To configure or customize this app, you need to import it in your dependencies in `manifest.json`.

```json
  dependencies: {
    "vtex.search-result": "3.x"
  }
```

Then, add `search-result` block into your app theme as we do in our [Store theme app](https://github.com/vtex-apps/store-theme/blob/master/store/blocks.json).

Now, you can change the behavior of the search result block that is in the store header. See an example of how to configure:

```json
  "search-result#department": {
    "blocks": [
      "filter-navigator.v2",
      "gallery",
      "not-found",
      "breadcrumb",
      "order-by",
      "total-products",
      "search-title"
    ],
    "props": {
      "context": {
        "maxItemsPerPage": 2,
        "orderByField": "OrderByReleaseDateDESC"
      },
      "hiddenFacets": {
        "layoutMode1": "normal",
        "layoutMode2": "small",
        "specificationFilters": {
          "hiddenFilters": []
        }
      },
      "pagination": "show-more"
    }
  },
```

### Blocks API

When implementing this app as a block, various inner blocks may be available. The following interface lists the available blocks within search result and describes if they are required or optional.

```json
"search-result": {
    "allowed": [
      "not-found",
      "breadcrumb",
      "filter-navigator",
      "total-products",
      "order-by",
      "search-title"
    ],
    "required": [
      "gallery"
    ],
    "component": "index"
  },
```

The search-result has as a required block the `gallery`. So, any search-result block implementation created must add a gallery as a block that is inside of search-result. Similarly, `gallery` has its own inner block structure that can be configured that you can see below.

```json
 "gallery": {
    "required": [
      "product-summary"
    ],
    "component": "Gallery"
  }
```

The gallery has as a required block the `product-summary`. So, any gallery block implementation created must add a product-summary as a block that is inside of gallery. (Similarly, `product-summary` has its own inner block structure that can be configured. There is a link to its API in the next section.)

### Configuration

#### Layout API

These properties can be changed in the `blocks.json` file of your theme.

| Prop name           | Type           | Description                                                                                                                          | Default value     |
| ------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ----------------- |
| `querySchema`       | `QuerySchema`  | Query made when there's no context                                                                                                   | N/A               |
| `hiddenFacets`      | `HiddenFacets` | Indicates which facets will be hidden                                                                                                | N/A               |
| `pagination`        | `Enum`         | Pagination type (values: 'show-more' or 'infinite-scroll')                                                                           | `infinity-scroll` |
| `mobileLayout`      | `MobileLayout` | Control mobile layout                                                                                                                | N/A               |
| `showFacetQuantity` | `Boolean`      | If quantity of items filtered by facet should appear besides its name on `filter-navigator`                                          | `false`           |
| `blockClass`        | `String`       | Unique class name to be appended to block classes                                                                                    | `""`              |
| `showProductsCount` | `Boolean`      | controls if the quantity of loaded products and total number of items of a search result are displayed under the `show more` button. | `false`           |

##### QuerySchema

| Prop name              | Type      | Description                                                                                                                                                                                           | Default value |
| ---------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| `maxItemsPerPage`      | `Number`  | Maximum number of items per search page                                                                                                                                                               | 10            |
| `queryField`           | `String`  | Query field                                                                                                                                                                                           | N/A           |
| `mapField`             | `String`  | Map field                                                                                                                                                                                             | N/A           |
| `restField`            | `String`  | Other Query Strings                                                                                                                                                                                   | N/A           |
| `orderByField`         | `Enum`    | Order by field (values: `OrderByTopSaleDESC`, `OrderByReleaseDateDESC`, `OrderByBestDiscountDESC`, `OrderByPriceDESC`, `OrderByPriceASC`, `OrderByNameASC`, `OrderByNameDESC` or `''` (by relevance)) | `''`          |
| `hideUnavailableItems` | `Boolean` | Set if unavailable items should show on search                                                                                                                                                        | `false`       |

##### HiddenFacets

| Prop name              | Type                   | Description                 | Default value |
| ---------------------- | ---------------------- | --------------------------- | ------------- |
| `brands`               | `Boolean`              | Hide Brands filter          | false         |
| `categories`           | `Boolean`              | Hide Categories filter      | false         |
| `priceRange`           | `Boolean`              | Hide Price filter           | false         |
| `specificationFilters` | `SpecificationFilters` | Hide Specifications filters | N/A           |

##### SpecificationFilters

| Prop name       | Type                      | Description                                           | Default value |
| --------------- | ------------------------- | ----------------------------------------------------- | ------------- |
| `hideAll`       | `Boolean`                 | Hide specifications filters                           | false         |
| `hiddenFilters` | `Array(HiddenFilterUnit)` | Array of specifications filters that should be hidden | N/A           |

##### HiddenFilterUnit

| Prop name | Type    | Description                         | Default value |
| --------- | ------- | ----------------------------------- | ------------- |
| name      | String! | Name of Hidden specification filter | ""            |

##### MobileLayout

This prop controls the way search results are displayed on mobile. The default values are shown below.

Notice that the default behavior for your store will be the one defined by the `mode1`. If you want the user to be able to switch between two modes, you must specify the `mode2` prop. If only the `mode1` is provided, the layout switcher will not be shown and search results will always be rendered according to `mode1`.

| Prop name | Type   | Description                                                           | Default value |
| --------- | ------ | --------------------------------------------------------------------- | ------------- |
| `mode1`   | `Enum` | Layout mode of the switcher (values: 'normal', 'small' or 'inline')   | `normal`      |
| `mode2`   | `Enum` | Layout mode of the switcher 2 (values: 'normal', 'small' or 'inline') | `small`       |

##### `filter-navigator` block

| Prop name            | Type      | Description                                                                                                                                                    | Default value |
| -------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| `preventRouteChange` | `Boolean` | Prevents route change when selecting filters, using the query string instead. Intended for `search-result` blocks inserted on custom pages with static routes. | `false`       |
| `initiallyCollapsed` | `Boolean` | Makes the search filters start out collapsed. | `false`       |

##### `filter-navigator.v2` block

| Prop name            | Type      | Description                                                                                                                                                    | Default value |
| -------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| `preventRouteChange` | `Boolean` | Prevents route change when selecting filters, using the query string instead. Intended for `search-result` blocks inserted on custom pages with static routes. | `false`       |
| `initiallyCollapsed` | `Boolean` | Makes the search filters start out collapsed. | `false`       |


Also, you can configure the product summary that is defined on search-result. See [here](https://github.com/vtex-apps/product-summary/blob/master/README.md#configuration) the Product Summary API.

### Styles API

This app provides some CSS classes as an API for style customization.

To use this CSS API, you must add the `styles` builder and create an app styling CSS file.

1. Add the `styles` builder to your `manifest.json`:

```json
  "builders": {
    "styles": "1.x"
  }
```

2. Create a file called `vtex.searchResult.css` inside the `styles/css` folder. Add your custom styles:

```css
.container {
  margin-top: 10px;
}
```

#### CSS namespaces

Below, we describe the namespaces that are defined in the search-result.

| Token name                         | Description                                                                            | Component Source                                                          |
| ---------------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `container`                        | The main container of search-result                                                    | [SearchResult](/react/components/SearchResult.js)                         |
| `buttonShowMore`                   | Show the see more button                                                               | [ShowMoreLoaderResult](/react/components/loaders/ShowMoreLoaderResult.js) |
| `showingProducts`                  | Text below the show mnore button                                                       | [ShowMoreLoaderResult](/react/components/loaders/ShowMoreLoaderResult.js) |
| `showingProductsCount`             | The range part of the text below the show more button                                  | [ShowMoreLoaderResult](/react/components/loaders/ShowMoreLoaderResult.js) |
| `switch`                           | Layout mode switcher container                                                         | [SearchResult](/react/components/SearchResult.js)                         |
| `breadcrumb`                       | Breadcrumb container                                                                   | [SearchResult](/react/components/SearchResult.js)                         |
| `filter`                           | Filter option container                                                                | [FilterOptionTemplate](/react/components/FilterOptionTemplate.js)         |
| `resultGallery`                    | Gallery result container                                                               | [SearchResult](/react/components/SearchResult.js)                         |
| `border`                           | Order by container border                                                              | [SearchResult](/react/components/SearchResult.js)                         |
| `gallery`                          | The main container of gallery                                                          | [Gallery](/react/Gallery.js)                                              |
| `filterPopupButton`                | Filter pop-up button                                                                   | [FilterSideBar](/react/components/FilterSideBar.js)                       |
| `accordionFilter`                  | Accordion filter container                                                             | [AccordionFilterContainer](/react/components/AccordionFilterContainer.js) |
| `filterAccordionItemBox`           | Accordion filter item container                                                        | [AccordionFilterItem](/react/components/AccordionFilterItem.js)           |
| `filterAccordionBreadcrumbs`       | Filter accordion breadcrumbs container                                                 | [AccordionFilterContainer](/react/components/AccordionFilterContainer.js) |
| `filterButtonsBox`                 | Filter buttons container                                                               | [FilterSidebar](/react/components/FilterSidebar.js)                       |
| `filterPopupFooter`                | Filter pop-up footer container                                                         | [Popup](/react/components/Popup.js)                                       |
| `accordionFilterItemOptions`       | Accordion filter item options container                                                | [AccordionFilterItem](/react/components/AccordionFilterItem.js)           |
| `dropdownMobile`                   | The main container of drop-down on mobile                                              | [SelectionListOrderBy](/react/components/SelectionListOrderBy.js)         |
| `accordionFilterItemActive`        | Container of the accordion filter item when it is active                               | [AccordionFilterItem](/react/components/AccordionFilterItem.js)           |
| `totalProducts`                    | The main container of total-products                                                   | [TotalProducts](/react/TotalProducts.js)                                  |
| `orderBy`                          | The main container of order-by                                                         | [OrderBy](/react/OrderBy.js)                                              |
| `accordionFilterItemHidden`        | Accordion filter item container when it is hidden                                      | [AccordionFilterItem](/react/components/AccordionFilterItem.js)           |
| `accordionFilterItem`              | Accordion filter item container                                                        | [AccordionFilterItem](/react/components/AccordionFilterItem.js)           |
| `accordionFilterItemBox`           | Accordion filter item box                                                              | [AccordionFilterItem](/react/components/AccordionFilterItem.js)           |
| `accordionFilterItemTitle`         | Accordion filter item title container                                                  | [AccordionFilterItem](/react/components/AccordionFilterItem.js)           |
| `accordionFilterItemIcon`          | Accordion filter item icon container                                                   | [AccordionFilterItem](/react/components/AccordionFilterItem.js)           |
| `filterAvailable`                  | Filter option template main container when it is available                             | [FilterOptionTemplate](/react/components/AccordionFilterItem.js)          |
| `filterSelected`                   | Filter option template main container when it is selected                              | [FilterOptionTemplate](/react/components/AccordionFilterItem.js)          |
| `filterPopupTitle`                 | Filter pop-up title label                                                              | [FilterSidebar](/react/components/FilterSidebar.js)                       |
| `filterPopupArrowIcon`             | Filter pop-up arrow icon container                                                     | [FilterSidebar](/react/components/FilterSidebar.js)                       |
| `footerButton`                     | Footer button                                                                          | [FooterButton](/react/components/FooterButton.js)                         |
| `layoutSwitcher`                   | Layout mode switcher container                                                         | [LayoutModeSwitcher](/react/components/LayoutModeSwitcher.js)             |
| `filterPopup`                      | Main container of filter pop-up                                                        | [FilterPopup](/react/components/FilterPopup.js)                           |
| `filterPopupOpen`                  | Main container of filter pop-up when it is open                                        | [FilterPopup](/react/components/FilterPopup.js)                           |
| `filterPopupContent`               | Filter pop-up content                                                                  | [Popup](/react/components/Popup.js)                                       |
| `filterPopupContentContainer`      | Filter pop-up content container                                                        | [Popup](/react/components/Popup.js)                                       |
| `filterPopupContentContainerOpen`  | Filter pop-up content container when it is open                                        | [Popup](/react/components/Popup.js)                                       |
| `galleryItem`                      | Gallery item container                                                                 | [Gallery](/react/Gallery.js)                                              |
| `searchNotFound`                   | Main container of Search Not Found                                                     | [NotFoundSearch](/react/NotFoundSearch.js)                                |
| `filterContainer`                  | Filter container                                                                       | [FilterNavigator](/react/components/FilterNavigator.js)                   |
| `filterContainer--title`           | Title's filter container                                                               | [FilterNavigator](/react/components/FilterNavigator.js)                   |
| `filterContainer--selectedFilters` | Selected filters' filter container                                                     | [SelectedFilters](/react/components/SelectedFilters.js)                   |
| `filterContainer--c`               | Department's filter container                                                          | [DepartmentFilters](/react/components/DepartmentFilters.js)               |
| `filterContainer--b`               | Brand's filter container                                                               | [FilterOptionTemplate](/react/components/FilterOptionTemplate.js)         |
| `filterContainer--priceRange`      | Price range's filter container                                                         | [PriceRange](/react/components/PriceRange.js)                             |
| `filterContainer--` + FACET_TYPE   | FACET_TYPE's filter container                                                          | [FilterOptionTemplate](/react/components/FilterOptionTemplate.js)         |
| `filterTitle`                      | Filter title container                                                                 | [FilterOptionTemplate](/react/components/FilterOptionTemplate.js)         |
| `filterIcon`                       | Filter icon container                                                                  | [FilterOptionTemplate](/react/components/FilterOptionTemplate.js)         |
| `galleryTitle`                     | Category name or search term title                                                     | [Title](/react/Title.js)                                                  |
| `filterItem`                       | Checkbox and label for Filters (desktop only)                                          | [SearchFilter](/react/components/FacetItem.js)                            |
| `filterItem--` + FACET_VALUE       | FACET_VALUE's checkbox and label for Filters (desktop only)                            | [SearchFilter](/react/components/FacetItem.js)                            |
| `filterItem--selected`             | Checkbox and label for selected Filters (desktop only)                                 | [SearchFilter](/react/components/FacetItem.js)                            |
| `selectedFilterItem`               | Checkbox and label for selected Filters (desktop only)                                 | [SelectedFilters](/react/components/SelectedFilters.js)                   |
| `orderByButton`                    | the "Sort By" button found on search results                                           | [SelectionListOrderBy](/react/components/SelectionListOrderBy.js)         |
| `orderByDropdown`                  | the dropdown that appears when the "Sort By" button found on search results is pressed | [SelectionListOrderBy](/react/components/SelectionListOrderBy.js)         |
| `orderByOptionsContainer`          | the container with the "Order by" options of the "Sort by" button                      | [SelectionListOrderBy](/react/components/SelectionListItem.js)            |
| `orderByOptionItem`                | the "Order by" option that appears in the container of the "Sort by" button            | [SelectionListOrderBy](/react/components/SelectionListItem.js)            |

| `categoriesContainer` | The container for the department filters | [DepartmentFilters](/react/components/DepartmentFilters.js) |
| `categoryGroup` | Container for each category group in the department filters | [CategoryFilter](/react/components/CategoryFilter.js) |
| `categoryParent` | View of the parent category of this group | [CategoryFilter](/react/components/CategoryFilter.js) |

## Troubleshooting

You can check if others are experiencing similar issues [here](https://github.com/vtex-apps/search-result/issues). Also feel free to [open issues](https://github.com/vtex-apps/search-result/issues/new).

## Contributing

Check it out [how to contribute](https://github.com/vtex-apps/awesome-io#contributing) with this project.

## Tests

To execute our tests go to `react/` folder and run `npm test`
