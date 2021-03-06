import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {RequestService} from '../request/request.service';
import { Breeding } from 'src/app/models/breeding/breeding';
import { BreedingService } from '../breeding/breeding.service';
import { ProfileService } from '../profile/profile.service';
import { AdoptionService } from '../adoption/adoption.service';

@Injectable({
  providedIn: 'root'
})
export class AnimalService {

  constructor(
    private requestService: RequestService,
    private BreedingService: BreedingService,
    private adoptionService: AdoptionService,
    private profileService: ProfileService
  ) { }

  createAnimal(data: any) {
    return this.requestService.request('POST', `${environment.endpoint}/pet`, data, {}, true);
  }

  editAnimal(id:number, data: any) {
    return this.requestService.request('PUT', `${environment.endpoint}/pet/edit/${id}`, data, {}, true);
  }

  getAnimalById(id: string) {
    return this.requestService.request('GET', `${environment.endpoint}/pet/${id}`, {}, {}, true);
  }
  getPetsInRevision() {
    return this.requestService.request('GET', `${environment.endpoint}/pet/revision`, {}, {}, true)
  }

  acceptAnimal(data: any, id: number) {
    return this.requestService.request('PUT', `${environment.endpoint}/pet/accept/${id}`, data, {}, true);
  }

  rejectAnimal(id: number) {
    return this.requestService.request('PUT', `${environment.endpoint}/pet/reject/${id}`, {}, {}, true)
  }

  deleteAnimal(id: number) {
    return this.requestService.request('DELETE', `${environment.endpoint}/pet/delete/${id}`, {}, {}, true)
  }

    canDeleteAnimal(id: number) {
    return this.requestService.request('GET', `${environment.endpoint}/pet/canDelete/${id}`, {}, {}, true)
  }

  notEditableAnimals(rol){
    var startAsync;
    if(rol=='particular'){
      startAsync = async callback => this.profileService.getParticularLogged().then(res => {
        var petsNotEditable = new Map();
        var id = res.particular.user_account_id;
        this.BreedingService.getPersonalBreedings(id).then(res=>{
          var array = res;
          for (let index = 0; index < array.length; index++) {
            const element = array[index];
            if(element.pet_id!=null && !(element.transaction_status=="Completed" || element.transaction_status=="Reviewed")){
              petsNotEditable.set(element.pet_id, element.transaction_status)
            }
          }
          callback(petsNotEditable);
        })
      });
    } else if (rol=='shelter'){
      startAsync = async callback => this.profileService.getShelterLogged().then(res => {
        var petsNotEditable = new Map();
        var id = res.shelter.user_account_id;
        console.log(id)
        this.adoptionService.getPersonalAdoptions(id).then(res=>{
          var array = res;
          for (let index = 0; index < array.length; index++) {
            const element = array[index];
            if(element.pet_id!=null && !(element.transaction_status=="Completed" || element.transaction_status=="Reviewed")){
              petsNotEditable.set(element.pet_id, element.transaction_status)
            }
          }
          console.log(petsNotEditable)
          callback(petsNotEditable);
        })
      });
    }
    return startAsync;
  }
}
