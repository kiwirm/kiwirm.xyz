"use client";
import { useEffect, useRef } from "react";
import * as d3 from "d3";

const CANVAS_SIZE = 256;
const EDGE_REPEL_MARGIN = 20;
const LINK_DISTANCE = 20;
const EDGE_REPEL_STRENGTH = 5;
const CHARGE_STRENGTH = -20;

const PROJECT_COLOR = "var(--color-blue)";
const TAG_COLOR = "var(--color-yellow)";
const HIGHLIGHT_STROKE = "var(--color-fg)";
const PROJECT_RADIUS = 10;
const TAG_RADIUS = 7;
const LINE_STROKE_WIDTH = 1.5;
const HIGHLIGHT_STROKE_WIDTH = 3;

interface Project {
  name: string;
  description: string;
  url: string;
  tags: string[];
}
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
interface ProjectsGraphMiniProps {
  hoveredProject: string | null;
  hoveredTag?: string | null;
}

const createGraphData = (projects: Project[]) => {
  const nodes: Node[] = [];
  const links: Link[] = [];
  const tagSet = new Set<string>();
  projects.forEach((project) => {
    nodes.push({ id: project.name, type: "project", url: project.url });
    project.tags.forEach((tag) => {
      tagSet.add(tag);
      links.push({ source: project.name, target: tag });
    });
  });
  tagSet.forEach((tag) => nodes.push({ id: tag, type: "tag" }));
  return { nodes, links };
};

export default function ProjectsGraph({
  hoveredProject,
  hoveredTag,
}: ProjectsGraphMiniProps) {
  const d3Container = useRef<SVGSVGElement | null>(null);
  const nodeSelectionRef = useRef<d3.Selection<
    SVGCircleElement | d3.BaseType,
    Node,
    SVGGElement,
    unknown
  > | null>(null);

  useEffect(() => {
    let simulation: d3.Simulation<Node, undefined>;
    fetch("/projects.json")
      .then((res) => res.json())
      .then((data: Project[]) => {
        const { nodes, links } = createGraphData(data);
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
            if (node.x < EDGE_REPEL_MARGIN) n.vx = (n.vx ?? 0) + EDGE_REPEL_STRENGTH / (node.x + 1);
            if (node.x > CANVAS_SIZE - EDGE_REPEL_MARGIN) n.vx = (n.vx ?? 0) - EDGE_REPEL_STRENGTH / (CANVAS_SIZE - node.x + 1);
            if (node.y < EDGE_REPEL_MARGIN) n.vy = (n.vy ?? 0) + EDGE_REPEL_STRENGTH / (node.y + 1);
            if (node.y > CANVAS_SIZE - EDGE_REPEL_MARGIN) n.vy = (n.vy ?? 0) - EDGE_REPEL_STRENGTH / (CANVAS_SIZE - node.y + 1);
          }
        };
        simulation.force("edge-repel", edgeRepelForce);

        svg
          .append("g")
          .attr("stroke", HIGHLIGHT_STROKE)
          .selectAll("line")
          .data(links)
          .join("line")
          .attr("stroke-width", LINE_STROKE_WIDTH);

        const node = svg
          .append("g")
          .selectAll("circle")
          .data(nodes)
          .join("circle")
          .attr("r", (d) =>
            d.type === "project" ? PROJECT_RADIUS : TAG_RADIUS
          )
          .attr("fill", (d) =>
            d.type === "project" ? PROJECT_COLOR : TAG_COLOR
          )
          .attr("stroke", "none")
          .attr("stroke-width", 0)
          .style("cursor", (d) =>
            d.type === "project" ? "pointer" : "default"
          )
          .on("mouseenter", function (_, d) {
            d3.select(this)
              .attr("stroke", HIGHLIGHT_STROKE)
              .attr("stroke-width", HIGHLIGHT_STROKE_WIDTH);
          })
          .on("mouseleave", function () {
            d3.select(this).attr("stroke", "none").attr("stroke-width", 0);
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
      });
  }, []);

  useEffect(() => {
    if (!nodeSelectionRef.current) return;
    nodeSelectionRef.current
      .attr("stroke", (d) => {
        if (d.type === "project" && hoveredProject === d.id)
          return HIGHLIGHT_STROKE;
        if (d.type === "tag" && hoveredTag === d.id) return HIGHLIGHT_STROKE;
        return "none";
      })
      .attr("stroke-width", (d) => {
        if (d.type === "project" && hoveredProject === d.id)
          return HIGHLIGHT_STROKE_WIDTH;
        if (d.type === "tag" && hoveredTag === d.id)
          return HIGHLIGHT_STROKE_WIDTH;
        return 0;
      });
  }, [hoveredProject, hoveredTag]);

  return <svg ref={d3Container} />;
}
