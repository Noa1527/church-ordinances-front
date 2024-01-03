// src/app/teams.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, switchMap, take, tap } from 'rxjs';
import { Elder, Elders } from './elder.type';
import { Team, Teams } from './team.type';
import { Regions } from 'src/app/services/member.type';

@Injectable({
  providedIn: 'root'
})
export class TeamsService {

  private _teams: BehaviorSubject<Teams | null> = new BehaviorSubject<Teams | null>(null);
  private _team: BehaviorSubject<Team | null> = new BehaviorSubject<Team | null>(null);
  private _elders: BehaviorSubject<Elders | null> = new BehaviorSubject<Elders | null>(null);
  private _elder: BehaviorSubject<Elder | null> = new BehaviorSubject<Elder | null>(null);

  constructor(private http: HttpClient) { }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------
  /**
   * Setter & getter for client
   *
   * @param value
   */
  set elder(value: Elder) {
    this._elder.next(value);
  }
  set elders(value: Elders) {
      this._elders.next(value);
  }
  set team(value: Team) {
    this._team.next(value);
  }
  set teams(value: Teams) {
      this._teams.next(value);
  }
  get elders$(): Observable<Elders | null> {
      return this._elders.asObservable();
  }

  get elder$(): Observable<Elder | null> {
      return this._elder.asObservable();
  }
  get teams$(): Observable<Teams | null> {
      return this._teams.asObservable();
  }

  get team$(): Observable<Team | null> {
      return this._team.asObservable();
  }

  getTeams(): Observable<Team> {
    return this.http.get('/api/teams').pipe(
      tap((brethen: any) => {
        this.teams = brethen;
      })
    );
  }

  updateTeam(seq: string, team: any): Observable<Team> {
      const numStr = seq.replace(/\D/g, '');
    
    return this.teams$.pipe(
      take(1),
      switchMap((teams: Teams | null) => 
        this.http.patch<Team>(`/api/teams/${numStr}`, team).pipe(
          tap((response: Team) => {
            
            if (teams) {
              const index = teams.findIndex((o) => o._id === response._id);
              if (index >= 0) {
                teams[index] = {
                  ...team,
                  ...response
                };
                this._teams.next(teams);
              }
            }
            this._team.next({...team, ...response});
          })
        )
      )
    );
  }

  getLeaders(region: Regions): Observable<Elder> {
    return this.http.get('/api/member/leaders', { params: { region } }).pipe(
      tap((leaders: any) => {
        this.elders = leaders;
      })
    );
  }
}
