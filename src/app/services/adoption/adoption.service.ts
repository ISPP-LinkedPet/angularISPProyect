import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {RequestService} from '../request/request.service';

import {ConfigService} from '../config/config.service';

@Injectable({
  providedIn: 'root'
})
export class AdoptionService {
  push: any;

  constructor(private requestService: RequestService, public configService: ConfigService) { }

  getAllAdoptions(token: string) {
    return this.requestService.request('GET', `${environment.endpoint}/adoption/available`, {}, {access_token: token}, true);
  }

  getAdoptionById(token: string, id: string) {
    return this.requestService.request('GET', `${environment.endpoint}/adoption/${id}`, {}, {access_token: token}, true);
  }

  getShelterById(token: string, id: string) {
    return this.requestService.request('GET', `${environment.endpoint}/shelter/${id}`, {}, {access_token: token}, true);
  }

  getAdoptionByShelterLogged() {
    var userlogged = this.configService.getUserLogged();
    return this.requestService.request('GET', `${environment.endpoint}/publication/user/${userlogged.id}`, {}, {}, true);
  }

  createAdoption(data: any) {
    return this.requestService.request('POST', `${environment.endpoint}/adoption`, data, {}, true);
  }

  editAdoption(data: any, id: number) {
    return this.requestService.request('PUT', `${environment.endpoint}/adoption/edit/${id}`, data, {}, true)
  }

  getPersonalAdoptions(id: string) {
    return this.requestService.request('GET', `${environment.endpoint}/publication/adoption/user/${id}`, {}, {}, true);
  }

  getPendingAdoptions() {
    return this.requestService.request('GET', `${environment.endpoint}/adoption/pending`, {}, {}, true);
  }

  acceptAdoption(id: string) {
    return this.requestService.request('PUT', `${environment.endpoint}/adoption/accept/${id}`, {}, {}, true);
  }

  rejectAdoption(id: string) {
    return this.requestService.request('PUT', `${environment.endpoint}/adoption/accept/${id}`, {}, {}, true);
  }

}
