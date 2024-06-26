export type Label = {
  name: string;
  color: {
    backgroundColor: string;
    textColor: string;
  };
};

export type mailDetails = {
  id: string;
  threadId: string;
  fromEmail: string;
  fromName: string;
  toEmail: string;
  subject: string;
  snippet: string;
  msgBody: string;
  category: string;
};
