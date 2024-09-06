export interface LoginUserRequest {
    user_email: string;
    user_password: string;
    google_recaptcha:string;
}

export interface JoinUserRequest {
    user_name:string;
    user_email: string;
    user_password: string;
    google_recaptcha:string;
}

export interface AuthResponse {
    payload: string;
}