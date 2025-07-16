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
  status: string;
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

  totalItems=0;
  page=1;
  limit=10;

  originalTickets: any[] = [];
  ticketCounts: any = {};

  selectedStatus: string = '';


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

  this.dataSource.filterPredicate = (data: Ticket, filter: string): boolean => {
    const search = filter.trim().toLowerCase();
    return (
      data.title?.toLowerCase().includes(search) ||
      data.description?.toLowerCase().includes(search) ||
      data.createdBy?.toLowerCase().includes(search) ||
      data.status?.toLowerCase().includes(search) ||
      data._id?.toLowerCase().includes(search)
    );
  };
}


ngAfterViewInit() {
  this.paginator.page.subscribe(() => {
    this.page = this.paginator.pageIndex + 1;
    this.limit = this.paginator.pageSize;
    this.loadTickets();
  });
}



applyGlobalFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();

  // Reset paginator
  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
}




loadTickets() {
  this.ticketService.getTickets(this.page, this.limit, this.selectedStatus, this.selectedUser).subscribe(res => {
    console.log(res);
    this.originalTickets = res.tickets;
    this.dataSource.data = res.tickets;
    this.totalItems = res.total;

    this.users = [...new Set(res.tickets.map((t: any) => t.createdBy))] as string[];
    this.cd.markForCheck();
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
  this.page = 1;
  this.paginator.firstPage();
  this.loadTickets();
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


filterByStatus(status: string) {
  this.selectedStatus = status;
  this.page = 1;
  this.paginator.firstPage();
  this.loadTickets();
}



}
