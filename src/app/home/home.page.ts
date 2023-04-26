import { Component } from '@angular/core';
import { Filesystem, Directory, FileInfo } from '@capacitor/filesystem';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  text = '';
  folderContent:any[] = [];

  constructor() {
    var path = "file:///storage/emulated/0";
    var filename = "myfile.txt";
    this.text = Directory.External;
    this.loadDocuments();

    /*
    https://devdactic.com/capacitor-file-explorer-ionic
    https://stackoverflow.com/questions/47069764/ionic-delete-file-using-native-url
    https://ourcodeworld.com/articles/read/28/how-to-delete-file-with-cordova
    https://github.com/apache/cordova-plugin-file
    https://forum.ionicframework.com/t/delete-image-from-gallery/26433

    ionic build && ionic cap copy && ionic cap sync && ionic cap open android
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

  async loadDocuments() {
    const folderContent = await Filesystem.readdir({
      directory: Directory.ExternalStorage,
      path: ''
     });

     this.folderContent = folderContent.files.map(file=>({name: file.name}));
     this.text += '\n ExternalStorage length ' + this.folderContent.length;

     const folderContent2 = await Filesystem.readdir({
       path: 'file:///storage/emulated/0'
      });

      this.folderContent = [...this.folderContent, folderContent2.files.map(file=>({name: file.name}))];
      this.text += '\n file:///storage/emulated/0 length ' + this.folderContent.length;
  }

}
