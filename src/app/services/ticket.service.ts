import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private apiUrl = 'http://localhost:5000/api/tickets';

  constructor(private http: HttpClient) {}

getTickets(page: number = 1, limit: number = 10, status?: string, createdBy?: string): Observable<any> {
  const token = localStorage.getItem('token');
  let query = `?page=${page}&limit=${limit}`;
  if (status) query += `&status=${status}`;
  if (createdBy) query += `&createdBy=${createdBy}`;
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get(`${this.apiUrl}${query}`, { headers });
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

updateTicketDetails(id: string, data: { title: string; description: string }): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.put(`${this.apiUrl}/${id}/details`, data, { headers });
}


uploadPdf(ticketId: string, formData: FormData): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  return this.http.post(`http://localhost:5000/api/tickets/${ticketId}/upload-pdf`, formData, {
    headers,
  });
}



private getAuthHeaders() {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
}

getTicketCounts() {
  return this.http.get<{ total: number; inProgress: number; inReview: number; done: number }>(
    `${this.apiUrl}/counts`
  );
}


}
