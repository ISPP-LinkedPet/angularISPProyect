import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {environment} from '../../../../environments/environment';

import {Router, ActivatedRoute} from "@angular/router";
import { BreedingService } from '../../../services/breeding/breeding.service';
import { ConfigService } from '../../../services/config/config.service';


import { faTimes } from '@fortawesome/free-solid-svg-icons';
import swal from 'src/sweetalert';

@Component({
  selector: 'app-breeding-form',
  templateUrl: './breeding-form.component.html',
  styleUrls: ['./breeding-form.component.css']
})
export class BreedingCreateComponent implements OnInit {

  @Input() creating: boolean;
  @Input() editBreeding: any;
  
  

  // photo
  @ViewChild('animalPhoto', { static: false }) animalPhoto: ElementRef;
  @ViewChild('vaccinePassaport', { static: false }) vaccinePassaport: ElementRef;
  @ViewChild('identificationPhoto', { static: false }) identificationPhoto: ElementRef;

  // variables validacion
  isValidBreed: boolean;
  isValidPrice: boolean;
  isValidGenre: boolean;
  isValidAge: boolean;
  isValidType: boolean;
  isValidPedigri: boolean;
  isValidAnimalPhoto: boolean;
  isValidLocation: boolean;
  isValidIdentificationPhoto: boolean;
  isValidVaccinePassaport: boolean;
  backError: string;

  // user data
  userlogged = this.configService.getUserLogged();
  rol: string = this.userlogged ? this.userlogged.role : 'disconnected';

  // form

  breedingForm: any;

  // utils
  title: any;
  env = environment.endpoint
  animalPhotos: any[] = [];
  identification_photos: any[] = [];
  vaccine_photos :any[] = [];
  id = null;
  private sub : any;

  // Icons
  faTimes = faTimes;

  constructor(
    private breedingService: BreedingService,
    private router: Router,
    private route: ActivatedRoute,
    public configService: ConfigService
  ) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id']; // (+) converts string 'id' to a number
    });
    
    //Security 
    if(!this.creating && this.rol == 'particular'){
    this.breedingService.getPersonalBreedings(this.userlogged.id).then(res=>{
      if(!res.map(o=>o.id).includes(this.editBreeding.publication_id)){
        this.router.navigate(['/pallAds'])
      }
    })
  }

    this.editBreeding = this.editBreeding || {};
    this.breedingForm = new FormGroup({
      title: new FormControl(
        this.editBreeding.title || '', this.requiredInput()
      ),
      age: new FormControl(
        this.editBreeding.age || '', this.requiredInput()
      ),
      genre: new FormControl('', this.requiredInput()),
      breed: new FormControl(
        this.editBreeding.breed || '', this.requiredInput()
      ),
      type: new FormControl('', this.requiredInput()
      ),
      pedigree: new FormControl('', this.requiredInput()),
      location: new FormControl(
        this.editBreeding.location || '', [Validators.required, Validators.minLength(0)]
      ),
      price: new FormControl(
        this.editBreeding.price || '', [Validators.required, Validators.min(0)]
      ),
      animal_photo: new FormControl(
        '', [Validators.required]
      ),
      identification_photo: new FormControl(
        '', [Validators.required]
      ),
      vaccine_passaport: new FormControl(
        '', [Validators.required]
      ),
    });
    
    this.getTitle();
    this.validationFields('default');
  }

  // utils
  getTitle(){
    this.title = this.rol=='moderator' ? 'Moderar' : (this.rol == 'particular' && !this.creating) ? 'Editar' : 'Crear nueva';
  }
  requiredInput(){
    if(!this.creating){
      return [Validators.required]
    }
    return []
  }

  // validations
  validateBreed() {
    if(!this.creating && this.rol == 'moderator'){
      this.isValidBreed = this.breedingForm.get('breed').valid;
    }
  }
  validatePrice() {
    this.isValidPrice = this.breedingForm.get('price').valid;
    if(this.breedingForm.get('price').value>950000){
      this.isValidPrice = false;
    }else{
      try {
        this.isValidPrice = this.isValidPrice && Number.isInteger(Number(this.breedingForm.get('price').value));
      } catch (e) {
        this.isValidPrice = false;
      }
  }
  }
  validateGenre() {
    if(!this.creating && this.rol=='moderator'){
      this.isValidGenre = ['Male','Female'].includes(this.breedingForm.get('genre').value);
    }
    
  }
  validateAge() {
    if(!this.creating && this.rol=='moderator'){
      this.isValidAge = this.breedingForm.get('age').valid;
      var date = new Date(this.breedingForm.get('age').value)
      var now = new Date()
      if(date>now){
        this.isValidAge = false
      }
    }
  }
  validateType() {
    if(!this.creating && this.rol=='moderator'){
      this.isValidType = ['Dog','Cat', 'Horse'].includes(this.breedingForm.get('type').value);
    }
  }
  validatePedigree() {
    if(!this.creating && this.rol=='moderator'){
      this.isValidPedigri = ['1','0'].includes(this.breedingForm.get('pedigree').value);
    }
  }

  validateAnimalPhoto(){
    if(this.animalPhoto!=undefined){
      const animalPhoto = this.animalPhoto.nativeElement.files;
      this.isValidAnimalPhoto = this.breedingForm.get('animal_photo').valid && animalPhoto.length >= 2;
    }else{
      this.isValidAnimalPhoto = this.breedingForm.get('animal_photo').valid
    }
  }

  validateLocation() {
    this.isValidLocation = this.breedingForm.get('location').valid;
  }
  validateIdentificationPhoto() {
    this.isValidIdentificationPhoto = this.breedingForm.get('identification_photo').valid;
  }
  validateVaccinePassaport() {
    this.isValidVaccinePassaport = this.breedingForm.get('vaccine_passaport').valid;
  }

  // If the input has changed(file picked) we project the file into the img previewer
  getAnimalPhotoAndValidate($event: Event) {
    this.animalPhotos = [];
    Array.from($event.target['files']).forEach(element => {
      this.animalPhotos.push(element);
    });
    this.validateAnimalPhoto();
  }

  // If the input has changed(file picked) we project the file into the img previewer
  getIdPhotoAndValidate($event: Event) {
    this.identification_photos = [];
    // We access he file with $event.target['files'][0]
    Array.from($event.target['files']).forEach(element => {
      this.identification_photos.push(element)
    });
    this.validateIdentificationPhoto();
  }


  // If the input has changed(file picked) we project the file into the img previewer
  getVacPhotoAndValidate($event: Event) {
    this.vaccine_photos = [];
    // We access he file with $event.target['files'][0]
    Array.from($event.target['files']).forEach(element => {
      this.vaccine_photos.push(element)
    });
    this.validateVaccinePassaport();
  }


  // submit form
  onSubmit() {
    this.validationFields();

    const formData: FormData = new FormData();
    // si se está creando
    if(this.creating && this.rol == 'particular' && this.isValidPrice && this.isValidAnimalPhoto && this.isValidLocation && this.isValidIdentificationPhoto && this.isValidVaccinePassaport){
      const animalPhoto = this.animalPhotos
      const vaccinePassaport = this.vaccine_photos
      const identificationPhoto = this.identification_photos;

      for(let i = 0; i < animalPhoto.length; i++) formData.append('animal_photo', animalPhoto[i], animalPhoto[i].name);
      for(let i = 0; i < vaccinePassaport.length; i++) formData.append('vaccine_passport', vaccinePassaport[i], vaccinePassaport[i].name);
      for(let i = 0; i < identificationPhoto.length; i++) formData.append('identification_photo', identificationPhoto[i], identificationPhoto[i].name);
      formData.append('price', this.breedingForm.value.price);
      formData.append('location', this.breedingForm.value.location);

      this.breedingService.createBreeding(formData).then(x => {
        swal("Perfecto", "Anuncio de crianza creado correctamente, a la espera de ser moderado.", "success");
        this.router.navigate(['/pallAds'])
      }).catch (error => {
        this.backError = error.error.error
      });
    }

    // edit prticular
    if(!this.creating && this.rol == 'particular' && this.isValidPrice && this.isValidAnimalPhoto && this.isValidLocation && this.isValidIdentificationPhoto && this.isValidVaccinePassaport){
      
      const animalPhoto = this.animalPhoto.nativeElement.files;
      const vaccinePassaport = this.vaccinePassaport.nativeElement.files;
      const identificationPhoto = this.identificationPhoto.nativeElement.files;

      for(let i = 0; i < animalPhoto.length; i++) formData.append('animal_photo', animalPhoto[i], animalPhoto[i].name);
      for(let i = 0; i < vaccinePassaport.length; i++) formData.append('vaccine_passport', vaccinePassaport[i], vaccinePassaport[i].name);
      for(let i = 0; i < identificationPhoto.length; i++) formData.append('identification_photo', identificationPhoto[i], identificationPhoto[i].name);
      formData.append('price', this.breedingForm.value.price);
      formData.append('location', this.breedingForm.value.location);

      this.breedingService.editBreeding(this.editBreeding.breedingId, formData).then(x => {
        swal("Perfecto", "Anuncio de crianza editado correctamente, a la espera de ser moderado.", "success");
        this.router.navigate(['/pallAds'])
      }).catch (error => {
        this.backError = error.error.error
      });
    }

    // si lo está editando un moderador
    if(!this.creating && this.rol == 'moderator' && this.isValidBreed && this.isValidGenre && this.isValidAge && this.isValidType && this.isValidPedigri){

      // console.log(this.breedingForm.value.age)
      formData.append('genre', this.breedingForm.value.genre);
      formData.append('breed', this.breedingForm.value.breed);
      formData.append('birth_date', this.breedingForm.value.age);
      formData.append('type', this.breedingForm.value.type);
      formData.append('pedigree', this.breedingForm.value.pedigree);
      
      this.breedingService.acceptBreeding(formData, this.editBreeding.breedingId).then(x => {
        swal("Perfecto", "Crianza aceptada correctamente, publicada en la lista de crianza.", "success");
        this.router.navigate(['/breeding-pending'])
      }).catch (error => this.backError = error.error.error);
    }
  }

  rejectPublication() {
    this.breedingService.rejectBreeding(this.editBreeding.breedingId).then(x => {
      swal("Perfecto", "Crianza rechazada correctamente.", "success");

      this.router.navigate(['/breeding-pending'])
    }).catch (error => this.backError = error.error.error);
  }

  validationFields(type?:string) {
    this.validatePrice();
    this.validateAge();
    this.validateAnimalPhoto();
    this.validateBreed();
    this.validateGenre();
    this.validateIdentificationPhoto();
    this.validateLocation();
    this.validateType();
    this.validateVaccinePassaport();
    this.validatePedigree();

    // create or edit
    if (type === 'default') {
      this.isValidBreed = true;
      this.isValidPrice = true;
      this.isValidGenre = true;
      this.isValidAge = true;
      this.isValidType = true;
      this.isValidPedigri = true;
      this.isValidAnimalPhoto = true;
      this.isValidLocation = true;
      this.isValidIdentificationPhoto = true;
      this.isValidVaccinePassaport = true;
    }
  }

  deleteImageAnimalPhotos(imageName){
    for (let index = 0; index < this.animalPhotos.length; index++) {
      let element = this.animalPhotos[index];
      if(element==imageName){
        this.animalPhotos.splice( index, 1 );
        break;
      }
    }
  }

  deleteIDPhotos(imageName){
    for (let index = 0; index < this.identification_photos.length; index++) {
      let element = this.identification_photos[index];
      if(element==imageName){
        this.identification_photos.splice( index, 1 );
        break;
      }
    }
  }

  deleteBreeding(id: number){
    this.breedingService.deleteBreeding(id).then(res=> {
      swal("Perfecto", "Oferta de crianza eliminada correctamente.", "success");
      this.router.navigate(['/pallAds']);
    });
  }

  deleteVetPhoto(imageName){
    for (let index = 0; index < this.vaccine_photos.length; index++) {
      let element = this.vaccine_photos[index];
      if(element==imageName){
        this.vaccine_photos.splice(index, 1);
        break;
      }
    }
  }



  
}
