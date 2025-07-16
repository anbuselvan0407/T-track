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

  // Title
  editingTitle = false;
  tempTitle = '';

  // Description
  editingDescription = false;
  tempDescription = '';

  selectedFile: File | null = null;

  constructor(private route: ActivatedRoute, private ticketService: TicketService, private router: Router) {}

  ngOnInit(): void {
    this.ticketId = this.route.snapshot.paramMap.get('id')!;
    this.ticketService.getTicketById(this.ticketId).subscribe(ticket => {
      this.ticket = ticket;
    });
  }

  navigate() {
    this.router.navigate(['/dashboard/ticket']);
  }

  // --- Title Editing ---
  startEditTitle() {
    this.editingTitle = true;
    this.tempTitle = this.ticket.title;
  }

saveTitle() {
  const updatedTitle = this.tempTitle.trim() ? this.tempTitle : this.ticket.title;

  this.ticketService.updateTicketDetails(this.ticketId, { title: updatedTitle, description: this.ticket.description }).subscribe({
    next: (updatedTicket) => {
      this.ticket.title = updatedTicket.title;
      this.editingTitle = false;
      alert('Title updated!');
    },
    error: (err) => {
      console.error(err);
      alert('Failed to update title');
    }
  });
}


  // --- Description Editing ---
  startEditDescription() {
    this.editingDescription = true;
    this.tempDescription = this.ticket.description;
  }

saveDescription() {
  const updatedDescription = this.tempDescription.trim() ? this.tempDescription : this.ticket.description;

  this.ticketService.updateTicketDetails(this.ticketId, { title: this.ticket.title, description: updatedDescription }).subscribe({
    next: (updatedTicket) => {
      this.ticket.description = updatedTicket.description;
      this.editingDescription = false;
      alert('Description updated!');
    },
    error: (err) => {
      console.error(err);
      alert('Failed to update description');
    }
  });
}


  cancelDescription() {
    this.editingDescription = false;
  }

  // --- PDF Upload ---
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.selectedFile = file;
      const formData = new FormData();
      if (this.selectedFile) {
  formData.append('pdf', this.selectedFile);
}


      this.ticketService.uploadPdf(this.ticketId, formData).subscribe({
        next: () => {
          alert('PDF uploaded and saved!');
          this.ticketService.getTicketById(this.ticketId).subscribe(updatedTicket => {
            this.ticket = updatedTicket;
          });
        },
        error: (err) => {
          console.error(err);
          alert('Failed to upload PDF');
        }
      });
    } else {
      alert('Please upload a valid PDF file.');
    }
  }

  updateStatus(newStatus: string) {
    this.ticketService.updateTicketStatus(this.ticketId, newStatus).subscribe(updated => {
      this.ticket.status = updated.status;
      alert('Status updated!');
    });
  }
}
