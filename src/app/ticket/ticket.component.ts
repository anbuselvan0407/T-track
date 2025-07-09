import { ChangeDetectionStrategy,ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { TicketService } from '../services/ticket.service';
import { CreateTicketComponentComponent } from '../create-ticket-component/create-ticket-component.component';
import { AuthService } from '../services/auth.service';
import { Router,NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
export interface Ticket {
  _id: string;
  title: string;
  description: string;
  createdBy: string;
}

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketComponent implements OnInit {
displayedColumns: string[] = ['id', 'title', 'description', 'status', 'createdBy'];

  dataSource = new MatTableDataSource<Ticket>();
  users: string[] = [];
  selectedUser: string = '';
  currentUserRole: string = '';
  isAdmin = false;

  originalTickets: any[] = [];
  ticketCounts: any = {};

  isClicked = false;


  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private ticketService: TicketService, private dialog: MatDialog,private authService: AuthService, private router: Router,private cd: ChangeDetectorRef ) {}

ngOnInit(): void {
  const role = this.authService.getUserRole();
  this.isAdmin = role === 'admin';
  this.loadTicketCounts();
  
  this.router.events
  .pipe(filter(event => event instanceof NavigationEnd))
  .subscribe(() => {
    if (this.router.url.includes('/dashboard/ticket')) {
      this.loadTicketCounts();
    }
  });
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

loadTicketCounts() {
  this.ticketService.getTicketCounts().subscribe(counts => {
    this.ticketCounts = counts;
    console.log(this.ticketCounts);
     this.cd.markForCheck();
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
