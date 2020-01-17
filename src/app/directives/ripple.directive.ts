import { Directive, HostBinding, Renderer2, ElementRef, HostListener, OnInit, Input } from '@angular/core';

const RIPPLE_IN_DURATION: number = 400;
const RIPPLE_OUT_DURATION: number = 450;

// This code is based on a (very) simplified version of Angular Material's matRipple
// For any WTFs or just figuring out what's going on, check the source for it on github

@Directive({
  selector: '[stpRipple]'
})
export class RippleDirective implements OnInit {
  @HostBinding('style.position') position: string = 'relative';
  @HostBinding('style.overflow') overflow: string = 'hidden';

  private containerElement: HTMLElement;

  @Input() public rippleColor: string | null = null;

  constructor(
    private renderer: Renderer2,
    private element: ElementRef<HTMLElement>
  ) { }

  public ngOnInit() {
    this.containerElement = this.element.nativeElement;
  }

  @HostListener('mousedown', ['$event'])
  public onClick(e: any) {
    const containerRect: ClientRect = this.containerElement.getBoundingClientRect();
    const x: number = e.clientX;
    const y: number = e.clientY;
    const radius: number = this.distanceToFurthestCorner(x, y, containerRect);
    const offsetX = x - containerRect.left;
    const offsetY = y - containerRect.top;

    const ripple: HTMLElement = this.renderer.createElement('div');
    this.renderer.addClass(ripple, 'ripple');

    ripple.style.left = `${offsetX - radius}px`;
    ripple.style.top = `${offsetY - radius}px`;
    ripple.style.height = `${radius * 2}px`;
    ripple.style.width = `${radius * 2}px`;
    ripple.style.transitionDuration = `${RIPPLE_IN_DURATION}ms`;

    if (this.rippleColor) {
      ripple.style.backgroundColor = this.rippleColor;
    }

    this.containerElement.appendChild(ripple);
    window.getComputedStyle(ripple).getPropertyValue('opacity'); // Force style recalculation

    ripple.style.transform = 'scale(1)';

    setTimeout(() => this.fadeOut(ripple), RIPPLE_IN_DURATION);
  }

  private fadeOut(ripple: HTMLElement) {
    ripple.style.transitionDuration = `${RIPPLE_OUT_DURATION}ms`;
    ripple.style.opacity = '0';

    setTimeout(() => this.containerElement.removeChild(ripple), RIPPLE_IN_DURATION);
  }

  private distanceToFurthestCorner(x: number, y: number, rect: ClientRect) {
    const distX = Math.max(Math.abs(x - rect.left), Math.abs(x - rect.right));
    const distY = Math.max(Math.abs(y - rect.top), Math.abs(y - rect.bottom));
    return Math.sqrt(distX * distX + distY * distY);
  }
}
