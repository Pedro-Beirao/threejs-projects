import * as THREE from 'three';
import { MySceneData } from './MySceneData.js';
/**
 *  This class contains the json parser
 *  Credits: Alexandre Valle (alexandre.valle@fe.up.pt)
 *  Version: 2023-10-13
 * 
 *  DO NOT CHANGE THIS FILE. IT WILL BE MODIFIED OR REPLACED DURING EVALUATION
 * 
 *  1. in a given class file MyWhateverNameClass.js in the constructor call:
 * 
 *  this.reader = new MyFileReader(this.onSceneLoaded.bind(this));
 *  this.reader.open("scenes/<path to json file>.json");	
 * 
 *  The last argumet in the constructor is a method that is called when the json file is loaded and parsed (see step 2).
 * 
 *  2. in the MyWhateverNameClass.js class, add a method with signature: 
 *     onSceneLoaded(data) {
 *     }
 * 
 *  This method is called once the json file is loaded and parsed successfully. The data argument is the entire scene data object. 
 * 
 */

/**
 * This class contains the json parser object
 */
class MyFileReader  {

	/**
		* the constructor 
		* @param {*} onSceneLoadedCallback - the callback to be called when the scene is loaded
		*/
	   constructor(onSceneLoadedCallback) {
		this.errorMessage = null;
		this.onSceneLoadedCallback = onSceneLoadedCallback;
	}

	/**
	 * opens a json file
	 * @param {*} jsonfile - the json file to be opened 
	 */
	open(jsonfile) {
		fetch(jsonfile)
			.then((res) => {
				if (!res.ok) {
					throw new Error(`HTTP error! Status: ${res.status}`);
				}
				return res.json();
			})
			.then((data) => {
				this.onSceneLoadedCallback(data);
			})
			.catch((error) =>
				console.error("Unable to fetch data:", error));
	};
}

export { MyFileReader };
