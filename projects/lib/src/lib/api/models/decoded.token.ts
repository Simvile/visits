export interface DecodedToken {
  sub: string;
  fullName: string;
  email: string;
  institutionId: string;
  exp: number;
  iat: number;
}