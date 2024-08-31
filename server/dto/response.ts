// response.ts
export interface ApplicationResponseDto {
    app_id: string;
    app_name: string;
    client_key: string;
    scope: string;
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
  
  export interface ScopeResponseDto {
    scope_id: number;
    scope_name: string;
    scope_info: string;
  }
  
  export interface AuthCodeResponseDto {
    auth_code: string;
    expires_at: Date;
  }