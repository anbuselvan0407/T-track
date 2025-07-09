import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {
  users: any[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe(data => {
      this.users = data;
    });
  }

  toggleRole(user: any) {
    const newRole = user.role === 'admin' ? 'maintainer' : 'admin';
    this.userService.updateUserRole(user._id, newRole).subscribe(() => {
      user.role = newRole; // update UI immediately
    });
  }
}
