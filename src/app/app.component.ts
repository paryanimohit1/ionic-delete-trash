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
  dataToBeCleared: any[] = [];
  allTrashFilesList = [
    '/.face',
    '/.profig.os',
    // '/Databases/msgstore-2023-04-27.1.db.crypt14',
    'helloworld',
  ];
  errorText: string[] = [];
  identifiedFiles: any[] = [];

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

  clearClicked() {
    this.presentToast(`TBC - ${this.dataToBeCleared.length}`);
  }

  async loadDocuments() {
    let whatsappDBFiles = await this.getWhatsAppDBFilesList();
    this.allTrashFilesList = [
      ...this.allTrashFilesList,
      ...whatsappDBFiles.map((file) => file.uri),
    ];
    this.allTrashFilesList.forEach((file) => {
      Filesystem.stat({
        path: BASE_URI + file,
      })
        .then((data) => {
          this.identifiedFiles.push(file);
          this.dataToBeCleared.push(data);
        })
        .catch((err) => {
          this.errorText.push(` ~ ${file} - ${err}`);
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

  async presentToast(
    message: string,
    position: 'top' | 'middle' | 'bottom' = 'middle'
  ) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: position,
    });

    await toast.present();
  }

  async getWhatsAppDBFilesList() {
    var waDbFiles: { name: string; uri: string }[] = [];
    const currentYear = new Date().getFullYear();
    // WHATSAPP_BASE_FOLDERS.forEach(async (whatsappBasePath) => {
    for (let i = 0; i < WHATSAPP_BASE_FOLDERS.length; i++) {
      let whatsappBasePath = WHATSAPP_BASE_FOLDERS[i];
      const whatsappFolderContent = await Filesystem.readdir({
        path: BASE_URI + whatsappBasePath + '/Databases',
      })
        .then((data) => data)
        .catch((err) => null);
      if (whatsappFolderContent?.files.length) {
        whatsappFolderContent.files.forEach((file) => {
          if (file.name.startsWith(`msgstore-${currentYear}-`)) {
            waDbFiles.push({
              name: file.name,
              uri: whatsappBasePath + '/Databases/' + file.name,
            });
          }
        });
        this.presentToast(
          'dbcount' +
            whatsappFolderContent.files.length +
            ' - filteredDBCount ' +
            waDbFiles.length,
          'bottom'
        );
      }
    }
    this.presentToast('wadbfiles' + waDbFiles.length, 'top');
    return waDbFiles;
  }
}
