import { Component, output, OutputEmitterRef } from '@angular/core';
import { SectionType } from '../../enums/section-type';

@Component({
  selector: 'footer[sign]',
  imports: [],
  templateUrl: './footer-sign.component.html',
  styleUrl: './footer-sign.component.scss'
})
export class FooterSignComponent {

  section: OutputEmitterRef<SectionType> = output<SectionType>();
  protected SectionType = SectionType;

    /**
     * Navgates to section.
     * @param section - Section for navigation.
     */
    protected navigate(section: SectionType) {
      this.section.emit(section);
    }
}
