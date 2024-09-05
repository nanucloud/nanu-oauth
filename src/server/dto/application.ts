export interface CreateApplicationRequest {
    app_name: string;
    permission_mode: number;
    owner_id: string;
}

export interface UpdateApplicationRequest {
    app_name?: string;
    permission_mode?: number;
}

export interface ApplicationResponse {
    app_id: string;
    app_name: string;
    client_key: string;
    client_secret?: string;
    permission_mode: number;
    created_at: Date;
    updated_at: Date;
}