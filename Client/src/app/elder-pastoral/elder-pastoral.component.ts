import { Component, OnInit } from '@angular/core';
import { CdkDrag, CdkDragDrop, CdkDropList, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TeamsService } from './services/elder-pastoral.service';
import { Team, Teams } from './services/team.type';
import { Observable, Subject, combineLatest, filter, map, max, takeUntil} from 'rxjs';
import { FamilyService } from '../services/familes/family.service';
import { Families, Family } from '../services/familes/family.type';
import { User } from '../user/service/user.types';
import { UserService } from '../user/service/user.service';
import { CommonModule } from '@angular/common';
import { Member, Members, Regions } from '../services/member.type';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
export interface Config {
  maxTeams: number;
}
@Component({
  selector: 'app-elder-pastoral',
  templateUrl: './elder-pastoral.component.html',
  styleUrls: ['./elder-pastoral.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule,
  ],
})
export class ElderPastoralComponent implements OnInit {
  pretriseMembers: any[] = [];
  familyMembers: any[] = [];
  teamAndFamilies: any[] = [];
  public configForm!: FormGroup;
  public teams: Teams | null = [];
  public teams$!: Observable<Teams | null>;
  public elders$!: Observable<Members | null>;
  public families$!: Observable<Families | null>;
  public team!: Teams | null;
  public teamate: Team[] = [];
  filteredElders: Members = [];
  filteredFamilies: Families = [];
  public user!: User;
  public user$!: Observable<User | null>;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  public region!: Regions;
  
  constructor(
    private _teamsService: TeamsService,
    private _familyService: FamilyService,
    private _userService: UserService,
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    ) {}
    
    ngOnInit(): void {
      this.teams$ = this._teamsService.teams$;
      this.elders$ = this._teamsService.elders$;
      this.families$ = this._familyService.families$; 
      this.user$ = this._userService.user$;

      this.user$.pipe(takeUntil(this._unsubscribeAll)).subscribe((user: User | null) => {
        this.region = user?.regions || Regions.Toul;        
      })

      this.configForm = this._formBuilder.group({
        maxTeams: [null, [Validators.required]]
      })

      // this.teams$.subscribe(teams => {
      //   console.log('team', teams);
      // })

      combineLatest([
        this.teams$,
        this.elders$,
        this.families$
      ])
      .pipe(
        filter(([teams, elders, families]) =>
          Array.isArray(teams) && Array.isArray(elders) && Array.isArray(families)
        ),
        map(([teams, elders, families]) => {

          console.log('teams combined', teams);
          this.configForm.patchValue({ maxTeams: teams?.length });
          this.teams = teams;

          const usedMemberIds = new Set(
            teams?.flatMap(team => team._members?.map((m: any) => typeof m === 'string' ? m : m._id))
          );
          const usedFamilyIds = new Set(
            teams?.flatMap(team => team._families?.map((f: any) => typeof f === 'string' ? f : f._id))
          );
      
          const filteredElders = elders?.filter(e => !usedMemberIds.has(e._id));
          const filteredFamilies = families?.filter(f => !usedFamilyIds.has(f._id));
      
          return { filteredElders, filteredFamilies };
        }),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe(({ filteredElders, filteredFamilies }) => {
        this.filteredElders = filteredElders || [];
        this.filteredFamilies = filteredFamilies || [];
      });
    }

    ngOnDestroy(): void {
      this._unsubscribeAll.next(null);
      this._unsubscribeAll.complete();
    }
    
    dropFamily(event: CdkDragDrop<any>) {
      // if (event.container.data) {}
      console.log('event', event);
      console.log('event', event.container.data);
      const draggedItem = event.item.data;
      console.log('draggedItem familly', draggedItem);

      if (draggedItem.type !== 'family') {
        console.log('draggedItem', draggedItem);
        this._snackBar.open('Ce Frère n\'est pas une famille', 'Fermer', {
          duration: 5000, // 5 secondes
          horizontalPosition: 'right',
          verticalPosition: 'top'
        })
        return; 
      }
      
      console.log('event container', event.container);
      console.log('event previousContainer', event.previousContainer);
      const containerId = event.container.id;
      if (event.previousContainer !== event.container) {

        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
        this.updateAvailableLists();
        this.saveTeams(containerId);
      }
      

    }
    dropMember(event: CdkDragDrop<any>) {
      if (event.container.data) {}
      console.log('event', event);
      const draggedItem = event.item.data;
      console.log('draggedItem member', draggedItem);

      if (draggedItem.type !== 'member') {
        console.log('draggedItem', draggedItem);
        this._snackBar.open('Cette famille n\'est pas un Frere', 'Fermer', {
          duration: 5000, // 5 secondes
          horizontalPosition: 'right',
          verticalPosition: 'top'
        })
        return; 
      }

      if (event.previousContainer !== event.container) {
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
        console.log('event.previousContainer.data',event.previousContainer.data);
        console.log('event.container.data',event.container.data);
        console.log('event.container.id',event.container.id);
        console.log('event.previousIndex',event.previousIndex);
        console.log('event.currentIndex',event.currentIndex);
        const containerId = event.container.id
        this.updateAvailableLists();
        this.saveTeams(containerId);
      }
    }
    drop(event: CdkDragDrop<Teams | undefined>) {
      console.log('event', event);
      

      // function checkId(id: string) {
      //   const regex = /^families\d*$/;
      //   return regex.test(id);
      // }

      // if (event.previousContainer === event.container) {
      //   moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      // } else {
      //   transferArrayItem(
      //     event.previousContainer.data,
      //     event.container.data,
      //     event.previousIndex,
      //     event.currentIndex,
      //   );
          
      //   const isMember = event.container.data[0].firstName !== undefined;

      //   if (event.previousContainer.id === 'filteredElders' || event.previousContainer.id === 'filteredFamilies') {
      //     if (isMember) {
      //       if (event.previousContainer.id === 'filteredElders') {
      //         this._teamsService.updateTeam({user: event.container.data}, event.container.id, { members: event.container.data.map(m => m._id) }).subscribe();
      //       }
      //     } else {
      //       if (event.container.data.some(m => m.code === 'families') && checkId(event.container.id) && event.previousContainer.id === 'filteredFamilies') {
      //         this._teamsService.updateTeam({user: event.container.data},event.container.id, { families: event.container.data.map(f => f._id) }).subscribe();
      //       }
      //     }
      //   } else if (event.container.id === 'filteredElders' || event.container.id === 'filteredFamilies') {
      //     if (isMember) {
      //       this._teamsService.updateTeam({user: event.container.data},event.previousContainer.id, { members: event.previousContainer.data.map(m => m._id) }).subscribe();
      //     } else {
      //       this._teamsService.updateTeam({user: event.container.data},event.previousContainer.id, { families: event.previousContainer.data.map(f => f._id) }).subscribe();
      //     }
      //   } else {
      //     if (checkId(event.container.id) && checkId(event.previousContainer.id) ) {
      //       // console.log('is not memeber ', isMember);
      //       // console.log('checkId(event.previousContainer.id)', checkId(event.previousContainer.id));
      //       // console.log('checkId(event.container.id)', checkId(event.container.id));
      //       // console.log('event.previousContainer.data', event.previousContainer);
      //       // console.log('event.container.data', event.container);
      //       // console.log('families prev true',event.previousContainer.data.map(m => m.code));
      //       // console.log('families cont map true',event.container.data.map(m => m.code));
      //       // console.log('families find true',event.container.data.find(m => m.code === 'families'));
            
      //       if (event.container.data.some(m => m.code === 'families')) {
      //         this._teamsService.updateTeam({user: event.container.data}, event.previousContainer.id, { families: event.previousContainer.data.map(f => f._id) }).subscribe();
      //         this._teamsService.updateTeam({user: event.container.data}, event.container.id, { families: event.container.data.map(f => f._id) }).subscribe();
      //       }
      //     } else if (!checkId(event.container.id) && !checkId(event.previousContainer.id) ) {
      //       // console.log('it is memeber ', isMember);
      //       // console.log('checkId(event.previousContainer.id)', checkId(event.previousContainer.id));
      //       // console.log('event.previousContainer.id', checkId(event.container.id));
            
            
      //       this._teamsService.updateTeam({user: event.container.data}, event.previousContainer.id, { members: event.previousContainer.data.map(m => m._id) }).subscribe();
      //       this._teamsService.updateTeam({user: event.container.data}, event.container.id, { members: event.container.data.map(m => m._id) }).subscribe();
      //     }
      //   }
      // }
    }

  // teamLimit(drag: CdkDrag, drop: CdkDropList): boolean {
  //   return drop.data.length < 3;
  // }
  getDragFamilyData(family: any, type: string): any {
    // console.log('<= member =>',family);
    // console.log('<= type =>',type);
    
    
    if (type === 'family') {
      return { ...family, type: 'family' };
   
    } else {
      this._snackBar.open('Une erreur s\'est produite', 'Fermer', {
        duration: 5000, // 5 secondes
        horizontalPosition: 'right',
        verticalPosition: 'top'
      });
    }

  }
  getDragMemberData(member: any, type: string): any {
    if (type === 'member') {
      return { ...member, type: 'member' };

    } else {

      this._snackBar.open('Une erreur s\'est produite', 'Fermer', {
        duration: 5000, // 5 secondes
        horizontalPosition: 'right',
        verticalPosition: 'top'
      });
    }
  }
  
    getMemberName(id: string): string {

      let member = this.filteredElders.find(m => m._id === id);
      
      this.teams?.forEach(team => {
        // console.log('team', team);
        
        const teamMember = team && team._members?.find((m: any) => m._id === id);
        if (teamMember) {
          member = teamMember;
        }
      });
      
      return member ? member.firstName + ' ' + member.lastName : '';
    }

    getFamilyName(id: string): string {

      let family = this.filteredFamilies.find(m => m._id === id);
      
      this.teams?.forEach(team => {
        // console.log('team', team);
        const teamFamily = team && team._families?.find((m: any) => m._id === id);
        if (teamFamily) {
          family = teamFamily;
        }
      });
      
      return family ? family.name : '';
    }

    updateAvailableLists() {
      const allMembers = this.filteredElders || [];
      const allFamilies = this.filteredFamilies || [];
    
      const usedMemberIds = this.teams?.flatMap((team: Team) => team._members?.map(m => m._id) || []);
      const usedFamilyIds = this.teams?.flatMap((team: Team) => team._families?.map(f => f._id) || []);
    
      this.filteredElders = allMembers.filter((m: Member) => !usedMemberIds?.includes(m._id));
      this.filteredFamilies = allFamilies.filter((f: Family) => !usedFamilyIds?.includes(f._id));
    }

    updateTeams(event: Event): void {
      const input = event.target as HTMLInputElement;
      const value = +input.value; // cast en number
      
      const config: Config = { maxTeams: value };
      
      this._teamsService.createConfigTeam(this.region, config).subscribe({
        next: (team: any) => {
          console.log('team',team);

          this._snackBar.open(`Le nombre d\'équipe a été modifier a ${config.maxTeams} avec success`, 'Fermer', {
            duration: 5000, // 5 secondes
            horizontalPosition: 'right',
            verticalPosition: 'top'
          });
        }, 
        error: (error) => {
          console.log(error);
          this._snackBar.open('Une erreur s\'est produite', 'Fermer', {
            duration: 5000, // 5 secondes
            horizontalPosition: 'right',
            verticalPosition: 'top'
          });
        }
      });
    }

    isAlreadyInTeams(id: string, type: 'member' | 'family'): boolean {
      this.teams?.some(team => {
        // console.log('team', team);
        
        if (type === 'member') {
          return team._members?.some((m: any) => m._id === id) ?? false;
        } else {
          return team._families?.some((f: any) => f._id === id) ?? false;
        }
      });
      return false;
    }
    

    saveTeams(id?: any) {
      console.log('draggedItem save', id);
      console.log('saveTeams', this.teams);
     let team: Team = this.getTeamToUpdate(this.teams || [], id);
     console.log('team', team);
     
      if (team) {
        this._teamsService.updateTeams(this.region, team).subscribe(() => {
          this._snackBar.open('Équipes mises à jour !', 'Fermer', { duration: 3000 });
        });
      }
      // Appel API à ton backend Nest (ex : via HttpClient)
    }

    onlyMembers = (drag: CdkDrag, drop: CdkDropList) => {
      // console.log('onlyMembers', drag, drop);
      return drag.data?.type === 'member';
    };
    onlyFamilies = (drag: CdkDrag, drop: CdkDropList) => {
      // console.log('onlyFamilies', drag, drop);
      return drag.data?.type === 'family';
    };

    getTeamToUpdate(teams: Teams, id: string): Team {
      return teams[Number(id)];
    }
}
