// response.ts
export interface ApplicationResponseDto {
    app_id: string;
    app_name: string;
    client_key: string;
    client_secret?: string;
    access_mode:boolean;
    created_at: Date;
    updated_at: Date;
  }
  
  export interface UserResponseDto {
    user_id: string;
    user_email: string;
    user_name: string;
    created_at: Date;
    updated_at: Date;
  }
  
  
  export interface AuthCodeResponseDto {
    auth_code: string;
    expires_at: Date;
  }