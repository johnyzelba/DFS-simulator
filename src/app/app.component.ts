import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { GraphService } from './core/services/graph.service';
import { DFSService } from './core/services/dfs.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [GraphService]

})
export class AppComponent {

  @ViewChild('canvas', { static: false }) htmlCanvas: ElementRef;
  title = 'weighted-graph';
  public context: CanvasRenderingContext2D;
  public mouseBehavior: {
    mouseDownOn: {
      x: number,
      y: number,
    };
    mouseUpOn: {
      x: number,
      y: number,
    };
    ismousePositionChanged: boolean;
    ismouseDown: boolean;
    ismouseDownOnEdge: boolean;
  };
  alpha = 0;
  delta = 0.02;
  headerHeight = 120;
  graphProperties: {
    isGraphDirected: boolean,
    isGraphWeighted: boolean,
    defaultEdgeColor: string,
    visitedEdgeColor: string,
    firstEdgeColor: string,
  };
  edgeToBeFaded: any;
  stopAnimationPropagation: boolean;

  constructor(private graphService: GraphService, private dfsService: DFSService) {
    this.graphService.setEdgesRdius(25);
    this.graphProperties = {
      isGraphDirected: false,
      isGraphWeighted: false,
      defaultEdgeColor: '#484848',
      visitedEdgeColor: '#909090',
      firstEdgeColor: '#007bff',

    };
    this.mouseBehavior = {
      mouseDownOn: {
        x: 0,
        y: 0,
      },
      mouseUpOn: {
        x: 0,
        y: 0,
      },
      ismouseDown: false,
      ismousePositionChanged: false,
      ismouseDownOnEdge: false,
    }
  }

  ngAfterViewInit(): void {
    this.htmlCanvas.nativeElement.width = window.innerWidth;
    this.htmlCanvas.nativeElement.height = window.innerHeight + this.headerHeight;
    this.context = this.htmlCanvas.nativeElement.getContext('2d');
  }

  onResize(event) {
    this.htmlCanvas.nativeElement.width = window.innerWidth;
    this.htmlCanvas.nativeElement.height = window.innerHeight + this.headerHeight;
    this.redraw();
  }

  onMouseDown(event) {
    this.stopAnimationPropagation = true;
    this.mouseBehavior.ismouseDown = true;
    this.mouseBehavior.mouseDownOn.x = event.clientX;
    this.mouseBehavior.mouseDownOn.y = event.clientY - this.headerHeight;
    let coordinates = this.graphService.getCoordinatesOfOverlapingEdge(this.mouseBehavior.mouseDownOn.x, this.mouseBehavior.mouseDownOn.y);
    if (coordinates == undefined)
      this.mouseBehavior.ismouseDownOnEdge = false;
    else {
      this.mouseBehavior.ismouseDownOnEdge = true;
      this.mouseBehavior.mouseDownOn.x = coordinates.x;
      this.mouseBehavior.mouseDownOn.y = coordinates.y;
    }
  }

  onMouseUp(event) {
    this.mouseBehavior.ismouseDown = false;
    this.mouseBehavior.mouseUpOn.x = event.clientX;
    this.mouseBehavior.mouseUpOn.y = event.clientY - this.headerHeight;
    if ((this.mouseBehavior.mouseDownOn.x != this.mouseBehavior.mouseUpOn.x) || (this.mouseBehavior.mouseDownOn.y != this.mouseBehavior.mouseUpOn.y)) {
      this.mouseBehavior.ismousePositionChanged = true;
      let coordinates = this.graphService.getCoordinatesOfOverlapingEdge(this.mouseBehavior.mouseUpOn.x, this.mouseBehavior.mouseUpOn.y);
      if (coordinates != undefined) {
        if (this.mouseBehavior.ismouseDownOnEdge) {
          this.context.clearRect(0, 0, window.innerWidth, window.innerHeight);
          this.SetNewVertex(this.mouseBehavior.mouseDownOn.x, this.mouseBehavior.mouseDownOn.y, coordinates.x, coordinates.y);
          this.redraw();
        }
      } else {
        this.context.clearRect(0, 0, window.innerWidth, window.innerHeight);
        this.redraw();
      }
    } else {
      this.mouseBehavior.ismousePositionChanged = false;
      if (this.mouseBehavior.ismouseDownOnEdge) {
      } else {
        this.SetNewEdge(this.mouseBehavior.mouseUpOn.x, this.mouseBehavior.mouseUpOn.y + this.headerHeight);
      }
    }
  }

  onMouseMove(event) {
    if (this.mouseBehavior.ismouseDown) {
      this.context.clearRect(0, 0, window.innerWidth, window.innerHeight + this.headerHeight);
      if (this.mouseBehavior.ismouseDownOnEdge) {
        this.context.beginPath();
        this.context.moveTo(this.mouseBehavior.mouseDownOn.x, this.mouseBehavior.mouseDownOn.y);
        this.context.lineTo(event.clientX, event.clientY - this.headerHeight);
        this.context.stroke();
      }
      this.redraw();
    }
  }

  SetNewVertex(xA: number, yA: number, xB: number, yB: number) {
    let edgeA = this.graphService.getEdgeByCoordinates(xA, yA);
    let edgeB = this.graphService.getEdgeByCoordinates(xB, yB);
    let vertex = [edgeA.id, edgeB.id];
    if (!this.graphService.isVertexExist(vertex)) {
      this.graphService.addVertex(edgeA, edgeB);
      this.drawVertex(vertex);
    }
  }

  SetNewEdge(x: number, y: number) {
    this.graphService.addEdge(x, y - this.headerHeight);
    this.alpha = 0;
    this.redraw();
  }

  redraw() {
    this.context.lineWidth = 6;
    this.context.fillStyle = '#484848';
    this.context.strokeStyle = '#d2d2d2';
    this.context.globalAlpha = 1;
    this.drawVertices();
    this.graphService.getEdges().forEach((edge, index) => {
      if (index < (this.graphService.getEdges().length - 1)) {
        this.alpha = 1;
        if (index == 0)
          this.drawEdge(edge, this.graphProperties.firstEdgeColor);
        else
          this.drawEdge(edge, this.graphProperties.defaultEdgeColor);
      } else {
        if (!this.mouseBehavior.ismouseDownOnEdge)
          this.alpha = 0;
        this.fadeLastEdge();
      }
    });
  }

  drawVertices() {
    let vercities = this.graphService.getVertices();
    vercities.forEach(vertex => {
      this.drawVertex(vertex);
    });

    this.graphService.getWeights().forEach((weight, index) => {
      this.drawVertexWeight(vercities[index], weight);
    });
  }

  drawVertex(vertex) {
    let edgeA = this.graphService.getEdgeById(vertex[0]);
    let edgeB = this.graphService.getEdgeById(vertex[1]);
    let slope = (edgeB.y - edgeA.y) / (edgeB.x - edgeA.x);
    let theta = Math.atan(slope);
    let perpendicularTtheta = Math.atan(-1 * (1 / slope));
    this.context.beginPath();
    this.context.moveTo(edgeA.x, edgeA.y);
    this.context.lineTo(edgeB.x, edgeB.y);
    if (this.graphProperties.isGraphDirected) {
      this.context.fillStyle = '#d2d2d2';
      if ((edgeB.x - edgeA.x) <= 0) {
        var triangleBaseX: number = edgeB.x + 35 * Math.cos(theta);
        var triangleBaseY: number = edgeB.y + 35 * Math.sin(theta);
      } else {
        var triangleBaseX: number = edgeB.x - 35 * Math.cos(theta);
        var triangleBaseY: number = edgeB.y - 35 * Math.sin(theta);
      }
      this.context.lineTo(triangleBaseX + 8 * Math.cos(perpendicularTtheta), triangleBaseY + 8 * Math.sin(perpendicularTtheta));
      this.context.lineTo(triangleBaseX - 8 * Math.cos(perpendicularTtheta), triangleBaseY - 8 * Math.sin(perpendicularTtheta));
      this.context.lineTo(edgeB.x, edgeB.y);
      this.context.fill();
    }
    this.context.fillStyle = '#484848';
    this.context.stroke();
  }

  drawVertexWeight(vertex, weight) {
    let edgeA = this.graphService.getEdgeById(vertex[0]);
    let edgeB = this.graphService.getEdgeById(vertex[1]);
    let avgX = (edgeA.x + edgeB.x) / 2;
    let avgy = (edgeA.y + edgeB.y) / 2;
    if (this.graphProperties.isGraphWeighted) {
      this.context.font = "18px Arial";
      this.context.fillText(Math.floor(weight).toString(), avgX, avgy);
    }
  }

  drawEdge(edge, color) {
    this.context.beginPath();
    this.context.fillStyle = color;
    this.context.arc(edge.x, edge.y, this.graphService.getEdgesRdius(), 0, 2 * Math.PI);
    this.context.fill();
    this.context.font = "26px Arial";
    this.context.fillStyle = '#fff';
    if (edge.id == 0)
      this.context.fillText("S", edge.x - 7.5, edge.y + 8.5);
    else
      this.context.fillText(edge.id.toString(), edge.x + 0.5 - (8 * edge.id.toString().length), edge.y + 8.5);
  }

  fadeLastEdge() {
    let edges = this.graphService.getEdges();
    let lastEdge = edges[edges.length - 1];
    this.alpha += this.delta;
    this.context.globalAlpha = this.alpha;
    if (edges.length == 1)
      this.drawEdge(lastEdge, this.graphProperties.firstEdgeColor);
    else
      this.drawEdge(lastEdge, this.graphProperties.defaultEdgeColor);
    if (this.alpha < 1)
      requestAnimationFrame(this.fadeLastEdge.bind(this));
  }

  fadeVisitedEdge() {
    this.alpha += this.delta;
    this.context.globalAlpha = this.alpha;
    this.drawEdge(this.edgeToBeFaded, this.graphProperties.visitedEdgeColor);
    if (this.alpha < 1)
      requestAnimationFrame(this.fadeVisitedEdge.bind(this));
  }

  onGraphPropertiesChanged(event) {
    this.graphProperties = {
      ...this.graphProperties
      , ...event
    };
    this.context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    this.redraw()
  }

  onClear() {
    this.context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    this.mouseBehavior.ismouseDown = false;
    this.mouseBehavior.ismousePositionChanged = false;
    this.mouseBehavior.ismouseDownOnEdge = false;
    this.graphService.clearGraph();
  }

  onSimulate() {
    let vertices = this.graphService.getVertices();
    let edges = this.graphService.getEdges();
    if (!this.graphProperties.isGraphDirected) {
      vertices.map(vertex => {
        if (!this.graphService.isVertexExist([vertex[1], vertex[0]])) {
          vertices.push([vertex[1], vertex[0]])
        }
      })
    }
    let pathToSimulate = this.dfsService.DFS(edges, vertices);
    this.stopAnimationPropagation = false
    pathToSimulate.forEach((edgeOrVertex, index) => {
      setTimeout(() => {
        if (typeof (edgeOrVertex) == 'number') {
          if (!this.stopAnimationPropagation) {
            this.edgeToBeFaded = this.graphService.getEdgeById(edgeOrVertex);
            this.alpha = 0;
            this.fadeVisitedEdge()
          } else {
            this.redraw();
          }
        }
      }, index * 500);
    })
  }
}
