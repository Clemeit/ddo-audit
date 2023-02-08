import React from "react";
import { Slider, Rail, Handles, Tracks, Ticks } from "react-compound-slider";

const sliderStyle = {
  // Give the slider some width
  position: "relative",
  width: "100%",
  height: 50,
};

const MAX_LEVEL = 32;

export function Handle({ handle: { id, value, percent }, getHandleProps }) {
  return (
    <div
      className="slider-handle"
      style={{
        left: `${percent}%`,
      }}
      {...getHandleProps(id)}
    >
      <div style={{ marginTop: -25, fontSize: "large" }}>{value}</div>
    </div>
  );
}

function Track({ source, target, getTrackProps }) {
  return (
    <div
      className="slider-track"
      style={{
        left: `${source.percent}%`,
        width: `${target.percent - source.percent}%`,
      }}
      {
        ...getTrackProps() /* this will set up events if you want it to be clickeable (optional) */
      }
    />
  );
}

const LevelRangeSlider = (props) => {
  return (
    <Slider
      rootStyle={sliderStyle}
      domain={[1, MAX_LEVEL]}
      step={1}
      mode={1}
      values={[props.minimumLevel, props.maximumLevel]}
      onChange={props.handleChange}
    >
      <Rail>
        {({ getRailProps }) => (
          <div className="slider-rail" {...getRailProps()} />
        )}
      </Rail>
      <Handles>
        {({ handles, getHandleProps }) => (
          <div className="slider-handles">
            {handles.map((handle) => (
              <Handle
                key={handle.id}
                handle={handle}
                getHandleProps={getHandleProps}
              />
            ))}
          </div>
        )}
      </Handles>
      <Tracks left={false} right={false}>
        {({ tracks, getTrackProps }) => (
          <div className="slider-tracks">
            {tracks.map(({ id, source, target }) => (
              <Track
                key={id}
                source={source}
                target={target}
                getTrackProps={getTrackProps}
              />
            ))}
          </div>
        )}
      </Tracks>
    </Slider>
  );
};

export default LevelRangeSlider;
