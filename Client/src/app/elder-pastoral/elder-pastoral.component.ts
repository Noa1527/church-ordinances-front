import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TeamsService } from './services/elder-pastoral.service';
import { Team, Teams } from './services/team.type';
import { Observable, Subject, combineLatest, map, takeUntil} from 'rxjs';
import { Elder, Elders } from './services/elder.type';
import { FamilyService } from '../services/familes/family.service';
import { Families, Family } from '../services/familes/family.type';
import { User } from '../user/service/user.types';
import { UserService } from '../user/service/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-elder-pastoral',
  templateUrl: './elder-pastoral.component.html',
  styleUrls: ['./elder-pastoral.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
  ],
})
export class ElderPastoralComponent implements OnInit {
  pretriseMembers: any[] = [];
  familyMembers: any[] = [];
  teamAndFamilies: any[] = [];
  public teams: { members: Elder[], families: Family[] }[] = Array(12).fill(null).map(() => ({ members: [], families: [] }));
  public teams$!: Observable<Teams | null>;
  public elders$!: Observable<Elders | null>;
  public families$!: Observable<Families | null>;
  public team!: Teams | null;
  public teamate: Team[] = [];
  public user!: User;
  public user$!: Observable<User | null>;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  
  constructor(
    private _teamsService: TeamsService,
    private _findAllFamily: FamilyService,
    private _userService: UserService,
    ) {}
    
    ngOnInit(): void {
      this.teams$ = this._teamsService.teams$;
      this.elders$ = this._teamsService.elders$;
      this.families$ = this._findAllFamily.families$; 

      console.log('this.families$', this.families$);
      console.log('this.elders$', this.elders$);
      console.log('this.teams$', this.teams$);

      this._teamsService.teams$
      .pipe(takeUntil(this._unsubscribeAll), map(teams => teams || []))
      .subscribe(teams => {
        this.team = teams;
        if (this.teamate) {
          this.teamate = []; // Réinitialisez teamate avant d'ajouter les équipes
          this.team.forEach((team: Team) => {
            this.teamate.push(team);
          });
        }
        // this.team.forEach((team: Team) => {
          
        //   if (this.teamate) {
        //     this.teamate.push(team);
        //   }
        // });
      });

      combineLatest([
        this._teamsService.elders$.pipe(takeUntil(this._unsubscribeAll), map(elders => elders || [])),
        this._findAllFamily.families$.pipe(takeUntil(this._unsubscribeAll), map(families => families || []))
      ]).subscribe(([members, families]) => {
        this.teams = JSON.parse(JSON.stringify(this.teamate));
      
        this.teams.forEach((team: Team) => {
          team.members = team.members?.map(memberId => {
            const member = members.find(m => m._id === memberId);
            return member ? member : memberId;
          }) || [];
      
          team.families = team.families?.map((family: any) => {
            const famille = families.find(f => f._id === family );
            return famille ? famille : family;
          }) || [];
        });
      
        this.pretriseMembers = members.filter((member: any) => {
          const isMember = this.teams.find(team => team.members.find(m => m._id === member._id));
          return !isMember; 
        });

        this.familyMembers = families.filter((family: any) => {
          const isFamily = this.teams.find(team => team.families.find(f => f._id === family._id));
          return !isFamily; 
        });
      });
      this._userService.user$.pipe(takeUntil(this._unsubscribeAll)).subscribe((user: User) => {
        this.user = user;
    
        if (this.user && this.user.regions) {
          this._findAllFamily.findAllFamily(this.user.regions).pipe(takeUntil(this._unsubscribeAll)).subscribe();
          this._teamsService.getLeaders(this.user.regions).pipe(takeUntil(this._unsubscribeAll)).subscribe();
          this._teamsService.getTeams(this.user.regions).pipe(takeUntil(this._unsubscribeAll)).subscribe();
        }
      });
      
    }

    ngOnDestroy(): void {
      this._unsubscribeAll.next(null);
      this._unsubscribeAll.complete();
    }
    
    drop(event: CdkDragDrop<any[]>) {

      function checkId(id: string) {
        const regex = /^families\d*$/;
        return regex.test(id);
      }

      if (event.previousContainer === event.container) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      } else {
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex,
        );
          
        const isMember = event.container.data[0].firstName !== undefined;

        if (event.previousContainer.id === 'pretriseMembers' || event.previousContainer.id === 'familyMembers') {
          if (isMember) {
            if (event.previousContainer.id === 'pretriseMembers') {
              this._teamsService.updateTeam({user: event.container.data}, event.container.id, { members: event.container.data.map(m => m._id) }).subscribe();
            }
          } else {
            if (event.container.data.some(m => m.code === 'families') && checkId(event.container.id) && event.previousContainer.id === 'familyMembers') {
              this._teamsService.updateTeam({user: event.container.data},event.container.id, { families: event.container.data.map(f => f._id) }).subscribe();
            }
          }
        } else if (event.container.id === 'pretriseMembers' || event.container.id === 'familyMembers') {
          if (isMember) {
            this._teamsService.updateTeam({user: event.container.data},event.previousContainer.id, { members: event.previousContainer.data.map(m => m._id) }).subscribe();
          } else {
            this._teamsService.updateTeam({user: event.container.data},event.previousContainer.id, { families: event.previousContainer.data.map(f => f._id) }).subscribe();
          }
        } else {
          if (checkId(event.container.id) && checkId(event.previousContainer.id) ) {
            // console.log('is not memeber ', isMember);
            // console.log('checkId(event.previousContainer.id)', checkId(event.previousContainer.id));
            // console.log('checkId(event.container.id)', checkId(event.container.id));
            // console.log('event.previousContainer.data', event.previousContainer);
            // console.log('event.container.data', event.container);
            // console.log('families prev true',event.previousContainer.data.map(m => m.code));
            // console.log('families cont map true',event.container.data.map(m => m.code));
            // console.log('families find true',event.container.data.find(m => m.code === 'families'));
            
            if (event.container.data.some(m => m.code === 'families')) {
              this._teamsService.updateTeam({user: event.container.data}, event.previousContainer.id, { families: event.previousContainer.data.map(f => f._id) }).subscribe();
              this._teamsService.updateTeam({user: event.container.data}, event.container.id, { families: event.container.data.map(f => f._id) }).subscribe();
            }
          } else if (!checkId(event.container.id) && !checkId(event.previousContainer.id) ) {
            // console.log('it is memeber ', isMember);
            // console.log('checkId(event.previousContainer.id)', checkId(event.previousContainer.id));
            // console.log('event.previousContainer.id', checkId(event.container.id));
            
            
            this._teamsService.updateTeam({user: event.container.data}, event.previousContainer.id, { members: event.previousContainer.data.map(m => m._id) }).subscribe();
            this._teamsService.updateTeam({user: event.container.data}, event.container.id, { members: event.container.data.map(m => m._id) }).subscribe();
          }
        }
      }
    }

  // teamLimit(drag: CdkDrag, drop: CdkDropList): boolean {
  //   return drop.data.length < 3;
  // }
  
    getMemberName(id: string): string {

      let member = this.pretriseMembers.find(m => m._id === id);
      
      this.teams.forEach(team => {
        
        const teamMember = team.members.find(m => m._id === id);
        if (teamMember) {
          member = teamMember;
        }
      });
      
      return member ? member.firstName + ' ' + member.lastName : '';
    }

    getFamilyName(id: string): string {

      let family = this.familyMembers.find(m => m._id === id);
      // console.log('family', family);
      
      this.teams.forEach(team => {
        // console.log('team', team);
        
        const teamFamily = team.families.find(m => m._id === id);
        if (teamFamily) {
          family = teamFamily;
        }
      });
      // console.log('family', family);
      
      return family ? family.name : '';
    }
}
