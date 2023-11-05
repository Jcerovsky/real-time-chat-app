const calculateWhenMessageSent = (timeSent: Date) => {
  const date = new Date(timeSent);

  return date.toLocaleDateString("en-AU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: false,
  });
};

export default calculateWhenMessageSent;
