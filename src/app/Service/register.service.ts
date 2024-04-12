import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  url='http://localhost:3000/data';
  constructor(private _http:HttpClient) { }

addUserData(data:any):Observable<any>{
  return this._http.post(this.url,data);
}

getUserData():Observable<any>{
  return this._http.get(this.url);
}

updateUserData(id:string,data:any):Observable<any>{
  return this._http.put(`http://localhost:3000/data/${id}`,data);
}

}
