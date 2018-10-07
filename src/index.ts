import * as dual from 'dual-range-bar';

// Configurations

interface Config {
  canvasID: string,
  // The grid series
  gridSeries?: number[][],
  // Coordinate limit
  minX?:number, maxX?: number, minY?:number, maxY?:number,
};

var defaultConfig: Config = {
  canvasID: 'preview',
  gridSeries: [[0.1, 0.1], [0.2, 0.2], [0.5, 0.1], [1, 0.5], [2, 2], [5, 1], [10, 1]],
  minX: -4000, maxX: 4000, minY: -6000, maxY: 6000,
};

var config: Config = defaultConfig;

(function checkWhenImported(): void {
  // Check if the script is running on a browser environment
  if(typeof window === 'undefined')
    throw Error('Grid paper only works on a browser.\nPlease check out if your configuration is correct.');
  // Check paper
  if(typeof paper === 'undefined')
    throw Error('paper.js is not detected.\nThis might happen due to a broken dependency');
})();

// Current bound of the window
// [Right top, Left bottom] corners of the canvas
var currentBound: paper.Point[] = [];

// Canvas bound of the window
var canvasSize: paper.Point;

// A user interface on canvas
class CanvasUI {
  private container:  HTMLElement;
  private uiOverlay:  HTMLElement;
  private horizontalBar: dual.HRange;
  private verticalBar:   dual.VRange;
  canvas:             HTMLElement;
  displayRect:        { minX: number, maxX: number, minY: number, maxY: number };

  constructor(container: HTMLElement) {
    this.container = container;
    this.container.style.position = 'relative';
    // Create canvas
    this.canvas = document.createElement('canvas');
    this.canvas.style.position = 'absolute';
    this.canvas.id = (this.container.id ? this.container.id : 'preview-container') + '-canvas';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.container.appendChild(this.canvas);
    // Create UI Overlay
    this.uiOverlay = document.createElement('div');
    this.uiOverlay.style.position = 'relative';
    this.uiOverlay.style.width = '100%';
    this.uiOverlay.style.height = '100%';
    this.container.appendChild(this.uiOverlay);
    // Horizontal dual range bar for scrolling
    let hbarContainer = document.createElement('div');
    hbarContainer.style.height = '20px';
    hbarContainer.style.width = 'calc(100% - 100px)';
    hbarContainer.style.margin = '10px 50px';
    hbarContainer.style.position = 'absolute';
    hbarContainer.style.bottom = '0px';
    let hbar = document.createElement('div');
    hbar.id = 'horizontal-scrolling-bar';
    hbar.style.height = '100%';
    hbar.style.width = '100%';
    hbar.style.position = 'relative';
    hbarContainer.appendChild(hbar);
    this.uiOverlay.appendChild(hbarContainer);
    this.horizontalBar = dual.HRange.getObject(hbar.id);
    // Vertical dual range bar for scrolling
    let vbarContainer = document.createElement('div');
    vbarContainer.style.height = 'calc(100% - 100px)';
    vbarContainer.style.width = '20px';
    vbarContainer.style.margin = '50px 10px';
    vbarContainer.style.position = 'absolute';
    vbarContainer.style.right = '0px';
    let vbar = document.createElement('div');
    vbar.id = 'vertical-scrolling-bar';
    vbar.style.height = '100%';
    vbar.style.width = '100%';
    vbar.style.position = 'relative';
    vbarContainer.appendChild(vbar);
    this.uiOverlay.appendChild(vbarContainer);
    this.verticalBar = dual.VRange.getObject(vbar.id);
    (window as any)['canvasUI'] = this;
    this.initView();
    this.horizontalBar.addLowerRangeChangeCallback((val: number) => { this.syncViewByHorizontal() });
    this.horizontalBar.addUpperRangeChangeCallback((val: number) => { this.syncViewByHorizontal() });
    this.verticalBar.addLowerRangeChangeCallback((val: number) => { this.syncViewByVertical() });
    this.verticalBar.addUpperRangeChangeCallback((val: number) => { this.syncViewByVertical() });
  }

  initView(): void {
    // Init the display view to fit the whole window
    this.displayRect.minX = config.minX;
    this.displayRect.maxX = config.maxX;
    this.displayRect.minY = config.minY;
    this.displayRect.maxY = config.maxY;
  }

  // Synchronize the display rect with the UI elements & v.v.
  syncViewByHorizontal(): void {
    let minX = this.horizontalBar.lowerRange;
    let maxX = this.horizontalBar.upperRange;
    // TODO
  }
  syncViewByVertical(): void {

  }

  destruct(): void {
    this.container.removeChild(this.uiOverlay);
  }
};

window.addEventListener('load', () => {
  try {
    var div: HTMLElement = document.getElementById(config.canvasID);
    var ui = new CanvasUI(div);
    
    paper.setup(ui.canvas.id);
    paper.tool = new paper.Tool();
    paper.tool.onMouseDown = (event: paper.ToolEvent) => {
      paper.project.view.translate(new paper.Point(10, 10));
    }
    var path = new paper.Path();
    path.strokeColor = 'black';
    path.add(new paper.Point(0, 0));
    path.add(new paper.Point(400, 300));
  } catch(err) { console.log(err); }
});
