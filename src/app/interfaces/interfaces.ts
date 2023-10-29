export interface UserProps {
  username: string;
  _id: string;
}

export interface MessageProps {
  sender: string;
  content: string;
  to: string;
}

export interface HomepageProps {
  isLoading: boolean;
  sentMessage: string;
  isSmallScreen: boolean;
  currentChatUsers: string[];
  selectedUser: UserProps | null;
  userList: UserProps[];
  isChatShownOnSmallScreen: boolean;
}
