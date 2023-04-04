import $ from "jquery";

function setDimensions() {
  console.log("resizing");
  const window = $("body").innerHeight();
  const nav = $("#navBar").outerHeight();
  console.log("window: " + window);
  console.log("nav: " + nav);
  console.log("puss: " + $("#belowNav").outerHeight());
  $("#belowNav").outerHeight(window - nav);
  console.log("puss3: " + $("#belowNav").outerHeight());
  console.log("setting height, i guess");
  //   setReady(false);
}
