import { Injectable } from '@angular/core';
import { Graph, Vertex, Edge } from '../data/graph';
import { inherits } from 'util';
@Injectable({
  providedIn: 'root'
})

export class GraphService implements Graph {
  edges: Set<Edge>;
  vertices: Map<string, number>;
  edgeRadius: number;
  constructor() {
    this.edges = new Set();
    this.vertices = new Map();
    this.edgeRadius = 10;
  }

  getEdgeByCoordinates(x: number, y: number) {
    let edgeToReturn: Edge;
    this.edges.forEach(edge => {
      if (this.calcEdgesDistance(edge.x, edge.y, x, y) < this.edgeRadius) {
        edgeToReturn = edge;
      }
    });
    return edgeToReturn;
  }

  getEdgeById(id: number) {
    let edgeToReturn: Edge;
    this.edges.forEach(edge => {
      if (edge.id == id) {
        edgeToReturn = edge;
      }
    });
    return edgeToReturn;
  }

  getGraph() {
    let tempGraph = {
      edges: [],
      verticies: []
    }
    this.edges.forEach(edge => {
      tempGraph.edges.push(edge);
    });
    this.vertices.forEach(vertex => {
      tempGraph.verticies.push(vertex);
    })
    return tempGraph;
  }

  getEdges() {
    let tempArr = [];
    this.edges.forEach(edge => {
      tempArr.push(edge);
    })
    return tempArr;
  }

  getVertices() {
    let tempArr = [];
    this.vertices.forEach((weight, vertex) => {
      tempArr.push(JSON.parse(vertex));
    })
    if (tempArr.length >= 2)
      tempArr.sort((a, b) => a[0] < b[0] || a[1] < b[1] ? -1 : 1);
    console.log('-=-=-=-=-', this.vertices, tempArr);

    return tempArr;
  }

  getWeights() {
    let tempArr = [];
    this.vertices.forEach(weight => {
      tempArr.push(weight);
    })
    return tempArr;
  }

  getEdgesRdius() {
    return this.edgeRadius;
  }

  getCoordinatesOfOverlapingEdge(x: number, y: number) {
    let coordinates: {
      x: number,
      y: number,
    };
    this.edges.forEach(edge => {
      if (this.calcEdgesDistance(edge.x, edge.y, x, y) < this.edgeRadius * 2) {
        coordinates = {
          x: edge.x,
          y: edge.y
        }
        return coordinates;
      }
    });
    return coordinates;
  }

  setEdgesRdius(radius: number) {
    this.edgeRadius = radius;
  }

  isCoordinateOverlapOtherEdges(x: number, y: number) {
    let flag = false;
    this.edges.forEach(edge => {
      if (!flag)
        if (this.calcEdgesDistance(edge.x, edge.y, x, y) < this.edgeRadius * 2)
          flag = true;
    })
    return flag;
  }

  isVertexExist(vertex: Array<number>) {
    return this.vertices.has(JSON.stringify(vertex));
  }

  addEdge(x: number, y: number) {
    this.edges.add({
      id: this.edges.size,
      x: x,
      y: y
    })
  }

  addVertex(edgeA: Edge, edgeB: Edge) {
    this.vertices.set(JSON.stringify([edgeA.id, edgeB.id]), this.calcEdgesDistance(edgeA.x, edgeA.y, edgeB.x, edgeB.y)
    );

  }

  calcEdgesDistance(cordinateAx: number, cordinateAy: number, cordinateBx: number, cordinateBy: number) {
    return Math.abs(Math.sqrt(Math.pow((cordinateAx - cordinateBx), 2) + Math.pow((cordinateAy - cordinateBy), 2)))
  }

  clearGraph() {
    this.edges.clear();
    this.vertices.clear();
  }
}
