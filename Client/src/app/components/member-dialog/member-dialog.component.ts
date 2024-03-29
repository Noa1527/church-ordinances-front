import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { LeaderRoleService } from 'src/app/services/leaderRoles/leader-roles.service';
import { Role, Roles } from 'src/app/services/leaderRoles/leader-roles.type';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MemberService } from 'src/app/services/member.service';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Member } from 'src/app/services/member.type';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import iziToast from 'izitoast';
import * as moment from 'moment';

@Component({
  selector: 'app-member-dialog',
  templateUrl: './member-dialog.component.html',
  styleUrls: ['./member-dialog.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatDatepickerModule, 
    MatNativeDateModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatSelectModule, 
    MatCheckboxModule, 
    MatButtonModule, 
    ReactiveFormsModule, 
    MatDialogModule
  ],
  providers: [
    {
        provide: MAT_DATE_LOCALE,
        useValue: 'fr-FR',
    },
    {
        provide: DateAdapter,
        useClass: MomentDateAdapter,
        deps: [MAT_DATE_LOCALE],
    },
    {
        provide: MAT_DATE_FORMATS,
        useValue: {
            parse: {
                dateInput: 'LL',
            },
            display: {
                dateInput: 'DD/MM/YYYY',
                monthYearLabel: 'YYYY',
                dateA11yLabel: 'LL',
                monthYearA11yLabel: 'YYYY',
            },
        },
    },
],
})
export class MemberDialogComponent implements OnInit{
  @Input()member?: Member;

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  
  public ordinancesTrue = null as any;

  public birthDate!: FormControl;
  public aaronicPriesthoodReception!: FormControl;

  public leaderRoles$!: Observable<Roles | null>;
  public currentRole = '';
  
  public memberForm!: FormGroup;
  
  public genders = [
    { name:'Homme' , value: 'H' }, 
    { name:'Femme' , value: 'F' }
  ];
  
  public regions = [
    { name:'Toul' , value: 'Toul' }, 
    { name:'Cholet' , value: 'Cholet' }, 
  ];
  
  public roles = [
    { name:'Présidence De Branche' , value: 'Présidence De Branche' }, 
    { name:'Prêtrise' , value: 'Prêtrise' }, 
    { name:'Société Secours' , value: 'Société Secours' }, 
    { name:'Jeunes Gens' , value: 'Jeunes Gens' }, 
    { name:'Jeunes Filles' , value: 'Jeunes Filles' }, 
    { name:'Primaire' , value: 'Primaire' }, 
    { name:'Membre' , value: 'Membre' }, 
  ];
  
  constructor(
    private readonly _formBuilder: FormBuilder,
    private readonly _memberService: MemberService,
    private readonly _leaderRolesService: LeaderRoleService,
    private readonly _dialogRef: MatDialogRef<MemberDialogComponent>,
  ) {  }

  ngOnInit(): void {
    iziToast.settings({
      timeout: 3000,
      resetOnHover: true,
      transitionIn: 'flipInX',
      transitionOut: 'flipOutX',
      position: 'topRight',
    });
    console.log('member',this.member);

    this.currentRole = this.member?.leaderRoles?.roles || '';
    this.leaderRoles$ = this._leaderRolesService.roles$

    this._leaderRolesService.findRoles().pipe(takeUntil(this._unsubscribeAll)).subscribe();

    this.birthDate = new FormControl(      
      moment(this.member?.birthDate).toDate(),
    );
  
    this.aaronicPriesthoodReception = new FormControl(
      moment(this.member?.aaronicPriesthoodReception).toDate(),
    );

    const formatDate = (dateString: any) => {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      }
      return dateString;
    };
  
    this.memberForm = this._formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      birthDate: [this.birthDate.value, Validators.required],
      aaronicPriesthoodReception: [this.aaronicPriesthoodReception.value, Validators.required],
      phone: ['', Validators.required],
      gender: ['', Validators.required],
      regions: ['', Validators.required],
      leaderRoles: ['', Validators.required],
      ordinance: this._formBuilder.group({
        Baptism: [false, Validators.required],
        AaronicPriesthood: [false, Validators.required],
        PriestHood: [false, Validators.required],
        Initiatory: [false, Validators.required],
        Endowment: [false, Validators.required],
        Sealing: [false, Validators.required]
      }),
      blessing: this._formBuilder.group({
        is_got: [false, Validators.required]
      }),
      _family: this._formBuilder.group({
        name: ['', Validators.required],
        region: ['', Validators.required],
        code: ['', Validators.required]
      }),
    });

    const lastNameControl = this.memberForm.get('lastName');
    const regionsControl = this.memberForm.get('regions');
    const familyNameControl = this.memberForm.get('_family.name');
    const familyRegionsControl = this.memberForm.get('_family.region');
  
    if (lastNameControl && familyNameControl && regionsControl && familyRegionsControl) {
      lastNameControl.valueChanges.subscribe((value: any) => {
        familyNameControl.setValue(value);
      });

      regionsControl.valueChanges.subscribe((value: any) => {
        familyRegionsControl.setValue(value);
      });
    }

    const birthDateControl = this.memberForm.get('birthDate');
    console.log('birthDateControl',birthDateControl);
    
    if (birthDateControl) {
      birthDateControl.valueChanges.subscribe((value: any) => {
        const formattedDate = formatDate(value);
        console.log('formattedDate',formattedDate);
        
        birthDateControl.setValue(formattedDate, { emitEvent: false }); 
      });
    }
    const aaronicPriesthoodReceptionControl = this.memberForm.get('aaronicPriesthoodReception');
    console.log('aaronicPriesthoodReceptionControl',aaronicPriesthoodReceptionControl);
    
    if (aaronicPriesthoodReceptionControl) {
      aaronicPriesthoodReceptionControl.valueChanges.subscribe((value: any) => {
        const formattedDate = formatDate(value);
        console.log('formattedDate',formattedDate);
        
        aaronicPriesthoodReceptionControl.setValue(formattedDate, { emitEvent: false }); 
      });
    }
    
    if (this.member) {
      console.log('ici boy',this.member.ordinance);
      this.ordinancesTrue = this.member?.ordinance?.AaronicPriesthood;
      console.log(this.ordinancesTrue) 
      
      this.memberForm.patchValue(this.member);
    }
    if (this.member && this.member.leaderRoles) {
      this.currentRole = this.member.leaderRoles._id || '';
      this.memberForm.patchValue({
        leaderRoles: this.currentRole
      });
    }
  }

  public changeDate(event: any): void {
    console.log('birth',this.birthDate);
    if (this.birthDate.value && this.birthDate.value._d) {
        let parsedDate = new Date(this.birthDate.value._d);
  
        let timeZoneOffset = parsedDate.getTimezoneOffset() * 60000;
        let adjustedDate = new Date(parsedDate.getTime() - timeZoneOffset);
  
        let formattedDate = adjustedDate.toISOString().split('T')[0];
        console.log('formattedDate birthDate',formattedDate);
        
        this.memberForm.get('birthDate')?.setValue(formattedDate);
    }
  }
  
  public changeDateAaronic(event: any): void {
    console.log(event);

    if (event.value && event.value._d) {
      let parsedDate = new Date(event.value._d);
      console.log('parsedDate',parsedDate);
      
      let timeZoneOffset = parsedDate.getTimezoneOffset() * 60000;
      let adjustedDate = new Date(parsedDate.getTime() - timeZoneOffset);
      let formattedDate = adjustedDate.toISOString();
      
      this.memberForm.get('aaronicPriesthoodReception')?.setValue(formattedDate);
      
    }
  
  }

  public onCheckboxChange(event: MatCheckboxChange) {
    this.ordinancesTrue = event.checked;
  }

  public submit(): void {
    let obs: Observable<Member>;

    console.log('submit',this.memberForm);

    if (this.memberForm.invalid) {
      console.log('invalid');
      
        iziToast.error({
          title: 'Hello',
          message: 'Welcome to iziToast!',
        });
        return;
    }

    if (this.member && this.member._id) {
        obs = this._memberService.update(
            this.member._id,
            this.memberForm.value,
        );

    } else {
        obs = this._memberService.create(this.memberForm.value);
    }

    obs.subscribe({
        next: (member: Member) => {
          iziToast.success({ message: 'Membre enregistré avec succès' });
            this.close(member);
        },
        error: (error: any) => {
            console.error(error);
        },
    });
  }

  private close(member?: Member): void {
      this._dialogRef.close(member);
  }
}
