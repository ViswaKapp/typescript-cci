import { Component, Input } from '@angular/core';
import {BaseHttpService} from './basehttp.service';
import { Vehicle } from './vehicle.type';
import { throwError} from 'rxjs';

@Component({
  selector: 'vehicles',
  templateUrl: './vehicles.component.html',
  providers: [BaseHttpService]
})
export class VehiclesComponent  {
  

public vehicles: Vehicle[];
public headers: string[];
private httpService : BaseHttpService; // Service that calls API 
// Change value based on Page number
public page: number = 1;

constructor(baseHttpService : BaseHttpService) {
console.log("VehiclesComponent instantiated");
this.httpService = baseHttpService;
this.vehicles=this.getVehicles();
this.headers=this.getHeaders();
}

/*
* Not used now, Idea is sto supply header names from service, if required.
*/
getHeaders() : string[] {
  return ["Name","Cost in Credits","Length"]
}
/**
 * Method responsible for returning vehicles data to the view after calling Service, which gets data from API.
 */
getVehicles() : Vehicle[] {

 /* //Mock
  this.vehicles = new Array();
  var v = new Vehicle("Audi R8","100","120 Km");
  this.vehicles.push(v); 
  */

  this.vehicles = this.getVehicleData();
  console.log("Vehicle in componentt"+ this.vehicles);

  return this.vehicles;
}
/**
 * Call HTTP service and asynchronously pouplate vehicles array
 */
public getVehicleData() : Vehicle[] {
  var vehicles : Vehicle[];
  
  console.info("Enterrd  getVehicleData  -----------:" ); 


  this.httpService.getData().subscribe(
    (data ) => {
      console.info("callGet Vehicle  -----------:" + data); 
      this.vehicles= data; 
      },
    (error) => { throwError(error); console.error("Error occured during Http invocation: " + error);}, 
    () => console.log("Completed request. ") 
  );

  return vehicles;
}

/**
 * getNextVehicles is called from pagination button next
 * 
 * The 'next' url is stored by the HTTP service and next function can safely call the same get service to get next set of data
 * 
 * Also 'page' value is changed based on the page number returned
 */
  public getNextVehicles() : Vehicle[] {

    return this.getVehicleData();
  }
  
  
/**
 * getPrevVehicles is called from pagination button previous
 * 
 * Not implemented yet
 * 
 * Also 'page' value is changed based on the page number returned
 */
  public getPrevVehicles() : Vehicle[] {

    return this.getVehicleData();
  }

  /**
   * Search Vehicles
   * Not implemented
   * 
   */
  searchVehicles(){
    return this.getVehicleData();
  }
}
