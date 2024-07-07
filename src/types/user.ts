export interface IUserInfo {
    username: string;
    name: string;
    email: string;
    phoneNumber: string;
    gender: string;
    avatarUrl: string;
}

export interface IUserInfoUpdate extends Pick<IUserInfo, 'username' | 'name' | 'email' | 'phoneNumber' | 'gender'> {}
