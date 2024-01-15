// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.
// var now = dayjs().format('dddd, MMMM Do');

$(function () {
  // TODO: Add a listener for click events on the save button. This code should
  // use the id in the containing time-block as a key to save the user input in
  // local storage. HINT: What does `this` reference in the click listener
  // function? How can DOM traversal be used to get the "hour-x" id of the
  // time-block containing the button that was clicked? How might the id be
  // useful when saving the description in local storage?
  //



  // ID of current time block
  const currentId = "#hour-" + dayjs().hour();
  // console.log(currentId);

  // Apply current class to current time block
  $(currentId).addClass("present");
  $(currentId).removeClass("future past");

  //Apply past class to previous time block
  // console.log($(currentId).prevAll());
  $(currentId).prevAll().addClass("past");
  $(currentId).prevAll().removeClass("future present");

  //Apply future class to next time block
  // console.log($(currentId).nextAll());
  $(currentId).nextAll().addClass("future");
  $(currentId).nextAll().removeClass("present past");

  
  // Display the current date in the header of the page.
  var now = dayjs().format('dddd, MMMM Do');
  $('#currentDay').text(now);
  // console.log(now);
});
