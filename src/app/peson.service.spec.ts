import { TestBed, inject } from '@angular/core/testing';

import { PersonService } from './person.service';

describe('MemberService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PersonService]
    });
  });

  it('should be created', inject([PersonService], (service: PersonService) => {
    expect(service).toBeTruthy();
  }));
});
