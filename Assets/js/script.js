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
  var timeScheduler = {
    // hourNotes is used to keep list of historic notes for time block.
    notes : [],
    
    // saveNote gets note and save note to hourNotes in localStorage after transform to string.
    saveNote : function(time, text) {
      var note = {
          timeBlock: time,
          note: text,
      };
      
      this.notes.push(note);
      localStorage.setItem('hourNotes', JSON.stringify(this.notes));
    },
  
    // loadNotes returns array of objects from hourNotes in localStorage.
    loadNotes : function() {
      if (localStorage.getItem("hourNotes") != null) {
          //  get string from scoreTable in localStorage and transform back to array of objects.
          this.notes = JSON.parse(localStorage.getItem("hourNotes"));           
      };
      return this.notes;
    },
  
    // clearAll clears the array notes and hourNotes in localStorage
    clearAll : function() {
      if (this.notes.length != 0) {
          this.notes.length = 0;
      };
      localStorage.removeItem("hourNotes");
    },
  };

  // load notes from localStorage to display in the time-block.
  var savedNotes = timeScheduler.loadNotes();
  savedNotes.forEach(element => {
    var timeBlockEl = $('#'+element.timeBlock);
    // console.log(timeBlockEl);
    timeBlockEl.children().eq(1).text(element.note);
  });

  // catch click on button with class .btn
  $(".btn").on("click", function (event) {
    //
    var timeBlockEl = $(event.target).parents(".time-block");
    // get text from textarea and save to localStorage
    timeScheduler.saveNote(timeBlockEl.attr('id'),timeBlockEl.children().eq(1).val());

  });


  // Apply past or future to time block when time is out of business time
  if (dayjs().hour() < 9) {
    
    $('#hour-9').addClass("future");
    $('#hour-9').removeClass("present past");
    $('#hour-9').nextAll().addClass("future");
    $('#hour-9').nextAll().removeClass("present past");
  } else if (dayjs().hour() > 17) {
    // Appply past class for all time blocks
    $('#hour-9').addClass("past");
    $('#hour-9').removeClass("present future");
    $('#hour-9').nextAll().addClass("past");
    $('#hour-9').nextAll().removeClass("present future");
  }

  // ID of current time block
  const currentId = "#hour-" + dayjs().hour();
  // console.log(currentId);

  // Apply current class to current time block
  $(currentId).addClass("present");
  $(currentId).removeClass("future past");

  // Apply past class to previous time block
  // console.log($(currentId).prevAll());
  $(currentId).prevAll().addClass("past");
  $(currentId).prevAll().removeClass("future present");

  // Apply future class to next time block
  // console.log($(currentId).nextAll());
  $(currentId).nextAll().addClass("future");
  $(currentId).nextAll().removeClass("present past");

  
  // Display the current date in the header of the page.
  var now = dayjs().format('dddd, MMMM Do');
  $('#currentDay').text(now);
  // console.log(now);
});
