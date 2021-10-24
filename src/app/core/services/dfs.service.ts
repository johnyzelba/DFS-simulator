import { Injectable } from '@angular/core';
import { Graph, Edge, Vertex } from '../data/graph';
import { queue } from 'rxjs/internal/scheduler/queue';

@Injectable({
  providedIn: 'root'
})
export class DFSService {

  constructor() { }

  DFS(edges: Edge[], verticies: Vertex[]) {
    let s = new Array();
    let explored = new Set();
    let edgeToVertexPath = new Array();
    s.push(edges[0].id);
    explored.add(edges[0].id);
    while (s.length > 0) {
      let t = s.pop();
      edgeToVertexPath.push(t);

      // 1. In the edges object, we search for nodes this node is directly connected to.
      // 2. We filter out the nodes that have already been explored.
      // 3. Then we mark each unexplored node as explored and push it to the Stack.

      verticies.filter(vertex => !explored.has(vertex[1]) && vertex[0] == t)
        .forEach(vertex => {
          explored.add(vertex[1]);
          s.push(vertex[1]);
        });
    }

    return edgeToVertexPath;
  }
}
