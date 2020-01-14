import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';

import { LoadingComponent } from './loading.component';

describe('BannerComponent (inline template)', () => {

  let comp:    LoadingComponent;
  let fixture: ComponentFixture<LoadingComponent>;
  let de:      DebugElement;
  let el:      HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadingComponent ], // declare the test component
    });

    fixture = TestBed.createComponent(LoadingComponent);

    comp = fixture.componentInstance; // BannerComponent test instance

    // query for the title <h1> by CSS element selector
    de = fixture.debugElement.query(By.css('.loader'));
    el = de.nativeElement;
  });

  it('should contain the wait spinner', () => {
    fixture.detectChanges();
    expect(el.innerHTML).toContain('<i _ngcontent-c1="" class="fa fa-cog fa-2x fa-spin"></i>');
  });

});

