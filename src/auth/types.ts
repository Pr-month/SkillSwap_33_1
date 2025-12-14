import { UserRole } from '../users/enums';

export type TJwtPayload = {
  sub: string;
  email: string;
  role: UserRole;
};

export type TAuthResponse = {
  user: TJwtPayload;
  //tokens: IAuthTokens;
};

/*
export interface IAuthTokens {
  accessToken: string;
  refreshToken?: string;
}
*/
