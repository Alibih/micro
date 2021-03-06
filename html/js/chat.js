'use strict';

Chat.CHAR_LIMIT = 300;

function Chat() {
  var self = this;
  
  self._name = '';
  self._unseenMessages = 0;
  self._hasClientFocus = true;
  self._requestingHandle = true;
  self._inputSelected = false;
  self._originalTitle = document.title;
  self._log = document.getElementById('chat-log');
  self._form = document.getElementById('chat-form');
  self._input = document.getElementById('chat-input');
  self._handle = document.getElementById('chat-handle');
  self._messages = document.getElementById('chat-messages');

  self._setupChatInput();

}

Chat.prototype.setName = function(name) {
  var self = this;
  self._name = name;
  self._requestingHandle = false;
  self._handle.innerHTML = self._name;
};

Chat.prototype.appendUserMessage = function(name, message) {
  var self = this;
  if (!self._hasClientFocus) {
    self._unseenMessages += 1;
    document.title = '(' + self._unseenMessages + ') ' + self._originalTitle;
  }
  var textnode = document.createTextNode(message);
  var li = document.createElement("li");
  li.innerHTML = '<a class="user" onclick=\'game.selectUser("'+name+'")\'>&lt'+name+'&gt&nbsp</a>';
  if (message[0] === '>') {
    // greentext message
    var span = document.createElement('span');
    span.className = 'quote';
    span.appendChild(textnode);
    li.appendChild(span);
  } else {
    // normal message
    li.appendChild(textnode);
  }
  self._messages.appendChild(li);
  self._scrollOrRoll();
};

Chat.prototype.appendSessionMessage = function(message) {
  var self = this;
  var textnode = document.createTextNode(message);
  var li = document.createElement("li");
  var span = document.createElement('span');
  span.className = 'session';
  span.appendChild(textnode);
  li.appendChild(span);
  self._messages.appendChild(li)
  self._scrollOrRoll();
};

Chat.prototype.gainFocus = function() {
  var self = this;
  self._hasClientFocus = true;
  self._unseenMessages = 0;
  document.title = self._originalTitle;
};

Chat.prototype.loseFocus = function() {
  var self = this;
  self._hasClientFocus = false;
};

Chat.prototype.isSelected = function() {
  var self = this;
  return self._inputSelected;
};

Chat.prototype._setupChatInput = function() {
  var self = this;

  self._input.onpaste = function(e) {
    // e.preventDefault();
  };

  self._input.onfocus = function() {
    self._hasClientFocus = true;
    self._inputSelected = true;
  };

  self._input.onblur = function() {
    self._inputSelected = false;
  };

  self._form.addEventListener('submit', function(event) {
    // don't refresh on submit
    event.preventDefault();
    // remove whitespace and limit input size
    var message = self._input.value;
    message = message.replace(/^\s*|^\s$/gm, '');
    if (message >= Chat.CHAR_LIMIT) {
      message = message.substring(0, Chat.CHAR_LIMIT) + '...';
    }
    // send valid messages to server
    if (message !== '') {
      if (!self._requestingHandle) {
        self.appendUserMessage(self._name, message);
        game.send({'type': 'chat', 'message': message});
      } else {
        // TODO check if name is valid format
        // ...
        game.send({'type': 'name', 'name': message});
      }
    }
    // clear input field
    self._input.value = '';
    self._input.blur();
    // select game canvas
    game.selectCanvas();
  });

  // enable and select chat input
  self._input.disabled = false;
  self.selectInput();

};

Chat.prototype.selectInput = function() {
  var self = this;
  self._input.select();
};

Chat.prototype._scrollOrRoll = function() {
  var self = this;
  // TODO scroll to bottom if not reading old messages
  // ...
  self._log.scrollTop = self._log.scrollHeight;
};
