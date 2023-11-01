export interface UserProps {
  username: string;
  _id: string;
}

export interface MessageProps {
  sender: string;
  content: string;
  to: string;
  _id?: string;
  isEdited?: boolean;
}

export interface HomepageProps {
  isLoading: boolean;
  sentMessage: string;
  isSmallScreen: boolean;
  currentChatUsers: string[];
  selectedUser: UserProps | null;
  userList: UserProps[];
  isSending: boolean;
  isChatShownOnSmallScreen: boolean;
}
