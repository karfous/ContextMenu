//testing only

const testShapes = [
  {
    type: "rectangle",
    dimensions: { width: "50px", height: "50px" },
    position: { top: "70px", left: "10px" },
  },
  {
    type: "circle",
    dimensions: { radius: "70px" },
    position: { top: "170px", left: "200px" },
  },
];
localStorage.setItem("myShapes", JSON.stringify(testShapes));

class Shape {
  constructor(template) {
    this.attributes = { type: "" };
    this.set("position", template.position);
    this.set("dimensions", template.dimensions);
  }
  set(attribute, value) {
    this.attributes[attribute] = value;
  }
  get(attribute) {
    return this.attributes[attribute];
  }

  getPosition() {
    return this.get("position");
  }

  getType() {
    return this.get("type");
  }

  getSaveFormat() {
    return this.attributes;
  }
}
class Rectangle extends Shape {
  constructor(template) {
    super(template);
    this.set("type", "rectangle");
  }

  getHeight() {
    return this.get("dimensions").height;
  }
  getWidth() {
    return this.get("dimensions").width;
  }
}
class Circle extends Shape {
  constructor(template) {
    super(template);
    this.set("type", "circle");
  }

  getRadius() {
    return this.get("dimensions").radius;
  }
}

class ShapeView {
  constructor(model) {
    this.model = model;
    this.el = document.createElement("div");
    this.el.id = model.id;
    this.el.setAttribute("type", model.getType());
  }

  render() {}

  setElPosition() {
    this.el.style.top = this.model.getPosition().top;
    this.el.style.left = this.model.getPosition().left;
  }

  appendView(element) {
    element.appendChild(this.el);
  }
}
class RectangleView extends ShapeView {
  constructor(model) {
    super(model);
    this.el.className = "position-absolute bg-warning border border-1 rounded";
  }
  render(element) {
    this.el.style.height = this.model.getHeight();
    this.el.style.width = this.model.getWidth();
    this.setElPosition();
    this.appendView(element);
  }
}
class CircleView extends ShapeView {
  constructor(model) {
    super(model);
    this.el.className =
      "position-absolute bg-warning border border-1 rounded-circle";
  }

  render(element) {
    this.el.style.height = this.model.getRadius();
    this.el.style.width = this.model.getRadius();
    this.el.classList.add("rounded-circle");
    this.setElPosition();
    this.appendView(element);
  }
}
class ContextMenuView {}

class AppCollection {
  constructor() {
    this.models = [];

    this.getShapesFromLocalStorage();
    this.setShapeIds(); // will help me identify a shape in AppView

    this.saveShapesToLocalStorage();
  }

  setShapeIds() {
    let index = 1;
    this.models.forEach((shape) => {
      shape.id = index;
      index++;
    });
  }

  getShapesFromLocalStorage() {
    const templateModels = JSON.parse(localStorage.getItem("myShapes"));
    //
    if (templateModels) {
      templateModels.forEach((template) => {
        const ClassConstructor = this.getClassConstructor(template.type);
        this.models.push(new ClassConstructor(template));
      });
      //  this.models = models;
      // create real objects
    }
  }

  getClassConstructor(type) {
    const classConstructor = {
      rectangle: Rectangle,
      circle: Circle,
    };
    return classConstructor[type];
  }

  saveShapesToLocalStorage() {
    // save only attributes needed for recreating the objects
    const models = [];
    this.models.forEach((model) => {
      models.push(model.getSaveFormat());
    });
    localStorage.setItem("myShapes", JSON.stringify(models));
  }
  addNewShape() {}
  findModel(id) {
    return this.models.find((model) => {
      return model.id == id;
    });
  }

  getShapeConstructor(shapeDescriptor) {
    const shapeModelList = {};
  }
}
class AppView {
  constructor() {
    this.el = document.createElement("div");
    this.collection = this._createAppCollection(); // this will contain all shape models
    // this.childViews = this._createAppViews();

    this._createMainHtmlElement();
    this._setEventListeners();
  }

  render(id) {
    const container = document.getElementById(id);
    container.appendChild(this.el);

    const fragment = new DocumentFragment();

    this.collection.models.forEach((model) => {
      const View = this._getShapeView(model);
      const view = new View(model);
      view.render(fragment);
      // fragment.appendChild(view.el)
    });
    this.el.appendChild(fragment);
    // this should render main view
    // and also all the childViews
    // this.childViews.forEach((view) => {
    //   view.render(this.el);
    // });
  }

  _createMainHtmlElement() {
    this.el.className =
      "container position-relative px-1 bg-light border border-1 rounded";
    this.el.id = "app-container";
    this.el.style.height = "500px";
  }
  _setEventListeners() {
    this.el.addEventListener(
      "contextmenu",
      this._handleContextMenuClick.bind(this)
    );
  }

  _getShapeView(model) {
    const shapeViewsList = {
      rectangle: RectangleView,
      circle: CircleView,
    };

    return shapeViewsList[model.get("type")];
  }

  /* this will take care of context menu appearence 
  - decide wheter you click in the blank space
  - or you click on a shape */
  _handleContextMenuClick(e) {
    e.preventDefault();
    console.log(e);
    // console.log(this);
    if (this._clickedOnEmptySpace(e)) {
      alert("Empty space");

      // show simple context menu
      return;
    }

    alert("Clicked on an object");
    console.log(this.collection.findModel(e.target.id));
    //show context menu to manipulate with object
  }

  _clickedOnEmptySpace(e) {
    return e.target == this.el;
  }

  _createAppCollection() {
    // factory function that can be overriden
    return new AppCollection();
  }
}

const appView = new AppView();
appView.render("app");
