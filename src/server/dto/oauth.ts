export interface OAuthRequest {
    app_name: string;
    redirect_uri: string;
}

export interface OAuthLoginRequest {
    user_email: string;
    user_password: string;
    client_key: string;
}

export interface AuthCodeResponse {
    auth_code: string;
    expires_at: Date;
}