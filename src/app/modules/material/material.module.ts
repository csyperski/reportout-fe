import {NgModule} from '@angular/core';

import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatExpansionModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule, MatNativeDateModule,
  MatOptionModule, MatPaginatorModule,
  MatRadioModule,
  MatSelectModule,
  MatSnackBarModule, MatSortModule, MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule
} from '@angular/material';

const modules = [
  MatIconModule,
  MatButtonModule,
  MatCheckboxModule,
  MatInputModule,
  MatSelectModule,
  MatOptionModule,
  MatTooltipModule,
  MatToolbarModule,
  MatTabsModule,
  MatMenuModule,
  MatRadioModule,
  MatCardModule,
  MatListModule,
  MatExpansionModule,
  MatSnackBarModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatTableModule,
  MatSortModule,
  MatPaginatorModule
];

@NgModule({
  declarations: [],
  imports: [
    ...modules
  ],
  exports: [
    ...modules
  ],
  providers: []
})
export class ReportOutMaterialModule {
}
