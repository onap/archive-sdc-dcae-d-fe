import {
  trigger,
  state,
  animate,
  transition,
  style,
  query
} from '@angular/animations';

export const fadeAnimation = trigger('fadeAnimation', [
  transition('* => *', [
    query(':enter', [style({ opacity: 0 })], { optional: true }),

    query(
      ':leave',
      [style({ opacity: 1 }), animate('0.5s', style({ opacity: 0 }))],
      { optional: true }
    ),

    query(
      ':enter',
      [style({ opacity: 0 }), animate('0.5s', style({ opacity: 1 }))],
      { optional: true }
    )
  ])
]);

export const slideAnimation = trigger('slideAnimation', [
  transition('* <=> *', [
    // Initial state of new route
    query(
      ':enter',
      style({
        position: 'fixed',
        width: '100%',
        transform: 'translateX(-100%)'
      }),
      { optional: true }
    ),
    // move page off screen right on leave
    // query(
    //   ':leave',
    //   animate(
    //     '500ms ease',
    //     style({
    //       position: 'fixed',
    //       width: '100%',
    //       transform: 'translateX(-100%)'
    //     })
    //   ),
    //   { optional: true }
    // ),
    // move page in screen from left to right
    query(
      ':enter',
      animate(
        '500ms ease',
        style({
          opacity: 1,
          transform: 'translateX(0%)'
        })
      ),
      { optional: true }
    )
  ])
]);
