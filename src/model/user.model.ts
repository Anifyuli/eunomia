interface BaseUserModel {
  username: string;
  password: string;
}

export interface RegisterUserRequest extends BaseUserModel {
  name: string;
}

export type LoginUserRequest = BaseUserModel;

export interface UserResponse {
  username: string;
  name: string;
  token?: string;
}

export interface UpdateUserRequest {
  name?: string;
  password?: string;
}
