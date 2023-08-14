import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User, ApiResponse } from './user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://randomuser.me/api/';
  private page = 1;

  constructor(private http: HttpClient) {}

  getUsers(page:number): Observable<User[]> {
    this.page = page;
    return this.http
      .get<ApiResponse>(`${this.apiUrl}?page=${this.page}&results=10`)
      .pipe(
        map((response) => {
          return response.results;
        })
      );
  }
}
