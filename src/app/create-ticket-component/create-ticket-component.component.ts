import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TicketService } from '../services/ticket.service';


@Component({
  selector: 'app-create-ticket-component',
  templateUrl: './create-ticket-component.component.html',
  styleUrls: ['./create-ticket-component.component.scss']
})
export class CreateTicketComponentComponent {
 title: string = '';
  description: string = '';

  constructor(
    private dialogRef: MatDialogRef<CreateTicketComponentComponent>,
    private ticketService: TicketService
  ) {}

  onCancel() {
    this.dialogRef.close();
  }

  onCreate() {
    const newTicket = {
      title: this.title,
      description: this.description,
      createdBy: localStorage.getItem('username') || 'unknown'
    };

    this.ticketService.createTicket(newTicket).subscribe(() => {
      this.dialogRef.close('refresh');
    });
  }
}
