export interface OAuthRequest {
    app_id: string;
    redirect_uri: string;
}



export interface RefreshTokenRequest {
    refresh_token: string;
}

export interface RefreshTokenResponse {
    access_token: string;
}