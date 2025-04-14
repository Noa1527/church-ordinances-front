import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Families } from '../services/familes/family.type';
import { FamilyService } from '../services/familes/family.service';
import { AuthService } from '../auth/service/auth.service';

export const FamiliesResolver: ResolveFn<Families> = () => {
    const authService = inject(AuthService);
    const familyService = inject(FamilyService);
  
    const user = authService.curentUser();
    const region = user?.regions;
    
    return familyService.findAllFamily(region);
};
