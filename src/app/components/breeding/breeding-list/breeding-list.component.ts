import { Component, OnInit, Input } from '@angular/core';
import { BreedingService } from '../../../services/breeding/breeding.service';
import {BreedingListPageComponent} from '../../../pages/breeding/list/breeding-list-page.component'
import {BreedingDisplayComponent} from 'src/app/components/breeding/breeding-display/breeding-display.component';
import {environment} from 'src/environments/environment';
import { ConfigService } from 'src/app/services/config/config.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {Router} from "@angular/router";

@Component({
  selector: 'app-breeding-list',
  templateUrl: './breeding-list.component.html',
  styleUrls: ['./breeding-list.component.css']
})
export class BreedingListComponent implements OnInit {
  breedings = new Array();
  env = environment.endpoint;

  filterForm: any;

  public breedingDisplayComponent: BreedingDisplayComponent;
  constructor(
      private breedingService: BreedingService,
      public breedingListPageComponent: BreedingListPageComponent,
      public configService: ConfigService,
      private router: Router
  ) {}

  ngOnInit(): void {
      const token = localStorage.getItem('access_token');
      this.breedingService.getAllBreedings().then(res => res.forEach(breedingAd => {
        this.breedings.push(breedingAd);
      })).then(res=>console.log(this.breedings));
      this.filterForm = new FormGroup({
        price: new FormControl(''),
        type: new FormControl(''),
        pedigree: new FormControl(''),
        breed: new FormControl(''),
        genre: new FormControl(''),
      });
  }

  userlogged = this.configService.getUserLogged();
  rol: string = this.userlogged ? this.userlogged.role : 'disconnected';

  viewDetails(id: string){
    this.breedingListPageComponent.isLeftVisible = !this.breedingListPageComponent.isLeftVisible;
    this.breedingListPageComponent.loadBreeding(id);
    window.scroll(0,0);
  }

  onSubmit() {
    this.breedings = [];
    this.breedingService.filterBreedings(this.filterForm.value.price || '', this.filterForm.value.type || '', this.filterForm.value.pedigree || '',
    this.filterForm.value.breed || '', this.filterForm.value.genre || '').then(x => {
      x.forEach(b => {
        this.breedings.push(b);
      });
    });
  }
}
