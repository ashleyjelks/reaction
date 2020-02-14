import path from "path"
import React from "react"
import ReactDOMServer from "react-dom/server"
import serialize from "serialize-javascript"
import { ServerStyleSheet } from "styled-components"

import { Resolver } from "found-relay"
import createRender from "found/lib/createRender"
import {
  FarceElementResult,
  FarceRedirectResult,
  getFarceResult,
} from "found/lib/server"
import qs from "qs"

import createQueryMiddleware from "farce/lib/createQueryMiddleware"

import { createRelaySSREnvironment } from "Artsy/Relay/createRelaySSREnvironment"
import { Boot } from "Artsy/Router/Boot"

import createLogger from "Utils/logger"
import { createMediaStyle } from "Utils/Responsive"
import { trace } from "Utils/trace"
import { getUser } from "Utils/user"
import { createRouteConfig } from "./Utils/createRouteConfig"
import { matchingMediaQueriesForUserAgent } from "./Utils/matchingMediaQueriesForUserAgent"

import { RouterConfig } from "./"
import { queryStringParsing } from "./Utils/queryStringParsing"
import { RenderError, RenderPending, RenderReady } from "./Utils/RenderStatus"

import { ChunkExtractor } from "@loadable/server"
import { getENV } from "Utils/getENV"

interface Resolve {
  bodyHTML?: string
  redirect?: {
    url: string
  }
  status?: number
  headTags?: any[]
  scripts?: string
  styleTags?: string
}

const MediaStyle = createMediaStyle()
const logger = createLogger("Artsy/Router/buildServerApp.tsx")

export interface ServerRouterConfig extends RouterConfig {
  userAgent?: string
}

export function buildServerApp(config: ServerRouterConfig): Promise<Resolve> {
  return trace(
    "buildServerApp",
    new Promise(async (resolve, reject) => {
      try {
        const { context = {}, routes = [], url, userAgent } = config
        const user = getUser(context.user)
        const relayEnvironment =
          context.relayEnvironment ||
          createRelaySSREnvironment({ user, userAgent })
        const historyMiddlewares = [
          createQueryMiddleware({
            parse: queryStringParsing,
            stringify: qs.stringify,
          }),
        ]
        const resolver = new Resolver(relayEnvironment)

        const Render = createRender({
          renderPending: RenderPending,
          renderReady: RenderReady,
          renderError: RenderError,
        })

        const farceResults = await trace(
          "buildServerApp.farceResults",
          getFarceResult({
            url,
            historyMiddlewares,
            routeConfig: createRouteConfig(routes),
            resolver,
            render: props => <Render {...props} />,
            matchContext: { user },
          })
        )

        if (isRedirect(farceResults)) {
          resolve({ redirect: farceResults.redirect })
        } else {
          /**
           * An array that gets passed to `react-head`'s provider that will
           * collect the header tags that are rendered by the App. `headTags`
           * is _mutated_ when it's passed to the App. Beware.
           *
           **/
          const headTags = [<style type="text/css">{MediaStyle}</style>]
          const matchingMediaQueries =
            userAgent && matchingMediaQueriesForUserAgent(userAgent)

          const ServerApp = ({ tags = [] }) => {
            return (
              <Boot
                context={context}
                user={user}
                headTags={tags}
                onlyMatchMediaQueries={matchingMediaQueries}
                relayEnvironment={relayEnvironment}
                routes={routes}
              >
                {farceResults.element}
              </Boot>
            )
          }

          // Build up script tags to inject into head
          const scripts = []

          const { relayData: _relayData, styleTags, bodyHTML } = await trace(
            "buildServerApp.fetch",
            (async () => {
              const sheet = new ServerStyleSheet()

              // Extract bundle split chunks for SSR
              let bundleJSX
              let html

              /**
               * This is the stats file generated by Force's webpack setup, via
               * @loadable/webpack-plugin.
               *
               * @see https://github.com/damassi/force/blob/master/webpack/envs/baseConfig.js#L94
               */
              let statsFile
              try {
                statsFile = path.resolve(
                  process.cwd(),
                  "public/assets",
                  "loadable-stats.json"
                )
              } catch (error) {
                console.log(
                  "[Artsy/Router/buildServerApp.tsx] Error:",
                  "Missing loadable-stats.json file"
                )
              }

              // FIXME: Remove once EXPERIMENTAL_APP_SHELL A/B test completes
              const entrypoints = []
              if (getENV("EXPERIMENTAL_APP_SHELL")) {
                entrypoints.push("experimental-app-shell")
              }

              const extractor = new ChunkExtractor({
                statsFile,
                entrypoints,
                // entrypoints: [
                //   // FIXME: Remove once EXPERIMENTAL_APP_SHELL A/B test completes
                //   // (rename entrypoint)
                //   // "experimental-app-shell",
                // ],
              })

              // Wrap component tree in library contexts to extract usage
              bundleJSX = extractor.collectChunks(
                sheet.collectStyles(<ServerApp tags={headTags} />)
              )

              html = ReactDOMServer.renderToString(bundleJSX)

              // Extract all dynamic `import()` bundle split tags from app
              const bundleScriptTags = extractor.getScriptTags()

              scripts.push(
                bundleScriptTags
                  .split("\n")
                  .map(script => {
                    /**
                     * In production, prefix injected script src with CDN endpoint.
                     * @see https://github.com/artsy/force/blob/master/src/lib/middleware/assetMiddleware.ts#L23
                     */
                    if (getENV("CDN_URL")) {
                      const scriptTagWithCDN = script.replace(
                        /src="\/assets/g,
                        `src="${getENV("CDN_URL")}/assets`
                      )
                      return scriptTagWithCDN
                    } else {
                      return script
                    }
                  })
                  .filter(script => {
                    return !(
                      /**
                       * Since these files are already embedded in our main
                       * layout file, omit them from the scripts array.
                       *
                       * TODO: Don't include these files in the main layout
                       * and instead relay on dynamically including them here.
                       * Will require some shuffling in the jade template,
                       * however.
                       */
                      (
                        script.includes("/assets/runtime-manifest.") ||
                        script.includes("/assets/common.")
                      )
                    )
                  })
                  .join("\n")
              )

              // TODO: Wire up if A/B test is successful
              // extractor.getLinkTags()

              // Get serializable Relay data for rehydration on the client
              const data = await relayEnvironment.relaySSRMiddleware.getCache()

              // Extract CSS styleTags to inject for SSR pass
              const tags = sheet.getStyleTags()

              return {
                relayData: data,
                styleTags: tags,
                bodyHTML: html,
              }
            })()
          )

          // Strip response of problematic data structures
          const relayData = cleanRelayData(_relayData)

          scripts.push(`
            <script>
              var __RELAY_BOOTSTRAP__ = ${serializeRelayData(relayData)};
            </script>
          `)

          const result = {
            bodyHTML,
            status: farceResults.status,
            headTags,
            styleTags,
            scripts: scripts.join("\n"),
          }

          // Only exporting this for testing purposes, don't go around using this
          // elsewhere, we’re serious.
          if (typeof jest !== "undefined") {
            Object.defineProperty(
              result,
              __THOU_SHALT_NOT_FAFF_AROUND_WITH_THIS_HERE_OBJECT_WE_ARE_SERIOUS__,
              { value: ServerApp }
            )
          }

          resolve(result)
        }
      } catch (error) {
        logger.error(error)
        reject(error)
      }
    })
  )
}

export const __THOU_SHALT_NOT_FAFF_AROUND_WITH_THIS_HERE_OBJECT_WE_ARE_SERIOUS__ =
  typeof jest !== "undefined" ? Symbol() : null

function isRedirect(
  farceResult: FarceElementResult | FarceRedirectResult
): farceResult is FarceRedirectResult {
  return farceResult.hasOwnProperty("redirect")
}

/**
 * FIXME: Relay SSR middleware is passing a _res object across which
 * has circular references, leading to issues *ONLY* on staging / prod
 * which can't be reproduced locally. This strips out _res as a quickfix
 * though this should be PR'd back at relay-modern-network-modern-ssr.
 */
function cleanRelayData(relayData: any) {
  try {
    relayData.forEach(item => {
      item.forEach(i => {
        delete i._res
      })
    })
  } catch (error) {
    console.error("[Artsy/Router/buildServerApp] Error cleaning data", error)
  }

  return relayData
}
/**
 * Serialize data for client-side consumption
 */
function serializeRelayData(relayData: any) {
  let hydrationData
  try {
    hydrationData = serialize(relayData, {
      isJSON: true,
    })
  } catch (error) {
    hydrationData = "{}"
    console.error(
      "[Artsy/Router/buildServerApp] Error serializing data:",
      error
    )
  }
  return serialize(hydrationData || {}, {
    isJSON: true,
  })
}
