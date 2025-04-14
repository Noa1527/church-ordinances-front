
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { AuthService } from '../auth/service/auth.service';
import { MemberService } from './member.service';
import { Members } from './member.type';

export const sistersResolver: ResolveFn<Members> = () => {
    const authService = inject(AuthService);
    const familyService = inject(MemberService);
  
    const user = authService.curentUser();
    const region = user?.regions;
    
    return familyService.findWomenLeaders(region);
};

