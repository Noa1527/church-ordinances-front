import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'environments/environement';
import { AuthService } from 'src/app/auth/service/auth.service';

@Injectable()
export class ApiUrlInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // clone request and replace 'http://' with 'https://' at the same time
    let editReq = req.clone();
    if (req.url.includes('/api/')) {
      editReq = req.clone({url: `${environment.apiUrl}${req.url.replace('/api/', '/')}`});
      
    }
    return next.handle(editReq);
  }
}
