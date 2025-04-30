import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { PDFService } from '../services/pdf/pdf.service';

 
const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();
@Component({
  selector: 'app-ordre-du-jours',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatFormFieldModule, 
    ReactiveFormsModule,
    FormsModule,
    MatInputModule, 
    MatIconModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    NgxMaterialTimepickerModule,
  ],
  templateUrl: './ordre-du-jours.component.html',
  styleUrl: './ordre-du-jours.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdreDuJoursComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  public pdfForm!: FormGroup;
  public memberOpenPrayerListFiltered: Array<any> = [];
  public memberSpiritualThoughtsListFiltered: Array<any> = [];
  public memberPresideByListFiltered: Array<any> = [];
  public reportListFiltered: Array<any> = [];

  public numPoint = 0;

  public presideBy: Array<any> = [
    {name: 'Frere Raveneau'},
    {name: 'Frere Narraidoo'},
    {name: 'Frere Pagos'},
    {name: 'jean-paul'},
  ];

  public spiritualThoughts: Array<any> = [
    {name: 'Frere Raveneau'},
    {name: 'Frere Narraidoo'},
    {name: 'Frere Pagos'},
    {name: 'jean-paul'},
  ];

  public selecteMemberPrayer: Array<any> = [
    {name: 'Frere Raveneau'},
    {name: 'Frere Narraidoo'},
    {name: 'Frere Pagos'},
    {name: 'jean-paul'},
  ];

  public report: Array<any> = [
    {name: 'Frere Raveneau'},
    {name: 'Frere Narraidoo'},
    {name: 'Frere Pagos'},
    {name: 'jean-paul'},
  ];
  
  constructor(
    private router: Router,
    private pdfService: PDFService,
    private formBuilder: FormBuilder,
  ) {
    NgxMaterialTimepickerModule.setOpts('fr-FR', 'france');
  }

  ngOnInit() {
    // this.routeService.changeRoute(this.router.url);

    //date du jours : date piker// 
    //l'heur du jours : heur piker
    // présider par : liste des utilisateurs
    // dirigé par : liste des utilisateurs
    // lecture du manuel: what to read
    // si un a invite qui ?
    // priere d'ouverture : liste des utilisateurs
    // pense spirituel : liste des utilisateurs
    // lecture du compt rendu : liste des utilisateurs
    // sujet : {
    //     1:string 
    //     2:string
    //     3:string
    //     4:string
    //     5:string
    // }
    // compte rendu: {
    //   1:string 
    //     2:string
    //     3:string
    //     4:string
    //     5:string
    // }
    //prier de cloture : liste des utilisateurs
    //prochaine reunion : date


    this.pdfForm = this.formBuilder.group({
      dateOfTheDay: '',
      preside: '',
      dirige: '',
      start: '',
      end: '',
      report: '',
      memberOpenPrayer: '',
      subjectSpiritualThoughts: '',
      memberSpiritualThoughts: '',
      agenda: this.formBuilder.array([]),
      conteRendu: this.formBuilder.array([]),
      memberClosePrayer: '',
      formattedNextDate: '',
      manuelGeneral: '',
      // heureRange = new FormGroup({
      //   start: new FormControl(),
      //   end: new FormControl()
      // });
    });

  }

  // OPEN PRAYER
  public onSelectedMemberOpenPrayerChanged(event: any): void {
    const value = event.target.value;
    this.memberOpenPrayerListFiltered = this.selecteMemberPrayer.filter((u) => `${u.name}`.toLocaleLowerCase().includes(value.toLocaleLowerCase()));
  }

  public displayFnOpenPayerList(value: any): string {
    return value ? `${ value.name }` : '';
  } 

  public onMemberOpenPrayerSelected(event: any): void {
    const selectElement = event.option.value;
    console.log(selectElement);
    //  let MemberPrayer = this.pdfForm.get('memberOpenPrayer')?.value
    //   console.log('MemberPrayer', MemberPrayer);
  }
  
  //SPIRITUAL THOUGHT
  public onMemberSpiritualThoughtsSelected(event: any): void {
    const value = event.target.value;
    this.memberSpiritualThoughtsListFiltered = this.spiritualThoughts.filter((u) => `${u.name}`.toLocaleLowerCase().includes(value.toLocaleLowerCase()));
  }

  public displayFnSpiritualThoughtsList(value: any): string {
    return value ? `${ value.name }` : '';
  }

  //REPORT
  public onReportSelected(event: any): void {
    const value = event.target.value;
    this.reportListFiltered = this.report.filter((u) => `${u.name}`.toLocaleLowerCase().includes(value.toLocaleLowerCase()));
  }

  public displayFnReportList(value: any): string {
      return value ? `${ value.name }` : '';
  }
  
  //PRESIDE BY
  public onPresideBySelected(event: any): void {
    const value = event.target.value;
    this.memberPresideByListFiltered = this.presideBy.filter((u) => `${u.name}`.toLocaleLowerCase().includes(value.toLocaleLowerCase()));
  }

  public displayFnPresideByList(value: any): string {
    return value ? `${ value.name }` : '';
  }
  
  public onSelectedMemberPresideByChanged(event: any): void {
    const value = event.target.value;
    console.log(value);
    
    // this.memberPresideByListFiltered = this.presideBy.filter((u) => `${u.name}`.toLocaleLowerCase().includes(value.toLocaleLowerCase()));
  }

 

  setAgenda(agenda: any[]): void {
    const agendasArray = this.pdfForm.get('agenda') as FormArray;
    agendasArray.clear();
    agenda.forEach((agendaInfo) => {
        agendasArray.push(this.createAgenda(agendaInfo));
    });
  }

  createAgenda(agendaInfo?: any): FormGroup {
    return this.formBuilder.group({
      point: [agendaInfo ? agendaInfo.point : '', Validators.required],
    });
  }

  createRow(): FormGroup {
    return this.formBuilder.group({
        point: ['', Validators.required],
    });
  }

  get agenda(): FormArray {
    return this.pdfForm.get('agenda') as FormArray;
  }

  addDefaultAgendaInfo(): void {
    const animalsArray = this.pdfForm.get('agenda') as FormArray;
    animalsArray.push(this.createAgenda());
}

  addRow() {
    this.agenda.push(this.createRow());
    this.numPoint++;
  }

  removeRow(index: number) {
    this.agenda.removeAt(index);
  }

  setConteRendu(conteRendu: any[]): void {
    const conteRenduArray = this.pdfForm.get('conteRendu') as FormArray;
    conteRenduArray.clear();
    conteRendu.forEach((conteRenduInfo) => {
      conteRenduArray.push(this.createAgenda(conteRenduInfo));
    });
  }

  createConteRendu(conteRenduInfo?: any): FormGroup {
    return this.formBuilder.group({
      point: [conteRenduInfo ? conteRenduInfo.point : '', Validators.required],
    });
  }

  get conteRendu(): FormArray {
    return this.pdfForm.get('conteRendu') as FormArray;
  }

  addDefaultConteRenduInfo(): void {
    const conteRendusArray = this.pdfForm.get('conteRendu') as FormArray;
    conteRendusArray.push(this.createConteRendu());
}

  addRowConteRendu() {
    this.conteRendu.push(this.createRow());
    this.numPoint++;
  }

  removeRowConteRendu(index: number) {
    this.conteRendu.removeAt(index);
  }

  getInvalidFields(): string[] {
      const invalidFields: string[] = [];
      Object.keys(this.pdfForm.controls).forEach(key => {
          const control = this.pdfForm.get(key);
          if (control && control.invalid) {
              invalidFields.push(key);
          }
      });
      this.agenda.controls.forEach((group, index) => {
          if (group.invalid) {
              invalidFields.push(`agenda[${index}]`);
          }
      });
      return invalidFields;
  }


public submitForm() {
  console.log('form submitted');

  console.log(this.pdfForm.value);

  if (!this.pdfForm.valid) {
    console.log('invalid', this.pdfForm);
    return;
  }

  console.log('valid', this.pdfForm);

  // const docDefinition = {
  //   content: [
  //     {
  //       text: 'Formulaire de données',
  //       fontSize: 22,
  //     },
  //     ...Object.keys(this.pdfForm.value).map((key) => ({
  //       text: `${key} : ${this.pdfForm.value[key]}`,
  //       fontSize: 14,
  //     })),
  //   ],
  // };

  // const pdfDoc = pdfMake.createPdf(docDefinition);
  // pdfDoc.download('formulaire.pdf');

  this.pdfService.generatePdf(this.pdfForm.value).subscribe({
    next: (pdfBlob: Blob) => {
      const date = new Date(this.pdfForm.value.dateOfTheDay);
      const formattedDate = date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).replace(/ /g, '_');
      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ODJ_College_${formattedDate}.pdf`;
      a.click();
      // Navigate to the confirmation required page
      // this._router.navigateByUrl('/confirmation-required');
    },
    error: (error: any) => {
      console.log(error);
    },
  });
}

  ngOnDestroy() {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
