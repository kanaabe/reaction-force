import { storiesOf } from "@storybook/react"
import React from "react"
import { Media } from "../Fixtures/Components"
import { VideoPlayer } from "../VideoPlayer/VideoPlayer"

storiesOf("Publishing/Video Player", module)
  .add("Video Player", () => {
    return (
      <div style={{ width: "100vw", height: "100vh" }}>
        <VideoPlayer {...Media[0]} />
      </div>
    )
  })
