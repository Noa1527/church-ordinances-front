import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { MemberService } from 'src/app/services/member.service';
import { Member } from 'src/app/services/member.type';

@Component({
  selector: 'app-member-dialog',
  templateUrl: './member-dialog.component.html',
  styleUrls: ['./member-dialog.component.css']
})
export class MemberDialogComponent implements OnInit{
  @Input()member?: Member;
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
    private readonly _dialogRef: MatDialogRef<MemberDialogComponent>,
  ) {  }

  ngOnInit(): void {

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
      birthDate: [formatDate(this.member?.birthDate), Validators.required],
      phone: ['', Validators.required],
      gender: ['', Validators.required],
      regions: ['', Validators.required],
      ordinance: this._formBuilder.group({
        Baptism: [false, Validators.required],
        PriestHood: [false, Validators.required],
        Initiatory: [false, Validators.required],
        Endowment: [false, Validators.required],
        Sealing: [false, Validators.required]
      }),
      blessing: this._formBuilder.group({
        is_got: [false, Validators.required]
      }),
      leaderRoles: this._formBuilder.group({
        roles: ['', Validators.required]
      }),
      _family: this._formBuilder.group({
        name: ['', Validators.required]
      }),
    });

    const lastNameControl = this.memberForm.get('lastName');
    const familyNameControl = this.memberForm.get('_family.name');
  
    if (lastNameControl && familyNameControl) {
      lastNameControl.valueChanges.subscribe(value => {
        familyNameControl.setValue(value);
      });
    }

    const birthDateControl = this.memberForm.get('birthDate');
    
    if (birthDateControl) {
      birthDateControl.valueChanges.subscribe(value => {
        const formattedDate = formatDate(value);
        birthDateControl.setValue(formattedDate, { emitEvent: false }); 
      });
    }
    
    if (this.member) {
      console.log(this.member);
      
      this.memberForm.patchValue(this.member);
    }
  }

  public submit(): void {
    let obs: Observable<Member>;

    console.log('submit',this.memberForm.value);
    

    if (this.memberForm.invalid) {
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
            this.close(member);
        },
        error: (error) => {
            console.error(error);
        },
    });
  }

  private close(member?: Member): void {
      this._dialogRef.close(member);
  }
}
