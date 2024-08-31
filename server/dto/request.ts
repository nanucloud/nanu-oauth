// request.ts
export interface CreateApplicationDto {
    app_name: string;
    scope_name: string;
  }
  
  export interface UpdateApplicationDto {
    app_name?: string;
    scope_name?: string;
  }
  
  export interface CreateUserDto {
    user_email: string;
    user_password: string;
    user_name: string;
  }
  
  export interface UpdateUserDto {
    user_email?: string;
    user_password?: string;
    user_name?: string;
  }
  
  export interface CreateScopeDto {
    scope_name: string;
    scope_info: string;
  }
  
  export interface UpdateScopeDto {
    scope_name?: string;
    scope_info?: string;
  }
  
  export interface OAuthRequestDto {
    app_name: string;
    redirect_uri: string;
  }
  
  export interface LoginDto {
    user_email: string;
    user_password: string;
    client_key: string;
  }