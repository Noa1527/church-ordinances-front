import { Component, ElementRef, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { MemberService } from '../services/member.service';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipsModule, MatChipInputEvent, MatChipGrid } from '@angular/material/chips';
import { UserService } from '../user/service/user.service';
import { Observable, Subject, filter, map, startWith, takeUntil } from 'rxjs';
import { Member, Members } from '../services/member.type';
import { User } from '../user/service/user.types';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { LiveAnnouncer } from '@angular/cdk/a11y';

@Component({
  selector: 'app-email',
  standalone: true,
  templateUrl: './email.component.html',
  styleUrl: './email.component.css',
  imports: [
    MatIconModule,
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule, 
    MatSelectModule, 
    MatButtonModule, 
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatChipsModule,
  ],
})
export class EmailComponent implements OnInit, OnDestroy{
  @ViewChild('memberInput') memberInput!: ElementRef<HTMLInputElement>;
  public announcer = inject(LiveAnnouncer);
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  public mailForm!: FormGroup;
  // public members$!: Observable<Members | null>;
  public user!: User;
  public user$!: Observable<User | null>;
  public visible = true;
  public selectable = true;
  public removable = true;
  public separatorKeysCodes: number[] = [ENTER, COMMA];
  
  public members!: Members | null;
  public members$!: Observable<Member[]>;
  public memberCtrl = new FormControl();
  public filteredMembers!: Observable<Member[]>;
  public selectedMembers: Member[] = [];

  constructor(
    private _memberService: MemberService,
    private _userService: UserService,
  ) {}

  ngOnInit() {
    
    // this.members$ = this._memberService.members$;
    this._memberService.members$.pipe(takeUntil(this._unsubscribeAll)).subscribe((members: Members | null) => {
      if (members !== null) {
        this.members = members;
      }
    });
    
   
    this._userService.user$.pipe(takeUntil(this._unsubscribeAll)).subscribe((user: User) => {
      this.user = user;
    
      if (this.user && this.user.regions) {
        this._memberService.getAllMembers(this.user.regions).pipe(takeUntil(this._unsubscribeAll)).subscribe((members: Members | null) => {
          this.members = members;
        });
      }
    });

    this.mailForm = new FormGroup({
      team: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      date: new FormControl('', [Validators.required]),
      heur: new FormControl('', [Validators.required]),
      url: new FormControl('', [Validators.required]),
      member: new FormControl(this.selectedMembers, [Validators.required]),
    });

    this.filteredMembers = this.memberCtrl.valueChanges.pipe(
      startWith(null),
      map((member: string | null) => member ? this._filter(member) : this.members?.slice()),
      filter((members): members is Member[] => members !== undefined)
    );
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  add(event: MatChipInputEvent): void {
console.log('event', event);

    const value = (event.value || '').trim();
console.log('value', value);

    // Add our fruit
    if (value) {
      // this.selectedMembers.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.memberCtrl.setValue(null);
  }

  remove(member: Member): void {
    const index = this.selectedMembers.indexOf(member);

    if (index >= 0) {
      this.selectedMembers.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    console.log('event', event);
    
    this.selectedMembers.push(event.option.value);
    this.memberInput.nativeElement.value = '';
    this.memberCtrl.setValue(null);
  }

  sendAnEmail() {
    console.log('members ->', this.members$);
    console.log('members ->', this.members);
    console.log('Selected members ->', this.selectedMembers);
    console.log('mailForm ->', this.mailForm.value);
    // console.log('sendAnEmail');
    
    this._memberService.sendAnEmail(this.mailForm.value).subscribe({
        next: (response) => console.log('Email sent successfully', response),
        error: (error) => console.error('Error sending email', error)
    });
  }

  sendAnEmailLesson() {
    console.log('sendAnEmail');
    
    this._memberService.sendAnEmailLesson().subscribe({
        next: (response) => console.log('Email sent successfully', response),
        error: (error) => console.error('Error sending email', error)
    });
  }

  private _filter(value: string): Member[] {
    const filterValue = value.toLowerCase();
  
    return this.members?.filter(member => member?.firstName?.toLowerCase().includes(filterValue)) || [];
  }
}
