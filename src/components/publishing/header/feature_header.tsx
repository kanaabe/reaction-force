import React from "react"
import sizeMe from "react-sizeme"
import styled from "styled-components"
import { pMedia } from "../../helpers"
import Fonts from "../fonts"
import AuthorDate from "./author_date"

function renderFeatureAsset(url, layout) {
  if (layout === "fullscreen") {
    return (
      <div>
        {renderAsset(url)}
        <Overlay />
      </div>
    )
  } else if (layout === "split") {
    return renderAsset(url)
  } else {
    return false
  }
}

function renderAsset(url) {
  if (isVideo(url)) {
    return (
      <FeatureVideoContainer>
        <FeatureVideo src={url} autoPlay controls={false} loop muted playsInline />
      </FeatureVideoContainer>
    )
  } else {
    return <FeatureImage src={url} />
  }
}

function renderTextLayoutAsset(url, layout) {
  if (layout === "text") {
    if (isVideo(url)) {
      return <Video src={url} autoPlay controls={false} loop muted playsInline />
    } else {
      return <Image src={url} />
    }
  } else {
    return false
  }
}

function isVideo(url) {
  return url.includes("mp4")
}

interface FeatureHeaderProps {
  article?: any
  size?: any
}

const FeatureHeader: React.SFC<FeatureHeaderProps> = props => {
  const { article } = props
  const { width } = props.size
  const hero = article.hero_section
  if (width < 600 && hero.type === "split") {
    return (
      <FeatureHeaderContainer data-type={hero.type}>
        <HeaderTextContainer>
          <HeaderText>
            <Vertical>{article.vertical.name}</Vertical>
            <Title>{article.title}</Title>
            {renderFeatureAsset(hero.url, hero.type)}
            <SubHeader>
              <SubHeaderText>{hero.subheader}</SubHeaderText>
              <AuthorDate layout={hero.type} authors={article.contributing_authors} date={article.published_at} />
            </SubHeader>
          </HeaderText>
        </HeaderTextContainer>
      </FeatureHeaderContainer>
    )
  } else {
    return (
      <FeatureHeaderContainer data-type={hero.type}>
        {renderFeatureAsset(hero.url, hero.type)}
        <HeaderTextContainer>
          <HeaderText>
            <Vertical>{article.vertical.name}</Vertical>
            <Title>{article.title}</Title>
            <SubHeader>
              <SubHeaderText>{hero.subheader}</SubHeaderText>
              <AuthorDate layout={hero.type} authors={article.contributing_authors} date={article.published_at} />
            </SubHeader>
          </HeaderText>
          {renderTextLayoutAsset(hero.url, hero.type)}
        </HeaderTextContainer>
      </FeatureHeaderContainer>
    )
  }
}

FeatureHeader.defaultProps = {
  size: {
    width: 0,
  },
}

const Div = styled.div`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
`
const Overlay = Div.extend`
  position: absolute;
  background-color: black;
  opacity: 0.17;
`
const Title = styled.div`
  ${Fonts.unica("s100")}
  margin-bottom: 75px;
  ${pMedia.md`
    ${Fonts.unica("s80")}
  `}
  ${pMedia.sm`
    ${Fonts.unica("s45")}
  `}
`
const Vertical = styled.div`
  ${Fonts.unica("s19", "medium")}
  ${pMedia.sm`
    ${Fonts.unica("s16", "medium")}
  `}
`
const HeaderTextContainer = Div.extend`
  margin: auto;
`
const HeaderText = Div.extend`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1250px;
  padding: 20px;
  color: #000;
  justify-content: flex-start;
`
const FeatureImage = Div.extend`
  position: absolute;
  background-image: url(${props => (props.src ? props.src : "")});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  right: 0;
  width: 100%;
`
const FeatureVideo = styled.video`
  width: 100vw;
  height: 100vh;
  object-fit: cover;
`
const FeatureVideoContainer = Div.extend`
  width: 100%;
  height: 100%;
  right: 0;
  position: absolute;
  overflow: hidden;
`

const Image = styled.img`
  width: 100%;
  height: auto;
  padding: 20px;
  box-sizing: border-box;
`
const Video = styled.video`
  width: 100vw;
`
const SubHeader = styled.div`
  ${Fonts.unica("s19", "medium")}
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  ${pMedia.sm`
    align-items: flex-start;
    flex-direction: column;
  `}
`

const SubHeaderText = styled.div`
  max-width: 460px;
  ${pMedia.sm`
    margin-bottom: 28px;
    ${Fonts.unica("s16", "medium")}
  `}
`

const FeatureHeaderContainer = Div.extend`
  &[data-type='text'] {
    ${Title} {
      margin-bottom: 150px;
    }
    ${HeaderText} {
      max-width: none;
    }
  }
  &[data-type='split'] {
    ${Title} {
      flex-grow: 1;
    }
    ${HeaderText} {
      width: 50%;
    }
    ${FeatureImage} {
      width: 50%;
      border: 20px solid white;
    }
    ${FeatureVideoContainer} {
      width: 50%;
      border: 20px solid white;
    }
    ${FeatureVideo} {
      width: 50vw;
    }
    ${SubHeader} {
      align-items: flex-start;
      flex-direction: column;
    }
    ${SubHeaderText} {
      margin-bottom: 30px;
    }
    ${pMedia.sm`
      ${Title} {
        margin-bottom: 20px;
      }
      ${HeaderText} {
        width: 100%;
      }
      ${FeatureImage} {
        width: 100%;
        position: relative;
        border: 0px;
        margin-bottom: 30px;
      }
      ${FeatureVideoContainer} {
        width: 100%;
        position: relative;
        border: 0px;
        margin-bottom: 30px;
      }
      ${FeatureVideo} {
        width: 100vw;
      }
    `}
  }
  &[data-type='fullscreen']{
    ${HeaderText} {
      padding: 50px;
      color: #fff;
      justify-content: flex-end;
      margin: auto;
    }
    ${pMedia.sm`
      ${HeaderText} {
        padding: 20px;
      }
    `}
  }
`

const sizeMeConfig = {
  monitorWidth: true,
  refreshRate: 64,
}

export default sizeMe(sizeMeConfig)(FeatureHeader)