import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  text = '';

  constructor() {
    var path = "file:///storage/emulated/0";
    var filename = "myfile.txt";

    /*
    https://devdactic.com/capacitor-file-explorer-ionic
    https://stackoverflow.com/questions/47069764/ionic-delete-file-using-native-url
    https://ourcodeworld.com/articles/read/28/how-to-delete-file-with-cordova
    https://github.com/apache/cordova-plugin-file
    https://forum.ionicframework.com/t/delete-image-from-gallery/26433
    */



    /* window.resolveLocalFileSystemURL(path, function(dir) {
        dir.getFile(filename, {create:false}, function(fileEntry) {
                  fileEntry.remove(function(){
                    this.text = 'removed';
                    // The file has been removed succesfully
                  },function(error){
                    this.text = 'error';
                    // Error deleting the file
                  },function(){
                    this.text = 'file doesn\'t exist';
                    // The file doesn't exist
                  });
        });
    }); */
  }

}
