export interface Edge {
  id: number;
  x: number;
  y: number;
}

export interface Vertex {
  edges: Array<number>;
}

export abstract class Graph {
  edges: Set<Edge>;
  vertices: Map<string, number>;
  constructor(edges, vertices) {
    this.edges = edges;
    this.vertices = vertices;
  }
  abstract getEdgeById(id: number): Edge;
  abstract getEdges(): Array<Edge>;
  abstract getVertices(): Array<Vertex>;
  abstract addEdge(x: number, y: number): void;
  abstract addVertex(edgeA: Edge, edgeB: Edge): void;
  abstract calcEdgesDistance(cordinateAx: number, cordinateAy: number, cordinateBx: number, cordinateBy: number): number;
  abstract clearGraph(): void;

}

