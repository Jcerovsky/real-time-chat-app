const createUserInitials = (username: string) => {
  if (username.length < 2) return;
  const firstTwoLetters = username.slice(0, 2);
  return firstTwoLetters.toUpperCase();
};

export default createUserInitials;
