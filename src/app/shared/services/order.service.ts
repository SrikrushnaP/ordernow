import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ApiService } from '../../core/services/api.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  public order_url = environment.server_url + '/orders/';

  constructor(private apiService: ApiService, private http: HttpClient) { }

  allOrder(): Observable<any> {
    return this.apiService.get(this.order_url)
  }
  singleOrder(id) {
    return this.apiService.get(this.order_url + id)
  }
  updateOrderStatus(id, order_dto): Observable<any> {
    return this.apiService.put(this.order_url + id, order_dto);
  }

  getSingleUserOrder(user_id=3){
    return this.apiService.get(this.order_url + '?userId=' + user_id);
  }

}
