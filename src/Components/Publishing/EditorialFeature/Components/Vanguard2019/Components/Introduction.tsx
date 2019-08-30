import { Box, color, Flex, media, Sans, Serif } from "@artsy/palette"
import { Byline, BylineContainer } from "Components/Publishing/Byline/Byline"
import { Text } from "Components/Publishing/Sections/Text"
import { ArticleData } from "Components/Publishing/Typings"
import React from "react"
import styled from "styled-components"
import { Media } from "Utils/Responsive"
import { VanguardVideoHeader } from "./VideoHeader"

export const VanguardIntroduction: React.SFC<{
  article: ArticleData
}> = props => {
  const { description } = props.article.series
  const { hero_section } = props.article
  const url = ((hero_section && hero_section.url) || "") as string
  const isVideo = url.includes("mp4")

  return (
    <IntroContainer>
      <Box minHeight="calc(100vw * 0.53)" pt={[100, 100, 50, 50]}>
        {isVideo && <VanguardVideoHeader url={url} />}

        <Media greaterThan="xs">
          <HeaderText
            pt={70}
            size={["12", "12", "14", "16"]}
            textAlign="center"
          >
            The Artsy
          </HeaderText>
          <InvertedHeaderText
            pt={70}
            size={["12", "12", "14", "16"]}
            textAlign="center"
          >
            The Artsy
          </InvertedHeaderText>
        </Media>
      </Box>
      <Box background={color("white100")} pt={[80, 100, 150]}>
        <Box mx="auto" maxWidth={980} px={4}>
          <Flex flexDirection="column" alignItems="center" pb={50}>
            <Media greaterThanOrEqual="xl">
              <LargeTitle size="12" element="h1" textAlign="center" pb={1}>
                The Artists To Know Right Now
              </LargeTitle>
            </Media>

            <Media lessThan="xl">
              <Title
                size={["8", "10", "12", "12"]}
                element="h1"
                textAlign="center"
                pb={1}
              >
                The Artists To Know Right Now
              </Title>
            </Media>

            <Byline {...props} />

            <Box textAlign="center" pt={50}>
              <Sans size="3t" weight="medium">
                Video by Alex John Beck
              </Sans>
              <Sans size="3t" weight="medium">
                Video Editing by Nate DeYoung
              </Sans>
              <Sans size="3t" weight="medium">
                Interaction Design by Wax Studios
              </Sans>
            </Box>
          </Flex>

          <Box pb={12}>
            <Text layout="standard" html={description} width="800px" />
          </Box>
        </Box>
      </Box>
    </IntroContainer>
  )
}

const HeaderText = styled(Sans)`
  position: absolute;
  top: 0;
  width: 100%;
  background-color: ${color("black100")};
  color: ${color("white100")};
  z-index: -1;
  mix-blend-mode: color-dodge;
`

const InvertedHeaderText = styled(Sans)`
  position: absolute;
  top: 0;
  width: 100%;
  background-color: ${color("black100")};
  color: ${color("white100")};
  z-index: -4;
  mix-blend-mode: difference;
`

const IntroContainer = styled(Box)`
  ${BylineContainer} {
    div::before {
      display: none;
    }
  }

  ${media.xs`
    ${BylineContainer} {
      flex-direction: column;
      align-items: center;
    }
  `}
`

const Title = styled(Serif)`
  text-transform: uppercase;
  line-height: 1em;
`

const LargeTitle = styled(Title)`
  font-size: 90px;
`
