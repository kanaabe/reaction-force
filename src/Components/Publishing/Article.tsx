import React from "react"
import Events from "../../Utils/Events"
import track from "../../Utils/track"
import { ArticleLayout } from "./Layouts/ArticleLayout"
import { SeriesLayout } from "./Layouts/SeriesLayout"
import { VideoLayout } from "./Layouts/VideoLayout"
import { ArticleData } from "./Typings"

export interface ArticleProps {
  article: ArticleData
  relatedArticles?: any
  relatedArticlesForPanel?: any
  relatedArticlesForCanvas?: any
  seriesArticle?: ArticleData
  isMobile?: boolean
  isSuper?: boolean
  isTruncated?: boolean
  emailSignupUrl?: string
  headerHeight?: string
  marginTop?: string
  display?: {
    name: string
    panel: object
    canvas: any
  }
}

@track((props) => {
  return {
    page: "Article",
    entity_type: "article",
    entity_id: props.article.id
  }
}, {
    dispatch: data => Events.postEvent(data)
  }
)
export class Article extends React.Component<ArticleProps, null> {
  getArticleLayout = () => {
    const { article } = this.props

    switch (article.layout) {
      case 'series': {
        return <SeriesLayout {...this.props} />
      }
      case 'video': {
        return <VideoLayout {...this.props} />
      }
      default: {
        return <ArticleLayout {...this.props} />
      }
    }
  }

  render() {
    return (
      <div>
        {this.getArticleLayout()}
      </div>
    )
  }
}
