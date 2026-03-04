import { ResolveFn } from "@angular/router";
import { Teams } from "./team.type";
import { inject } from "@angular/core";
import { AuthService } from "src/app/auth/service/auth.service";
import { TeamsService } from "./elder-pastoral.service";

export const GetTeamsResolver: ResolveFn<Teams> = () => {
    const authService = inject(AuthService);
    const teamService = inject(TeamsService);
  
    const user = authService.curentUser();
    const region = user?.regions;
    console.log('region', region);
    
    return teamService.getTeams(region);
};