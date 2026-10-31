import { LiveRoom } from '../types';

export function validateLoginInput(name: string, phone: string, accepted: boolean): { isValid: boolean; error?: string } {
  const trimmedName = name.trim();
  const trimmedPhone = phone.trim().replace(/\D/g, '');

  if (!trimmedName) {
    return { isValid: false, error: 'Name is required' };
  }
  if (trimmedPhone.length !== 10) {
    return { isValid: false, error: 'Valid 10-digit mobile number is required' };
  }
  if (!accepted) {
    return { isValid: false, error: 'Please accept Terms & Conditions' };
  }

  return { isValid: true };
}

export function validateOtp(otp: string): { isValid: boolean; error?: string } {
  const cleaned = otp.trim();
  if (cleaned === '123456') {
    return { isValid: true };
  }
  return { isValid: false, error: 'Incorrect demo OTP. Use 123456.' };
}

export function validateCreateRoom(
  name: string,
  topic: string,
  capacityStr: string
): { isValid: boolean; error?: string; capacity?: number } {
  const trimmedName = name.trim();
  const trimmedTopic = topic.trim();
  const capacity = parseInt(capacityStr.trim(), 10);

  if (!trimmedName || !trimmedTopic || isNaN(capacity) || capacity < 2 || capacity > 100) {
    return { isValid: false, error: 'Enter room details. Capacity must be 2–100.' };
  }

  return { isValid: true, capacity };
}

export function joinRoomLogic(
  room: LiveRoom,
  userName: string
): { success: boolean; updatedRoom: LiveRoom; error?: string } {
  if (room.members >= room.capacity) {
    return { success: false, updatedRoom: room, error: 'Room is full.' };
  }

  const isHost = room.host === userName || room.host === 'You';
  if (!room.isPublic && !isHost) {
    return {
      success: false,
      updatedRoom: room,
      error: 'Private room: host permission required.',
    };
  }

  if (room.memberNames.includes(userName)) {
    return { success: true, updatedRoom: room };
  }

  const updated: LiveRoom = {
    ...room,
    members: room.members + 1,
    memberNames: [...room.memberNames, userName],
  };

  return { success: true, updatedRoom: updated };
}

export function leaveRoomLogic(room: LiveRoom, userName: string): LiveRoom {
  if (!room.memberNames.includes(userName)) {
    return room;
  }
  return {
    ...room,
    members: Math.max(1, room.members - 1),
    memberNames: room.memberNames.filter((m) => m !== userName),
    speakers: room.speakers?.filter((s) => s !== userName),
    coHosts: room.coHosts?.filter((c) => c !== userName),
    moderators: room.moderators?.filter((m) => m !== userName),
  };
}

export function kickMemberLogic(room: LiveRoom, targetMember: string): LiveRoom {
  if (targetMember === room.host) return room;
  return {
    ...room,
    members: Math.max(1, room.members - 1),
    memberNames: room.memberNames.filter((m) => m !== targetMember),
    speakers: room.speakers?.filter((s) => s !== targetMember),
    coHosts: room.coHosts?.filter((c) => c !== targetMember),
    moderators: room.moderators?.filter((m) => m !== targetMember),
  };
}

export function toggleRoomMuteLogic(room: LiveRoom): LiveRoom {
  return {
    ...room,
    isMuted: !room.isMuted,
  };
}

export function filterRooms(rooms: LiveRoom[], query: string, topicFilter: string = 'All'): LiveRoom[] {
  const q = query.toLowerCase().trim();
  return rooms.filter((room) => {
    if (!room.isActive) return false;
    const matchesQuery =
      !q ||
      room.name.toLowerCase().includes(q) ||
      room.topic.toLowerCase().includes(q) ||
      room.host.toLowerCase().includes(q);
    const matchesTopic = topicFilter === 'All' || room.topic.toLowerCase() === topicFilter.toLowerCase();
    return matchesQuery && matchesTopic;
  });
}

export function calculateRankings(rooms: LiveRoom[]): LiveRoom[] {
  return [...rooms]
    .filter((r) => r.isActive)
    .sort((a, b) => b.members - a.members);
}
