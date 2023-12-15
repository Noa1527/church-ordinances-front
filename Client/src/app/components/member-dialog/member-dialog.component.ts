import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import * as moment from 'moment';
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

  constructor(
    private readonly _formBuilder: FormBuilder,
    private readonly _memberService: MemberService,
    private readonly _dialogRef: MatDialogRef<MemberDialogComponent>,
  ) {  }

  ngOnInit(): void {

    const formatDate = (dateString: any) => {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        // Ajouter un zéro devant les jours et les mois si nécessaire
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
        // Update the family name with the new last name
        familyNameControl.setValue(value);
      });
    }

    const birthDateControl = this.memberForm.get('birthDate');
    
    if (birthDateControl) {
      birthDateControl.valueChanges.subscribe(value => {
        // Convertir la date en format JJ/MM/AAAA et mettre à jour le champ
        const formattedDate = formatDate(value);
        birthDateControl.setValue(formattedDate, { emitEvent: false }); // Ne pas déclencher un nouvel événement de changement
      });
    }
    
    if (this.member) {
      console.log(this.member);
      
      this.memberForm.patchValue(this.member);
    }
  }

  public submit(): void {
    let obs: Observable<Member>;

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
