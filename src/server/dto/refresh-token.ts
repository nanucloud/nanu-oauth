export interface CreateRefreshTokenRequest {
    user_id: string; // 사용자 ID
    application_id: string; // 애플리케이션 ID
    auth_code: string; // 인증 코드
    expires_at: Date; // 인증 코드 만료 시간
    permission_level: number; // 인증 코드 권한 수준
}

export interface UpdateRefreshTokenRequest {
    auth_code?: string; // 인증 코드
    expires_at?: Date; // 인증 코드 만료 시간 
    permission_level?: number; // 인증 코드 권한 수준 
    valid?: boolean; // 인증 코드 유효 여부 
}

export interface RefreshTokenResponse {
    auth_id: string; // 인증 코드 고유 ID
    user_id: string; // 사용자 ID
    application_id: string; // 애플리케이션 ID
    auth_code: string; // 인증 코드
    created_at: Date; // 인증 코드 생성일자
    expires_at: Date; // 인증 코드 만료일자
    valid: boolean; // 인증 코드 유효 여부
    permission_level: number; // 인증 코드 권한 수준
}
