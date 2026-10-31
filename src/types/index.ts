export interface LiveRoom {
  id: string;
  name: string;
  host: string;
  topic: string;
  isPublic: boolean;
  capacity: number;
  members: number;
  isActive: boolean;
  isMuted: boolean;
  memberNames: string[];
  coHosts?: string[];
  moderators?: string[];
  speakers?: string[];
  createdAt?: number;
  tags?: string[];
}

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  isHost?: boolean;
}

export interface PostMoment {
  id: string;
  author: string;
  time: string;
  content: string;
  mediaType?: 'photo' | 'video' | 'voice';
  mediaUrl?: string;
  likes: number;
  commentsCount: number;
  liked?: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'room' | 'system' | 'gift' | 'follow';
}
