import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TicketService } from '../services/ticket.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-ticket-detail',
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.scss']
})
export class TicketDetailComponent implements OnInit {
  ticketId!: string;
  ticket: any = {};

  constructor(private route: ActivatedRoute, private ticketService: TicketService, private router:Router) {}

ngOnInit(): void {
  this.ticketId = this.route.snapshot.paramMap.get('id')!;
  console.log("Ticket ID from URL", this.ticketId);
  this.ticketService.getTicketById(this.ticketId).subscribe(ticket => {
    this.ticket = ticket;
  });
}


  updateStatus(newStatus: string) {
    this.ticketService.updateTicketStatus(this.ticketId, newStatus).subscribe(updated => {
      this.ticket.status = updated.status;
      alert('Status updated!');
    });
  }

  navigate(){
    this.router.navigate(['/dashboard/ticket']);
  }
}
