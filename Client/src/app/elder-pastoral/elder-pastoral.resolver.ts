import { ResolveFn } from "@angular/router";
import { Members } from "../services/member.type";
import { AuthService } from "../auth/service/auth.service";
import { inject } from "@angular/core";
import { MemberService } from "../services/member.service";
import { TeamsService } from "./services/elder-pastoral.service";

export const GetLeadersResolver: ResolveFn<Members> = () => {
    const authService = inject(AuthService);
    const teamService = inject(TeamsService);
  
    const user = authService.curentUser();
    const region = user?.regions;
    console.log('region', region);
    
    return teamService.getLeaders(region);
};