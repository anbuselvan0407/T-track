import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private apiUrl = 'http://localhost:5000/api/tickets';

  constructor(private http: HttpClient) {}

  getTickets(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(this.apiUrl, { headers });
  }

  createTicket(data: { title: string; description: string }): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(this.apiUrl, data, { headers });
  }

getTicketById(id: string) {
  return this.http.get<any>(`${this.apiUrl}/${id}`, {
    headers: this.getAuthHeaders()
  });
}

updateTicketStatus(id: string, status: string) {
  return this.http.put<any>(`http://localhost:5000/api/tickets/${id}`, { status }, {
    headers: this.getAuthHeaders()
  });
}

private getAuthHeaders() {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
}

}
