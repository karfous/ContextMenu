class Shape {}
class Rectangle {}
class Circle {}

class ShapeView {
  constructor(model) {
    this.model = model;
    this.el = document.createElement("div");
    this.el.className = "position-absolute bg-warning border border-1 rounded";
  }

  render() {}

  setElPosition() {
    this.el.style.top = this.position.top;
    this.el.style.left = this.position.left;
  }
}
class RectangleView extends ShapeView {
  constructor(model) {
    super(model);
    this.width = this.model.width;
    this.height = this.model.height;
    this.position = this.model.position;
  }
  render() {
    this.el.style.height = this.height;
    this.el.style.width = this.width;
    this.setElPosition();
    const container = document.getElementById("app-container"); // TODO
    container.appendChild(this.el);
  }
}
class CircleView extends ShapeView {
  constructor(model) {
    super(model);
    this.radius = this.model.radius;
    this.position = this.model.position;
  }

  render() {
    this.el.style.height = this.radius;
    this.el.style.width = this.radius;
    this.el.classList.add("rounded-circle");
    this.setElPosition();
    const container = document.getElementById("app-container"); // TODO
    container.appendChild(this.el);
  }
}
class ContextMenuView {}

class AppCollection {
  constructor() {}
  getShapesFromLocalStorage() {}
}
class CollectionView {
  constructor() {
    this.el = document.createElement("div");
    this.collection = this.createCollection(); // this will save all shape models

    this.el.className =
      "container position-relative px-1 bg-light border border-1 rounded";
    this.el.id = "app-container";
    this.el.style.height = "500px";
    this.el.addEventListener(
      "contextmenu",
      this.handleContextMenuClick.bind(this)
    );
  }

  render(id) {
    // this should render main view
    // what about views for all of the shapes in collection?
    const container = document.getElementById(id);
    container.appendChild(this.el);
  }

  /* this will take care of context menu appearence 
  - decide wheter you click in the blank space
  - or you click on a shape */
  handleContextMenuClick(e) {
    e.preventDefault();
    if (this.isClickedOnObject(e)) {
      // show simple context menu
      alert("Area");
    } else {
      //show some options to manipulate with object
      alert("Object");
    }
  }

  isClickedOnObject(e) {
    return e.target == this.el;
  }

  createCollection() {
    // factory function that can be overriden
    return new AppCollection();
  }
}

const appView = new CollectionView();
appView.render("app");

const rect = new RectangleView({
  width: "50px",
  height: "50px",
  position: { top: "70px", left: "10px" },
});
rect.render();
const circ = new CircleView({
  radius: "70px",
  position: { top: "170px", left: "150px" },
});
circ.render();
