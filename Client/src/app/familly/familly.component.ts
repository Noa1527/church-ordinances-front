import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Observable, Subject, filter, takeUntil } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Member } from 'src/app/services/member.type';
import { User } from 'src/app/user/service/user.types';
import { UserService } from 'src/app/user/service/user.service';
import { Families, Family } from 'src/app/services/familes/family.type';
import { FamilyService } from 'src/app/services/familes/family.service';

@Component({
  selector: 'app-familly',
  templateUrl: './familly.component.html',
  styleUrls: ['./familly.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
})
export class FamillyComponent implements OnInit, OnDestroy {

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  public family!: MatTableDataSource<Family>;
  public user!: User;
  public user$!: Observable<User | null>;
  public families$!: Observable<Families | null>;
  
  displayedColumns: string[] = [
    'name',
    'region',
    'delete'
    
  ];

  constructor(
    private familyService: FamilyService,
    private userService: UserService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.families$ = this.familyService.families$;
    this.user$ = this.userService.user$;

    this.user$.pipe(takeUntil(this._unsubscribeAll)).subscribe((user: User | null) => {
      console.log('user', user);
      if (user !== null) {
        
        this.user = user;
      }
    });

    this.familyService.families$.pipe(takeUntil(this._unsubscribeAll),
      filter((families: Families | null): families is Families => families !== null),
    ).subscribe((families: Families) => {
      console.log('families', families);
      
      this.family = new MatTableDataSource(families);
    });
    
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
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
//     const ref = this.dialog.open(MemberDialogComponent, {
//         width: '100%',
//     });
    
//     if (member) {
//       ref.componentInstance.member = member;
//     }
  }

  public deleteFamily(family: Family): void {
    console.log(family, 'family');
    
    if (family && family._id && family.region) {
      this.familyService.deleteFamily(family._id, family.region).pipe(takeUntil(this._unsubscribeAll)).subscribe();
    }
  }
}
