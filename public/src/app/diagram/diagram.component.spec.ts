// import { ComponentFixture, TestBed, async } from '@angular/core/testing';
// import { DiagramComponent } from './diagram.component';

// describe('DiagramComponent', () => {
//   let component: DiagramComponent;
//   let fixture: ComponentFixture<DiagramComponent>;

//   beforeEach(
//     async(() => {
//       TestBed.configureTestingModule({
//         declarations: [DiagramComponent]
//       }).compileComponents();
//     })
//   );

//   beforeEach(() => {
//     fixture = TestBed.createComponent(DiagramComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should check on change check maxLengthLeft', () => {
//     component.list = [
//       {
//         name1: 'node1dsvsdsvd',
//         name2: 'node2',
//         p1: 'Stream_publish_0',
//         p2: 'capability'
//       },
//       {
//         name1: 'node33',
//         name2: 'node2555',
//         p1: 'requirement2',
//         p2: 'capability11'
//       },
//       {
//         name1: 'namber4',
//         name2: 'namber3',
//         p1: 'requirement3',
//         p2: 'capability4'
//       }
//     ];
//     component.ngOnChanges();
//     expect(component.maxLengthLeft).toBe(16);
//   });
//   it('should check on change check maxLengthRight', () => {
//     component.list = [
//       {
//         name1: 'node1dsvsdsvd',
//         name2: 'node2',
//         p1: 'Stream_publish_0',
//         p2: 'capability'
//       },
//       {
//         name1: 'node33',
//         name2: 'node2555',
//         p1: 'requirement2',
//         p2: 'capability11'
//       },
//       {
//         name1: 'namber4',
//         name2: 'namber3',
//         p1: 'requirement3',
//         p2: 'capability4'
//       }
//     ];
//     component.ngOnChanges();
//     expect(component.maxLengthRight).toBe(12);
//   });
//   it('should check on change check maxWidth', () => {
//     component.list = [
//       {
//         name1: 'node1dsvsdsvd',
//         name2: 'node2',
//         p1: 'Stream_publish_0',
//         p2: 'capability'
//       },
//       {
//         name1: 'node33',
//         name2: 'node2555',
//         p1: 'requirement2',
//         p2: 'capability11'
//       },
//       {
//         name1: 'namber4',
//         name2: 'namber3',
//         p1: 'requirement3',
//         p2: 'capability4'
//       }
//     ];
//     component.ngOnChanges();
//     // expect(component.maxWidth).toBe(550);
//   });
// });
