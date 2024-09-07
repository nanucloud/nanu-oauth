export interface OAuthRequest {
    app_id: string;
    redirect_uri: string;
}

export interface OAuthLoginRequest {
    app_id:string;
    token:string;
    user_email:string;
    user_password:string;
    redirect_uri:string;
}

export interface RefreshTokenRequest {
    refresh_token: string;
}

export interface RefreshTokenResponse {
    access_token: string;
}