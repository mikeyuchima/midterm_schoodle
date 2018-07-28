$(document).ready(function() {
  let counter = 0;

  $('#add_time').click(() => {
    console.log('click');
    console.log(counter)
    $('.times').append(`<input id="times-start" type="time" name="start" min="00:00" max="24:00" required pattern="[0-9]{2}:[0-9]{2}" placeholder="start : time">
    <input id="times-end" type="time" name="end" min="00:00" max="24:00" required pattern="[0-9]{2}:[0-9]{2}" placeholder="end:time">`);
    return counter++;
  })
  // let arr = [];
  // $('#submit').click(() => {
  //   arr = $('.times-start').data({start: 'start'}).data()
  //   console.log('PRINTING', arr);
  // })
});

$(() => {
  $.ajax({
    method: "GET",
    url: "/api/users"
  }).done((users) => {
    for(user of users) {
      $("<div>").text(user.name).appendTo($("body"));
    }
  });;
});
