import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateLoginInput,
  validateOtp,
  validateCreateRoom,
  joinRoomLogic,
  leaveRoomLogic,
  kickMemberLogic,
  toggleRoomMuteLogic,
  filterRooms,
  calculateRankings,
} from './chatLogic';
import { LiveRoom } from '../types';

const sampleRoom: LiveRoom = {
  id: 'room-1',
  name: 'Friendship Zone',
  host: 'Rahul',
  topic: 'Friendship',
  isPublic: true,
  capacity: 10,
  members: 3,
  isActive: true,
  isMuted: false,
  memberNames: ['Rahul', 'Aman', 'Priya'],
};

test('validateLoginInput checks name, phone and terms', () => {
  assert.equal(validateLoginInput('', '9876543210', true).isValid, false);
  assert.equal(validateLoginInput('Nitish', '123', true).isValid, false);
  assert.equal(validateLoginInput('Nitish', '9876543210', false).isValid, false);
  assert.equal(validateLoginInput('Nitish', '9876543210', true).isValid, true);
});

test('validateOtp validates correct demo OTP 123456', () => {
  assert.equal(validateOtp('123456').isValid, true);
  assert.equal(validateOtp('000000').isValid, false);
  assert.equal(validateOtp('123').isValid, false);
});

test('validateCreateRoom checks capacity boundary 2-100', () => {
  assert.equal(validateCreateRoom('Chill Zone', 'Talk', '50').isValid, true);
  assert.equal(validateCreateRoom('Chill Zone', 'Talk', '1').isValid, false);
  assert.equal(validateCreateRoom('Chill Zone', 'Talk', '101').isValid, false);
  assert.equal(validateCreateRoom('', 'Talk', '50').isValid, false);
});

test('joinRoomLogic respects room capacity and public/private', () => {
  const fullRoom: LiveRoom = { ...sampleRoom, members: 10, capacity: 10 };
  const joinFull = joinRoomLogic(fullRoom, 'Sneha');
  assert.equal(joinFull.success, false);
  assert.equal(joinFull.error, 'Room is full.');

  const privateRoom: LiveRoom = { ...sampleRoom, isPublic: false, host: 'Aman' };
  const joinPrivate = joinRoomLogic(privateRoom, 'Sneha');
  assert.equal(joinPrivate.success, false);
  assert.equal(joinPrivate.error, 'Private room: host permission required.');

  const joinValid = joinRoomLogic(sampleRoom, 'Sneha');
  assert.equal(joinValid.success, true);
  assert.equal(joinValid.updatedRoom.members, 4);
  assert.ok(joinValid.updatedRoom.memberNames.includes('Sneha'));
});

test('leaveRoomLogic decrements member count cleanly', () => {
  const left = leaveRoomLogic(sampleRoom, 'Priya');
  assert.equal(left.members, 2);
  assert.ok(!left.memberNames.includes('Priya'));
});

test('kickMemberLogic removes participant unless host', () => {
  const kicked = kickMemberLogic(sampleRoom, 'Aman');
  assert.equal(kicked.members, 2);
  assert.ok(!kicked.memberNames.includes('Aman'));

  const kickHost = kickMemberLogic(sampleRoom, 'Rahul');
  assert.equal(kickHost.members, 3);
  assert.ok(kickHost.memberNames.includes('Rahul'));
});

test('toggleRoomMuteLogic toggles room mute state', () => {
  const muted = toggleRoomMuteLogic(sampleRoom);
  assert.equal(muted.isMuted, true);
  const unmuted = toggleRoomMuteLogic(muted);
  assert.equal(unmuted.isMuted, false);
});

test('filterRooms filters by active status, query, and topic', () => {
  const rooms: LiveRoom[] = [
    sampleRoom,
    {
      id: 'room-2',
      name: 'Bollywood Music Hits',
      host: 'Aman',
      topic: 'Music',
      isPublic: true,
      capacity: 20,
      members: 15,
      isActive: true,
      isMuted: false,
      memberNames: ['Aman'],
    },
    {
      id: 'room-3',
      name: 'Old Inactive Room',
      host: 'Vikram',
      topic: 'Talk',
      isPublic: true,
      capacity: 20,
      members: 0,
      isActive: false,
      isMuted: false,
      memberNames: [],
    },
  ];

  const musicFiltered = filterRooms(rooms, '', 'Music');
  assert.equal(musicFiltered.length, 1);
  assert.equal(musicFiltered[0].name, 'Bollywood Music Hits');

  const queryFiltered = filterRooms(rooms, 'friendship');
  assert.equal(queryFiltered.length, 1);
  assert.equal(queryFiltered[0].name, 'Friendship Zone');
});

test('calculateRankings orders rooms by active member counts', () => {
  const rooms: LiveRoom[] = [
    { ...sampleRoom, id: '1', members: 10 },
    { ...sampleRoom, id: '2', members: 50 },
    { ...sampleRoom, id: '3', members: 25 },
  ];
  const ranked = calculateRankings(rooms);
  assert.equal(ranked[0].id, '2');
  assert.equal(ranked[1].id, '3');
  assert.equal(ranked[2].id, '1');
});
