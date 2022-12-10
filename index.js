class Shape {}
class Rectangle {}
class Circle {}

// save some models to local storage
// testing only
const myShapes = [
  {
    type: "rectangle",
    width: "50px",
    height: "50px",
    position: { top: "70px", left: "10px" },
  },
  {
    type: "circle",
    radius: "70px",
    position: { top: "170px", left: "150px" },
  },
];
localStorage.setItem("myShapes", JSON.stringify(myShapes));
class ShapeView {
  constructor(model) {
    this.model = model;
    this.el = document.createElement("div");
  }

  render() {}

  setElPosition() {
    this.el.style.top = this.position.top;
    this.el.style.left = this.position.left;
  }

  appendView(element) {
    element.appendChild(this.el);
  }
}
class RectangleView extends ShapeView {
  constructor(model) {
    super(model);
    this.el.className = "position-absolute bg-warning border border-1 rounded";
    this.width = this.model.width;
    this.height = this.model.height;
    this.position = this.model.position;
  }
  render(element) {
    this.el.style.height = this.height;
    this.el.style.width = this.width;
    this.setElPosition();
    this.appendView(element);
  }
}
class CircleView extends ShapeView {
  constructor(model) {
    super(model);
    this.el.className =
      "position-absolute bg-warning border border-1 rounded-circle";
    this.radius = this.model.radius;
    this.position = this.model.position;
  }

  render(element) {
    this.el.style.height = this.radius;
    this.el.style.width = this.radius;
    this.el.classList.add("rounded-circle");
    this.setElPosition();
    this.appendView(element);
  }
}
class ContextMenuView {}

class AppCollection {
  constructor() {
    this.models = this.getShapesFromLocalStorage();
  }
  getShapesFromLocalStorage() {
    const models = JSON.parse(localStorage.getItem("myShapes"));
    return models ? models : [];
  }
}
class CollectionView {
  constructor() {
    this.el = document.createElement("div");
    this.collection = this.createCollection(); // this will save all shape models
    this.childViews = this.getChildViews();

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
    // and also all the childViews
    this.childViews.forEach((view) => {
      view.render(this.el);
    });
    const container = document.getElementById(id);
    container.appendChild(this.el);
  }

  getChildViews() {
    const allViews = [];
    this.collection.models.forEach((model) => {
      const View = this.getShapeView(model);
      allViews.push(new View(model));
    });
    return allViews;
  }

  getShapeView(model) {
    const shapeViewsList = {
      rectangle: RectangleView,
      circle: CircleView,
    };

    return shapeViewsList[model.type];
  }

  renderChild(model, view) {}

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
    console.log(this);
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

// const rect = new RectangleView({
//   width: "50px",
//   height: "50px",
//   position: { top: "70px", left: "10px" },
// });
// rect.render();
// const circ = new CircleView({
//   radius: "70px",
//   position: { top: "170px", left: "150px" },
// });
// circ.render();
