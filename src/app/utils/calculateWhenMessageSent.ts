const calculateWhenMessageSent = (timeSent: Date) => {
  const date = new Date(timeSent);

  return date
    .toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
    .replace(",", " at ");
};

export default calculateWhenMessageSent;
