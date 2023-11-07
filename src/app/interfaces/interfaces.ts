export interface UserProps {
  _id: string;
  username: string;
}

export interface MessageProps {
  _id?: string;
  content: string;
  createdAt?: Date;
  isEdited?: boolean;
  sender: string;
  to: string;
}

export interface HomepageProps {
  currentChatUsers: string[];
  isChatShownOnSmallScreen: boolean;
  isLoading: boolean;
  isSending: boolean;
  isSmallScreen: boolean;
  searchedIndex: number;
  searchedResultsIndexes: number[];
  searchedText: string;
  selectedUser: UserProps | null;
  sentMessage: string;
  userList: UserProps[];
}

export interface NavbarProps {
  isSmallerScreen: boolean;
  confirmDeletingUser: boolean;
  isDeleteOptionVisible: boolean;
  isLoading: boolean;
  isMenuShown: boolean;
}
