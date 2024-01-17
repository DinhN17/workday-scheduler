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

  // timeScheduler: an object for managing notes/events by time which user input and save to localstorage
  var timeScheduler = {
    // hourNotes is used to keep list of historic notes for time block.
    notes : [],
    
    // _checkDuplicate check if timeBlock has been existed in notes and return -1 or the index of duplicate
    _checkDuplicate : function(timeBlock) {
      // check if timeBlock 
      for (let index = 0; index < this.notes.length; index++) {
        const element = this.notes[index];
        if (element.timeBlock === timeBlock) {
          return index;          
        }
      };
      return -1;
    },

    // saveNote gets note and save note to hourNotes in localStorage after transform to string.
    // return false/true if it failed/success to save to localStorage
    saveNote : function(time, text) {
      var note = {
          timeBlock: time,
          note: text,
      };
      
      // check if the timeblock data has been existed. If yes, overwite it, else push it to array.
      var index = this._checkDuplicate(time);
      if (index < 0) {
        this.notes.push(note);
      } else {
        this.notes[index] = note;
      };

      try {
        localStorage.setItem('hourNotes', JSON.stringify(this.notes));
        return true;
      } catch(e) {
        return false;
      };
            
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

  // load notes from localStorage to display in the time-blocks respectively.
  var savedNotes = timeScheduler.loadNotes();
  savedNotes.forEach(element => {
    var timeBlockEl = $('#'+element.timeBlock);
    timeBlockEl.children().eq(1).text(element.note);
  });

  // catch click on button with class .btn
  $(".btn").on("click", function (event) {
    //
    var timeBlockEl = $(event.target).parents(".time-block");
    // get text from textarea, save to localStorage and send a message if the saving is success.
    if (timeScheduler.saveNote(timeBlockEl.attr('id'),timeBlockEl.children().eq(1).val())) {
      $("#time-table").before("<p class=\"text-center\">Appointment Added to <span style=\"color:orange\" >localStorage</span> <i class=\"fa fa-check\" style=\"font-size:24px;color:green\"></i></p>");
    } else {
      $("#time-table").before("<p class=\"text-center\">Appointment failed to add to localStorage </p>");      
    }
    
    // set timer 2s to delete saved notification message
    setTimeout(() => {
      $("#time-table").prev().remove();
    }, 2000);
    

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
});
