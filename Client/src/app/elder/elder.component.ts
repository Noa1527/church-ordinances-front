import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MemberService } from '../services/member.service';
import { Observable, Subject, filter, takeUntil } from 'rxjs';
import { Member, Members } from '../services/member.type';
import { MemberDialogComponent } from '../components/member-dialog/member-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UserService } from '../user/service/user.service';
import { User } from '../user/service/user.types';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-elder',
  templateUrl: './elder.component.html',
  styleUrls: ['./elder.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
  ],
})
export class ElderComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  public member: MatTableDataSource<Member>;
  public user!: User;
  public user$!: Observable<User | null>;
  
  displayedColumns: string[] = [
    'firstName', 
    'lastName', 
    'email', 
    'age', 
    'gender', 
    'phone', 
    'ordinance.Baptism', 
    'ordinance.PriestHood', 
    'ordinance.Initiatory', 
    'ordinance.Endowment', 
    'ordinance.Sealing', 
    'blessing.is_got', 
    // 'comments' 
  ];

  constructor(
    private memberService: MemberService,
    private userService: UserService,
    private dialog: MatDialog,
  ) { 
    this.member = new MatTableDataSource();
  }

  ngOnInit(): void {

    this.userService.user$.pipe(takeUntil(this._unsubscribeAll)).subscribe((user: User) => {
      console.log('user', user);
      this.user = user;
  
      if (this.user && this.user.regions) {
        console.log('this.user.regions',this.user.regions);
        this.memberService.findLeaders(this.user.regions).pipe(takeUntil(this._unsubscribeAll)).subscribe();
      }
    });

    this.memberService.leaders$.pipe(takeUntil(this._unsubscribeAll),
      filter((members: Members | null): members is Members => members !== null),
    ).subscribe((members: Members) => {
      console.log('members', members);
      this.member = new MatTableDataSource(members);
    });
    
    this.userService.get().pipe(takeUntil(this._unsubscribeAll)).subscribe();

  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  // si le membre a 18 ans ou plus, et quil na pas la pretrise, il doit etre affiché en rouge
  public getOrdinanceColor(member: Member): string {
    if (member?.birthDate && member?.ordinance?.PriestHood === false && this.getAge(member.birthDate) >= 18) {
      return 'red';
    }
    return '';
  }

  getAge(birthDate: Date): number {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const month = today.getMonth() - birthDateObj.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDateObj.getDate())) {
        age--;
    }
    return age;
  }

  filterValues: Record<string, string> = {};
  
  // public applyFilter(filterValue: string, columnName: string) {

  //   this.filterValues[columnName] = filterValue;
  //   this.member.filterPredicate = (data: any, filter: string) => {
  //     let filterArray = filter.split(',');

  //     return filterArray.every(filterValue => {
  //       let pair = filterValue.split(':');
  //       return data[pair[0]].trim().toLowerCase().includes(pair[1]);
  //     });

  //   };
    
  //   let finalFilter = Object.keys(this.filterValues).map(key => `${key}:${this.filterValues[key]}`).join(',');
  //   this.member.filter = finalFilter.trim();
  // }

  public createOrEditAgency(member?: Member): void {
    const ref = this.dialog.open(MemberDialogComponent, {
        width: '100%',
    });
    
    if (member) {
      ref.componentInstance.member = member;
    }
  }
}
