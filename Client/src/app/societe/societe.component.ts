import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Member, Members } from 'src/app/services/member.type';
import { MemberService } from '../services/member.service';
import { Subject, filter, takeUntil } from 'rxjs';

@Component({
  selector: 'app-societe',
  templateUrl: './societe.component.html',
  styleUrls: ['./societe.component.css']
})
export class SocieteComponent implements OnInit {

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  public member: MatTableDataSource<Member>;
  
  displayedColumns: string[] = [
    'firstName', 
    'lastName', 
    'email', 
    'age', 
    'gender', 
    'phone', 
    'ordinance.Baptism', 
    'ordinance.Initiatory', 
    'ordinance.Endowment', 
    'ordinance.Sealing', 
    'blessing.is_got', 
    // 'comments' 
  ];

  constructor(private memberService: MemberService) { 
    this.member = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.memberService.womenLeaders$.pipe(takeUntil(this._unsubscribeAll),
      filter((members: Members | null): members is Members => members !== null),
    ).subscribe((members: Members) => {
      this.member = new MatTableDataSource(members);
    });

    this.memberService.findWomenLeaders().pipe(takeUntil(this._unsubscribeAll)).subscribe();
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
  
  applyFilter(filterValue: string, columnName: string) {

    this.filterValues[columnName] = filterValue;
    this.member.filterPredicate = (data: any, filter: string) => {
      let filterArray = filter.split(',');

      return filterArray.every(filterValue => {
        let pair = filterValue.split(':');
        return data[pair[0]].trim().toLowerCase().includes(pair[1]);
      });

    };
    
    let finalFilter = Object.keys(this.filterValues).map(key => `${key}:${this.filterValues[key]}`).join(',');
    this.member.filter = finalFilter.trim();
  }
}
