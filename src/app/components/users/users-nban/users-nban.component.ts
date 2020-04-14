import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin/admin.service';
import { environment } from 'src/environments/environment';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-users-nban',
  templateUrl: './users-nban.component.html',
  styleUrls: ['./users-nban.component.css']
})
export class UsersNbanComponent implements OnInit {
  users = new Array();
  returnedUsers = new Array();
  env = environment.endpoint
  filterForm: any;
  // pagginations
  itemsPerPage = 5;
  constructor(private adminService: AdminService, private router: Router) { }

  ngOnInit(): void {
    this.adminService.getUsersNotBan().then(res => {
      res.forEach(userAd => {
        this.users.push(userAd);
      });
      this.returnedUsers = this.users.slice(0, this.itemsPerPage);
    })
    this.filterForm = new FormGroup({
      role: new FormControl(''),
    });
  }
  banUser(id: number) {
    this.adminService.banUser(id).then(res => {
      alert('¡Has baneado con éxito al usuario!')
      this.router.navigate(['/userList']);
      this.ngOnInit();
    });

  }
  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.returnedUsers = this.users.slice(startItem, endItem);
  }
  onSubmit() {
    this.users = [];
    this.adminService.filterAdmin(this.filterForm.value.role).then(x => {
        x.forEach(b => {
          this.users.push(b);
        });
        this.returnedUsers = this.users.slice(0, this.itemsPerPage);
      });
  }

}
