export interface CreatePermissionRequest {
    permission_user: string;
    permission_app: string;
    permission_message: string;
}

export interface PermissionRemoveRequest {
    permission_user: string;
    permission_app: string;
    permission_message: string;
}

export interface PermissionResponse {
    permission_user: string;
    permission_app: string;
    permission_message: string;
}