import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { GatewayService } from '../../services/gateway/gateway.service';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
import { UIModalNotificationPage } from 'global';
import { globalShareServices } from 'src/app/shared/globalShareServices';

@Component({
  selector: 'app-upload-template',
  templateUrl: './upload-template.component.html',
  styleUrls: ['./upload-template.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class UploadTemplateComponent implements OnInit {
  @ViewChild('UploadFileInput', { static: false }) uploadFileInput: ElementRef;
  uploadTemplate: FormGroup;
  fileInputLabel: string;
  userFile: any = File;
  formData: any;
  warningFlag: string;
  @ViewChild(UIModalNotificationPage) modelNotification;
  showLoaderImage: boolean;
  uploadedExcel: string;
  message: any;
  constructor(private formBuilder: FormBuilder, private gatewayService: GatewayService,
    private router: Router,
    private route: ActivatedRoute, private globalService: globalSharedService,
    private changeDetector: ChangeDetectorRef,private globalShareService:globalShareServices) { }
  ngOnInit(): void {
    this.registerForm();
    this.uploadedExcel = 'inputExcelFileUpload';
  }
  registerForm() {
    this.uploadTemplate = this.formBuilder.group({
      myfile: [null, [Validators.required]],
      fileSource: [[Validators.required]]
    })
  }
  redirectTo() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
  cancelUploadForm() {
    if (this.uploadTemplate.dirty) {
      this.warningFlag = "cancel";
      this.formCancelConfirm();
    } else {
      this.formCancelConfirm();
    }
  }
  formCancelConfirm() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
  resetuploadForm() {
    this.warningFlag = "reset";
    this.modelNotification.alertMessage('Warning', 'You will not be able to recover the changes!');
  }
  alertRedirection() {
    if (this.warningFlag == "reset") {
      this.formResetConfirm();
    } else if (this.warningFlag == "cancel") {
      this.formCancelConfirm();
    }
    this.warningFlag = "";
  }
  resetgatewayForm() {
    this.warningFlag = "reset";
    this.modelNotification.alertMessage('Warning', 'You will not be able to recover the changes!');
  }
  formResetConfirm() {
    this.uploadTemplate.reset();
    this.userFile = [];
    this.uploadTemplate.reset();
    this.fileInputLabel = null;
    this.registerForm();
  }
  onSelectFile(event) {
    this.message = null;
    const file = event.target.files[0];
    this.userFile = file;
    if (!this.validateFile(this.userFile.name)) {
      alert('Selected file format is not supported');
      return false;
    }
    this.uploadTemplate.patchValue({
      fileSource: file
    })
    this.fileInputLabel = this.userFile.name;
    this.uploadTemplate.get('myfile').setValue(this.fileInputLabel);
  }
  validateFile(name: String) {
    var ext = name.substring(name.lastIndexOf('.') + 1);
    if (ext.toLowerCase() == 'xls' || ext.toLocaleLowerCase() == 'xlsx') {
      return true;
    }
    else {
      return false;
    }
  }
  onFormSubmit() {
    this.showLoaderImage = true;
    const formData = new FormData();
    let beId = sessionStorage.getItem('beId');
    let userId = sessionStorage.getItem('userId');
    formData.append('file', this.userFile)
    formData.append('beId', beId);
    formData['file'] = this.uploadTemplate.get('fileSource').value;
    formData['beId'] = beId;
    this.globalShareService.uploadTemplateObj=[];
    this.uploadedExcel = '';
    this.gatewayService.uploadTemplate(formData, beId, userId).subscribe((data) => {
      this.showLoaderImage = false;
      if (data.message && data.message.length) {
        this.message = data.message;
        this.uploadedExcel = 'errorMessage';
        return;
      }
      if(data.object){
      this.globalShareService.setUploadTemplateObj(data.object);
      this.router.navigate(['/service-request'], { relativeTo: this.route });
      return;
      }
    },
      (error: any) => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      }
    );
  }
  backButton(){
    this.uploadTemplate.reset();
    this.userFile = [];
    this.fileInputLabel = null;
    this.uploadedExcel = 'inputExcelFileUpload';
  }
}
