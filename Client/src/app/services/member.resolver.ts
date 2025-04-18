
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

export const MembersResolver: ResolveFn<Members> = () => {
    const authService = inject(AuthService);
    const memberService = inject(MemberService);
  
    const user = authService.curentUser();
    const region = user?.regions;
    console.log('region', region);
    
    return memberService.getAllMembers(region);
};

export const AllMembersResolver: ResolveFn<Members> = () => {
    const authService = inject(AuthService);
    const memberService = inject(MemberService);
  
    const user = authService.curentUser();
    const region = user?.regions;
    console.log('region', region);
    
    return memberService.getAllMembers(region);
};





