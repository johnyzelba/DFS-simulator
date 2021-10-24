import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Output() graphPropertiesChanged = new EventEmitter();  
  @Output() simulateGraph = new EventEmitter();
  @Output() clearGraph = new EventEmitter();

  graphProperties: {
    isGraphDirected: boolean,
    isGraphWeighted: boolean
  };

  constructor() {
    this.graphProperties = {
      isGraphDirected: false,
      isGraphWeighted: false
    }
  }

  ngOnInit() {
  }

  onClick() {
    this.graphPropertiesChanged.emit(this.graphProperties);
  }

  onClear() {
    this.clearGraph.emit();
  }

  onSimulate() {
    this.simulateGraph.emit();
  }
}
