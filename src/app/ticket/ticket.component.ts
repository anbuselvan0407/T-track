import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { TicketService } from '../services/ticket.service';
import { CreateTicketComponentComponent } from '../create-ticket-component/create-ticket-component.component';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export interface Ticket {
  _id: string;
  title: string;
  description: string;
  createdBy: string;
}

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss']
})
export class TicketComponent implements OnInit {
displayedColumns: string[] = ['id', 'title', 'description', 'status', 'createdBy'];

  dataSource = new MatTableDataSource<Ticket>();
  users: string[] = [];
  selectedUser: string = '';
  currentUserRole: string = '';
  isAdmin = false;

  originalTickets: any[] = [];



  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private ticketService: TicketService, private dialog: MatDialog,private authService: AuthService, private router: Router) {}

ngOnInit(): void {
  const role = this.authService.getUserRole();
  this.isAdmin = role === 'admin';
  this.loadTickets();
}


loadTickets() {
this.ticketService.getTickets().subscribe((tickets: any[]) => {
  this.originalTickets = tickets;
  this.dataSource.data = tickets;
  this.users = [...new Set(tickets.map((t: any) => t.createdBy))];
  this.dataSource.paginator = this.paginator;
});

}


applyFilter() {
  if (this.selectedUser) {
    this.dataSource.data = this.originalTickets.filter(t => t.createdBy === this.selectedUser);
  } else {
    this.dataSource.data = this.originalTickets;
  }

  // Reset paginator to first page after filtering
  if (this.paginator) {
    this.paginator.firstPage();
  }
}


  openCreateTicketDialog() {
    const dialogRef = this.dialog.open(CreateTicketComponentComponent, {
      panelClass: 'custom-dialog-panel'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'refresh') {
        this.loadTickets();
      }
    });
  }



openTicketDetail(row: any) {
  console.log('Row clicked, navigating to', row._id);
  this.router.navigate(['/dashboard/ticket', row._id]);
}

}
