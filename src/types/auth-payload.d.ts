
export interface AuthPayload {
    id:       number;
    fullName: string;
    email:    string,
    iat:      number;
    exp:      number;
    aud:      string;
    iss:      string;
}