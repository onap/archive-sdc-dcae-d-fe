import { DomSanitizer } from '@angular/platform-browser';
import { Pipe, PipeTransform } from '@angular/core';

import * as feather from 'feather-icons/dist/feather';

@Pipe({ name: 'feather' })
export class FeatherIconsPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(icon: string, size: number = 24, fill: string = 'none') {
    return this.sanitizer.bypassSecurityTrustHtml(
      feather.icons[icon].toSvg({
        width: size,
        height: size,
        fill: fill
      })
    );
  }
}
