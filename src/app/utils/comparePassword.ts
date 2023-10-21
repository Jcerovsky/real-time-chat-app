export const comparePassword = (password1: string, password2: string) => {
  if (password1 !== password2) return "Passwords do not match";
  if (password1.length < 5)
    return "Password needs to be at least 5 characters long";
  return "Success";
};
