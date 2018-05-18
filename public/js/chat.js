var socket = io();

function scrollToBottom () {
  // Selectors
  var messages = jQuery('#messages');
  var newMessage = messages.children('li:last-child')
  // Heights
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
}



socket.on('newMessage', function (message) {
  
 
  var formattedTime = moment(message.createdAt).format('h:mm a');
 

  // var li = jQuery(`<li class="message"><div class="message__title"> <h4>${message.from}</h4><span>${formattedTime}</span></div> <div class="message__body"><p>${message.text}</p>
  // </div></li>`);
  if(message.from != "System"){
    // var li = jQuery(`<li class="alert alert-warning chat-left" style="padding-bottom:2em;"> ${message.text} <span class="time float-right">${formattedTime}</span> </li>`);
    var msg = jQuery(`<li class='chat friend'><div class='user-photo-bot'></div><p class='chat-message'>${message.text} </p></li>`)
    jQuery('#messages').append(msg);

    scrollToBottom();
}

 
});



jQuery('#message-form').on('submit', function (e) {
  e.preventDefault();

  var messageTextbox = jQuery('[name=message]');

  socket.emit('createMessage', {
    from: 'User',
    text: messageTextbox.val()
  }, function () {
    messageTextbox.val('')
  });
  var msg2 = jQuery(`<li class='chat self'><div class='user-photo'></div><p class='chat-message'>${messageTextbox.val()} </p></li>`)

  jQuery('#messages').append(msg2);

  scrollToBottom();
});


