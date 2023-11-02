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
  currentChatUsers: string[];
  isChatShownOnSmallScreen: boolean;
  isLoading: boolean;
  isSending: boolean;
  isSmallScreen: boolean;
  searchedText: string;
  selectedUser: UserProps | null;
  sentMessage: string;
  userList: UserProps[];
}
