import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './user.interface';
import { UserService } from './user.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {
  users: User[] = [];
  computedUsers: User[] = [];
  backupComputedUsers: User[] = [];
  private userSubscription:Subscription;
  page: number = 1;
  pages: number[] = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10
  ]
  sort: boolean = false;

  constructor(private http: HttpClient, private userService: UserService) {
    this.userSubscription = Subscription.EMPTY;
  }

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.userSubscription = this.userService.getUsers(this.page).subscribe((users: User[]) => {
      this.users = users;
      this.computedUsers = users;
    });
  }

  filterUsers(event: any) {
    const country: string = event.target.value.toLowerCase();
    const filteredUsers = [...this.users].filter((user) => {
      return user.location.country.toLowerCase().includes(country)
    })

    if(filteredUsers.length > 0) {
      this.computedUsers = filteredUsers;
      this.backupComputedUsers = filteredUsers;
    }
    if(filteredUsers.length === 0) this.computedUsers = this.users;
  }

  sortingUsers() {
    this.sort = !this.sort;
    let sortedUsers:User[] = [];

    if (this.sort) {
      sortedUsers = [...this.computedUsers].sort((a, b) => {
        return a.location.country.toLowerCase().localeCompare(b.location.country.toLowerCase())
      })

      this.computedUsers = sortedUsers;
    } else {
      if(this.backupComputedUsers.length > 0){
        this.computedUsers = [...this.backupComputedUsers];
      }else{
        this.computedUsers = [...this.users];
      }
    }
  }

  paginateUsers(page: number) {
    this.page = page;
    this.getUsers();
  }

  next() {
    this.page = this.page + 1;
    this.getUsers();
  }

  prev() {
    if (this.page >= 1) {
      this.page = this.page - 1;
      this.getUsers();
    }
  }
  
  ngOnDestroy(){
    this.userSubscription.unsubscribe();
  }
}
