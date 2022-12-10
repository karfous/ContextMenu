class Shape {}
class Rectangle {}
class Circle {}

class ShapeView {}
class RectangleView {}
class CircleView {}
class ContextMenuView {}

class AppCollection {
  constructor() {}
  getShapesFromLocalStorage() {}
}
class CollectionView {
  constructor() {
    this.view = document.createElement("div");
    this.collection = this.createCollection(); // this will save all shape models

    this.view.className = "container px-1 bg-light border border-1 rounded";
    this.view.style.height = "500px";
    this.view.addEventListener("contextmenu", this.handleContextMenuClick);
  }

  render(id) {
    // this should render main view
    // what about views for all of the shapes in collection?
    const container = document.getElementById(id);
    container.appendChild(this.view);
  }

  /* this will take care of context menu appearence 
  - decide wheter you click in the blank space
  - or you click on a shape */
  handleContextMenuClick(e) {
    e.preventDefault();
    console.log(e);
  }

  createCollection() {
    // factory function that can be overriden
    return new AppCollection();
  }
}

const appView = new CollectionView();
appView.render("app");
