"use client";

import * as d3 from "d3";

import { useEffect, useRef } from "react";

import { TableData } from "../types/types";

const CANVAS_SIZE = 256;
const EDGE_REPEL_MARGIN = 20;
const LINK_DISTANCE = 20;
const EDGE_REPEL_STRENGTH = 5;
const CHARGE_STRENGTH = -20;

interface Node {
  id: string;
  type: "project" | "tag";
  url?: string;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}
interface Link {
  source: string;
  target: string;
}

const createGraphData = (projects: TableData) => {
  const nodes: Node[] = [];
  const links: Link[] = [];
  const tagSet = new Set<string>();
  projects.rows.forEach((project) => {
    nodes.push({ id: project.key, type: "project", url: project.url });
    Object.keys(project.relations).forEach((relation) => {
      tagSet.add(relation);
      links.push({ source: project.key, target: relation });
    });
  });
  tagSet.forEach((tag) => nodes.push({ id: tag, type: "tag" }));
  return { nodes, links };
};

export default function projectsVisual({
  projects,
  hoveredProject,
  hoveredTag,
  setHoveredProject,
  setHoveredTag,
}: {
  projects: TableData;
  hoveredProject: string | null;
  hoveredTag?: string | null;
  setHoveredProject: (name: string | null) => void;
  setHoveredTag: (tag: string | null) => void;
}) {
  const d3Container = useRef<SVGSVGElement | null>(null);
  const nodeSelectionRef = useRef<d3.Selection<
    SVGCircleElement | d3.BaseType,
    Node,
    SVGGElement,
    unknown
  > | null>(null);

  useEffect(() => {
    let simulation: d3.Simulation<Node, undefined>;
    const { nodes, links } = createGraphData(projects);
    const svg = d3.select(d3Container.current);
    svg.selectAll("*").remove();
    svg.attr("width", CANVAS_SIZE).attr("height", CANVAS_SIZE);

    simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d: any) => d.id)
          .distance(LINK_DISTANCE)
      )
      .force("charge", d3.forceManyBody().strength(CHARGE_STRENGTH))
      .force("center", d3.forceCenter(CANVAS_SIZE / 2, CANVAS_SIZE / 2));

    const edgeRepelForce = () => {
      for (const node of nodes) {
        if (typeof node.x !== "number" || typeof node.y !== "number") continue;
        const n = node as any;
        if (node.x < EDGE_REPEL_MARGIN)
          n.vx = (n.vx ?? 0) + EDGE_REPEL_STRENGTH / (node.x + 1);
        if (node.x > CANVAS_SIZE - EDGE_REPEL_MARGIN)
          n.vx = (n.vx ?? 0) - EDGE_REPEL_STRENGTH / (CANVAS_SIZE - node.x + 1);
        if (node.y < EDGE_REPEL_MARGIN)
          n.vy = (n.vy ?? 0) + EDGE_REPEL_STRENGTH / (node.y + 1);
        if (node.y > CANVAS_SIZE - EDGE_REPEL_MARGIN)
          n.vy = (n.vy ?? 0) - EDGE_REPEL_STRENGTH / (CANVAS_SIZE - node.y + 1);
      }
    };
    simulation.force("edge-repel", edgeRepelForce);

    svg
      .append("g")
      .attr("stroke", "var(--color-fg)")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", "var(--stroke-edge)");

    const node = svg
      .append("g")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", (d) =>
        d.type === "project"
          ? "var(--radius-primary)"
          : "var(--radius-secondary)"
      )
      .attr("fill", (d) =>
        d.type === "project" ? "var(--color-blue)" : "var(--color-yellow)"
      )
      .attr("stroke", "none")
      .attr("stroke-width", 0)
      .style("cursor", (d) => (d.type === "project" ? "pointer" : "default"))
      .on("mouseenter", function (_, d) {
        d3.select(this)
          .attr("stroke", "var(--color-fg)")
          .attr("stroke-width", "var(--stroke-node-hover)")
          .attr(
            "fill",
            d.type === "project"
              ? "var(--color-blue-secondary)"
              : "var(--color-yellow-secondary)"
          );
        if (d.type === "project") setHoveredProject(d.id);
        if (d.type === "tag") setHoveredTag(d.id as any);
      })
      .on("mouseleave", function (_, d) {
        d3
          .select(this)
          .attr("stroke", "none")
          .attr("stroke-width", 0)
          .attr(
            "fill",
            d.type === "project" ? "var(--color-blue)" : "var(--color-yellow)"
          );
        if (d.type === "project") setHoveredProject(null);
        if (d.type === "tag") setHoveredTag(null as any);
      })
      .call(
        d3
          .drag<any, Node>()
          .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    node.on("click", (_, d) => {
      if (d.type === "project" && d.url) window.open(d.url, "_blank");
    });

    nodeSelectionRef.current = node;

    simulation.on("tick", () => {
      svg
        .selectAll("line")
        .attr("x1", (d) => (d as any).source.x)
        .attr("y1", (d) => (d as any).source.y)
        .attr("x2", (d) => (d as any).target.x)
        .attr("y2", (d) => (d as any).target.y);
      node.attr("cx", (d) => (d as any).x).attr("cy", (d) => (d as any).y);
    });
  }, [projects]);

  useEffect(() => {
    const node = nodeSelectionRef.current;
    if (!node) return;
    node
      .attr("stroke", (d) => {
        if (d.type === "project" && hoveredProject === d.id) return "var(--color-fg)";
        if (d.type === "tag" && hoveredTag === d.id) return "var(--color-fg)";
        return "none";
      })
      .attr("stroke-width", (d) => {
        if (d.type === "project" && hoveredProject === d.id)
          return "var(--stroke-node-hover)";
        if (d.type === "tag" && hoveredTag === d.id)
          return "var(--stroke-node-hover)";
        return 0;
      })
      .attr("fill", (d) => {
        if (d.type === "project" && hoveredProject === d.id)
          return "var(--color-blue-secondary)";
        if (d.type === "tag" && hoveredTag === d.id)
          return "var(--color-yellow-secondary)";
        return d.type === "project" ? "var(--color-blue)" : "var(--color-yellow)";
      });
  }, [hoveredProject, hoveredTag]);

  return <svg ref={d3Container} />;
}
