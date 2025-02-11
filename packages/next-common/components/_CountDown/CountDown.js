import React, { useEffect, useMemo, useRef } from "react";
import { select } from "d3-selection";
import { arc } from "d3-shape";
import Tooltip from "../tooltip";
import styled from "styled-components";

const Wrapper = styled.div`
  &,
  /* tooltip component */
  & > div {
    display: inline-flex;
  }
`;

const SVG = styled.svg`
  g {
    path:first-child {
      fill: ${(p) => p.foregroundColor};
    }
    path:last-child {
      fill: ${(p) => p.backgroundColor};
    }
  }
`;

export default function CountDown(props) {
  const {
    numerator = 0,
    denominator = 0,
    size = 12,
    backgroundColor = "#FFF2D9",
    foregroundColor = "#F2B12F",
    tooltipContent,
  } = props ?? {};

  const svgElement = useRef(null);

  const percent = useMemo(() => {
    const v = numerator / denominator;

    if (v >= 1) {
      return 100;
    }

    return parseInt(v * 100);
  }, [numerator, denominator]);

  useEffect(() => {
    const outerRadius = size / 2;
    const innerRadius = outerRadius / 2;
    const angle = (2 * Math.PI * percent) / 100;

    const svgEl = select(svgElement.current);
    svgEl.selectAll("*").remove();
    const svg = svgEl
      .append("g")
      .attr("transform", `translate(${outerRadius},${outerRadius})`);

    const arc1 = arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .startAngle(0)
      .endAngle(angle);
    svg.append("path").attr("d", arc1).style("stroke-width", "0");

    const arc2 = arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .startAngle(angle)
      .endAngle(2 * Math.PI);
    svg.append("path").attr("d", arc2).style("stroke-width", "0");
  }, [percent, size, svgElement]);

  return (
    <Wrapper>
      <Tooltip content={tooltipContent}>
        <SVG
          ref={svgElement}
          width={size}
          height={size}
          foregroundColor={foregroundColor}
          backgroundColor={backgroundColor}
        />
      </Tooltip>
    </Wrapper>
  );
}
