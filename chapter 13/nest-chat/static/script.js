const socket = io('http://localhost:3000/chat');
const nickname = prompt('Enter your nickname');
const roomSocket = io('http://localhost:3000/room');
let currentRoom = '';

socket.on('connect', function () {
  console.log('connected to server');
});

function createRoom() {
  const room = prompt('생성할 방의 이름을 입력해주세요');
  roomSocket.emit('createRoom', { room, nickname });
}

roomSocket.on('rooms', function (data) {
  console.log(data);
  $('#room').empty();
  data.forEach(function (room) {
    $('#room').append(
      `<li>${room} <button onclick="joinRoom('${room}')">참여</button></li>`,
    );
  });
});

function sendMessage() {
  if (currentRoom === '') {
    alert('채팅방에 참여해주세요');
    return;
  }
  const message = $('#message').val();
  const data = { message, nickname, room: currentRoom };
  $('#chat').append(`<div>${nickname}: ${message}</div>`);
  socket.emit('message', data);
  return false;
}

socket.on('message', function (message) {
  $('#chat').append(`<div>${message}</div>`);
});

socket.on('notice', function (data) {
  $('#notice').append(`<div>${data.message}</div>`);
});

roomSocket.on('notice', function (data) {
  $('#notice').append(`<div>${data.message}</div>`);
});

function joinRoom(room) {
  roomSocket.emit('joinRoom', { room, nickname, toLeaveRoom: currentRoom });
  $('#chat').empty();
  currentRoom = room;
}

roomSocket.on('message', function (data) {
  console.log(data);
  $('#chat').append(`<div>${data.message}</div>`);
});
