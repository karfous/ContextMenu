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
class ContextMenuView {
  constructor(e, commandList) {
    this.modal = new bootstrap.Modal(document.getElementById("modalTemplate"));

    this.commandList = commandList;

    this.menu = this.modal._dialog;

    // add context menu to body relatively to cursor
    this.menu.style.position = "absolute";
    this.menu.style.top = `${e.clientY}px`;
    this.menu.style.left = `${e.clientX}px`;
    this.menu.innerHTML = "";

    this.createContextMenuList();
  }

  createContextMenuList() {
    // create a main part of the content
    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";

    // create list of commands
    const divList = document.createElement("div");
    divList.id = "context-menu-list";
    divList.className = "list-group d-inline-block w-auto";

    this.createAnchors(divList);
    modalContent.appendChild(divList);
    this.menu.appendChild(modalContent);
  }
  createAnchor(command) {
    const anchor = document.createElement("a");
    anchor.className = "list-group-item list-group-item-action";
    anchor.textContent = command.text;
    anchor.href = "#";
    anchor.addEventListener("click", () => {
      // TODO not sure about this solution
      // every commands has a function that is called, but I need to bind this  and command parameters here
      // command.self could be changed if using arrow functions?
      command.fn.call(command.self, command.parameters);
      this.modal.hide(); // hide a menu after the command is clicked
    });
    return anchor;
  }
  createAnchors(target) {
    const fragment = new DocumentFragment();
    this.commandList.forEach((command) => {
      const anchor = this.createAnchor(command);
      fragment.appendChild(anchor);
    });
    target.appendChild(fragment);
  }

  render() {
    this.modal.show();
  }
}
class AppCollection {
  constructor() {
    this.models = [];

    this.getShapesFromLocalStorage();
    this.setShapeIds(); // will help me identify a shape in AppView

    // this.saveShapesToLocalStorage();
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

  addShape(template) {
    const ClassConstructor = this.getClassConstructor(template.type);
    this.models.push(new ClassConstructor(template));
    this.setShapeIds();
    this.saveShapesToLocalStorage();
  }

  deleteShape(id) {
    this.models = this.models.filter((model) => model.id != id);
    this.setShapeIds();
    this.saveShapesToLocalStorage();
  }

  clear() {
    this.models = [];
    this.setShapeIds();
    this.saveShapesToLocalStorage();
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

  findModel(id) {
    return this.models.find((model) => {
      return model.id == id;
    });
  }

  forEach(fn) {
    // fn should be arrow function to preserve this context
    this.models.forEach(fn);
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
    this.createViews();
  }

  createViews() {
    this.el.innerHTML = ""; // clear container before creating new views
    const fragment = new DocumentFragment(); // use fragment and insert it at once to the container
    // forEach method above the collection which is an object not an array
    // implemented in order to avoid this.collection.models.forEach calling (...models...)
    this.collection.forEach((model) => {
      const View = this._getShapeView(model);
      const view = new View(model);
      view.render(fragment);
    });
    this.el.appendChild(fragment);
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
  // TODO JaKa - is this the rigth way how to get ShapeViews?
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
    const self = this;
    // TODO commandList is terrible like this, what is the better way?
    // default command list needs to be edited every time a new command is addede or changed
    let commandList = [
      {
        text: "New object",
        fn: self.collection.addShape,
        parameters: {
          type: "rectangle",
          dimensions: { width: "50px", height: "50px" },
          position: { top: `${e.offsetY}px`, left: `${e.offsetX}px` },
        },
        self: self.collection,
        type: "empty",
      },
      {
        text: "Delete all",
        fn: self.collection.clear,
        parameters: "",
        self: self.collection,
        type: "empty",
      },
      {
        text: "Delete shape",
        fn: self.collection.deleteShape,
        parameters: e.target.id,
        self: self.collection,
        type: "object",
      },
      {
        text: "Duplicate shape",
        fn: self.collection.addShape,
        parameters: e.target.id, //
        self: self.collection,
        type: "object",
      },
    ];
    // changing commandList according to the click event
    if (this._clickedOnEmptySpace(e)) {
      commandList = commandList.filter((command) => command.type == "empty");
    } else {
      commandList = commandList.filter((command) => command.type == "object");
    }

    const modalMenu = new ContextMenuView(e, commandList);
    modalMenu.render();

    this.createViews();
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
