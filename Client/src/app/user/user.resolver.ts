
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { AuthService } from '../auth/service/auth.service';
import { User } from './service/user.types';

export const ConnectedUserResolver: ResolveFn<User> = () => {
    return inject(AuthService).curentUser();
};
