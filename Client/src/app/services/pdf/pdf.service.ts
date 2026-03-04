import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PDFService {
    constructor(private _http: HttpClient) {}

    public generatePdf(data: any) {
        return this._http.post('/api/pdf/generate', data, {
          responseType: 'blob'
        });
    }
}