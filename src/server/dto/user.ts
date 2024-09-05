export interface CreateUserRequest {
    user_email: string;
    user_password: string;
    user_name: string;
}

export interface UpdateUserRequest {
    user_email?: string;
    user_password?: string;
    user_name?: string;
}

export interface UserResponse {
    user_id: string;
    user_email: string;
    user_name: string;
    created_at: Date;
    updated_at: Date;
    user_password?: string;
}
