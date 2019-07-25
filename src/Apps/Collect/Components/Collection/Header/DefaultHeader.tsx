import { Box, color, Flex, Image } from "@artsy/palette"
import { DefaultHeader_headerArtworks } from "__generated__/DefaultHeader_headerArtworks.graphql"
import React, { FC, useEffect, useState } from "react"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components"
import { getViewportWidth } from "Utils/viewport"

interface Props {
  headerArtworks: DefaultHeader_headerArtworks
  defaultHeaderImageHeight: number
}

const IMAGE_MARGIN_X = 10
const LARGE_VIEWPORT_WIDTH = 880

export const CollectionDefaultHeader: FC<Props> = ({
  headerArtworks,
  defaultHeaderImageHeight,
}) => {
  useViewportSize()
  const { hits: artworks } = headerArtworks

  const getHeaderArtworks = (
    allArtworks: any[],
    headerWidth: number,
    isSmallViewport: boolean
  ) => {
    let artworkWidthsInOriginalArray = 0
    let artworkWidthsInRepeatedArray = artworkWidthsInOriginalArray
    const repeatedArtworksArray = []

    allArtworks.forEach(artwork => {
      isSmallViewport
        ? (artworkWidthsInOriginalArray +=
            artwork.image.small.width + IMAGE_MARGIN_X)
        : (artworkWidthsInOriginalArray +=
            artwork.image.large.width + IMAGE_MARGIN_X)
      repeatedArtworksArray.push(artwork)
    })

    artworkWidthsInRepeatedArray = artworkWidthsInOriginalArray

    /**
     * If the summed widths of the artworks returned is larger than the width
     * of the viewport then there's no need to duplicate/repeat the header's artworks
     */
    if (artworkWidthsInOriginalArray >= headerWidth) {
      return allArtworks
    } else {
      /**
       * Otherwise, duplicate the original array of artworks and add a new artwork to the array
       * until the summed widths of the artworks is greater than the viewport width
       */
      while (artworkWidthsInRepeatedArray <= headerWidth) {
        allArtworks.forEach((artwork, i) => {
          repeatedArtworksArray.push(artwork)

          isSmallViewport
            ? (artworkWidthsInRepeatedArray +=
                artwork.image.small.width + IMAGE_MARGIN_X)
            : (artworkWidthsInRepeatedArray +=
                artwork.image.large.width + IMAGE_MARGIN_X)
        })
      }

      return repeatedArtworksArray
    }
  }

  const viewportWidth = getViewportWidth()
  const smallViewport = viewportWidth < LARGE_VIEWPORT_WIDTH
  const duplicatedArtworks = artworks.slice(0)
  const artworksToRender = getHeaderArtworks(
    duplicatedArtworks,
    viewportWidth,
    smallViewport
  )

  return (
    <header>
      <DefaultHeaderContainer
        position={["relative", "absolute"]}
        left={["auto", 0]}
        width={["auto", 1]}
        height={[160, 160, 250]}
      >
        <HeaderArtworks>
          {(artworksToRender || []).map((artwork, i) => {
            return (
              <a href={artwork.href} key={i}>
                <Image
                  mx={0.5}
                  height={defaultHeaderImageHeight}
                  src={
                    smallViewport
                      ? artwork.image.small.url
                      : artwork.image.large.url
                  }
                  preventRightClick
                />
              </a>
            )
          })}
        </HeaderArtworks>
      </DefaultHeaderContainer>
    </header>
  )
}

const useViewportSize = () => {
  const isClient = typeof window === "object"
  const [windowSize, setWindowSize] = useState(getViewportWidth())

  useEffect(() => {
    if (!isClient) {
      return () => null
    }

    const handleResize = () => {
      setWindowSize(getViewportWidth())
    }

    window.addEventListener("resize", handleResize)

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return windowSize
}

export const CollectionDefaultHeaderFragmentContainer = createFragmentContainer(
  CollectionDefaultHeader,
  {
    headerArtworks: graphql`
      fragment DefaultHeader_headerArtworks on FilterArtworks {
        hits {
          href
          id
          image {
            small: resized(height: 160) {
              url
              width
              height
            }
            large: resized(height: 220) {
              url
              width
              height
            }
          }
        }
      }
    `,
  }
)

const DefaultHeaderContainer = styled(Box)`
  background-color: ${color("black5")};
  overflow: hidden;
`
const HeaderArtworks = styled(Flex)`
  flex-direction: row;
  position: absolute;
  bottom: 0;
`
