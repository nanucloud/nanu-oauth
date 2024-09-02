// request.ts
export interface CreateApplicationDto {
    app_name: string;
    access_mode:boolean;
    owner_id:string;
  }
  
  export interface UpdateApplicationDto {
    app_name?: string;
    access_mode?:boolean;
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
    
  export interface OAuthRequestDto {
    app_name: string;
    redirect_uri: string;
  }
  
  export interface LoginDto {
    user_email: string;
    user_password: string;
    client_key: string;
  }

  export interface PermissionDto {
    permission_user: string;
    permission_application: string;
    permission_message: string;
  }