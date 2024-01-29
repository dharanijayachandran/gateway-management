import { APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeleteGatewayComponent } from './delete-gateway/delete-gateway.component';
import { GatewayModelCommStandardFormComponent } from './gateway-model/pages/gateway-model-comm-standard-form/gateway-model-comm-standard-form.component';
import { GatewayModelCommStandardMappingFormComponent } from './gateway-model/pages/gateway-model-comm-standard-mapping-form/gateway-model-comm-standard-mapping-form.component';
import { GatewayModelCommStandardMappingComponent } from './gateway-model/pages/gateway-model-comm-standard-mapping/gateway-model-comm-standard-mapping.component';
import { GatewayModelCommStandardComponent } from './gateway-model/pages/gateway-model-comm-standard/gateway-model-comm-standard.component';
import { GatewayModelFormComponent } from './gateway-model/pages/gateway-model-form/gateway-model-form.component';
import { GatewayModelPinFormComponent } from './gateway-model/pages/gateway-model-pin-form/gateway-model-pin-form.component';
import { GatewayModelPinPreviewComponent } from './gateway-model/pages/gateway-model-pin-preview/gateway-model-pin-preview.component';
import { GatewayModelPinComponent } from './gateway-model/pages/gateway-model-pin/gateway-model-pin.component';
import { GatewayModelPortFormComponent } from './gateway-model/pages/gateway-model-port-form/gateway-model-port-form.component';
import { GatewayModelPortViewComponent } from './gateway-model/pages/gateway-model-port-view/gateway-model-port-view.component';
import { GatewayModelPortComponent } from './gateway-model/pages/gateway-model-port/gateway-model-port.component';
import { GatewayModelViewComponent } from './gateway-model/pages/gateway-model-view/gateway-model-view.component';
import { GatewayModelComponent } from './gateway-model/pages/gateway-model/gateway-model.component';
import { CommunicationComponent } from './gateway-template/pages/communication/communication.component';
import { GatewayCommIOTagComponent } from './gateway-template/pages/gateway-comm-iotag/gateway-comm-iotag.component';
import { GatewayIODatahandlerFormComponent } from './gateway-template/pages/gateway-io-datahandler-form/gateway-io-datahandler-form.component';
import { GatewayIoDhResponseTagPreviewComponent } from './gateway-template/pages/gateway-io-dh-response-tag-preview/gateway-io-dh-response-tag-preview.component';
import { GatewayIoDhResponseTagComponent } from './gateway-template/pages/gateway-io-dh-response-tag/gateway-io-dh-response-tag.component';
import { GatewayIoDhTagPreviewComponent } from './gateway-template/pages/gateway-io-dh-tag-preview/gateway-io-dh-tag-preview.component';
import { GatewayIoDhTagComponent } from './gateway-template/pages/gateway-io-dh-tag/gateway-io-dh-tag.component';
import { GatewayTemplateFormComponent } from './gateway-template/pages/gateway-template-form/gateway-template-form.component';
import { GatewayTemplateIoTagFormComponent } from './gateway-template/pages/gateway-template-io-tag-form/gateway-template-io-tag-form.component';
import { GatewayTemplateIoTagViewComponent } from './gateway-template/pages/gateway-template-io-tag-view/gateway-template-io-tag-view.component';
import { GatewayTemplateIoTagComponent } from './gateway-template/pages/gateway-template-io-tag/gateway-template-io-tag.component';
import { GatewayTemplateViewComponent } from './gateway-template/pages/gateway-template-view/gateway-template-view.component';
import { GatewayTemplateComponent } from './gateway-template/pages/gateway-template/gateway-template.component';
import { DownloadTemplatePreviewComponent } from './gateway/pages/download-template-preview/download-template-preview.component';
import { DownloadTemplateReadViewComponent } from './gateway/pages/download-template-read-view/download-template-read-view.component';
import { DownloadTemplateComponent } from './gateway/pages/download-template/download-template.component';
import { GatewayFormViewComponent } from './gateway/pages/gateway-form-view/gateway-form-view.component';
import { GatewayIoTagFormComponent } from './gateway/pages/gateway-io-tag-form/gateway-io-tag-form.component';
import { GatewayIoTagListComponent } from './gateway/pages/gateway-io-tag-list/gateway-io-tag-list.component';
import { GatewayIoTagPreviewComponent } from './gateway/pages/gateway-io-tag-preview/gateway-io-tag-preview.component';
import { GatewayIoTagReadViewComponent } from './gateway/pages/gateway-io-tag-read-view/gateway-io-tag-read-view.component';
import { GatewayIoTagViewComponent } from './gateway/pages/gateway-io-tag-view/gateway-io-tag-view.component';
import { GatewayListComponent } from './gateway/pages/gateway-list/gateway-list.component';
import { GatewayPreviewComponent } from './gateway/pages/gateway-preview/gateway-preview.component';
import { GatewayReadViewComponent } from './gateway/pages/gateway-read-view/gateway-read-view.component';
import { GatewayViewComponent } from './gateway/pages/gateway-view/gateway-view.component';
import { GatewayComponent } from './gateway/pages/gateway/gateway.component';
import { ServiceRequestComponent } from './gateway/pages/service-request/service-request.component';
import { UploadTemplateComponent } from './gateway/pages/upload-template/upload-template.component';
import { PendingChangesGuard } from 'global';


const routes: Routes = [
  {
    path: 'gateway-model',
    children: [
      {
        path: '',
        component: GatewayModelComponent,
        data: { title: 'Gateway Model' }
      },
      {
        path: 'gateway-model-form',
        component: GatewayModelFormComponent,
        canDeactivate: [PendingChangesGuard]
      },
      {
        path: 'gateway-model-comm-standard-form',
        component: GatewayModelCommStandardFormComponent,
        canDeactivate: [PendingChangesGuard]
      },
      {
        path: 'gateway-model-pin-preview',
        component: GatewayModelPinPreviewComponent
      },
      {
        path: 'gateway-model-port-form',
        component: GatewayModelPortFormComponent

      },
      {
        path: 'gateway-model-comm-standard-mapping-form',
        component: GatewayModelCommStandardMappingFormComponent
      }
    ]
  },
  {
    path: 'gateway-template',
    children: [
      {
        path: '',
        component: GatewayTemplateComponent,
        data: { title: 'Gateway Template' }
      },
      {
        path: 'gateway-template-form',
        component: GatewayTemplateFormComponent,
        canDeactivate: [PendingChangesGuard],
        data: { title: 'Gateway Template Form' }

      },
      {
        path: 'gateway-template-io-tag-form',
        component: GatewayTemplateIoTagFormComponent,
        canDeactivate: [PendingChangesGuard]
      },
      {
        path: 'gateway-comm-io-tag',
        component: GatewayCommIOTagComponent,
        canDeactivate: [PendingChangesGuard],
        data: { title: 'Gateway IOTag' }
      },
      {
        path: 'IO-data-handler-form',
        component: GatewayIODatahandlerFormComponent,
        canDeactivate: [PendingChangesGuard],
        data: { title: 'Gateway IO DH Form' }
      },
      {
        path: 'gateway-io-dh-tag',
        component: GatewayIoDhTagComponent,
        canDeactivate: [PendingChangesGuard],
      },
      {
        path: 'gateway-io-dh-tag-preview',
        component: GatewayIoDhTagPreviewComponent
      },
      {
        path: 'gateway-io-dh-response-tag',
        component: GatewayIoDhResponseTagComponent,
        canDeactivate: [PendingChangesGuard],
      },
      {
        path: 'gateway-io-dh-response-tag-preview',
        component: GatewayIoDhResponseTagPreviewComponent
      },
    ]
  },
  {
    path: 'gateway',
    children: [
      {
        path: '',
        component: GatewayComponent,
        data: { title: 'Gateway' }
      },
      {
        path: 'gateway-form',
        component: GatewayFormViewComponent,
        data: { title: 'Gateway Form' },
        canDeactivate: [PendingChangesGuard]
      },
      {
        path: 'gateway-view',
        component: GatewayViewComponent,
        data: { title: 'Gateway view' },
        canDeactivate: [PendingChangesGuard]
      },
      {
        path: 'gateway-preview',
        component: GatewayPreviewComponent
      },
      {
        path: 'gateway-io-tag-form',
        component: GatewayIoTagFormComponent,
        data: { title: 'Gateway IO Tag Form' },
        canDeactivate: [PendingChangesGuard]
      },
      {
        path: 'gateway-io-tag-view',
        component: GatewayIoTagViewComponent,
        data: { title: 'Gateway IO Tag view' },
        canDeactivate: [PendingChangesGuard]
      },
      {
        path: 'gateway-io-tag-preview',
        component: GatewayIoTagPreviewComponent
      },
      {
        path: 'gateway-comm-io-tag',
        component: GatewayCommIOTagComponent,
        canDeactivate: [PendingChangesGuard],
        data: { title: 'Gateway IOTag' }
      },
      {
        path: 'IO-data-handler-form',
        canDeactivate: [PendingChangesGuard],
        component: GatewayIODatahandlerFormComponent,
        data: { title: 'Gateway IO DH Form' }
      },
      {
        path: 'gateway-io-dh-tag',
        component: GatewayIoDhTagComponent,
        canDeactivate: [PendingChangesGuard]
      },
      {
        path: 'gateway-io-dh-tag-preview',
        component: GatewayIoDhTagPreviewComponent
      },
      {
        path: 'gateway-io-dh-response-tag',
        component: GatewayIoDhResponseTagComponent,
        canDeactivate: [PendingChangesGuard]
      },
      {
        path: 'gateway-io-dh-response-tag-preview',
        component: GatewayIoDhResponseTagPreviewComponent
      },
      {
        path: 'upload-template',
        component: UploadTemplateComponent,
        data: { title: 'Upload Template' }
      },
      {
        path: 'download-template',
        component: DownloadTemplateComponent,
        data: { title: 'Download Template' },
        canDeactivate: [PendingChangesGuard]
      }
      ,
      {
        path: 'download-template-preview',
        component:DownloadTemplatePreviewComponent

      }
    ]
  },
  {
    path: 'delete-gateway',
    component: DeleteGatewayComponent,
  },
  {
    path: 'service-request',
    component: ServiceRequestComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/gateway-config' },
  ],
})
export class AppRoutingModule { }
export const gatewayManagementComponentsDeclaration =[
  GatewayModelComponent,
  GatewayModelCommStandardComponent,
  GatewayModelCommStandardFormComponent,
  GatewayModelCommStandardMappingComponent,
  GatewayModelCommStandardMappingFormComponent,
  GatewayModelFormComponent,
  GatewayModelPinComponent,
  GatewayModelPinFormComponent,
  GatewayModelPinPreviewComponent,
  GatewayModelPortComponent,
  GatewayModelPortFormComponent,
  GatewayModelPortViewComponent,
  GatewayModelViewComponent,
  CommunicationComponent,
  GatewayCommIOTagComponent,
  GatewayIODatahandlerFormComponent,
  GatewayIoDhResponseTagComponent,
  GatewayIoDhResponseTagPreviewComponent,
  GatewayIoDhTagComponent,
  GatewayIoDhTagPreviewComponent,
  GatewayTemplateComponent,
  GatewayTemplateFormComponent,
  GatewayTemplateIoTagComponent,
  GatewayTemplateIoTagFormComponent,
  GatewayTemplateIoTagViewComponent,
  GatewayTemplateViewComponent,
  DownloadTemplateComponent,
  DownloadTemplatePreviewComponent,
  DownloadTemplateReadViewComponent,
  GatewayComponent,
  GatewayFormViewComponent,
  GatewayIoTagFormComponent,
  GatewayIoTagListComponent,
  GatewayIoTagPreviewComponent,
  GatewayIoTagReadViewComponent,
  GatewayIoTagViewComponent,
  GatewayListComponent,
  GatewayPreviewComponent,
  GatewayReadViewComponent,
  GatewayViewComponent,
  UploadTemplateComponent,
  ServiceRequestComponent
];
