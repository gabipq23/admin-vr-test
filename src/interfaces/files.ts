export interface IFiles {
  id: number;
  createdAt: string;
  fileType: string;
  format: string;
  length: string;
  messageId: string;
  name: string;
  observation: string;
  prospect: {
    data: Record<string, string | boolean>;
    bot: { id: string; name: string };
    externalId: string;
    platformData: {
      isBusiness: boolean;
      name: string;
      numberExists: boolean;
      picture: string;
    };
    status: {
      setAt: string;
      status: string;
    };
    wuid: string;
  };
  prospectId: string;
  s3: boolean;
  seconds: number;
  status: string;
  updatedAt: string;
  url: string;
}
