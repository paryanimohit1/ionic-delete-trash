import { Component } from '@angular/core';
import { Filesystem } from '@capacitor/filesystem';
import { ToastController } from '@ionic/angular';

const BASE_URI = 'file:///storage/emulated/0';
const WHATSAPP_BASE_FOLDERS = [
  '/Android/media/com.whatsapp/WhatsApp',
  '/WhatsApp',
];

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  files = [
    '/.face',
    '/.profig.os',
    // '/Databases/msgstore-2023-04-27.1.db.crypt14',
    'helloworld',
  ];
  text = '';
  folderContent: any[] = [];

  constructor(private toastController: ToastController) {
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
      });
    */
  }

  async loadDocuments() {
    let whatsappDBFiles = await this.getWhatsAppDBFilesList();

    this.files = [...this.files, ...whatsappDBFiles.map((file) => file.uri)];
    this.folderContent.push(...this.files);
    this.files.forEach((file) => {
      Filesystem.stat({
        path: BASE_URI + file,
      })
        .then((data) => {
          this.text += `<br>${file} - ${data.type}`;
          this.folderContent.push(data.uri);
        })
        .catch((err) => {
          this.text += `<br>${file} - ${err}`;
        });
    });

    this.presentToast('Available files loaded', 'middle');

    /*

    TODO: Use Toast controller and stat
    add a fn to get whatsapp db files dynamically

    */

    // const folderContent = await Filesystem.readdir({
    //   directory: Directory.ExternalStorage,
    //   path: ''
    //  });

    //  this.folderContent = folderContent.files.map(file=>({name: file.name}));
    //  this.text += '\n ExternalStorage length ' + this.folderContent.length;

    //  const folderContent2 = await Filesystem.readdir({
    //    path: 'file:///storage/emulated/0'
    //   });

    //   this.folderContent = [...this.folderContent, folderContent2.files.map(file=>({name: file.name}))];
    //   this.text += '\n file:///storage/emulated/0 length ' + this.folderContent.length;
    /* this.folderContent = [
        { name: "Alice" },
        { name: "Bob" },
        { name: "Charlie" },
        { name: "David" },
        { name: "Emily" },
        { name: "Frank" },
        { name: "Grace" },
        { name: "Henry" },
        { name: "Isabella" },
        { name: "Jack" },
        { name: "Katherine" },
        { name: "Liam" },
        { name: "Mia" },
        { name: "Noah" },
        { name: "Olivia" },
        { name: "Penny" },
        { name: "Quinn" },
        { name: "Ryan" },
        { name: "Sophia" },
        { name: "Thomas" },
        { name: "Bob" },
        { name: "Charlie" },
        { name: "David" },
        { name: "Emily" },
        { name: "Frank" },
        { name: "Grace" },
        { name: "Henry" },
        { name: "Isabella" },
        { name: "Jack" },
        { name: "Katherine" },
        { name: "Liam" },
        { name: "Mia" }
        ]; */
  }

  async presentToast(message: string, position: 'top' | 'middle' | 'bottom' = 'middle') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: position,
    });

    await toast.present();
  }

  async getWhatsAppDBFilesList() {
    let order = 0;
    var waDbFiles: { name: string; uri: string }[] = [];
    const currentYear = new Date().getFullYear();
    // WHATSAPP_BASE_FOLDERS.forEach(async (whatsappBasePath) => {
      for(let i = 0; i< WHATSAPP_BASE_FOLDERS.length; i++){
        let whatsappBasePath = WHATSAPP_BASE_FOLDERS[i];
      const whatsappFolderContent = await Filesystem.readdir({
        path: BASE_URI + whatsappBasePath + '/Databases',
      }).then(data => data).catch(err=>{
        this.text += whatsappBasePath + ' ' + err
        return null;
      });
      if (whatsappFolderContent?.files.length) {
        var mappedList = whatsappFolderContent.files.map((file) => {
          return {
              name: file.name,
              uri: whatsappBasePath + '/Databases/' + file.name
            }
          }).filter((file) => file.name.startsWith(`msgstore-${currentYear}-`));
          waDbFiles.push(...mappedList)//[ ...waDbFiles, ...mappedList ];
          this.presentToast((order++) + 'dbcount' + whatsappFolderContent.files.length + ' - map ' + mappedList.length + ' - finaldbfilesarrPUSH ' + waDbFiles.length, 'bottom');
      }
    };
    this.presentToast((order++) + 'wadbfiles' + waDbFiles.length, 'top')
    return waDbFiles;
  }
}
