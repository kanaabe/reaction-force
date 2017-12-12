import * as React from "react"
import { ConnectionData } from "react-relay"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import styled from "styled-components"

import { ButtonState } from "../Buttons/Default"
import Button from "../Buttons/Ghost"
import Spinner from "../Spinner"

import Dropdown from "../ArtworkFilter/Dropdown"
import ForSaleCheckbox from "../ArtworkFilter/ForSaleCheckbox"

import Headline from "../ArtworkFilter/Headline"
import TotalCount from "../ArtworkFilter/TotalCount"

import BorderedPulldown from "../BorderedPulldown"

import ArtworkGrid from "../ArtworkGrid"

const PageSize = 10

interface Filters {
  for_sale?: boolean
  dimension_range?: string
  price_range?: string
  medium?: string
}

interface Props extends RelayProps, Filters {
  relay?: RelayPaginationProp
  onDropdownSelected: (slice: string, value: string) => void
  onSortSelected: (sort: string) => void
  onForSaleToggleSelected: () => void
  onArtistModeToggleSelected: () => void
  sort?: string
}

interface State extends Filters {
  loading: boolean
}

const FilterBar = styled.div`
  vertical-align: middle;
  text-align: center;

  > div {
    display: inline-block;
  }
`

const SubFilterBar = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 40px 0 20px;
  align-items: center;
`

const SpinnerContainer = styled.div`
  width: 100%;
  height: 100px;
  position: relative;
`

const ArtistFilterButtons = styled.div`
  margin-right: 10px;
  button {
    height: 52px;
    padding: 16px;
  }
`

export class Artworks extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      loading: false,
    }
  }

  renderDropdown() {
    return this.props.gene.filtered_artworks.aggregations.map(aggregation => {
      return (
        <Dropdown
          aggregation={aggregation}
          key={aggregation.slice}
          selected={aggregation.slice && this.props[aggregation.slice.toLowerCase()]}
          onSelected={this.props.onDropdownSelected}
        />
      )
    })
  }

  

  renderArtistsModeToggle() {
    return (
      <ArtistFilterButtons>
        <span>By Artists:</span>
        <Button
          onClick={this.props.onArtistModeToggleSelected}
          state={ButtonState.Default}
        >
          All Artists
        </Button>
        <span>By Work:</span>
      </ArtistFilterButtons>
    )
  }

  renderForSaleToggle() {
    return <ForSaleCheckbox checked={this.props.for_sale} onChange={this.props.onForSaleToggleSelected} />
  }

  renderArtworks() {
    const pulldownOptions = [
      { val: "-partner_updated_at", name: "Recently Updated" },
      { val: "-year", name: "Artwork Year (desc.)" },
      { val: "year", name: "Artwork Year (asc.)" },
    ]
    const selectedSort = pulldownOptions.find((sort) => sort.val === this.props.sort)
    return (
      <div>
        <SubFilterBar>
          <div>
            <Headline
              medium={this.props.medium}
              price_range={this.props.price_range}
              dimension_range={this.props.dimension_range}
              for_sale={this.props.for_sale}
              facet={this.props.gene.filtered_artworks.facet}
              aggregations={this.props.gene.filtered_artworks.aggregations}
            />
            <TotalCount filter_artworks={this.props.gene.filtered_artworks} />
          </div>
          <BorderedPulldown defaultValue="Recently Updated" selectedName={selectedSort && selectedSort.name} options={pulldownOptions} onChange={this.props.onSortSelected} />
        </SubFilterBar>
        <ArtworkGrid
          artworks={this.props.gene.filtered_artworks.artworks as any}
          columnCount={4}
          itemMargin={40}
          onLoadMore={() => null}
        />
        <SpinnerContainer>{this.state.loading ? <Spinner /> : ""}</SpinnerContainer>
      </div>
    )
  }

  render() {
    return (
      <div>
        <FilterBar>
          {this.renderArtistsModeToggle()}
          {this.renderForSaleToggle()}
          {this.renderDropdown()}
        </FilterBar>
        {this.renderArtworks()}
      </div>
    )
  }
}

export default createPaginationContainer(
  Artworks,
  {
    gene: graphql.experimental`
      fragment Artworks_gene on Gene
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "String", defaultValue: "" }
          sort: { type: "String", defaultValue: "-partner_updated_at" }
          for_sale: { type: "Boolean" }
          medium: { type: "String", defaultValue: "*" }
          aggregations: { type: "[ArtworkAggregation]", defaultValue: [MEDIUM, TOTAL, PRICE_RANGE, DIMENSION_RANGE] }
          price_range: { type: "String", defaultValue: "*" }
          dimension_range: { type: "String", defaultValue: "*" }
        ) {
        filtered_artworks(
          aggregations: $aggregations
          size: $count
          for_sale: $for_sale
          medium: $medium
          price_range: $price_range
          dimension_range: $dimension_range
          sort: $sort
        ) {
          ...TotalCount_filter_artworks
          
          aggregations {
            slice
            counts {
              name
              id
            }
            ...Dropdown_aggregation
          }
          artworks: artworks_connection(first: $count, after: $cursor) @connection(key: "Artworks_artworks") {
            pageInfo {
              hasNextPage
              endCursor
            }
            edges {
              node {
                __id
              }
            }
            ...ArtworkGrid_artworks
          }
          facet {
            ...Headline_facet
          }
        }
      }
    `,
  },
  {
    direction: "forward",
    getConnectionFromProps(props) {
      return props.gene.filtered_artworks.artworks as ConnectionData
    },
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount,
      }
    },
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        // in most cases, for variables other than connection filters like
        // `first`, `after`, etc. you may want to use the previous values.
        ...fragmentVariables,
        count,
        cursor,
        geneNodeID: props.gene.__id,
      }
    },
    query: graphql.experimental`
      query ArtworksQuery(
        $geneNodeID: ID!
        $count: Int!
        $cursor: String
        $showArtists: Boolean
        $sort: String
        $for_sale: Boolean
        $medium: String
        $aggregations: [ArtworkAggregation]
        $price_range: String
        $dimension_range: String
      ) {
        node(__id: $geneNodeID) {
          ...Artworks_gene
            @arguments(
              count: $count
              cursor: $cursor
              showArtists: $showArtists
              sort: $sort
              for_sale: $for_sale
              medium: $medium
              aggregations: $aggregations
              price_range: $price_range
              dimension_range: $dimension_range
            )
        }
      }
    `,
  }
)

interface RelayProps {
  gene: {
    __id: string
    filtered_artworks: {
      aggregations: Array<{
        slice: string
        counts: {
          name: string | null
          id: string | null
        }
      }>
      artworks: {
        edges: Array<{}>
      }
      facet: any
    }
  }
}
